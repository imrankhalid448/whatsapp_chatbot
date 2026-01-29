require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Root route for health/status check
app.get('/', (req, res) => {
  res.status(200).send('Whatsapp Chatbot API is running.');
});

// Webhook verification
app.get('/webhook', (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Webhook to receive messages

// WhatsApp webhook with backend bot engine integration
const botEngine = require('./bot/engine');
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object) {
    if (
      body.entry &&
      Array.isArray(body.entry) &&
      body.entry[0].changes &&
      Array.isArray(body.entry[0].changes) &&
      body.entry[0].changes[0].value &&
      body.entry[0].changes[0].value.messages &&
      Array.isArray(body.entry[0].changes[0].value.messages)
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      let msgBody = '';

      if (message.type === 'text') {
        msgBody = message.text.body;
      } else if (message.type === 'interactive' && message.interactive.button_reply) {
        // Handle WhatsApp button click
        msgBody = message.interactive.button_reply.id; // Use ID for exact logic, or .title
      }

      // Use backend bot engine to process message
      const replies = botEngine.processMessage(from, msgBody);

      for (const reply of replies) {
        try {
          const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
          let payload;
          if (reply && typeof reply === 'object' && reply.type === 'button') {
            // WhatsApp interactive button message
            payload = {
              messaging_product: 'whatsapp',
              to: from,
              type: 'interactive',
              interactive: {
                type: 'button',
                body: { text: reply.body },
                action: {
                  buttons: reply.buttons.map((btn, idx) => ({
                    type: 'reply',
                    reply: {
                      id: btn.id || `btn_${idx + 1}`,
                      title: btn.title
                    }
                  }))
                }
              }
            };
          } else {
            // Plain text fallback
            payload = {
              messaging_product: 'whatsapp',
              to: from,
              text: { body: reply }
            };
          }
          await axios.post(
            url,
            payload,
            {
              headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          // Small delay for natural flow
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch (error) {
          console.error('Error sending WhatsApp reply:', error.response ? error.response.data : error.message);
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Send message endpoint (for testing)
app.post('/send', async (req, res) => {
  const { to, message } = req.body;
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
