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

// Webhook to receive messages and auto-reply
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object) {
    // Check for WhatsApp messages
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
      const from = message.from; // WhatsApp user phone number
      const msgBody = message.text && message.text.body ? message.text.body : '';

      // Auto-reply logic (customize as needed)
      const reply = `You said: ${msgBody}`;

      // Send reply using WhatsApp API
      try {
        const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
        await axios.post(
          url,
          {
            messaging_product: 'whatsapp',
            to: from,
            text: { body: reply }
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (error) {
        console.error('Error sending WhatsApp reply:', error.message);
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
