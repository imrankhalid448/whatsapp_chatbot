// Node.js compatible menu data for backend bot
module.exports = {
	categories: [
		{ id: 'burgers', title: { en: "Burgers", ar: "البرجر" }, description: { en: "Delicious Burgers", ar: "برجر لذيذ" }, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
		{ id: 'wraps', title: { en: "Wraps", ar: "اللفائف" }, description: { en: "Tasty Wraps", ar: "لفائف شهية" }, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80" },
		{ id: 'sandwiches', title: { en: "Sandwiches", ar: "السندويشات" }, description: { en: "Fresh Sandwiches", ar: "سندويشات طازجة" }, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80" },
		{ id: 'sides', title: { en: "Sides & Snacks", ar: "مقبلات و وجبات خفيفة" }, description: { en: "Crunchy Sides", ar: "مقبلات مقرمشة" }, image: "https://images.unsplash.com/photo-1541592106381-b31e9674c96b?auto=format&fit=crop&w=600&q=80" },
		{ id: 'meals', title: { en: "Meals", ar: "الوجبات" }, description: { en: "Full Meals", ar: "وجبات كاملة" }, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80" },
		{ id: 'juices', title: { en: "Juices", ar: "العصائر" }, description: { en: "Fresh Juices", ar: "عصائر طازجة" }, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80" },
		{ id: 'drinks', title: { en: "Drinks", ar: "المشروبات" }, description: { en: "Cold Drinks", ar: "مشروبات باردة" }, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" }
	],
	items: {
		burgers: [
			{ id: "1", name: { en: "Chicken Burger", ar: "برجر دجاج" }, price: 9.5, image: "https://images.unsplash.com/photo-1615297928064-24977384d271?auto=format&fit=crop&w=600&q=80" },
			{ id: "2", name: { en: "Beef Burger", ar: "برجر لحم" }, price: 9.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
			{ id: "3", name: { en: "Regular Zinger Burger", ar: "برجر زنجر عادي" }, price: 13.5, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80" },
			{ id: "4", name: { en: "Spicy Zinger Burger", ar: "برجر زنجر حار" }, price: 11.5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80" },
			{ id: "5", name: { en: "Crispy Burger", ar: "برجر كرسبي" }, price: 14.0, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80" }
		],
		wraps: [
			{ id: "6", name: { en: "Spicy Tortilla Zinger", ar: "تورتيلا زنجر حار" }, price: 12.5, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80" },
			{ id: "7", name: { en: "Regular Tortilla Zinger", ar: "تورتيلا زنجر عادي" }, price: 14.5, image: "https://images.unsplash.com/photo-1562967960-f4d6d84f9ed4?auto=format&fit=crop&w=600&q=80" },
			{ id: "8", name: { en: "Tortilla Chicken Jumbo", ar: "تورتيلا دجاج جامبو" }, price: 15.0, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80" }
		],
		sandwiches: [
			{ id: "9", name: { en: "Kibdah Sandwich", ar: "ساندويتش كبدة" }, price: 4.75, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80" },
			{ id: "10", name: { en: "Egg Sandwich", ar: "ساندويتش بيض" }, price: 3.75, image: "https://images.unsplash.com/photo-1525385133512-2f3b8b159259?auto=format&fit=crop&w=600&q=80" },
			{ id: "11", name: { en: "Shakshouka Sandwich", ar: "ساندويتش شكشوكة" }, price: 3.75, image: "https://images.unsplash.com/photo-1590558774780-d2328b9c8b0c?auto=format&fit=crop&w=600&q=80" },
			{ id: "12", name: { en: "Chicken Sandwich", ar: "ساندويتش دجاج" }, price: 4.75, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80" },
			{ id: "13", name: { en: "Kabab Chicken Jumbo", ar: "كباب دجاج جامبو" }, price: 14.5, image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80" },
			{ id: "14", name: { en: "Kudu Chicken Sandwich", ar: "ساندويتش دجاج كودو" }, price: 16.5, image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80" },
			{ id: "15", name: { en: "Falafel Sandwich", ar: "ساندويتش فلافل" }, price: 4.75, image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&w=600&q=80" },
			{ id: "16", name: { en: "Hot Dog Jumbo", ar: "هوت دوج جامبو" }, price: 8.5, image: "https://images.unsplash.com/photo-1619740455993-9e612b4e7b42?auto=format&fit=crop&w=600&q=80" }
		],
		sides: [
			{ id: "44", name: { en: "Popcorn", ar: "فشار" }, price: 6.0, image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80" },
			{ id: "17", name: { en: "Sweet Potato", ar: "بطاطس حلوة" }, price: 7.5, image: "https://images.unsplash.com/photo-1600557754388-75b8a916301f?auto=format&fit=crop&w=600&q=80" },
			{ id: "18", name: { en: "Sweet Corn", ar: "ذرة حلوة" }, price: 8.0, image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80" },
			{ id: "19", name: { en: "French Fries", ar: "بطاطس مقلية" }, price: 8.0, image: "https://images.unsplash.com/photo-1541592106381-b31e9674c96b?auto=format&fit=crop&w=600&q=80" },
			{ id: "20", name: { en: "Potato Crispy", ar: "بطاطس كرسبي" }, price: 8.0, image: "https://images.unsplash.com/photo-1628191011893-0ec391ad5522?auto=format&fit=crop&w=600&q=80" },
			{ id: "21", name: { en: "Corn Dog", ar: "كورندوج" }, price: 8.0, image: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=600&q=80" },
			{ id: "22", name: { en: "Chicken Nuggets (8 pcs)", ar: "دجاج ناجتس ٨ قطع" }, price: 12.0, image: "https://images.unsplash.com/photo-1562967960-f4d6d84f9ed4?auto=format&fit=crop&w=600&q=80" },
			{ id: "23", name: { en: "Chicken Popcorn", ar: "دجاج بوب كورن" }, price: 8.5, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80" },
			{ id: "24", name: { en: "Onion Rings", ar: "حلقات بصل" }, price: 8.0, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&q=80" }
		],
		meals: [
			{ id: "25", name: { en: "Chicken Burger Meal", ar: "وجبة برجر دجاج" }, price: 14.5, image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=600&q=80" },
			{ id: "26", name: { en: "Beef Burger Meal", ar: "وجبة برجر لحم" }, price: 14.5, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80" },
			{ id: "27", name: { en: "Crispy Burger Meal", ar: "وجبة برجر كرسبي" }, price: 19.5, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80" },
			{ id: "28", name: { en: "Tortilla Chicken Meal", ar: "وجبة تورتيلا دجاج" }, price: 15.5, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80" },
			{ id: "29", name: { en: "Kabab Chicken Meal", ar: "وجبة كباب دجاج" }, price: 19.5, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80" },
			{ id: "30", name: { en: "Hot Dog Meal", ar: "وجبة هوت دوج" }, price: 13.5, image: "https://images.unsplash.com/photo-1619740455993-9e612b4e7b42?auto=format&fit=crop&w=600&q=80" },
			{ id: "31", name: { en: "Spicy Zinger Burger Meal", ar: "وجبة برجر زنجر حار" }, price: 16.5, image: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=600&q=80" },
			{ id: "32", name: { en: "Regular Zinger Burger Meal", ar: "وجبة برجر زنجر عادي" }, price: 18.5, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80" },
			{ id: "33", name: { en: "Spicy Tortilla Zinger Meal", ar: "وجبة تورتيلا زنجر حار" }, price: 17.5, image: "https://images.unsplash.com/photo-1544982503-9f9848a4a34e?auto=format&fit=crop&w=600&q=80" },
			{ id: "34", name: { en: "Regular Tortilla Zinger Meal", ar: "وجبة تورتيلا زنجر عادي" }, price: 19.5, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80" },
			{ id: "35", name: { en: "Spicy Chicken Barosted", ar: "دجاج بروستد حار" }, price: 19.5, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80" },
			{ id: "36", name: { en: "Chicken Nuggets Meal", ar: "وجبة دجاج ناجتس" }, price: 17.5, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80" }
		],
		juices: [
			{ id: "45", name: { en: "Rabia Juice", ar: "عصير ربيع" }, price: 2.5, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80" },
			{ id: "37", name: { en: "Fresh Orange Juice", ar: "عصير برتقال طازج" }, price: 10.0, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80" },
			{ id: "38", name: { en: "Slash Juice", ar: "عصير سلاش" }, price: 6.0, image: "https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=600&q=80" },
			{ id: "39", name: { en: "Cocktail Juice", ar: "عصير كوكتيل" }, price: 6.0, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" }
		],
		drinks: [
			{ id: "40", name: { en: "Pepsi", ar: "بيبسي" }, price: 2.5, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
			{ id: "41", name: { en: "Water", ar: "ماء" }, price: 1.5, image: "https://images.unsplash.com/photo-1616118132534-381148898bb4?auto=format&fit=crop&w=600&q=80" },
			{ id: "42", name: { en: "Tea", ar: "شاي" }, price: 1.5, image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80" },
			{ id: "43", name: { en: "Coffee", ar: "قهوة" }, price: 3.0, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80" }
		]
	}
};