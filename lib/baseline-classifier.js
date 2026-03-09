/**
 * Baseline Keyword-Based Transaction Classifier
 * 
 * A simple rule-based classifier that maps merchant names and
 * transaction descriptions to categories using keyword matching.
 * 
 * This serves as a BASELINE comparison for the paper to demonstrate
 * the improvement of LLM-based classification over naive approaches.
 */

// Keyword → category mapping (lowercase)
const KEYWORD_RULES = {
    // Transportation
    transportation: [
        "uber", "ola", "lyft", "rapido", "metro", "bus", "train", "irctc",
        "petrol", "fuel", "gas station", "parking", "toll", "cab", "taxi",
        "auto rickshaw", "rickshaw", "diesel",
    ],
    // Groceries
    groceries: [
        "bigbasket", "blinkit", "dmart", "d-mart", "reliance fresh",
        "grocery", "kirana", "supermarket", "vegetables", "fruits",
        "milk", "bread", "zepto", "jiomart", "instamart",
    ],
    // Food & Dining
    food: [
        "swiggy", "zomato", "restaurant", "cafe", "starbucks", "dominos",
        "pizza", "burger", "mcdonald", "kfc", "subway", "food", "dining",
        "biryani", "chinese", "dine", "eat",
    ],
    // Shopping
    shopping: [
        "amazon", "flipkart", "myntra", "ajio", "mall", "croma", "reliance digital",
        "shop", "purchase", "clothing", "electronic", "nykaa", "meesho",
    ],
    // Entertainment
    entertainment: [
        "netflix", "spotify", "hotstar", "prime video", "bookmyshow",
        "movie", "cinema", "game", "steam", "playstation", "xbox",
        "concert", "streaming", "disney",
    ],
    // Utilities
    utilities: [
        "electricity", "electric", "power", "water board", "gas agency",
        "jio", "airtel", "vodafone", "bsnl", "internet", "wifi", "fiber",
        "phone bill", "recharge", "broadband",
    ],
    // Housing
    housing: [
        "rent", "landlord", "mortgage", "society", "maintenance",
        "property tax", "home repair", "plumber", "electrician",
        "house", "flat", "apartment",
    ],
    // Healthcare
    healthcare: [
        "hospital", "pharmacy", "doctor", "dr.", "clinic", "medical",
        "apollo", "1mg", "pharmeasy", "lab test", "diagnostic",
        "dental", "health", "medicine",
    ],
    // Education
    education: [
        "udemy", "coursera", "book", "tuition", "school", "college",
        "university", "course", "exam", "education", "learning",
        "skillshare", "linkedin learning",
    ],
    // Travel
    travel: [
        "makemytrip", "goibibo", "hotel", "booking.com", "flight",
        "airline", "trip", "travel", "vacation", "oyo", "airbnb",
    ],
    // Personal Care
    personal: [
        "salon", "gym", "spa", "beauty", "haircut", "grooming",
        "laundry", "dry clean", "fitness",
    ],
    // Insurance
    insurance: [
        "lic", "insurance", "premium", "policy", "hdfc life",
        "icici prudential", "car insurance", "health insurance",
    ],
    // Bills & Fees
    bills: [
        "emi", "loan", "credit card bill", "bank fee", "service charge",
        "late fee", "penalty", "interest",
    ],
    // Gifts
    gifts: [
        "gift", "donation", "charity", "birthday", "anniversary",
        "wedding", "present",
    ],
    // Income categories
    salary: [
        "salary", "payroll", "wages", "employer", "monthly pay",
    ],
    freelance: [
        "freelance", "upwork", "fiverr", "client payment", "gig",
        "contract work",
    ],
    investments: [
        "dividend", "interest earned", "mutual fund", "sip", "stock",
        "zerodha", "groww", "investment return",
    ],
};

/**
 * Classify a transaction using keyword matching.
 * 
 * @param {string} description - Transaction description
 * @param {string} merchantName - Merchant name (optional)
 * @returns {{ category: string, confidence: string, matchedKeyword: string | null }}
 */
export function classifyByKeywords(description, merchantName = "") {
    const text = `${description} ${merchantName}`.toLowerCase().trim();

    for (const [category, keywords] of Object.entries(KEYWORD_RULES)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                return {
                    category,
                    confidence: "keyword-match",
                    matchedKeyword: keyword,
                };
            }
        }
    }

    // Default fallback
    return {
        category: "other-expense",
        confidence: "no-match",
        matchedKeyword: null,
    };
}

/**
 * Evaluate baseline classifier accuracy against a labeled dataset.
 * 
 * @param {{ description: string, category: string, merchantName?: string }[]} testData
 * @returns {{ accuracy: number, total: number, correct: number, perCategory: object, confusionSummary: object[] }}
 */
export function evaluateBaselineAccuracy(testData) {
    let correct = 0;
    const perCategory = {};
    const confusionSummary = [];

    for (const item of testData) {
        const predicted = classifyByKeywords(item.description, item.merchantName || "");
        const actual = item.category;
        const isCorrect = predicted.category === actual;

        if (isCorrect) correct++;

        // Track per-category stats
        if (!perCategory[actual]) {
            perCategory[actual] = { total: 0, correct: 0 };
        }
        perCategory[actual].total++;
        if (isCorrect) perCategory[actual].correct++;

        // Log misclassifications for analysis
        if (!isCorrect) {
            confusionSummary.push({
                description: item.description,
                actual,
                predicted: predicted.category,
                matchedKeyword: predicted.matchedKeyword,
            });
        }
    }

    // Calculate per-category accuracy
    const perCategoryAccuracy = {};
    for (const [cat, stats] of Object.entries(perCategory)) {
        perCategoryAccuracy[cat] = {
            accuracy: parseFloat(((stats.correct / stats.total) * 100).toFixed(2)),
            correct: stats.correct,
            total: stats.total,
        };
    }

    return {
        accuracy: parseFloat(((correct / testData.length) * 100).toFixed(2)),
        total: testData.length,
        correct,
        perCategory: perCategoryAccuracy,
        misclassifications: confusionSummary.slice(0, 20), // Top 20 errors
    };
}
