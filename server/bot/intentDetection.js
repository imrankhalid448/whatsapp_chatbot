// ============================================
// INTENT DETECTION SYSTEM
// Handles 1000+ variations of menu browsing questions
// ============================================

const menu = require('./menu');

// ============================================
// COMPREHENSIVE INTENT PATTERNS
// ============================================

const MENU_BROWSING_PATTERNS = {
	showMe: [
		'show me', 'show', 'display', 'let me see', 'lemme see', 'can i see',
		'could i see', 'may i see', 'i want to see', 'i wanna see', 'wanna see',
		'show us', 'display for me', 'show me the', 'can you show', 'can u show',
		'pls show', 'please show', 'plz show', 'plss show', 'pleas show'
	],
	whatHave: [
		'what do you have', 'what you have', 'what u have', 'what have you got',
		'what you got', 'what u got', 'whats available', 'what is available',
		'what available', 'what do u have', 'what do you got', 'what you have in',
		'what do you have in', 'what u have in', 'what have you', 'what have u',
		'what options', 'what are the options', 'what r the options', 'what choices',
		'whats there', 'what is there', 'what there', 'what all you have'
	],
	menu: [
		'menu', 'menu of', 'menu for', 'the menu', 'your menu', 'ur menu',
		'full menu', 'complete menu', 'entire menu', 'whole menu', 'all menu',
		'menu items', 'menu list', 'food menu', 'item menu', 'items menu',
		'menue', 'manu', 'menuu', 'menus', 'menuz'
	],
	list: [
		'list', 'list of', 'list all', 'list the', 'listing', 'listings',
		'give me list', 'give list', 'show list', 'show me list', 'can i get list',
		'send list', 'send me list', 'share list', 'share the list'
	],
	items: [
		'items', 'item', 'things', 'stuff', 'options', 'choices', 'selection',
		'selections', 'products', 'dishes', 'foods', 'food items', 'menu items',
		'available items', 'all items', 'your items', 'ur items', 'the items'
	],
	categories: [
		'categories', 'category', 'types', 'type', 'kinds', 'kind', 'sections',
		'section', 'groups', 'group', 'menu categories', 'food categories',
		'item categories', 'all categories', 'your categories', 'ur categories',
		'categries', 'catagories', 'catgories', 'categry', 'catagory'
	],
	browse: [
		'browse', 'browsing', 'look at', 'looking at', 'check', 'check out',
		'checking', 'checking out', 'explore', 'exploring', 'view', 'viewing',
		'see', 'seeing', 'look through', 'go through', 'scroll through'
	],
	questions: [
		'what', 'which', 'whats', 'what is', 'what are', 'what r',
		'tell me', 'tell me about', 'tell about', 'info about', 'information about',
		'details about', 'detail about', 'describe', 'explain'
	],
	cancel: [
		'cancel order', 'cancel my order', 'complete cancel order', 'entire cancel order',
		'cancel all', 'cancel everything', 'cancel complete order', 'cancel entire order',
		'i want to cancel', 'stop order', 'delete order', 'remove order', 'cancel'
	],
	finish: [
		'finish order', 'finish my order', 'complete order', 'checkout', 'check out',
		'pay', 'payment', 'bill', 'receipt', 'done', 'finalise', 'finalize',
		'i am done', 'im done', 'end order', 'finish'
	],
	irrelevant: [
		// Profanity & Insults
		'fuck', 'shit', 'bitch', 'asshole', 'pussy', 'dick', 'idiot', 'stupid', 'bastard', 'cunt', 'dumb', 'moron', 'fucker', 'motherfucker', 'cocksucker', 'wanker', 'twat', 'prick', 'slut', 'whore', 'jerk', 'loser', 'suck', 'stfu', 'shut up', 'hate you', 'kill yourself', 'kys', 'garbage', 'trash', 'crappy', 'worthless', 'retard', 'scum', 'scumbag', 'degenerate', 'fool', 'donkey', 'pig', 'animal', 'curse', 'dammit', 'hell', 'crap', 'bullshit',
		// Romance & Compliments
		'love you', 'miss you', 'marry me', 'kiss', 'babe', 'dear', 'honey', 'sweetie', 'cutie', 'darling', 'beautiful', 'sexy', 'hot', 'gorgeous', 'handsome', 'pretty', 'cool', 'awesome', 'amazing', 'best bot', 'good bot', 'smart bot', 'i like you', 'you are great', 'you are nice', 'my love', 'be mine', 'date me', 'date', 'marriage', 'girlfriend', 'boyfriend', 'hubby', 'wifey', 'sweetheart', 'crush', 'lovey', 'xoxo', 'hugs',
		// Personal Questions
		'who are you', 'what is your name', 'what are you', 'how old are you', 'where do you live', 'where are you from', 'are you human', 'are you a bot', 'are you real', 'who made you', 'who created you', 'tell me about yourself', 'what is your gender', 'are you male', 'are you female', 'whats up', 'whatsup', 'how r u', 'how are you', 'how are you doing', 'r u ok', 'are you okay', 'whats your job', 'do you eat', 'do you sleep',
		// Unrelated Queries
		'help me', 'weather', 'news', 'time', 'date tomorrow', 'google', 'search', 'facebook', 'instagram', 'tiktok', 'youtube', 'music', 'song', 'video', 'joke', 'tell a joke', 'story', 'history', 'politics', 'bitcoin', 'crypto', 'stocks', 'money', 'rich', 'poor', 'job', 'work', 'school', 'homework', 'math', 'science', 'health', 'doctor', 'hospital', 'police', 'emergency', 'fire', 'car', 'bike', 'plane', 'travel', 'vacation', 'trip', 'games', 'gaming', 'ps5', 'xbox', 'nintendo', 'anime', 'movies', 'series', 'netflix', 'amazon',
		// Nonsense & Fillers
		'blabla', 'gibberish', 'random', 'hshshs', 'hahaha', 'lol', 'lmao', 'rofl', 'hehe', 'xd', 'ok ok', 'yea yea', 'nope', 'yup', 'maybe', 'not sure', 'whatever', 'who cares', 'so what', 'and then', 'then what', 'nothing', 'just looking', 'testing', 'test', 'ping', 'pong'
	]
};

const CATEGORY_KEYWORDS = {
	burgers: {
		keywords: ['burger', 'burgers', 'buger', 'bugger', 'burgr', 'burgar', 'burguer', 'beef burger', 'chicken burger', 'برجر', 'البرجر', 'برجرات', 'برقر'],
		variations: ['in burgers', 'from burgers', 'burger section', 'burger category', 'burger menu', 'burger items', 'burger options', 'burger choices', 'burger selection', 'burger list', 'burger stuff', 'burger things']
	},
	wraps: {
		keywords: ['wrap', 'wraps', 'wrp', 'warp', 'wrapp', 'roll', 'rolls', 'tortilla', 'tortila', 'tortillas', 'لفائف', 'اللفائف', 'لفاف', 'رول'],
		variations: ['in wraps', 'from wraps', 'wrap section', 'wrap category', 'wrap menu', 'wrap items', 'wrap options', 'wrap choices', 'wrap selection', 'wrap list', 'wrap stuff', 'wrap things']
	},
	sandwiches: {
		keywords: ['sandwich', 'sandwiches', 'sandwch', 'sandwhich', 'sandwitch', 'sanwich', 'sandwic', 'sandwiche', 'سندويش', 'السندويشات', 'سندويتش'],
		variations: ['in sandwiches', 'from sandwiches', 'sandwich section', 'sandwich category', 'sandwich menu', 'sandwich items', 'sandwich options', 'sandwich choices', 'sandwich selection', 'sandwich list', 'sandwich stuff', 'sandwich things']
	},
	sides: {
		keywords: ['side', 'sides', 'snack', 'snacks', 'appetizer', 'appetizers', 'starter', 'starters', 'side dish', 'side dishes', 'side items', 'fries', 'nuggets', 'popcorn', 'corn', 'potato', 'مقبلات', 'المقبلات', 'سناك', 'جانبية'],
		variations: ['in sides', 'from sides', 'side section', 'side category', 'side menu', 'side items', 'side options', 'side choices', 'snack section', 'snack menu', 'snack items', 'appetizer menu']
	},
	meals: {
		keywords: ['meal', 'meals', 'meel', 'meeal', 'combo', 'combos', 'meal deal', 'meal deals', 'full meal', 'complete meal', 'وجبة', 'الوجبات', 'وجبات'],
		variations: ['in meals', 'from meals', 'meal section', 'meal category', 'meal menu', 'meal items', 'meal options', 'meal choices', 'meal selection', 'meal list', 'combo menu', 'combo section']
	},
	juices: {
		keywords: ['juice', 'juices', 'juic', 'juce', 'juise', 'fresh juice', 'fruit juice', 'عصير', 'العصائر', 'عصائر', 'عصيرات'],
		variations: ['in juices', 'from juices', 'juice section', 'juice category', 'juice menu', 'juice items', 'juice options', 'juice choices', 'juice selection', 'juice list', 'juice stuff', 'juice things']
	},
	drinks: {
		keywords: ['drink', 'drinks', 'beverage', 'beverages', 'soft drink', 'cold drink', 'pepsi', 'water', 'tea', 'coffee', 'مشروب', 'المشروبات', 'مشروبات'],
		variations: ['in drinks', 'from drinks', 'drink section', 'drink category', 'drink menu', 'drink items', 'drink options', 'drink choices', 'beverage menu', 'beverage section', 'beverage items']
	}
};

const MENU_BROWSING_PATTERNS_AR = {
	showMe: ['أرني', 'عرض', 'وريني', 'فرجني', 'شوف', 'ابغى اشوف', 'بدي شوف', 'أريد رؤية', 'ممكن اشوف', 'تعرض لي', 'هات', 'عطني'],
	whatHave: ['ماذا لديكم', 'شنو عندكم', 'وش عندكم', 'ايش عندكم', 'شو عندكم', 'ما هي الخيارات', 'وش فيه', 'ايش فيه', 'ماهي الاصناف', 'وش تبيعون'],
	menu: ['قائمة', 'القائمة', 'منيو', 'المنيو', 'لائحة الطعام', 'قائمة الطعام', 'الاصناف', 'الاكل', 'قائمة الاكل'],
	list: ['ليسته', 'لستة', 'قائمه', 'لائحة', 'سجل'],
	items: ['اصناف', 'منتجات', 'اغراض', 'اشياء', 'وجبات', 'اكلات'],
	categories: ['اقسام', 'تصنيفات', 'انواع', 'فئات', 'تشكيلة'],
	browse: ['تصفح', 'استعراض', 'رؤية', 'مشاهدة', 'اطلاع'],
	questions: ['ماهو', 'ما هي', 'وش', 'ايش', 'شنو', 'شو'],
	cancel: ['إلغاء الطلب', 'الغاء الطلب', 'إلغاء طلبي', 'الغاء طلبي', 'كنسل', 'إلغاء الكل', 'الغاء الكل', 'إلغاء الطلب بالكامل', 'الغاء بالكامل', 'أريد الإلغاء', 'توقف', 'حذف الطلب', 'إلغاء'],
	finish: ['إنهاء الطلب', 'انهاء الطلب', 'إنهاء', 'انهاء', 'إتمام الطلب', 'حساب', 'الحساب', 'الفاتورة', 'دفع', 'سداد', 'خلاص', 'خلصنا', 'تم الطلب'],
	irrelevant: [
		// Insults & Profanity (Dialects)
		'كلب', 'حمار', 'غبي', 'حيوان', 'يلعن', 'طز', 'خرا', 'زق', 'تفو', 'لحجي', 'ورع', 'ورعان', 'يا ليل', 'اخرس', 'اسكت', 'انطم', 'سد بوزك', 'يا حقير', 'حقير', 'واطي', 'سافل', 'حيوانة', 'كلبة', 'حمارة', 'غبية', 'بقرة', 'ثور', 'تيوس', 'تيس', 'يا غبي', 'يا حمار', 'عنبو', 'لعنة', 'زفت', 'خايس', 'سئ', 'مو زين', 'سيء', 'خبيث', 'لعين', 'مجرم', 'سرواق', 'حرامي', 'كذاب', 'نصاب', 'منافق', 'غشاش', 'يا كذاب',
		// Romance & Compliments
		'احبك', 'اعشقك', 'وحشتني', 'يا حبيبي', 'حبيبي', 'يا قلبي', 'قلبي', 'حياتي', 'يا عيوني', 'عيوني', 'يا روحي', 'روحي', 'يا قمر', 'يا عسل', 'عسل', 'سكر', 'حلو', 'زي القمر', 'جميل', 'وسيم', 'مزيون', 'كشخة', 'ذوق', 'رهيب', 'فنان', 'بطل', 'ما شاء الله', 'يا روحي انت', 'اموت فيك', 'اعزك', 'غالي', 'يا غالي', 'يا طيب', 'خدوم', 'شكرا يا عسل', 'وردة', 'بوسة', 'قبلة', 'تزوجني', 'تتزوجيني', 'خطوبة', 'زواج', 'حب', 'غرام', 'عشق', 'وله',
		// Bot Identity
		'من انت', 'وش اسمك', 'ايش اسمك', 'مين انت', 'انت انسان', 'انت بوت', 'انت حقيقي', 'مين صنعك', 'مين برمجك', 'ايش شغلتك', 'ليش انت هنا', 'انت ذكر ولا انثى', 'بنت ولا ولد', 'كم عمرك', 'وين ساكن', 'وين بيتكم', 'تعرف تطبخ', 'انت تاكل', 'انت تشرب', 'انت تنام', 'في احد غيرك',
		// Unrelated Queries
		'مساعدة', 'ساعدني', 'كيف حالك', 'اخبارك', 'وش علومك', 'طمني عنك', 'الجو', 'الطقس', 'اخبار', 'سياسة', 'كورة', 'مباريات', 'نادي', 'هلال', 'نصر', 'اتحاد', 'شباب', 'الرياض', 'السعودية', 'موسم الرياض', 'وين اروح', 'سفر', 'سياحة', 'فندق', 'مطعم ثاني', 'جوجل', 'بحث', 'فيسبوك', 'تويتر', 'انستقرام', 'تيك توك', 'يوتيوب', 'اغنية', 'فيديو', 'نكتة', 'قول نكتة', 'قصة', 'تاريخ', 'رياضيات', 'علوم', 'مدرسة', 'جامعة', 'دوام', 'شغل', 'وظيفة', 'فلوس', 'غني', 'فقير', 'بيتكوين', 'كريبتو', 'اسهم', 'توقعات', 'شرطة', 'طوارئ', 'اسعاف', 'حريق', 'مستشفى', 'دكتور', 'سوق', 'تسوق', 'سيارات', 'طيارة', 'سفرة', 'اجازة', 'العاب', 'بلايستيشن', 'انمي', 'افلام', 'مسلسلات', 'نتفلكس', 'امازون', 'موقعكم', 'وينكم', 'مكانكم', 'فروعكم', 'وين الفرع',
		// Fillers & Nonsense
		'خرابيط', 'كلام فاضي', 'اي شيء', 'مدري', 'ما ادري', 'يمكن', 'ممكن', 'صح', 'خطأ', 'لا لا', 'ايه ايه', 'خلاص خلاص', 'بس بس', 'هيا تعال', 'وش السالفة', 'شالسالفة', 'تست', 'تحربة', 'بيبي', 'باي', 'مع السلامة', 'اشوفك', 'يلا', 'باي باي', 'هيا', 'تست تست'
	]
};

const CATEGORY_KEYWORDS_AR = {
	burgers: {
		keywords: ['برجر', 'البرجر', 'برجرات', 'برقر', 'همبرجر', 'برجر لحم', 'برجر دجاج'],
		variations: ['قسم البرجر', 'قائمة البرجر', 'انواع البرجر', 'اصناف البرجر', 'وجبات البرجر', 'منيو البرجر']
	},
	wraps: {
		keywords: ['تورتيلا', 'تورتلا', 'لفائف', 'اللفائف', 'رول', 'سندويشات تورتيلا', 'راب'],
		variations: ['قسم التورتيلا', 'قائمة التورتيلا', 'انواع التورتيلا', 'اصناف التورتيلا', 'لفائف التورتيلا']
	},
	sandwiches: {
		keywords: ['سندويش', 'سندويتش', 'سندويشات', 'ساندويش', 'صاج', 'شطيرة'],
		variations: ['قسم السندويشات', 'قائمة السندويشات', 'انواع السندويشات', 'سندويشات مشكلة']
	},
	sides: {
		keywords: ['مقبلات', 'المقبلات', 'سناك', 'وجبات خفيفة', 'بطاطس', 'ناجتس', 'بوب كورن'],
		variations: ['قسم المقبلات', 'قائمة المقبلات', 'انواع المقبلات', 'اضافات', 'جانبية']
	},
	meals: {
		keywords: ['وجبة', 'وجبات', 'بوكس', 'كومبو', 'الوجبات'],
		variations: ['قسم الوجبات', 'قائمة الوجبات', 'وجبات كاملة', 'وجبات التوفير']
	},
	juices: {
		keywords: ['عصير', 'عصائر', 'عصيرات', 'العصير', 'مشروبات طازجة'],
		variations: ['قسم العصائر', 'قائمة العصائر', 'انواع العصائر', 'عصيرات طازجة']
	},
	drinks: {
		keywords: ['مشروب', 'مشروبات', 'ببسي', 'بيبسي', 'ماء', 'شاي', 'قهوة', 'مشروبات غازية'],
		variations: ['قسم المشروبات', 'قائمة المشروبات', 'المشروبات الباردة', 'المشروبات الساخنة']
	}
};

const generateIntentPatterns = (lang = 'en') => {
	const patterns = [];
	const isAr = lang === 'ar';
	const KEYWORDS_SOURCE = isAr ? CATEGORY_KEYWORDS_AR : CATEGORY_KEYWORDS;
	const PATTERNS_SOURCE = isAr ? MENU_BROWSING_PATTERNS_AR : MENU_BROWSING_PATTERNS;

	Object.keys(KEYWORDS_SOURCE).forEach(categoryId => {
		const catKeywords = KEYWORDS_SOURCE[categoryId].keywords;
		const catVariations = KEYWORDS_SOURCE[categoryId].variations;

		Object.values(PATTERNS_SOURCE).forEach(patternGroup => {
			patternGroup.forEach(pattern => {
				catKeywords.forEach(keyword => {
					patterns.push({ pattern: `${pattern} ${keyword}`, categoryId, intent: 'BROWSE_CATEGORY' });
					if (!isAr) {
						patterns.push({ pattern: `${pattern} the ${keyword}`, categoryId, intent: 'BROWSE_CATEGORY' });
					}
				});
				catVariations.forEach(variation => {
					patterns.push({ pattern: `${pattern} ${variation}`, categoryId, intent: 'BROWSE_CATEGORY' });
				});
			});
		});

		catKeywords.forEach(keyword => {
			patterns.push({ pattern: keyword, categoryId, intent: 'BROWSE_CATEGORY' });
		});
	});

	return patterns;
};

const levenshtein = (a, b) => {
	const matrix = [];
	for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
	for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
			}
		}
	}
	return matrix[b.length][a.length];
};

const detectIntent = (text, lang = 'en') => {
	const normalized = text.toLowerCase().trim();
	const isAr = lang === 'ar';
	const patterns = generateIntentPatterns(lang);

	for (const pattern of patterns) {
		if (normalized === pattern.pattern || normalized.includes(pattern.pattern)) {
			return pattern;
		}
	}

	const PATTERNS_SOURCE = isAr ? MENU_BROWSING_PATTERNS_AR : MENU_BROWSING_PATTERNS;
	for (const cancelPattern of PATTERNS_SOURCE.cancel) {
		if (normalized.includes(cancelPattern)) return { pattern: cancelPattern, intent: 'CANCEL_ORDER' };
	}
	for (const finishPattern of PATTERNS_SOURCE.finish) {
		if (normalized.includes(finishPattern)) return { pattern: finishPattern, intent: 'FINISH_ORDER' };
	}
	for (const irrPattern of PATTERNS_SOURCE.irrelevant) {
		if (normalized.includes(irrPattern)) return { pattern: irrPattern, intent: 'IRRELEVANT' };
	}

	const KEYWORDS_SOURCE = isAr ? CATEGORY_KEYWORDS_AR : CATEGORY_KEYWORDS;
	for (const [categoryId, data] of Object.entries(KEYWORDS_SOURCE)) {
		for (const keyword of data.keywords) {
			if (normalized.includes(keyword) || keyword.includes(normalized)) {
				const hasBrowsingIntent = Object.values(PATTERNS_SOURCE).flat().some(pattern => normalized.includes(pattern));
				if (hasBrowsingIntent || normalized.split(' ').length <= 3) {
					return { pattern: normalized, categoryId, intent: 'BROWSE_CATEGORY' };
				}
			}
		}
	}

	let generalMenuPatterns = isAr ?
		['أهلاً', 'اهلاً', 'اهلا', 'مرحبا', 'مرحباً', 'عرض القائمة', 'القائمة', 'المنيو', 'منيو', 'قائمة الطعام', 'وش عندكم', 'ايش عندكم', 'ماذا لديكم', 'وريني الاكل', 'ابغى اطلب', 'طلب جديد', 'قائمة الاسعار', 'اصناف الاكل', 'ماهي الاصناف', 'بدي شوف المنيو', 'عرض الاصناف', 'وش تبيعون', 'وريني المنيو', 'وين المنيو', 'شنو عندكم', 'شو عندكم', 'فيه منيو'] :
		['hi', 'hello', 'hey', 'start', 'show menu', 'menu', 'show me menu', 'what do you have', 'show items', 'show categories', 'list categories', 'all categories', 'what categories', 'menu categories', 'food categories', 'i want to order', 'menu please', 'need your menu', 'i want menu', 'see menu', 'view menu', 'order please', 'start order', 'show me the menu', 'can i see the menu', 'whats on the menu', 'give me the menu', 'menu options', 'menu items', 'menu list', 'menu card', 'menu now', 'menu info', 'menu information', 'menu details', 'id like to see the menu', 'can you show your menu', 'i want to check the menu', 'do you have a menu', 'please send me the menu', 'id like to order something', 'what can i order', 'what food do you have', 'whats available', 'what dishes do you serve', 'can i get the menu', 'i want to see what you offer'];

	const normalizedLower = normalized.replace(/[^a-z0-9\u0600-\u06FF\s]/g, '').replace(/\s+/g, ' ').trim();
	for (const pattern of generalMenuPatterns) {
		const patternLower = pattern.replace(/[^a-z0-9\u0600-\u06FF\s]/g, '').replace(/\s+/g, ' ').trim();
		if (normalizedLower === patternLower || normalizedLower.includes(patternLower) || patternLower.includes(normalizedLower)) {
			return { pattern: normalized, categoryId: null, intent: 'BROWSE_ALL_CATEGORIES' };
		}
		const dist = levenshtein(normalizedLower, patternLower);
		const threshold = Math.max(2, Math.floor(patternLower.length / 3));
		if (dist <= threshold) return { pattern: normalized, categoryId: null, intent: 'BROWSE_ALL_CATEGORIES' };
	}

	return null;
};

module.exports = {
	detectIntent
};
