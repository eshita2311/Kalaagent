export type Language = "en" | "hi" | "ta" | "ur" | "bn" | "mr";

export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  ur: "اردو",
  bn: "বাংলা",
  mr: "मराठी",
};

type TranslationKey =
  | "nav.search"
  | "nav.audit"
  | "nav.dashboard"
  | "nav.wishlist"
  | "nav.orders"
  | "nav.checkout"
  | "nav.help"
  | "nav.login"
  | "nav.logout"
  | "nav.hi"
  | "search.placeholder"
  | "search.button"
  | "search.searching"
  | "search.browseByCategory"
  | "search.unableToFulfill"
  | "search.noResults"
  | "product.buyNow"
  | "checkout.title"
  | "checkout.orderSummary"
  | "checkout.buyerName"
  | "checkout.total"
  | "checkout.payButton"
  | "checkout.reopenPayment"
  | "checkout.noProductSelected"
  | "checkout.paidSuccess"
  | "login.title"
  | "login.signup"
  | "login.name"
  | "login.email"
  | "login.password"
  | "login.submit"
  | "login.createAccount"
  | "wishlist.title"
  | "wishlist.empty"
  | "orders.title"
  | "orders.empty"
  | "help.title"
  | "help.subject"
  | "help.message"
  | "help.submit"
  | "help.submitted"
  | "help.pastTickets";

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  "nav.search": "Search",
  "nav.audit": "Audit Trail",
  "nav.dashboard": "Dashboard",
  "nav.wishlist": "Wishlist",
  "nav.orders": "Orders",
  "nav.checkout": "Checkout",
  "nav.help": "Help Desk",
  "nav.login": "Login",
  "nav.logout": "Logout",
  "nav.hi": "Hi",
  "search.placeholder": "e.g. authentic Madhubani painting under ₹3000",
  "search.button": "Search",
  "search.searching": "Searching…",
  "search.browseByCategory": "Browse by category",
  "search.unableToFulfill": "Unable to fulfill this request",
  "search.noResults": "No results yet — try a search above.",
  "product.buyNow": "Buy Now",
  "checkout.title": "Checkout",
  "checkout.orderSummary": "Order Summary",
  "checkout.buyerName": "Buyer name",
  "checkout.total": "Total",
  "checkout.payButton": "Pay with Razorpay (Test Mode)",
  "checkout.reopenPayment": "Reopen Payment",
  "checkout.noProductSelected": 'No product selected yet — go to Search and click "Buy Now" on a product.',
  "checkout.paidSuccess": "Payment successful (Test Mode)",
  "login.title": "Log in",
  "login.signup": "Sign up",
  "login.name": "Name",
  "login.email": "Email",
  "login.password": "Password",
  "login.submit": "Log in",
  "login.createAccount": "Create account",
  "wishlist.title": "Your Wishlist",
  "wishlist.empty": "Nothing saved yet — tap the heart icon on a product to save it here.",
  "orders.title": "Order History",
  "orders.empty": "No orders yet — your purchases will show up here.",
  "help.title": "Help Desk",
  "help.subject": "Subject",
  "help.message": "Message",
  "help.submit": "Submit Ticket",
  "help.submitted": "Your ticket has been submitted. We'll get back to you soon.",
  "help.pastTickets": "Your Past Tickets",
};

const hi: Translations = {
  "nav.search": "खोजें",
  "nav.audit": "ऑडिट ट्रेल",
  "nav.dashboard": "डैशबोर्ड",
  "nav.wishlist": "इच्छा सूची",
  "nav.orders": "ऑर्डर",
  "nav.checkout": "चेकआउट",
  "nav.help": "सहायता केंद्र",
  "nav.login": "लॉग इन",
  "nav.logout": "लॉग आउट",
  "nav.hi": "नमस्ते",
  "search.placeholder": "उदाहरण: ₹3000 के अंदर असली मधुबनी पेंटिंग",
  "search.button": "खोजें",
  "search.searching": "खोज रहे हैं…",
  "search.browseByCategory": "श्रेणी के अनुसार ब्राउज़ करें",
  "search.unableToFulfill": "यह अनुरोध पूरा नहीं किया जा सका",
  "search.noResults": "अभी तक कोई परिणाम नहीं — ऊपर खोजें।",
  "product.buyNow": "अभी खरीदें",
  "checkout.title": "चेकआउट",
  "checkout.orderSummary": "ऑर्डर सारांश",
  "checkout.buyerName": "खरीदार का नाम",
  "checkout.total": "कुल",
  "checkout.payButton": "Razorpay से भुगतान करें (टेस्ट मोड)",
  "checkout.reopenPayment": "भुगतान फिर से खोलें",
  "checkout.noProductSelected": "अभी तक कोई उत्पाद चयनित नहीं है — खोजें में जाएं और किसी उत्पाद पर 'अभी खरीदें' पर क्लिक करें।",
  "checkout.paidSuccess": "भुगतान सफल (टेस्ट मोड)",
  "login.title": "लॉग इन",
  "login.signup": "साइन अप",
  "login.name": "नाम",
  "login.email": "ईमेल",
  "login.password": "पासवर्ड",
  "login.submit": "लॉग इन",
  "login.createAccount": "खाता बनाएं",
  "wishlist.title": "आपकी इच्छा सूची",
  "wishlist.empty": "अभी तक कुछ भी सहेजा नहीं गया — किसी उत्पाद पर हार्ट आइकन दबाएं।",
  "orders.title": "ऑर्डर इतिहास",
  "orders.empty": "अभी तक कोई ऑर्डर नहीं — आपकी खरीदारी यहाँ दिखेगी।",
  "help.title": "सहायता केंद्र",
  "help.subject": "विषय",
  "help.message": "संदेश",
  "help.submit": "टिकट सबमिट करें",
  "help.submitted": "आपका टिकट सबमिट हो गया है। हम जल्द ही आपसे संपर्क करेंगे।",
  "help.pastTickets": "आपके पिछले टिकट",
};

const ta: Translations = {
  "nav.search": "தேடல்",
  "nav.audit": "தணிக்கை பாதை",
  "nav.dashboard": "டாஷ்போர்டு",
  "nav.wishlist": "விருப்பப் பட்டியல்",
  "nav.orders": "ஆர்டர்கள்",
  "nav.checkout": "செக்அவுட்",
  "nav.help": "உதவி மையம்",
  "nav.login": "உள்நுழைய",
  "nav.logout": "வெளியேறு",
  "nav.hi": "வணக்கம்",
  "search.placeholder": "எ.கா. ₹3000க்குள் உண்மையான மதுபனி ஓவியம்",
  "search.button": "தேடு",
  "search.searching": "தேடுகிறது…",
  "search.browseByCategory": "வகை வாரியாக உலாவு",
  "search.unableToFulfill": "இந்த கோரிக்கையை நிறைவேற்ற முடியவில்லை",
  "search.noResults": "இதுவரை முடிவுகள் இல்லை — மேலே தேடவும்.",
  "product.buyNow": "இப்போது வாங்கு",
  "checkout.title": "செக்அவுட்",
  "checkout.orderSummary": "ஆர்டர் சுருக்கம்",
  "checkout.buyerName": "வாங்குபவர் பெயர்",
  "checkout.total": "மொத்தம்",
  "checkout.payButton": "Razorpay மூலம் செலுத்தவும் (சோதனை முறை)",
  "checkout.reopenPayment": "பணம் செலுத்துதலை மீண்டும் திற",
  "checkout.noProductSelected": "இன்னும் தயாரிப்பு எதுவும் தேர்ந்தெடுக்கப்படவில்லை — தேடலுக்குச் சென்று 'இப்போது வாங்கு' கிளிக் செய்யவும்.",
  "checkout.paidSuccess": "பணம் செலுத்தல் வெற்றி (சோதனை முறை)",
  "login.title": "உள்நுழைய",
  "login.signup": "பதிவு செய்யவும்",
  "login.name": "பெயர்",
  "login.email": "மின்னஞ்சல்",
  "login.password": "கடவுச்சொல்",
  "login.submit": "உள்நுழைய",
  "login.createAccount": "கணக்கை உருவாக்கு",
  "wishlist.title": "உங்கள் விருப்பப் பட்டியல்",
  "wishlist.empty": "இதுவரை எதுவும் சேமிக்கப்படவில்லை — ஒரு தயாரிப்பில் ஹார்ட் ஐகானை தட்டவும்.",
  "orders.title": "ஆர்டர் வரலாறு",
  "orders.empty": "இதுவரை ஆர்டர்கள் இல்லை — உங்கள் கொள்முதல் இங்கே தோன்றும்.",
  "help.title": "உதவி மையம்",
  "help.subject": "பொருள்",
  "help.message": "செய்தி",
  "help.submit": "டிக்கெட்டை சமர்ப்பிக்கவும்",
  "help.submitted": "உங்கள் டிக்கெட் சமர்ப்பிக்கப்பட்டது. நாங்கள் விரைவில் தொடர்பு கொள்வோம்.",
  "help.pastTickets": "உங்கள் முந்தைய டிக்கெட்டுகள்",
};

const ur: Translations = {
  "nav.search": "تلاش کریں",
  "nav.audit": "آڈٹ ٹریل",
  "nav.dashboard": "ڈیش بورڈ",
  "nav.wishlist": "پسندیدہ فہرست",
  "nav.orders": "آرڈرز",
  "nav.checkout": "چیک آؤٹ",
  "nav.help": "مدد مرکز",
  "nav.login": "لاگ ان",
  "nav.logout": "لاگ آؤٹ",
  "nav.hi": "السلام علیکم",
  "search.placeholder": "مثلاً ₹3000 کے اندر اصلی مدھوبنی پینٹنگ",
  "search.button": "تلاش کریں",
  "search.searching": "تلاش ہو رہی ہے…",
  "search.browseByCategory": "قسم کے مطابق دیکھیں",
  "search.unableToFulfill": "یہ درخواست پوری نہیں کی جا سکی",
  "search.noResults": "ابھی تک کوئی نتیجہ نہیں — اوپر تلاش کریں۔",
  "product.buyNow": "ابھی خریدیں",
  "checkout.title": "چیک آؤٹ",
  "checkout.orderSummary": "آرڈر کا خلاصہ",
  "checkout.buyerName": "خریدار کا نام",
  "checkout.total": "کل رقم",
  "checkout.payButton": "Razorpay سے ادائیگی کریں (ٹیسٹ موڈ)",
  "checkout.reopenPayment": "ادائیگی دوبارہ کھولیں",
  "checkout.noProductSelected": "ابھی تک کوئی پروڈکٹ منتخب نہیں کی گئی — تلاش میں جائیں اور 'ابھی خریدیں' پر کلک کریں۔",
  "checkout.paidSuccess": "ادائیگی کامیاب (ٹیسٹ موڈ)",
  "login.title": "لاگ ان",
  "login.signup": "سائن اپ",
  "login.name": "نام",
  "login.email": "ای میل",
  "login.password": "پاس ورڈ",
  "login.submit": "لاگ ان",
  "login.createAccount": "اکاؤنٹ بنائیں",
  "wishlist.title": "آپ کی پسندیدہ فہرست",
  "wishlist.empty": "ابھی تک کچھ محفوظ نہیں ہوا — کسی پروڈکٹ پر دل کے آئیکن کو دبائیں۔",
  "orders.title": "آرڈر کی تاریخ",
  "orders.empty": "ابھی تک کوئی آرڈر نہیں — آپ کی خریداری یہاں نظر آئے گی۔",
  "help.title": "مدد مرکز",
  "help.subject": "موضوع",
  "help.message": "پیغام",
  "help.submit": "ٹکٹ جمع کروائیں",
  "help.submitted": "آپ کا ٹکٹ جمع ہو گیا ہے۔ ہم جلد آپ سے رابطہ کریں گے۔",
  "help.pastTickets": "آپ کے سابقہ ٹکٹس",
};

const bn: Translations = {
  "nav.search": "খুঁজুন",
  "nav.audit": "অডিট ট্রেইল",
  "nav.dashboard": "ড্যাশবোর্ড",
  "nav.wishlist": "পছন্দের তালিকা",
  "nav.orders": "অর্ডারসমূহ",
  "nav.checkout": "চেকআউট",
  "nav.help": "সহায়তা কেন্দ্র",
  "nav.login": "লগ ইন",
  "nav.logout": "লগ আউট",
  "nav.hi": "নমস্কার",
  "search.placeholder": "যেমন ₹3000 এর মধ্যে আসল মধুবনী পেইন্টিং",
  "search.button": "খুঁজুন",
  "search.searching": "খোঁজা হচ্ছে…",
  "search.browseByCategory": "বিভাগ অনুযায়ী দেখুন",
  "search.unableToFulfill": "এই অনুরোধটি পূরণ করা যায়নি",
  "search.noResults": "এখনো কোনো ফলাফল নেই — উপরে খুঁজুন।",
  "product.buyNow": "এখনই কিনুন",
  "checkout.title": "চেকআউট",
  "checkout.orderSummary": "অর্ডার সারাংশ",
  "checkout.buyerName": "ক্রেতার নাম",
  "checkout.total": "মোট",
  "checkout.payButton": "Razorpay দিয়ে পেমেন্ট করুন (টেস্ট মোড)",
  "checkout.reopenPayment": "পেমেন্ট আবার খুলুন",
  "checkout.noProductSelected": "এখনো কোনো পণ্য নির্বাচন করা হয়নি — সার্চে গিয়ে কোনো পণ্যে 'এখনই কিনুন' ক্লিক করুন।",
  "checkout.paidSuccess": "পেমেন্ট সফল (টেস্ট মোড)",
  "login.title": "লগ ইন",
  "login.signup": "সাইন আপ",
  "login.name": "নাম",
  "login.email": "ইমেইল",
  "login.password": "পাসওয়ার্ড",
  "login.submit": "লগ ইন",
  "login.createAccount": "অ্যাকাউন্ট তৈরি করুন",
  "wishlist.title": "আপনার পছন্দের তালিকা",
  "wishlist.empty": "এখনো কিছু সংরক্ষণ করা হয়নি — কোনো পণ্যে হার্ট আইকনে ট্যাপ করুন।",
  "orders.title": "অর্ডার ইতিহাস",
  "orders.empty": "এখনো কোনো অর্ডার নেই — আপনার কেনাকাটা এখানে দেখা যাবে।",
  "help.title": "সহায়তা কেন্দ্র",
  "help.subject": "বিষয়",
  "help.message": "বার্তা",
  "help.submit": "টিকিট জমা দিন",
  "help.submitted": "আপনার টিকিট জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।",
  "help.pastTickets": "আপনার পূর্ববর্তী টিকিটসমূহ",
};

const mr: Translations = {
  "nav.search": "शोधा",
  "nav.audit": "ऑडिट ट्रेल",
  "nav.dashboard": "डॅशबोर्ड",
  "nav.wishlist": "इच्छा यादी",
  "nav.orders": "ऑर्डर्स",
  "nav.checkout": "चेकआउट",
  "nav.help": "मदत केंद्र",
  "nav.login": "लॉग इन",
  "nav.logout": "लॉग आउट",
  "nav.hi": "नमस्कार",
  "search.placeholder": "उदा. ₹3000 च्या आत खरी मधुबनी पेंटिंग",
  "search.button": "शोधा",
  "search.searching": "शोधत आहे…",
  "search.browseByCategory": "श्रेणीनुसार ब्राउझ करा",
  "search.unableToFulfill": "ही विनंती पूर्ण करता आली नाही",
  "search.noResults": "अद्याप कोणतेही निकाल नाहीत — वर शोधा.",
  "product.buyNow": "आता खरेदी करा",
  "checkout.title": "चेकआउट",
  "checkout.orderSummary": "ऑर्डर सारांश",
  "checkout.buyerName": "खरेदीदाराचे नाव",
  "checkout.total": "एकूण",
  "checkout.payButton": "Razorpay ने पैसे भरा (टेस्ट मोड)",
  "checkout.reopenPayment": "पेमेंट पुन्हा उघडा",
  "checkout.noProductSelected": "अद्याप कोणतेही उत्पादन निवडलेले नाही — शोधा वर जा आणि 'आता खरेदी करा' क्लिक करा.",
  "checkout.paidSuccess": "पेमेंट यशस्वी (टेस्ट मोड)",
  "login.title": "लॉग इन",
  "login.signup": "साइन अप",
  "login.name": "नाव",
  "login.email": "ईमेल",
  "login.password": "पासवर्ड",
  "login.submit": "लॉग इन",
  "login.createAccount": "खाते तयार करा",
  "wishlist.title": "तुमची इच्छा यादी",
  "wishlist.empty": "अद्याप काहीही जतन केलेले नाही — एखाद्या उत्पादनावरील हार्ट आयकॉनवर टॅप करा.",
  "orders.title": "ऑर्डर इतिहास",
  "orders.empty": "अद्याप कोणतीही ऑर्डर नाही — तुमची खरेदी इथे दिसेल.",
  "help.title": "मदत केंद्र",
  "help.subject": "विषय",
  "help.message": "संदेश",
  "help.submit": "तिकीट सबमिट करा",
  "help.submitted": "तुमचे तिकीट सबमिट झाले आहे. आम्ही लवकरच संपर्क करू.",
  "help.pastTickets": "तुमची मागील तिकिटे",
};

export const translations: Record<Language, Translations> = { en, hi, ta, ur, bn, mr };
export type { TranslationKey };
