










const KEYWORD_RULES = {

  transportation: [
  "uber", "ola", "lyft", "rapido", "metro", "bus", "train", "irctc",
  "petrol", "fuel", "gas station", "parking", "toll", "cab", "taxi",
  "auto rickshaw", "rickshaw", "diesel"],


  groceries: [
  "bigbasket", "blinkit", "dmart", "d-mart", "reliance fresh",
  "grocery", "kirana", "supermarket", "vegetables", "fruits",
  "milk", "bread", "zepto", "jiomart", "instamart"],


  food: [
  "swiggy", "zomato", "restaurant", "cafe", "starbucks", "dominos",
  "pizza", "burger", "mcdonald", "kfc", "subway", "food", "dining",
  "biryani", "chinese", "dine", "eat"],


  shopping: [
  "amazon", "flipkart", "myntra", "ajio", "mall", "croma", "reliance digital",
  "shop", "purchase", "clothing", "electronic", "nykaa", "meesho"],


  entertainment: [
  "netflix", "spotify", "hotstar", "prime video", "bookmyshow",
  "movie", "cinema", "game", "steam", "playstation", "xbox",
  "concert", "streaming", "disney"],


  utilities: [
  "electricity", "electric", "power", "water board", "gas agency",
  "jio", "airtel", "vodafone", "bsnl", "internet", "wifi", "fiber",
  "phone bill", "recharge", "broadband"],


  housing: [
  "rent", "landlord", "mortgage", "society", "maintenance",
  "property tax", "home repair", "plumber", "electrician",
  "house", "flat", "apartment"],


  healthcare: [
  "hospital", "pharmacy", "doctor", "dr.", "clinic", "medical",
  "apollo", "1mg", "pharmeasy", "lab test", "diagnostic",
  "dental", "health", "medicine"],


  education: [
  "udemy", "coursera", "book", "tuition", "school", "college",
  "university", "course", "exam", "education", "learning",
  "skillshare", "linkedin learning"],


  travel: [
  "makemytrip", "goibibo", "hotel", "booking.com", "flight",
  "airline", "trip", "travel", "vacation", "oyo", "airbnb"],


  personal: [
  "salon", "gym", "spa", "beauty", "haircut", "grooming",
  "laundry", "dry clean", "fitness"],


  insurance: [
  "lic", "insurance", "premium", "policy", "hdfc life",
  "icici prudential", "car insurance", "health insurance"],


  bills: [
  "emi", "loan", "credit card bill", "bank fee", "service charge",
  "late fee", "penalty", "interest"],


  gifts: [
  "gift", "donation", "charity", "birthday", "anniversary",
  "wedding", "present"],


  salary: [
  "salary", "payroll", "wages", "employer", "monthly pay"],

  freelance: [
  "freelance", "upwork", "fiverr", "client payment", "gig",
  "contract work"],

  investments: [
  "dividend", "interest earned", "mutual fund", "sip", "stock",
  "zerodha", "groww", "investment return"]

};








export function classifyByKeywords(description, merchantName = "") {
  const text = `${description} ${merchantName}`.toLowerCase().trim();

  for (const [category, keywords] of Object.entries(KEYWORD_RULES)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return {
          category,
          confidence: "keyword-match",
          matchedKeyword: keyword
        };
      }
    }
  }


  return {
    category: "other-expense",
    confidence: "no-match",
    matchedKeyword: null
  };
}







export function evaluateBaselineAccuracy(testData) {
  let correct = 0;
  const perCategory = {};
  const confusionSummary = [];

  for (const item of testData) {
    const predicted = classifyByKeywords(item.description, item.merchantName || "");
    const actual = item.category;
    const isCorrect = predicted.category === actual;

    if (isCorrect) correct++;


    if (!perCategory[actual]) {
      perCategory[actual] = { total: 0, correct: 0 };
    }
    perCategory[actual].total++;
    if (isCorrect) perCategory[actual].correct++;


    if (!isCorrect) {
      confusionSummary.push({
        description: item.description,
        actual,
        predicted: predicted.category,
        matchedKeyword: predicted.matchedKeyword
      });
    }
  }


  const perCategoryAccuracy = {};
  for (const [cat, stats] of Object.entries(perCategory)) {
    perCategoryAccuracy[cat] = {
      accuracy: parseFloat((stats.correct / stats.total * 100).toFixed(2)),
      correct: stats.correct,
      total: stats.total
    };
  }

  return {
    accuracy: parseFloat((correct / testData.length * 100).toFixed(2)),
    total: testData.length,
    correct,
    perCategory: perCategoryAccuracy,
    misclassifications: confusionSummary.slice(0, 20)
  };
}
