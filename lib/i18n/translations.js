import { DEFAULT_LOCALE, resolveLocale } from "./config";

export const MESSAGES = {
  en: {
    header: {
      features: "Features",
      proof: "Proof",
      login: "Login"
    },
    hero: {
      badge: "AI-assisted finance for high-speed decisions",
      titleFirst: "Stop Tracking.",
      titleSecond: "Start Controlling Money.",
      subtitle:
      "Gullak turns every transaction into momentum. Capture expenses, forecast outcomes, and get signal-first insights without dashboard clutter.",
      secureAuth: "Secure auth",
      realtimeInsights: "Realtime insights",
      smartAutomation: "Smart automation",
      enterDashboard: "Enter Dashboard",
      users: "Users",
      tracked: "Tracked",
      uptime: "Uptime",
      usersValue: "50K+",
      trackedValue: "Rs.200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "Product signal",
      essentialTitle: "Everything essential. Nothing noisy.",
      essentialSubtitle:
      "Built for short attention spans: fast capture, clear analytics, and actionable feedback.",
      trust: "Trust and conversion",
      valueTitle: "See the value in under a minute.",
      ctaTitle: "Ready to run your money like a control room?",
      ctaSubtitle:
      "Jump in, log your first transactions, and watch real insights kick in.",
      launch: "Launch Gullak"
    },
    sidebar: {
      workspace: "Workspace",
      actions: "Actions",
      dashboard: "Dashboard",
      analytics: "Analytics",
      goals: "Goals",
      recurringCenter: "Recurring Center",
      reports: "Reports",
      quickAdd: "Quick Add",
      preferences: "Preferences",
      weekFocus: "This Week's Focus",
      weekFocusHint: "Keep expenses below income and log every transaction on the same day.",
      navigationMenu: "Navigation Menu",
      contactUs: "Contact Us",
      versionLabel: "Gullak v1.1 Premium Preview"
    },
    dashboard: {
      commandCenter: "Financial command center",
      commandCenterTitle: "Track momentum, spot risk, and act faster",
      selectMonth: "Select month",
      performanceSnapshot: "Performance Snapshot",
      performanceHint: "Month-over-month movement for the numbers that matter most.",
      spendingStory: "Spending Story",
      spendingHint: "Recent activity and category concentration for the selected month.",
      financialPulse: "Financial Pulse",
      financialHealthScore: "Financial Health Score",
      onTrack: "On track",
      watchSpending: "Watch spending",
      actionNeeded: "Action needed",
      projectedMonthEndBalance: "Projected Month-End Balance",
      projectedGrowth: "Projected growth",
      projectedDecline: "Projected decline",
      currentTotalBalance: "Current Total Balance",
      allLinkedAccounts: "Across all linked accounts",
      insightCashflowPositive: "You are cashflow-positive this month.",
      insightCashflowNegative: "You are spending more than you are earning this month.",
      insightHighActivity: "High transaction activity detected. Review frequent categories.",
      insightManageableActivity: "Transaction volume is manageable this month.",
      insightBalanceUp: "Projected month-end balance is improving.",
      insightBalanceDown: "Projected month-end balance may decline if current pace continues.",
      totalBalance: "Total Balance",
      incomeLabel: "Income",
      expensesLabel: "Expenses",
      netCashflow: "Net Cashflow",
      stableVsLastMonth: "Stable vs last month",
      vsLastMonth: "vs last month",
      latestActivity: "Latest Activity",
      selectAccount: "Select account",
      noActivity: "No activity for this month yet. Add your first entry to start insight tracking.",
      untitledTransaction: "Untitled Transaction",
      expenseMix: "Expense Mix",
      noExpenseData: "Expense data will appear here once you record expense transactions.",
      projectedIncome: "Projected Income",
      projectedExpenses: "Projected Expenses",
      projectedNet: "Projected Net",
      projectedBalance: "Projected Balance",
      forecastStrip: "Forecast Strip",
      monthProgress: "Month progress",
      forecastHint: "Forecast values are pace-adjusted for the current month and final for closed months.",
      ruleBasedInsights: "Rule-Based Insights",
      insightBudgetRiskTitle: "Budget risk is elevated",
      insightBudgetRiskDetail: "Expenses already consumed {pct}% of this month's income.",
      insightCashflowHealthyTitle: "Cashflow is currently healthy",
      insightCashflowHealthyDetail: "You are retaining {amount} this month before projection.",
      insightCategoryConcentrationTitle: "Category concentration detected",
      insightCategoryConcentrationDetail: "{topCategory} accounts for {pct}% of this month's expenses.",
      insightSpendingMixBalancedTitle: "Spending mix is balanced",
      insightSpendingMixBalancedDetail: "Top category ({topCategory}) contributes {pct}% of expenses.",
      insightUnusualExpenseMovementTitle: "Unusual expense movement",
      insightUnusualExpenseMovementDetail: "{count} recent transaction(s) sit outside normal spending behavior.",
      insightNoAnomalySignalTitle: "No anomaly signal this month",
      insightNoAnomalySignalDetail: "Recent spending pattern remains within your normal range.",
      insightSpendingAcceleratedTitle: "Spending has accelerated",
      insightSpendingAcceleratedDetail: "Expenses are up {pct}% versus last month.",
      insightGreatMomentumTitle: "Great momentum versus last month",
      insightGreatMomentumDetail: "Expenses are down {pct}% compared to last month.",
      insightMoMSteadyTitle: "Month-over-month spending is steady",
      insightMoMSteadyDetail: "Variance is {variance}% compared to last month."
    },
    reports: {
      title: "Reports",
      subtitle: "Generate monthly exports for budgeting, internships, and planning.",
      filters: "Report Filters",
      month: "Month",
      account: "Account",
      type: "Type",
      allAccounts: "All Accounts",
      incomeAndExpenses: "Income + Expenses",
      incomeOnly: "Income Only",
      expenseOnly: "Expense Only",
      preparing: "Preparing...",
      downloadCsv: "Download CSV",
      downloaded: "Report downloaded successfully",
      downloadFailed: "Failed to download report",
      income: "Income",
      expenses: "Expenses",
      net: "Net",
      preview: "Report Preview",
      transactions: "transactions",
      noTransactionsYet: "No transactions found yet. Add entries to generate your first report.",
      addTransaction: "Add Transaction",
      untitled: "Untitled",
      noMatches: "No transactions match these filters. Try All Accounts or Income + Expenses."
    },
    transaction: {
      addTransactionTitle: "Add Transaction",
      editTransactionTitle: "Edit Transaction",
      scanSuccess: "Receipt scanned successfully",
      createdSuccess: "Transaction created successfully",
      updatedSuccess: "Transaction updated successfully",
      type: "Type",
      selectType: "Select type",
      expense: "Expense",
      income: "Income",
      amount: "Amount",
      quickPicks: "Quick picks:",
      account: "Account",
      selectAccount: "Select account",
      createAccount: "Create Account",
      category: "Category",
      recent: "Recent:",
      selectCategory: "Select category",
      categoryHint: "Choose the closest category now. You can refine analytics from your transaction history later.",
      date: "Date",
      today: "Today",
      yesterday: "Yesterday",
      pickDate: "Pick a date",
      description: "Description",
      enterDescription: "Enter description",
      descriptionTip: "Tip: Add merchant or purpose like \"Swiggy dinner\" for better insights.",
      descriptionGood: "Looks good. This description will improve your category and trend insights.",
      premiumHabit: "Premium habit for this week",
      premiumHabitHint: "Log transactions on the same day to keep your forecast and weekly coaching accurate.",
      recurringTransaction: "Recurring Transaction",
      recurringHint: "Set up a recurring schedule for this transaction",
      recurringInterval: "Recurring Interval",
      selectInterval: "Select interval",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
      cancel: "Cancel",
      updating: "Updating...",
      creating: "Creating...",
      updateTransaction: "Update Transaction",
      createTransaction: "Create Transaction",
      scanButton: "Scan Receipt with AI (Image or PDF)",
      scanning: "Scanning Receipt...",
      fileSizeError: "File size should be less than 5MB",
      fileTypeError: "Please upload an image or PDF file"
    },
    settings: {
      title: "Settings",
      appearance: "Appearance",
      preferredTheme: "Choose your preferred theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      smsNotifications: "SMS Notifications",
      save: "Save",
      saving: "Saving...",
      sendTestSms: "Send Test SMS",
      sending: "Sending...",
      remove: "Remove",
      quickAddPreferences: "Quick Add Preferences",
      manageAccounts: "Manage Accounts",
      addAccount: "Add Account",
      noAccounts: "No accounts found.",
      contactUs: "Contact Us"
    }
  },
  hi: {
    header: {
      features: "फीचर्स",
      proof: "प्रमाण",
      login: "लॉगिन"
    },
    hero: {
      badge: "तेज़ निर्णयों के लिए AI-सहायित वित्त",
      titleFirst: "सिर्फ ट्रैक मत करें।",
      titleSecond: "पैसे पर नियंत्रण करें।",
      subtitle:
      "Gullak हर ट्रांज़ैक्शन को प्रगति में बदलता है। खर्च दर्ज करें, परिणाम का अनुमान लगाएं, और बिना जटिल डैशबोर्ड के स्पष्ट इनसाइट्स पाएं।",
      secureAuth: "सुरक्षित लॉगिन",
      realtimeInsights: "रीयलटाइम इनसाइट्स",
      smartAutomation: "स्मार्ट ऑटोमेशन",
      enterDashboard: "डैशबोर्ड खोलें",
      users: "उपयोगकर्ता",
      tracked: "ट्रैक किया गया",
      uptime: "अपटाइम",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "प्रोडक्ट सिग्नल",
      essentialTitle: "जरूरी सब कुछ। अतिरिक्त कुछ नहीं।",
      essentialSubtitle:
      "कम समय में अधिक काम: तेज़ एंट्री, स्पष्ट एनालिटिक्स, और तुरंत उपयोगी फीडबैक।",
      trust: "विश्वास और परिणाम",
      valueTitle: "एक मिनट से कम में मूल्य देखें।",
      ctaTitle: "क्या आप अपने पैसे को कंट्रोल रूम की तरह चलाना चाहते हैं?",
      ctaSubtitle:
      "शुरू करें, पहली ट्रांज़ैक्शन जोड़ें, और तुरंत उपयोगी इनसाइट्स देखें।",
      launch: "Gullak शुरू करें"
    },
    sidebar: {
      workspace: "वर्कस्पेस",
      actions: "एक्शन",
      dashboard: "डैशबोर्ड",
      analytics: "एनालिटिक्स",
      goals: "लक्ष्य",
      recurringCenter: "रिकरिंग सेंटर",
      reports: "रिपोर्ट्स",
      quickAdd: "क्विक ऐड",
      preferences: "पसंद",
      weekFocus: "इस सप्ताह का फोकस",
      weekFocusHint: "खर्च को आय से कम रखें और हर ट्रांज़ैक्शन उसी दिन दर्ज करें।",
      navigationMenu: "नेविगेशन मेनू",
      contactUs: "संपर्क करें",
      versionLabel: "Gullak v1.1 प्रीमियम प्रीव्यू"
    },
    dashboard: {
      commandCenter: "वित्तीय कमांड सेंटर",
      commandCenterTitle: "गति ट्रैक करें, जोखिम पहचानें, और तेजी से कार्रवाई करें",
      selectMonth: "महीना चुनें",
      performanceSnapshot: "प्रदर्शन स्नैपशॉट",
      performanceHint: "महत्वपूर्ण आंकड़ों की महीने-दर-महीने चाल देखें।",
      spendingStory: "खर्च की कहानी",
      spendingHint: "चुने गए महीने की हाल की गतिविधि और श्रेणी वितरण।",
      financialPulse: "वित्तीय पल्स",
      financialHealthScore: "वित्तीय हेल्थ स्कोर",
      onTrack: "सही दिशा में",
      watchSpending: "खर्च पर नजर रखें",
      actionNeeded: "कार्रवाई जरूरी",
      projectedMonthEndBalance: "अनुमानित महीने-अंत बैलेंस",
      projectedGrowth: "अनुमानित वृद्धि",
      projectedDecline: "अनुमानित गिरावट",
      currentTotalBalance: "वर्तमान कुल बैलेंस",
      allLinkedAccounts: "सभी जुड़े खातों में",
      insightCashflowPositive: "इस महीने आपका कैशफ्लो सकारात्मक है।",
      insightCashflowNegative: "इस महीने आप कमाई से अधिक खर्च कर रहे हैं।",
      insightHighActivity: "उच्च ट्रांज़ैक्शन गतिविधि मिली। बार-बार आने वाली श्रेणियां देखें।",
      insightManageableActivity: "इस महीने ट्रांज़ैक्शन वॉल्यूम नियंत्रित है।",
      insightBalanceUp: "अनुमानित महीने-अंत बैलेंस सुधर रहा है।",
      insightBalanceDown: "वर्तमान गति जारी रही तो महीने-अंत बैलेंस घट सकता है।",
      totalBalance: "कुल बैलेंस",
      incomeLabel: "आय",
      expensesLabel: "खर्च",
      netCashflow: "नेट कैशफ्लो",
      stableVsLastMonth: "पिछले महीने जैसा स्थिर",
      vsLastMonth: "पिछले महीने की तुलना में",
      latestActivity: "हाल की गतिविधि",
      selectAccount: "खाता चुनें",
      noActivity: "इस महीने अभी कोई गतिविधि नहीं। इनसाइट ट्रैकिंग शुरू करने के लिए पहली एंट्री जोड़ें।",
      untitledTransaction: "बिना शीर्षक ट्रांज़ैक्शन",
      expenseMix: "खर्च मिश्रण",
      noExpenseData: "खर्च डेटा यहां तब दिखेगा जब आप खर्च ट्रांज़ैक्शन दर्ज करेंगे।",
      projectedIncome: "अनुमानित आय",
      projectedExpenses: "अनुमानित खर्च",
      projectedNet: "अनुमानित नेट",
      projectedBalance: "अनुमानित बैलेंस",
      forecastStrip: "फोरकास्ट स्ट्रिप",
      monthProgress: "महीने की प्रगति",
      forecastHint: "फोरकास्ट मान वर्तमान महीने की गति के अनुसार समायोजित होते हैं और बंद महीनों के लिए अंतिम होते हैं।",
      ruleBasedInsights: "नियम-आधारित इनसाइट्स"
    },
    reports: {
      title: "रिपोर्ट्स",
      subtitle: "बजटिंग, इंटर्नशिप और योजना के लिए मासिक एक्सपोर्ट बनाएं।",
      filters: "रिपोर्ट फ़िल्टर्स",
      month: "महीना",
      account: "खाता",
      type: "प्रकार",
      allAccounts: "सभी खाते",
      incomeAndExpenses: "आय + खर्च",
      incomeOnly: "केवल आय",
      expenseOnly: "केवल खर्च",
      preparing: "तैयार हो रहा है...",
      downloadCsv: "CSV डाउनलोड करें",
      downloaded: "रिपोर्ट सफलतापूर्वक डाउनलोड हुई",
      downloadFailed: "रिपोर्ट डाउनलोड नहीं हो सकी",
      income: "आय",
      expenses: "खर्च",
      net: "नेट",
      preview: "रिपोर्ट प्रीव्यू",
      transactions: "ट्रांज़ैक्शन",
      noTransactionsYet: "अभी कोई ट्रांज़ैक्शन नहीं मिला। अपनी पहली रिपोर्ट के लिए एंट्री जोड़ें।",
      addTransaction: "ट्रांज़ैक्शन जोड़ें",
      untitled: "बिना शीर्षक",
      noMatches: "इन फ़िल्टर्स से कोई ट्रांज़ैक्शन नहीं मिला। सभी खाते या आय + खर्च आज़माएं।"
    },
    transaction: {
      addTransactionTitle: "ट्रांज़ैक्शन जोड़ें",
      editTransactionTitle: "ट्रांज़ैक्शन संपादित करें",
      scanSuccess: "रसीद सफलतापूर्वक स्कैन हुई",
      createdSuccess: "ट्रांज़ैक्शन सफलतापूर्वक बनाया गया",
      updatedSuccess: "ट्रांज़ैक्शन सफलतापूर्वक अपडेट हुआ",
      type: "प्रकार",
      selectType: "प्रकार चुनें",
      expense: "खर्च",
      income: "आय",
      amount: "राशि",
      quickPicks: "त्वरित विकल्प:",
      account: "खाता",
      selectAccount: "खाता चुनें",
      createAccount: "खाता बनाएं",
      category: "श्रेणी",
      recent: "हाल की:",
      selectCategory: "श्रेणी चुनें",
      categoryHint: "अभी सबसे नजदीकी श्रेणी चुनें। बाद में ट्रांज़ैक्शन हिस्ट्री से एनालिटिक्स सुधार सकते हैं।",
      date: "तारीख",
      today: "आज",
      yesterday: "कल",
      pickDate: "तारीख चुनें",
      description: "विवरण",
      enterDescription: "विवरण दर्ज करें",
      descriptionTip: "सुझाव: बेहतर इनसाइट्स के लिए \"Swiggy dinner\" जैसा व्यापारी या उद्देश्य जोड़ें।",
      descriptionGood: "बहुत अच्छा। यह विवरण आपकी श्रेणी और ट्रेंड इनसाइट्स सुधार देगा।",
      premiumHabit: "इस सप्ताह की प्रीमियम आदत",
      premiumHabitHint: "फोरकास्ट और साप्ताहिक कोचिंग सटीक रखने के लिए ट्रांज़ैक्शन उसी दिन दर्ज करें।",
      recurringTransaction: "रिकरिंग ट्रांज़ैक्शन",
      recurringHint: "इस ट्रांज़ैक्शन के लिए आवर्ती शेड्यूल सेट करें",
      recurringInterval: "आवृत्ति अंतराल",
      selectInterval: "अंतराल चुनें",
      daily: "दैनिक",
      weekly: "साप्ताहिक",
      monthly: "मासिक",
      yearly: "वार्षिक",
      cancel: "रद्द करें",
      updating: "अपडेट हो रहा है...",
      creating: "बन रहा है...",
      updateTransaction: "ट्रांज़ैक्शन अपडेट करें",
      createTransaction: "ट्रांज़ैक्शन बनाएं",
      scanButton: "AI से रसीद स्कैन करें (इमेज या PDF)",
      scanning: "रसीद स्कैन हो रही है...",
      fileSizeError: "फाइल आकार 5MB से कम होना चाहिए",
      fileTypeError: "कृपया इमेज या PDF फाइल अपलोड करें"
    },
    settings: {
      title: "सेटिंग्स",
      appearance: "दिखावट",
      preferredTheme: "अपनी पसंदीदा थीम चुनें",
      light: "लाइट",
      dark: "डार्क",
      system: "सिस्टम",
      smsNotifications: "SMS सूचनाएं",
      save: "सहेजें",
      saving: "सहेजा जा रहा है...",
      sendTestSms: "टेस्ट SMS भेजें",
      sending: "भेजा जा रहा है...",
      remove: "हटाएं",
      quickAddPreferences: "क्विक ऐड पसंद",
      manageAccounts: "खाते प्रबंधित करें",
      addAccount: "खाता जोड़ें",
      noAccounts: "कोई खाता नहीं मिला।",
      contactUs: "संपर्क करें"
    }
  },
  mr: {
    header: {
      features: "वैशिष्ट्ये",
      proof: "पुरावा",
      login: "लॉगिन"
    },
    hero: {
      badge: "जलद निर्णयांसाठी AI-सहाय्यित वित्त",
      titleFirst: "फक्त नोंद नको.",
      titleSecond: "पैशांवर नियंत्रण ठेवा.",
      subtitle:
      "Gullak प्रत्येक व्यवहाराला गती देतो. खर्च नोंदवा, पुढील परिणामांचा अंदाज घ्या, आणि अनावश्यक गोंधळाशिवाय स्पष्ट इनसाइट्स मिळवा.",
      secureAuth: "सुरक्षित प्रवेश",
      realtimeInsights: "रिअलटाइम इनसाइट्स",
      smartAutomation: "स्मार्ट ऑटोमेशन",
      enterDashboard: "डॅशबोर्ड उघडा",
      users: "वापरकर्ते",
      tracked: "ट्रॅक केलेले",
      uptime: "अपटाइम",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "प्रॉडक्ट सिग्नल",
      essentialTitle: "गरजेचं सर्व. गोंधळ शून्य.",
      essentialSubtitle:
      "कमी वेळेत जास्त परिणाम: जलद नोंद, स्पष्ट विश्लेषण आणि कृतीयोग्य अभिप्राय.",
      trust: "विश्वास आणि रूपांतरण",
      valueTitle: "एक मिनिटात मूल्य अनुभवा.",
      ctaTitle: "तुमचे पैसे कंट्रोल रूमसारखे चालवायला तयार आहात?",
      ctaSubtitle:
      "सुरू करा, पहिले व्यवहार नोंदवा आणि तत्काळ इनसाइट्स मिळवा.",
      launch: "Gullak सुरू करा"
    }
  },
  bn: {
    header: {
      features: "ফিচার",
      proof: "প্রমাণ",
      login: "লগইন"
    },
    hero: {
      badge: "দ্রুত সিদ্ধান্তের জন্য AI সহায়তাপ্রাপ্ত ফাইন্যান্স",
      titleFirst: "শুধু ট্র্যাক নয়।",
      titleSecond: "টাকার নিয়ন্ত্রণ নিন।",
      subtitle:
      "Gullak প্রতিটি লেনদেনকে গতিতে রূপ দেয়। খরচ নথিবদ্ধ করুন, ফলাফল অনুমান করুন এবং অপ্রয়োজনীয় ড্যাশবোর্ড ঝামেলা ছাড়া স্পষ্ট ইনসাইট পান।",
      secureAuth: "সুরক্ষিত অথ",
      realtimeInsights: "রিয়েলটাইম ইনসাইট",
      smartAutomation: "স্মার্ট অটোমেশন",
      enterDashboard: "ড্যাশবোর্ডে যান",
      users: "ব্যবহারকারী",
      tracked: "ট্র্যাকড",
      uptime: "আপটাইম",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "প্রোডাক্ট সিগন্যাল",
      essentialTitle: "প্রয়োজনীয় সবকিছু। অতিরিক্ত কিছু নয়।",
      essentialSubtitle:
      "কম সময়ে দ্রুত কাজ: দ্রুত এন্ট্রি, পরিষ্কার অ্যানালিটিক্স এবং কার্যকর ফিডব্যাক।",
      trust: "বিশ্বাস ও রূপান্তর",
      valueTitle: "এক মিনিটেরও কম সময়ে ফল দেখুন।",
      ctaTitle: "আপনার অর্থকে কন্ট্রোল রুমের মতো চালাতে প্রস্তুত?",
      ctaSubtitle:
      "শুরু করুন, প্রথম লেনদেন যোগ করুন এবং সঙ্গে সঙ্গে ইনসাইট পান।",
      launch: "Gullak শুরু করুন"
    }
  },
  ta: {
    header: {
      features: "அம்சங்கள்",
      proof: "சான்று",
      login: "உள்நுழை"
    },
    hero: {
      badge: "வேகமான முடிவுகளுக்கான AI உதவிய நிதி",
      titleFirst: "பதிவு மட்டும் வேண்டாம்.",
      titleSecond: "பணத்தை கட்டுப்படுத்துங்கள்.",
      subtitle:
      "Gullak ஒவ்வொரு பரிவர்த்தனையையும் முன்னேற்றமாக மாற்றுகிறது. செலவுகளை பதிவு செய்யுங்கள், முடிவுகளை முன்னறிவிக்குங்கள், குழப்பமில்லா டாஷ்போர்டில் தெளிவான பார்வைகளைப் பெறுங்கள்.",
      secureAuth: "பாதுகாப்பான உள்நுழைவு",
      realtimeInsights: "நேரடி பார்வைகள்",
      smartAutomation: "ச்மார்ட் தானியக்கம்",
      enterDashboard: "டாஷ்போர்டுக்கு செல்லவும்",
      users: "பயனர்கள்",
      tracked: "பதிவானது",
      uptime: "செயல்நேரம்",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "தயாரிப்பு சிக்னல்",
      essentialTitle: "தேவையானவை அனைத்தும். தேவையற்றது எதுவும் இல்லை.",
      essentialSubtitle:
      "குறைந்த நேரத்தில் அதிக செயல்: வேகமான பதிவு, தெளிவான பகுப்பாய்வு, மற்றும் உடனடி செயல் பரிந்துரைகள்.",
      trust: "நம்பிக்கை மற்றும் மாற்றம்",
      valueTitle: "ஒரு நிமிடத்திற்குள் மதிப்பை காணுங்கள்.",
      ctaTitle: "உங்கள் பணத்தை கட்டுப்பாட்டு அறை போல நிர்வகிக்க தயாரா?",
      ctaSubtitle:
      "தொடங்குங்கள், முதல் பரிவர்த்தனைகளை சேர்த்து உடனே பார்வைகளைப் பெறுங்கள்.",
      launch: "Gullak தொடங்கவும்"
    }
  },
  te: {
    header: {
      features: "ఫీచర్లు",
      proof: "నిరూపణ",
      login: "లాగిన్"
    },
    hero: {
      badge: "వేగవంతమైన నిర్ణయాల కోసం AI సహాయక ఫైనాన్స్",
      titleFirst: "కేవలం ట్రాక్ చేయొద్దు.",
      titleSecond: "డబ్బును నియంత్రించండి.",
      subtitle:
      "Gullak ప్రతి లావాదేవీని పురోగతిగా మారుస్తుంది. ఖర్చులను నమోదు చేయండి, ఫలితాలను అంచనా వేయండి, మరియు డాష్‌బోర్డ్ గందరగోళం లేకుండా స్పష్టమైన ఇన్‌సైట్స్ పొందండి.",
      secureAuth: "భద్రమైన లాగిన్",
      realtimeInsights: "రియల్‌టైమ్ ఇన్‌సైట్స్",
      smartAutomation: "స్మార్ట్ ఆటోమేషన్",
      enterDashboard: "డాష్‌బోర్డ్‌లోకి వెళ్లండి",
      users: "వినియోగదారులు",
      tracked: "ట్రాక్ చేసినది",
      uptime: "అప్టైమ్",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "ప్రోడక్ట్ సిగ్నల్",
      essentialTitle: "అవసరమైనది అన్నీ. గందరగోళం ఏదీ కాదు.",
      essentialSubtitle:
      "చిన్న సమయంలో ఎక్కువ ఫలితం: వేగవంతమైన ఎంట్రీ, స్పష్టమైన విశ్లేషణ, మరియు చర్యకు పనికివచ్చే ఫీడ్‌బ్యాక్.",
      trust: "నమ్మకం మరియు మార్పిడి",
      valueTitle: "ఒక నిమిషంలో విలువను చూడండి.",
      ctaTitle: "మీ డబ్బును కంట్రోల్ రూమ్‌లా నడపడానికి సిద్ధమా?",
      ctaSubtitle:
      "ఇప్పుడే మొదలు పెట్టండి, మొదటి లావాదేవీలను జోడించండి, వెంటనే ఇన్‌సైట్స్ పొందండి.",
      launch: "Gullak ప్రారంభించండి"
    }
  },
  kn: {
    header: {
      features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
      proof: "ಸಾಕ್ಷ್ಯ",
      login: "ಲಾಗಿನ್"
    },
    hero: {
      badge: "ವೇಗದ ನಿರ್ಧಾರಗಳಿಗೆ AI ಸಹಾಯಕ ಹಣಕಾಸು",
      titleFirst: "ಕೆವಲ ಟ್ರ್ಯಾಕ್ ಮಾಡಬೇಡಿ.",
      titleSecond: "ಹಣದ ನಿಯಂತ್ರಣ ಪಡೆಯಿರಿ.",
      subtitle:
      "Gullak ಪ್ರತಿ ವ್ಯವಹಾರವನ್ನು ಪ್ರಗತಿಯಾಗಿಸುತ್ತದೆ. ಖರ್ಚುಗಳನ್ನು ದಾಖಲಿಸಿ, ಫಲಿತಾಂಶಗಳನ್ನು ಊಹಿಸಿ, ಮತ್ತು ಗೊಂದಲವಿಲ್ಲದ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನೊಂದಿಗೆ ಸ್ಪಷ್ಟ ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಿರಿ.",
      secureAuth: "ಸುರಕ್ಷಿತ ಲಾಗಿನ್",
      realtimeInsights: "ರಿಯಲ್‌ಟೈಮ್ ಒಳನೋಟಗಳು",
      smartAutomation: "ಸ್ಮಾರ್ಟ್ ಆಟೋಮೇಷನ್",
      enterDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ",
      users: "ಬಳಕೆದಾರರು",
      tracked: "ಟ್ರ್ಯಾಕ್ ಮಾಡಿದದು",
      uptime: "ಅಪ್‌ಟೈಮ್",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "ಉತ್ಪನ್ನ ಸಂಕೇತ",
      essentialTitle: "ಅಗತ್ಯವಿರುವುದೇ ಎಲ್ಲವೂ. ಗೊಂದಲ ಏನೂ ಇಲ್ಲ.",
      essentialSubtitle:
      "ಕಡಿಮೆ ಸಮಯದಲ್ಲಿ ಹೆಚ್ಚು ಫಲಿತಾಂಶ: ವೇಗವಾದ ದಾಖಲಾತಿ, ಸ್ಪಷ್ಟ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಕ್ರಿಯಾತ್ಮಕ ಪ್ರತಿಕ್ರಿಯೆ.",
      trust: "ವಿಶ್ವಾಸ ಮತ್ತು ಪರಿವರ್ತನೆ",
      valueTitle: "ಒಂದು ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ ಸಮಯದಲ್ಲಿ ಮೌಲ್ಯ ನೋಡಿ.",
      ctaTitle: "ನಿಮ್ಮ ಹಣವನ್ನು ಕಂಟ್ರೋಲ್ ರೂಮ್‌ನಂತೆ ನಿರ್ವಹಿಸಲು ಸಿದ್ಧವೇ?",
      ctaSubtitle:
      "ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ, ಮೊದಲ ವ್ಯವಹಾರಗಳನ್ನು ಸೇರಿಸಿ ಮತ್ತು ತಕ್ಷಣ ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಿರಿ.",
      launch: "Gullak ಆರಂಭಿಸಿ"
    }
  },
  ml: {
    header: {
      features: "സവിശേഷതകള്‍",
      proof: "തെളിവ്",
      login: "ലോഗിന്‍"
    },
    hero: {
      badge: "വേഗത്തിലുള്ള തീരുമാനങ്ങൾക്കായി AI സഹായിത ധനകാര്യ",
      titleFirst: "വെറും ട്രാക്ക് ചെയ്യേണ്ടതില്ല.",
      titleSecond: "പണത്തെ നിയന്ത്രിക്കുക.",
      subtitle:
      "Gullak ഓരോ ഇടപാടിനെയും മുന്നേറ്റമായി മാറ്റുന്നു. ചെലവുകൾ രേഖപ്പെടുത്തുക, ഫലങ്ങൾ പ്രവചിക്കുക, ഡാഷ്ബോർഡ് തിരക്കില്ലാതെ വ്യക്തമായ ഇൻസൈറ്റുകൾ നേടുക.",
      secureAuth: "സുരക്ഷിത ലോഗിന്‍",
      realtimeInsights: "റിയൽടൈം ഇൻസൈറ്റുകൾ",
      smartAutomation: "സ്മാർട്ട് ഓട്ടോമേഷൻ",
      enterDashboard: "ഡാഷ്ബോർഡിലേക്ക് പ്രവേശിക്കുക",
      users: "ഉപയോക്താക്കള്‍",
      tracked: "ട്രാക്ക് ചെയ്തത്",
      uptime: "അപ്ടൈം",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "ഉൽപ്പന്ന സിഗ്നൽ",
      essentialTitle: "അത്യാവശ്യമായത് എല്ലാം. ശബ്ദം ഒന്നുമില്ല.",
      essentialSubtitle:
      "ചുരുങ്ങിയ സമയത്ത് കൂടുതൽ നേട്ടം: വേഗത്തിലുള്ള എൻട്രി, വ്യക്തമായ അനലിറ്റിക്സ്, പ്രായോഗിക ഫീഡ്ബാക്ക്.",
      trust: "വിശ്വാസവും പരിവര്‍ത്തനവും",
      valueTitle: "ഒരു മിനിറ്റിന് താഴെ സമയംകൊണ്ട് മൂല്യം കാണുക.",
      ctaTitle: "നിങ്ങളുടെ പണം കൺട്രോൾ റൂം പോലെ നിയന്ത്രിക്കാൻ തയ്യാറാണോ?",
      ctaSubtitle:
      "ഇപ്പോൾ തുടങ്ങൂ, ആദ്യ ഇടപാടുകൾ ചേർക്കൂ, ഉടൻ ഇൻസൈറ്റുകൾ കാണൂ.",
      launch: "Gullak ആരംഭിക്കുക"
    }
  },
  raj: {
    header: {
      features: "फीचर",
      proof: "सबूत",
      login: "लॉगिन"
    },
    hero: {
      badge: "तेज फैसला खातर AI-सहायता वित्त",
      titleFirst: "सिरफ ट्रैक मत करो.",
      titleSecond: "पैसा रो कंट्रोल लो.",
      subtitle:
      "Gullak हर ट्रांजेक्शन ने तरक्की में बदल देवे है। खर्च लिखो, नतीजा अनुमान करो, अर साफ इनसाइट पावो।",
      secureAuth: "सुरक्षित लॉगिन",
      realtimeInsights: "रीयलटाइम इनसाइट",
      smartAutomation: "स्मार्ट ऑटोमेशन",
      enterDashboard: "डैशबोर्ड खोलो",
      users: "यूजर",
      tracked: "ट्रैक",
      uptime: "अपटाइम",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "प्रोडक्ट सिग्नल",
      essentialTitle: "जरूरी सब कुछ। फालतू कुछ ना.",
      essentialSubtitle:
      "थोड़ा टाइम, ज्यादा काम: फास्ट एंट्री, साफ एनालिटिक्स, अर काम की सलाह।",
      trust: "भरोसो अर कन्वर्जन",
      valueTitle: "एक मिनट में फायदा देखो.",
      ctaTitle: "थारो पैसा कंट्रोल रूम जेसो चलाणे खातर तैयार हो?",
      ctaSubtitle:
      "चालू करो, पहली ट्रांजेक्शन जोड़ो, अर तुरन्त इनसाइट देखो।",
      launch: "Gullak चालू करो"
    }
  },
  pa: {
    header: {
      features: "ਫੀਚਰ",
      proof: "ਸਬੂਤ",
      login: "ਲਾਗਇਨ"
    },
    hero: {
      badge: "ਤੇਜ਼ ਫੈਸਲਿਆਂ ਲਈ AI-ਸਹਾਇਤ ਫਾਇਨੈਂਸ",
      titleFirst: "ਸਿਰਫ ਟ੍ਰੈਕ ਨਾ ਕਰੋ।",
      titleSecond: "ਪੈਸੇ 'ਤੇ ਕੰਟਰੋਲ ਲਓ।",
      subtitle:
      "Gullak ਹਰ ਲੈਣ-ਦੇਣ ਨੂੰ ਤਰੱਕੀ ਵਿੱਚ ਬਦਲਦਾ ਹੈ। ਖਰਚੇ ਦਰਜ ਕਰੋ, ਨਤੀਜੇ ਅਨੁਮਾਨੋ, ਅਤੇ ਸਾਫ ਇਨਸਾਈਟ ਪ੍ਰਾਪਤ ਕਰੋ।",
      secureAuth: "ਸੁਰੱਖਿਅਤ ਲਾਗਇਨ",
      realtimeInsights: "ਰੀਅਲਟਾਈਮ ਇਨਸਾਈਟਸ",
      smartAutomation: "ਸਮਾਰਟ ਆਟੋਮੇਸ਼ਨ",
      enterDashboard: "ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ",
      users: "ਯੂਜ਼ਰ",
      tracked: "ਟ੍ਰੈਕਡ",
      uptime: "ਅਪਟਾਈਮ",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "ਪ੍ਰੋਡਕਟ ਸਿਗਨਲ",
      essentialTitle: "ਲੋੜੀਂਦਾ ਸਭ ਕੁਝ। ਫ਼ਜ਼ੂਲ ਕੁਝ ਨਹੀਂ।",
      essentialSubtitle:
      "ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਵੱਧ ਕੰਮ: ਤੇਜ਼ ਐਂਟਰੀ, ਸਾਫ ਐਨਾਲਿਟਿਕਸ, ਅਤੇ ਕਾਰਗਰ ਫੀਡਬੈਕ।",
      trust: "ਭਰੋਸਾ ਅਤੇ ਕਨਵਰਜ਼ਨ",
      valueTitle: "ਇੱਕ ਮਿੰਟ ਵਿੱਚ ਮੁੱਲ ਵੇਖੋ।",
      ctaTitle: "ਕੀ ਤੁਸੀਂ ਆਪਣੇ ਪੈਸੇ ਨੂੰ ਕੰਟਰੋਲ ਰੂਮ ਵਾਂਗ ਚਲਾਉਣ ਲਈ ਤਿਆਰ ਹੋ?",
      ctaSubtitle:
      "ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ, ਪਹਿਲੀਆਂ ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨਾਂ ਜੋੜੋ, ਅਤੇ ਤੁਰੰਤ ਇਨਸਾਈਟ ਲਓ।",
      launch: "Gullak ਸ਼ੁਰੂ ਕਰੋ"
    }
  },
  or: {
    header: {
      features: "ବିଶେଷତା",
      proof: "ପ୍ରମାଣ",
      login: "ଲଗଇନ୍"
    },
    hero: {
      badge: "ଦ୍ରୁତ ସିଦ୍ଧାନ୍ତ ପାଇଁ AI ସହାୟିତ ଫାଇନାନ୍ସ",
      titleFirst: "କେବଳ ଟ୍ରାକ୍ କରନ୍ତୁ ନାହିଁ।",
      titleSecond: "ଟଙ୍କା ଉପରେ ନିୟନ୍ତ୍ରଣ ନିଅନ୍ତୁ।",
      subtitle:
      "Gullak ପ୍ରତ୍ୟେକ ଲେନଦେନକୁ ଗତିରେ ପରିଣତ କରେ। ଖର୍ଚ୍ଚ ଲେଖନ୍ତୁ, ଫଳାଫଳ ଅନୁମାନ କରନ୍ତୁ, ଏବଂ ସ୍ପଷ୍ଟ ଇନସାଇଟ୍ ପାଆନ୍ତୁ।",
      secureAuth: "ସୁରକ୍ଷିତ ଲଗଇନ୍",
      realtimeInsights: "ରିଅଲ୍ଟାଇମ୍ ଇନସାଇଟ୍",
      smartAutomation: "ସ୍ମାର୍ଟ ଅଟୋମେସନ୍",
      enterDashboard: "ଡ୍ୟାଶବୋର୍ଡକୁ ଯାଆନ୍ତୁ",
      users: "ବ୍ୟବହାରକାରୀ",
      tracked: "ଟ୍ରାକ୍ କରାଯାଇଛି",
      uptime: "ଅପଟାଇମ୍",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "ପ୍ରୋଡକ୍ଟ ସିଗ୍ନାଲ୍",
      essentialTitle: "ଆବଶ୍ୟକ ସବୁକିଛି। ଅନାବଶ୍ୟକ କିଛି ନାହିଁ।",
      essentialSubtitle:
      "କମ ସମୟରେ ଅଧିକ ଫଳ: ଦ୍ରୁତ ଏଣ୍ଟ୍ରି, ସ୍ପଷ୍ଟ ଆନାଲିଟିକ୍ସ, ଏବଂ କାର୍ଯ୍ୟକାରୀ ଫିଡ୍‌ବ୍ୟାକ୍।",
      trust: "ଭରସା ଏବଂ କନଭର୍ସନ୍",
      valueTitle: "ଏକ ମିନିଟ୍‌ରେ ମୂଲ୍ୟ ଦେଖନ୍ତୁ।",
      ctaTitle: "ଆପଣଙ୍କ ଟଙ୍କାକୁ କନ୍ଟ୍ରୋଲ୍ ରୁମ୍ ପରି ଚାଲାଇବାକୁ ପ୍ରସ୍ତୁତ କି?",
      ctaSubtitle:
      "ଏବେ ଆରମ୍ଭ କରନ୍ତୁ, ପ୍ରଥମ ଟ୍ରାନ୍ଜାକ୍ସନ୍ ଯୋଡନ୍ତୁ, ଏବଂ ତୁରନ୍ତ ଇନସାଇଟ୍ ପାଆନ୍ତୁ।",
      launch: "Gullak ଆରମ୍ଭ କରନ୍ତୁ"
    }
  },
  gu: {
    header: {
      features: "ફીચર્સ",
      proof: "પુરાવો",
      login: "લૉગિન"
    },
    hero: {
      badge: "ઝડપી નિર્ણયો માટે AI સહાયિત ફાઇનાન્સ",
      titleFirst: "માત્ર ટ્રેક નહીં.",
      titleSecond: "પૈસે પર નિયંત્રણ મેળવો.",
      subtitle:
      "Gullak દરેક ટ્રાન્ઝેક્શનને ગતિમાં ફેરવે છે. ખર્ચ નોંધો, પરિણામોનો અંદાજ લગાવો અને અવ્યવસ્થિત ડેશબોર્ડ વિના સ્પષ્ટ ઇન્સાઇટ્સ મેળવો.",
      secureAuth: "સુરક્ષિત લોગિન",
      realtimeInsights: "રીઅલટાઇમ ઇન્સાઇટ્સ",
      smartAutomation: "સ્માર્ટ ઓટોમેશન",
      enterDashboard: "ડેશબોર્ડમાં જાઓ",
      users: "વપરાશકર્તાઓ",
      tracked: "ટ્રેક્ડ",
      uptime: "અપટાઇમ",
      usersValue: "50K+",
      trackedValue: "₹200Cr+",
      uptimeValue: "99.9%"
    },
    landing: {
      productSignal: "પ્રોડક્ટ સિગ્નલ",
      essentialTitle: "જરૂરી બધું. અવાજ કંઈ નહીં.",
      essentialSubtitle:
      "ઓછા સમયમાં વધુ: ઝડપી એન્ટ્રી, સ્પષ્ટ એનાલિટિક્સ, અને કાર્યક્ષમ પ્રતિસાદ.",
      trust: "વિશ્વાસ અને રૂપાંતર",
      valueTitle: "એક મિનિટમાં મૂલ્ય જુઓ.",
      ctaTitle: "તમારા પૈસાને કંટ્રોલ રૂમની જેમ ચલાવવા તૈયાર છો?",
      ctaSubtitle:
      "શરૂ કરો, પહેલી ટ્રાન્ઝેક્શન ઉમેરો અને તરત ઇન્સાઇટ્સ મેળવો.",
      launch: "Gullak લોન્ચ કરો"
    }
  }
};

const MODULE_SECTION_KEYS = ["sidebar", "dashboard", "reports", "transaction", "settings"];
const EXTENDED_LOCALES = ["mr", "bn", "ta", "te", "kn", "ml", "raj", "pa", "or", "gu"];

for (const localeCode of EXTENDED_LOCALES) {
  if (!MESSAGES[localeCode]) continue;
  for (const sectionKey of MODULE_SECTION_KEYS) {
    if (!MESSAGES[localeCode][sectionKey]) {
      MESSAGES[localeCode][sectionKey] = MESSAGES.en[sectionKey];
    }
  }
}

const NATIVE_MODULE_OVERRIDES = {
  mr: {
    sidebar: {
      workspace: "कार्यस्थळ",
      actions: "क्रिया",
      dashboard: "डॅशबोर्ड",
      analytics: "विश्लेषण",
      goals: "ध्येये",
      recurringCenter: "आवर्ती केंद्र",
      reports: "अहवाल",
      quickAdd: "त्वरित जोडा",
      preferences: "प्राधान्ये",
      weekFocus: "या आठवड्याचा फोकस",
      contactUs: "संपर्क करा",
      navigationMenu: "नेव्हिगेशन मेनू"
    },
    dashboard: {
      commandCenter: "आर्थिक कमांड सेंटर",
      selectMonth: "महिना निवडा",
      performanceSnapshot: "कामगिरी झलक",
      spendingStory: "खर्चाची कथा",
      latestActivity: "अलीकडील गतिविधी",
      selectAccount: "खाते निवडा",
      expenseMix: "खर्च मिश्रण",
      forecastStrip: "अंदाज पट्टी",
      ruleBasedInsights: "नियमाधारित अंतर्दृष्टी"
    },
    reports: {
      title: "अहवाल",
      filters: "अहवाल फिल्टर",
      month: "महिना",
      account: "खाते",
      type: "प्रकार",
      allAccounts: "सर्व खाती",
      downloadCsv: "CSV डाउनलोड करा",
      income: "उत्पन्न",
      expenses: "खर्च",
      net: "निव्वळ",
      preview: "अहवाल पूर्वावलोकन",
      addTransaction: "व्यवहार जोडा"
    },
    transaction: {
      addTransactionTitle: "व्यवहार जोडा",
      editTransactionTitle: "व्यवहार संपादित करा",
      type: "प्रकार",
      amount: "रक्कम",
      account: "खाते",
      category: "श्रेणी",
      date: "दिनांक",
      description: "वर्णन",
      recurringTransaction: "आवर्ती व्यवहार",
      createTransaction: "व्यवहार तयार करा",
      updateTransaction: "व्यवहार अद्यतनित करा",
      cancel: "रद्द करा"
    },
    settings: {
      title: "सेटिंग्ज",
      appearance: "देखावा",
      smsNotifications: "SMS सूचना",
      quickAddPreferences: "त्वरित-जोड प्राधान्ये",
      manageAccounts: "खाती व्यवस्थापित करा",
      contactUs: "संपर्क करा",
      save: "जतन करा"
    }
  },
  bn: {
    sidebar: {
      workspace: "ওয়ার্কস্পেস",
      actions: "অ্যাকশন",
      dashboard: "ড্যাশবোর্ড",
      analytics: "অ্যানালিটিক্স",
      goals: "লক্ষ্য",
      recurringCenter: "রিকারিং সেন্টার",
      reports: "রিপোর্ট",
      quickAdd: "কুইক অ্যাড",
      preferences: "পছন্দ",
      weekFocus: "এই সপ্তাহের ফোকাস",
      contactUs: "যোগাযোগ করুন",
      navigationMenu: "নেভিগেশন মেনু"
    },
    dashboard: {
      commandCenter: "ফাইন্যান্স কমান্ড সেন্টার",
      selectMonth: "মাস নির্বাচন করুন",
      performanceSnapshot: "পারফরম্যান্স স্ন্যাপশট",
      spendingStory: "খরচের গল্প",
      latestActivity: "সাম্প্রতিক কার্যকলাপ",
      selectAccount: "অ্যাকাউন্ট নির্বাচন করুন",
      expenseMix: "খরচের মিশ্রণ",
      forecastStrip: "ফোরকাস্ট স্ট্রিপ",
      ruleBasedInsights: "রুল-বেসড ইনসাইট"
    },
    reports: {
      title: "রিপোর্ট",
      filters: "রিপোর্ট ফিল্টার",
      month: "মাস",
      account: "অ্যাকাউন্ট",
      type: "ধরণ",
      allAccounts: "সব অ্যাকাউন্ট",
      downloadCsv: "CSV ডাউনলোড করুন",
      income: "আয়",
      expenses: "ব্যয়",
      net: "নেট",
      preview: "রিপোর্ট প্রিভিউ",
      addTransaction: "লেনদেন যোগ করুন"
    },
    transaction: {
      addTransactionTitle: "লেনদেন যোগ করুন",
      editTransactionTitle: "লেনদেন সম্পাদনা করুন",
      type: "ধরণ",
      amount: "পরিমাণ",
      account: "অ্যাকাউন্ট",
      category: "বিভাগ",
      date: "তারিখ",
      description: "বিবরণ",
      recurringTransaction: "পুনরাবৃত্ত লেনদেন",
      createTransaction: "লেনদেন তৈরি করুন",
      updateTransaction: "লেনদেন আপডেট করুন",
      cancel: "বাতিল"
    },
    settings: {
      title: "সেটিংস",
      appearance: "দেখন",
      smsNotifications: "SMS নোটিফিকেশন",
      quickAddPreferences: "কুইক অ্যাড পছন্দ",
      manageAccounts: "অ্যাকাউন্ট ম্যানেজ করুন",
      contactUs: "যোগাযোগ করুন",
      save: "সেভ"
    }
  },
  ta: {
    sidebar: {
      workspace: "பணிப்பகுதி",
      actions: "செயல்கள்",
      dashboard: "டாஷ்போர்டு",
      analytics: "பகுப்பாய்வு",
      goals: "இலக்குகள்",
      recurringCenter: "மீளும் மையம்",
      reports: "அறிக்கைகள்",
      quickAdd: "விரைவு சேர்",
      preferences: "விருப்பங்கள்",
      weekFocus: "இந்த வார கவனம்",
      contactUs: "எங்களை தொடர்புகொள்ள",
      navigationMenu: "வழிசெலுத்தல் பட்டியல்"
    },
    dashboard: {
      commandCenter: "நிதி கட்டுப்பாட்டு மையம்",
      selectMonth: "மாதத்தை தேர்ந்தெடு",
      performanceSnapshot: "செயல்திறன் சுருக்கம்",
      spendingStory: "செலவுக் கதை",
      latestActivity: "சமீபத்திய செயல்பாடு",
      selectAccount: "கணக்கைத் தேர்ந்தெடு",
      expenseMix: "செலவுக் கலவை",
      forecastStrip: "முன்னறிவு பட்டை",
      ruleBasedInsights: "விதிமுறை அடிப்படையிலான உள்ளடக்கம்"
    },
    reports: {
      title: "அறிக்கைகள்",
      filters: "அறிக்கை வடிகட்டிகள்",
      month: "மாதம்",
      account: "கணக்கு",
      type: "வகை",
      allAccounts: "அனைத்து கணக்குகள்",
      downloadCsv: "CSV பதிவிறக்கு",
      income: "வருமானம்",
      expenses: "செலவுகள்",
      net: "நிகர",
      preview: "அறிக்கை முன்னோட்டம்",
      addTransaction: "பரிவர்த்தனை சேர்"
    },
    transaction: {
      addTransactionTitle: "பரிவர்த்தனை சேர்",
      editTransactionTitle: "பரிவர்த்தனை திருத்து",
      type: "வகை",
      amount: "தொகை",
      account: "கணக்கு",
      category: "பிரிவு",
      date: "தேதி",
      description: "விளக்கம்",
      recurringTransaction: "மீளும் பரிவர்த்தனை",
      createTransaction: "பரிவர்த்தனை உருவாக்கு",
      updateTransaction: "பரிவர்த்தனை புதுப்பி",
      cancel: "ரத்து செய்"
    },
    settings: {
      title: "அமைப்புகள்",
      appearance: "தோற்றம்",
      smsNotifications: "SMS அறிவிப்புகள்",
      quickAddPreferences: "விரைவு சேர் விருப்பங்கள்",
      manageAccounts: "கணக்குகளை நிர்வகி",
      contactUs: "எங்களை தொடர்புகொள்ள",
      save: "சேமி"
    }
  },
  te: {
    sidebar: {
      workspace: "వర్క్‌స్పేస్",
      actions: "చర్యలు",
      dashboard: "డాష్‌బోర్డ్",
      analytics: "అనలిటిక్స్",
      goals: "లక్ష్యాలు",
      recurringCenter: "రికరింగ్ సెంటర్",
      reports: "రిపోర్టులు",
      quickAdd: "క్విక్ యాడ్",
      preferences: "అభిరుచులు",
      weekFocus: "ఈ వారం దృష్టి",
      contactUs: "మమ్మల్ని సంప్రదించండి",
      navigationMenu: "నావిగేషన్ మెను"
    },
    dashboard: {
      commandCenter: "ఫైనాన్స్ కమాండ్ సెంటర్",
      selectMonth: "నెల ఎంచుకోండి",
      performanceSnapshot: "పనితీరు స్నాప్‌షాట్",
      spendingStory: "ఖర్చుల కథ",
      latestActivity: "తాజా కార్యాచరణ",
      selectAccount: "ఖాతాను ఎంచుకోండి",
      expenseMix: "ఖర్చుల మిశ్రమం",
      forecastStrip: "ఫోర్‌కాస్ట్ స్ట్రిప్",
      ruleBasedInsights: "నిబంధన ఆధారిత ఇన్‌సైట్స్"
    },
    reports: {
      title: "రిపోర్టులు",
      filters: "రిపోర్ట్ ఫిల్టర్లు",
      month: "నెల",
      account: "ఖాతా",
      type: "రకం",
      allAccounts: "అన్ని ఖాతాలు",
      downloadCsv: "CSV డౌన్‌లోడ్",
      income: "ఆదాయం",
      expenses: "ఖర్చులు",
      net: "నికర",
      preview: "రిపోర్ట్ ప్రివ్యూ",
      addTransaction: "ట్రాన్సాక్షన్ జోడించండి"
    },
    transaction: {
      addTransactionTitle: "ట్రాన్సాక్షన్ జోడించండి",
      editTransactionTitle: "ట్రాన్సాక్షన్ సవరించండి",
      type: "రకం",
      amount: "మొత్తం",
      account: "ఖాతా",
      category: "వర్గం",
      date: "తేదీ",
      description: "వివరణ",
      recurringTransaction: "పునరావృత ట్రాన్సాక్షన్",
      createTransaction: "ట్రాన్సాక్షన్ సృష్టించండి",
      updateTransaction: "ట్రాన్సాక్షన్ నవీకరించండి",
      cancel: "రద్దు"
    },
    settings: {
      title: "సెట్టింగ్స్",
      appearance: "రూపం",
      smsNotifications: "SMS నోటిఫికేషన్లు",
      quickAddPreferences: "క్విక్ యాడ్ అభిరుచులు",
      manageAccounts: "ఖాతాలను నిర్వహించండి",
      contactUs: "మమ్మల్ని సంప్రదించండి",
      save: "సేవ్"
    }
  },
  kn: {
    sidebar: {
      workspace: "ಕಾರ್ಯಸ್ಥಳ",
      actions: "ಕ್ರಿಯೆಗಳು",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      analytics: "ವಿಶ್ಲೇಷಣೆ",
      goals: "ಗುರಿಗಳು",
      recurringCenter: "ಪುನರಾವರ್ತನಾ ಕೇಂದ್ರ",
      reports: "ವರದಿಗಳು",
      quickAdd: "ತ್ವರಿತ ಸೇರಿಸಿ",
      preferences: "ಆದ್ಯತೆಗಳು",
      weekFocus: "ಈ ವಾರದ ಗಮನ",
      contactUs: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
      navigationMenu: "ನ್ಯಾವಿಗೇಶನ್ ಮೆನು"
    },
    dashboard: {
      commandCenter: "ಹಣಕಾಸು ಕಮಾಂಡ್ ಕೇಂದ್ರ",
      selectMonth: "ತಿಂಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      performanceSnapshot: "ಕಾರ್ಯಕ್ಷಮತಾ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್",
      spendingStory: "ಖರ್ಚಿನ ಕಥೆ",
      latestActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
      selectAccount: "ಖಾತೆ ಆಯ್ಕೆಮಾಡಿ",
      expenseMix: "ಖರ್ಚಿನ ಮಿಶ್ರಣ",
      forecastStrip: "ಅಂದಾಜು ಪಟ್ಟೆ",
      ruleBasedInsights: "ನಿಯಮ ಆಧಾರಿತ ಒಳನೋಟಗಳು"
    },
    reports: {
      title: "ವರದಿಗಳು",
      filters: "ವರದಿ ಫಿಲ್ಟರ್‌ಗಳು",
      month: "ತಿಂಗಳು",
      account: "ಖಾತೆ",
      type: "ಪ್ರಕಾರ",
      allAccounts: "ಎಲ್ಲ ಖಾತೆಗಳು",
      downloadCsv: "CSV ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      income: "ಆದಾಯ",
      expenses: "ಖರ್ಚುಗಳು",
      net: "ನಿವ್ವಳ",
      preview: "ವರದಿ ಪೂರ್ವವೀಕ್ಷಣೆ",
      addTransaction: "ವ್ಯವಹಾರ ಸೇರಿಸಿ"
    },
    transaction: {
      addTransactionTitle: "ವ್ಯವಹಾರ ಸೇರಿಸಿ",
      editTransactionTitle: "ವ್ಯವಹಾರ ತಿದ್ದು",
      type: "ಪ್ರಕಾರ",
      amount: "ಮೊತ್ತ",
      account: "ಖಾತೆ",
      category: "ವರ್ಗ",
      date: "ದಿನಾಂಕ",
      description: "ವಿವರಣೆ",
      recurringTransaction: "ಪುನರಾವರ್ತಿತ ವ್ಯವಹಾರ",
      createTransaction: "ವ್ಯವಹಾರ ರಚಿಸಿ",
      updateTransaction: "ವ್ಯವಹಾರ ನವೀಕರಿಸಿ",
      cancel: "ರದ್ದು"
    },
    settings: {
      title: "ಸೆಟ್ಟಿಂಗ್ಸ್",
      appearance: "ರೂಪ",
      smsNotifications: "SMS ಸೂಚನೆಗಳು",
      quickAddPreferences: "ತ್ವರಿತ-ಸೇರಿಕೆ ಆದ್ಯತೆಗಳು",
      manageAccounts: "ಖಾತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
      contactUs: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
      save: "ಉಳಿಸಿ"
    }
  },
  ml: {
    sidebar: {
      workspace: "വർക്ക്സ്പേസ്",
      actions: "പ്രവർത്തനങ്ങൾ",
      dashboard: "ഡാഷ്ബോർഡ്",
      analytics: "അനലിറ്റിക്സ്",
      goals: "ലക്ഷ്യങ്ങൾ",
      recurringCenter: "റിക്കറിംഗ് സെന്റർ",
      reports: "റിപ്പോർട്ടുകൾ",
      quickAdd: "ക്വിക് ആഡ്",
      preferences: "മുൻഗണനകൾ",
      weekFocus: "ഈ ആഴ്ചയിലെ ഫോക്കസ്",
      contactUs: "ബന്ധപ്പെടുക",
      navigationMenu: "നാവിഗേഷൻ മെനു"
    },
    dashboard: {
      commandCenter: "ഫൈനാൻസ് കമാൻഡ് സെന്റർ",
      selectMonth: "മാസം തിരഞ്ഞെടുക്കുക",
      performanceSnapshot: "പ്രകടന സ്നാപ്ഷോട്ട്",
      spendingStory: "ചെലവിന്റെ കഥ",
      latestActivity: "സമീപകാല പ്രവർത്തനം",
      selectAccount: "അക്കൗണ്ട് തിരഞ്ഞെടുക്കുക",
      expenseMix: "ചെലവ് മിശ്രണം",
      forecastStrip: "ഫോർകാസ്റ്റ് സ്ട്രിപ്പ്",
      ruleBasedInsights: "റൂൾ-ബേസ്ഡ് ഇൻസൈറ്റുകൾ"
    },
    reports: {
      title: "റിപ്പോർട്ടുകൾ",
      filters: "റിപ്പോർട്ട് ഫിൽറ്ററുകൾ",
      month: "മാസം",
      account: "അക്കൗണ്ട്",
      type: "തരം",
      allAccounts: "എല്ലാ അക്കൗണ്ടുകളും",
      downloadCsv: "CSV ഡൗൺലോഡ് ചെയ്യുക",
      income: "വരുമാനം",
      expenses: "ചെലവുകൾ",
      net: "നെറ്റ്",
      preview: "റിപ്പോർട്ട് പ്രിവ്യൂ",
      addTransaction: "ഇടപാട് ചേർക്കുക"
    },
    transaction: {
      addTransactionTitle: "ഇടപാട് ചേർക്കുക",
      editTransactionTitle: "ഇടപാട് തിരുത്തുക",
      type: "തരം",
      amount: "തുക",
      account: "അക്കൗണ്ട്",
      category: "വിഭാഗം",
      date: "തീയതി",
      description: "വിവരണം",
      recurringTransaction: "പുനരാവർത്തന ഇടപാട്",
      createTransaction: "ഇടപാട് സൃഷ്ടിക്കുക",
      updateTransaction: "ഇടപാട് അപ്‌ഡേറ്റ് ചെയ്യുക",
      cancel: "റദ്ദാക്കുക"
    },
    settings: {
      title: "സെറ്റിംഗ്സ്",
      appearance: "രൂപം",
      smsNotifications: "SMS അറിയിപ്പുകൾ",
      quickAddPreferences: "ക്വിക് ആഡ് മുൻഗണനകൾ",
      manageAccounts: "അക്കൗണ്ടുകൾ നിയന്ത്രിക്കുക",
      contactUs: "ബന്ധപ്പെടുക",
      save: "സേവ്"
    }
  },
  raj: {
    sidebar: {
      workspace: "वर्कस्पेस",
      actions: "एक्शन",
      dashboard: "डैशबोर्ड",
      analytics: "एनालिटिक्स",
      goals: "लक्ष्य",
      recurringCenter: "रिकरिंग सेंटर",
      reports: "रिपोर्ट",
      quickAdd: "क्विक ऐड",
      preferences: "पसंद",
      weekFocus: "ई हफ्ता रो फोकस",
      contactUs: "संपर्क करो",
      navigationMenu: "नेविगेशन मेनू"
    },
    dashboard: {
      commandCenter: "फाइनेंस कमांड सेंटर",
      selectMonth: "महीनो चुनो",
      performanceSnapshot: "परफॉर्मेंस स्नैपशॉट",
      spendingStory: "खर्चा री कहानी",
      latestActivity: "हाल री गतिविधि",
      selectAccount: "खातो चुनो",
      expenseMix: "खर्चा मिक्स",
      forecastStrip: "फोरकास्ट स्ट्रिप",
      ruleBasedInsights: "नियम-आधारित इनसाइट"
    },
    reports: {
      title: "रिपोर्ट",
      filters: "रिपोर्ट फिल्टर",
      month: "महीनो",
      account: "खातो",
      type: "प्रकार",
      allAccounts: "बदा खाता",
      downloadCsv: "CSV डाउनलोड करो",
      income: "आवक",
      expenses: "खर्चा",
      net: "नेट",
      preview: "रिपोर्ट प्रीव्यू",
      addTransaction: "ट्रांजेक्शन जोड़ो"
    },
    transaction: {
      addTransactionTitle: "ट्रांजेक्शन जोड़ो",
      editTransactionTitle: "ट्रांजेक्शन बदलो",
      type: "प्रकार",
      amount: "रकम",
      account: "खातो",
      category: "श्रेणी",
      date: "तारीख",
      description: "विवरण",
      recurringTransaction: "आवर्ती ट्रांजेक्शन",
      createTransaction: "ट्रांजेक्शन बनाओ",
      updateTransaction: "ट्रांजेक्शन अपडेट करो",
      cancel: "रद्द"
    },
    settings: {
      title: "सेटिंग्स",
      appearance: "रूप",
      smsNotifications: "SMS सूचना",
      quickAddPreferences: "क्विक ऐड पसंद",
      manageAccounts: "खाता मैनेज करो",
      contactUs: "संपर्क करो",
      save: "सेव"
    }
  },
  pa: {
    sidebar: {
      workspace: "ਵਰਕਸਪੇਸ",
      actions: "ਐਕਸ਼ਨ",
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      analytics: "ਐਨਾਲਿਟਿਕਸ",
      goals: "ਲੱਖੇ",
      recurringCenter: "ਰਿਕਰਿੰਗ ਸੈਂਟਰ",
      reports: "ਰਿਪੋਰਟਾਂ",
      quickAdd: "ਕੁਇਕ ਐਡ",
      preferences: "ਪਸੰਦ",
      weekFocus: "ਇਸ ਹਫ਼ਤੇ ਦਾ ਫੋਕਸ",
      contactUs: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
      navigationMenu: "ਨੇਵੀਗੇਸ਼ਨ ਮੈਨੂ"
    },
    dashboard: {
      commandCenter: "ਫਾਇਨੈਂਸ ਕਮਾਂਡ ਸੈਂਟਰ",
      selectMonth: "ਮਹੀਨਾ ਚੁਣੋ",
      performanceSnapshot: "ਪਰਫਾਰਮੈਂਸ ਸਨੈਪਸ਼ਾਟ",
      spendingStory: "ਖਰਚ ਦੀ ਕਹਾਣੀ",
      latestActivity: "ਤਾਜ਼ਾ ਗਤੀਵਿਧੀ",
      selectAccount: "ਖਾਤਾ ਚੁਣੋ",
      expenseMix: "ਖਰਚਾ ਮਿਸ਼ਰਣ",
      forecastStrip: "ਫੋਰਕਾਸਟ ਸਟ੍ਰਿਪ",
      ruleBasedInsights: "ਨਿਯਮ-ਅਧਾਰਿਤ ਇਨਸਾਈਟਸ"
    },
    reports: {
      title: "ਰਿਪੋਰਟਾਂ",
      filters: "ਰਿਪੋਰਟ ਫਿਲਟਰ",
      month: "ਮਹੀਨਾ",
      account: "ਖਾਤਾ",
      type: "ਕਿਸਮ",
      allAccounts: "ਸਾਰੇ ਖਾਤੇ",
      downloadCsv: "CSV ਡਾਊਨਲੋਡ ਕਰੋ",
      income: "ਆਮਦਨ",
      expenses: "ਖਰਚੇ",
      net: "ਨੈੱਟ",
      preview: "ਰਿਪੋਰਟ ਝਲਕ",
      addTransaction: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਜੋੜੋ"
    },
    transaction: {
      addTransactionTitle: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਜੋੜੋ",
      editTransactionTitle: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਸੋਧੋ",
      type: "ਕਿਸਮ",
      amount: "ਰਕਮ",
      account: "ਖਾਤਾ",
      category: "ਸ਼੍ਰੇਣੀ",
      date: "ਤਾਰੀਖ",
      description: "ਵੇਰਵਾ",
      recurringTransaction: "ਦੋਹਰਾਉਂਦਾ ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ",
      createTransaction: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਬਣਾਓ",
      updateTransaction: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਅਪਡੇਟ ਕਰੋ",
      cancel: "ਰੱਦ ਕਰੋ"
    },
    settings: {
      title: "ਸੈਟਿੰਗਜ਼",
      appearance: "ਦਿੱਖ",
      smsNotifications: "SMS ਨੋਟੀਫਿਕੇਸ਼ਨ",
      quickAddPreferences: "ਕੁਇਕ ਐਡ ਪਸੰਦਾਂ",
      manageAccounts: "ਖਾਤੇ ਸੰਭਾਲੋ",
      contactUs: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
      save: "ਸੇਵ"
    }
  },
  or: {
    sidebar: {
      workspace: "ୱର୍କସ୍ପେସ",
      actions: "କାର୍ଯ୍ୟ",
      dashboard: "ଡ୍ୟାଶବୋର୍ଡ",
      analytics: "ବିଶ୍ଳେଷଣ",
      goals: "ଲକ୍ଷ୍ୟ",
      recurringCenter: "ରିକରିଂ କେନ୍ଦ୍ର",
      reports: "ରିପୋର୍ଟ",
      quickAdd: "କ୍ୱିକ୍ ଆଡ୍",
      preferences: "ପସନ୍ଦ",
      weekFocus: "ଏହି ସପ୍ତାହର ଧ୍ୟାନ",
      contactUs: "ସମ୍ପର୍କ କରନ୍ତୁ",
      navigationMenu: "ନାଭିଗେସନ୍ ମେନୁ"
    },
    dashboard: {
      commandCenter: "ଫାଇନାନ୍ସ କମାଣ୍ଡ ସେଣ୍ଟର",
      selectMonth: "ମାସ ଚୟନ କରନ୍ତୁ",
      performanceSnapshot: "ପରିଣାମ ସ୍ନାପଶଟ୍",
      spendingStory: "ଖର୍ଚ୍ଚର କଥା",
      latestActivity: "ସମ୍ପ୍ରତି କାର୍ଯ୍ୟକଳାପ",
      selectAccount: "ଖାତା ଚୟନ କରନ୍ତୁ",
      expenseMix: "ଖର୍ଚ୍ଚ ମିଶ୍ରଣ",
      forecastStrip: "ପୂର୍ବାନୁମାନ ପଟି",
      ruleBasedInsights: "ନିୟମ-ଆଧାରିତ ଇନସାଇଟ୍"
    },
    reports: {
      title: "ରିପୋର୍ଟ",
      filters: "ରିପୋର୍ଟ ଫିଲ୍ଟର",
      month: "ମାସ",
      account: "ଖାତା",
      type: "ପ୍ରକାର",
      allAccounts: "ସମସ୍ତ ଖାତା",
      downloadCsv: "CSV ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
      income: "ଆୟ",
      expenses: "ଖର୍ଚ୍ଚ",
      net: "ନେଟ୍",
      preview: "ରିପୋର୍ଟ ପ୍ରିଭ୍ୟୁ",
      addTransaction: "ଲେନଦେନ ଯୋଡନ୍ତୁ"
    },
    transaction: {
      addTransactionTitle: "ଲେନଦେନ ଯୋଡନ୍ତୁ",
      editTransactionTitle: "ଲେନଦେନ ସମ୍ପାଦନା କରନ୍ତୁ",
      type: "ପ୍ରକାର",
      amount: "ରାଶି",
      account: "ଖାତା",
      category: "ଶ୍ରେଣୀ",
      date: "ତାରିଖ",
      description: "ବର୍ଣନା",
      recurringTransaction: "ପୁନରାବୃତ୍ତ ଲେନଦେନ",
      createTransaction: "ଲେନଦେନ ସୃଷ୍ଟି କରନ୍ତୁ",
      updateTransaction: "ଲେନଦେନ ଅଦ୍ୟତନ କରନ୍ତୁ",
      cancel: "ବାତିଲ୍"
    },
    settings: {
      title: "ସେଟିଂସ୍",
      appearance: "ଦେଖା",
      smsNotifications: "SMS ସୂଚନା",
      quickAddPreferences: "କ୍ୱିକ୍ ଆଡ୍ ପସନ୍ଦ",
      manageAccounts: "ଖାତା ପରିଚାଳନା କରନ୍ତୁ",
      contactUs: "ସମ୍ପର୍କ କରନ୍ତୁ",
      save: "ସେଭ୍"
    }
  },
  gu: {
    sidebar: {
      workspace: "વર્કસ્પેસ",
      actions: "ક્રિયાઓ",
      dashboard: "ડેશબોર્ડ",
      analytics: "એનલિટિક્સ",
      goals: "લક્ષ્યો",
      recurringCenter: "રિકરિંગ સેન્ટર",
      reports: "રિપોર્ટ્સ",
      quickAdd: "ક્વિક એડ",
      preferences: "પસંદગીઓ",
      weekFocus: "આ અઠવાડિયાનો ફોકસ",
      contactUs: "અમારો સંપર્ક કરો",
      navigationMenu: "નેવિગેશન મેનુ"
    },
    dashboard: {
      commandCenter: "ફાઇનાન્સ કમાન્ડ સેન્ટર",
      selectMonth: "મહિનો પસંદ કરો",
      performanceSnapshot: "પરફોર્મન્સ સ્નેપશોટ",
      spendingStory: "ખર્ચની કહાની",
      latestActivity: "તાજેતરની પ્રવૃત્તિ",
      selectAccount: "એકાઉન્ટ પસંદ કરો",
      expenseMix: "ખર્ચ મિશ્રણ",
      forecastStrip: "ફોરકાસ્ટ સ્ટ્રિપ",
      ruleBasedInsights: "નિયમ આધારિત ઇન્સાઇટ્સ"
    },
    reports: {
      title: "રિપોર્ટ્સ",
      filters: "રિપોર્ટ ફિલ્ટર્સ",
      month: "મહિનો",
      account: "એકાઉન્ટ",
      type: "પ્રકાર",
      allAccounts: "બધા એકાઉન્ટ્સ",
      downloadCsv: "CSV ડાઉનલોડ કરો",
      income: "આવક",
      expenses: "ખર્ચ",
      net: "નેટ",
      preview: "રિપોર્ટ પ્રિવ્યુ",
      addTransaction: "ટ્રાન્ઝેક્શન ઉમેરો"
    },
    transaction: {
      addTransactionTitle: "ટ્રાન્ઝેક્શન ઉમેરો",
      editTransactionTitle: "ટ્રાન્ઝેક્શન સુધારો",
      type: "પ્રકાર",
      amount: "રકમ",
      account: "એકાઉન્ટ",
      category: "શ્રેણી",
      date: "તારીખ",
      description: "વર્ણન",
      recurringTransaction: "રીકરિંગ ટ્રાન્ઝેક્શન",
      createTransaction: "ટ્રાન્ઝેક્શન બનાવો",
      updateTransaction: "ટ્રાન્ઝેક્શન અપડેટ કરો",
      cancel: "રદ કરો"
    },
    settings: {
      title: "સેટિંગ્સ",
      appearance: "દેખાવ",
      smsNotifications: "SMS સૂચનાઓ",
      quickAddPreferences: "ક્વિક એડ પસંદગીઓ",
      manageAccounts: "એકાઉન્ટ્સ મેનેજ કરો",
      contactUs: "અમારો સંપર્ક કરો",
      save: "સેવ"
    }
  }
};

const NATIVE_SENTENCE_OVERRIDES = {
  mr: {
    sidebar: {
      weekFocusHint: "खर्च उत्पन्नापेक्षा कमी ठेवा आणि प्रत्येक व्यवहार त्याच दिवशी नोंदवा."
    },
    dashboard: {
      performanceHint: "महत्त्वाच्या आकड्यांतील महिन्यानुसार बदल पाहा.",
      spendingHint: "निवडलेल्या महिन्यासाठी अलीकडील क्रियाकलाप आणि श्रेणी एकाग्रता.",
      noActivity: "या महिन्यात अजून कोणतीही क्रिया नाही. अंतर्दृष्टी ट्रॅकिंग सुरू करण्यासाठी पहिली नोंद जोडा.",
      noExpenseData: "तुम्ही खर्च व्यवहार नोंदवल्यावर येथे डेटा दिसेल."
    },
    reports: {
      noTransactionsYet: "अजून कोणतेही व्यवहार सापडले नाहीत. पहिला अहवाल तयार करण्यासाठी नोंदी जोडा.",
      noMatches: "या फिल्टरशी जुळणारे व्यवहार नाहीत. सर्व खाती किंवा उत्पन्न + खर्च वापरून पहा."
    },
    transaction: {
      createdSuccess: "व्यवहार यशस्वीरीत्या तयार झाला.",
      updatedSuccess: "व्यवहार यशस्वीरीत्या अद्यतनित झाला.",
      categoryHint: "आता सर्वात जवळची श्रेणी निवडा. नंतर इतिहासातून विश्लेषण सुधारता येईल.",
      descriptionTip: "सूचना: चांगल्या अंतर्दृष्टीसाठी \"Swiggy dinner\" सारखे वर्णन द्या.",
      premiumHabitHint: "अचूक अंदाजासाठी व्यवहार त्याच दिवशी नोंदवा.",
      scanButton: "AI सह पावती स्कॅन करा (प्रतिमा किंवा PDF)",
      fileSizeError: "फाइल आकार 5MB पेक्षा कमी असावा.",
      fileTypeError: "कृपया प्रतिमा किंवा PDF फाइल अपलोड करा."
    },
    settings: {
      preferredTheme: "तुमची पसंतीची थीम निवडा"
    }
  },
  bn: {
    sidebar: {
      weekFocusHint: "খরচ আয়-এর নিচে রাখুন এবং প্রতিটি লেনদেন একই দিনে লিখুন।"
    },
    dashboard: {
      performanceHint: "সবচেয়ে গুরুত্বপূর্ণ সংখ্যার মাসভিত্তিক পরিবর্তন দেখুন।",
      spendingHint: "নির্বাচিত মাসের সাম্প্রতিক কার্যকলাপ ও বিভাগভিত্তিক ঘনত্ব।",
      noActivity: "এই মাসে এখনো কোনো কার্যকলাপ নেই। ইনসাইট ট্র্যাকিং শুরু করতে প্রথম এন্ট্রি যোগ করুন।",
      noExpenseData: "আপনি ব্যয়ের লেনদেন যোগ করলে এখানে ডেটা দেখাবে।"
    },
    reports: {
      noTransactionsYet: "এখনো কোনো লেনদেন পাওয়া যায়নি। প্রথম রিপোর্ট তৈরি করতে এন্ট্রি যোগ করুন।",
      noMatches: "এই ফিল্টারে কোনো লেনদেন মেলেনি। সব অ্যাকাউন্ট বা আয় + ব্যয় চেষ্টা করুন।"
    },
    transaction: {
      createdSuccess: "লেনদেন সফলভাবে তৈরি হয়েছে।",
      updatedSuccess: "লেনদেন সফলভাবে আপডেট হয়েছে।",
      categoryHint: "এখন সবচেয়ে কাছের বিভাগ বাছুন। পরে হিস্টরি থেকে অ্যানালিটিক্স উন্নত করতে পারবেন।",
      descriptionTip: "টিপ: ভালো ইনসাইটের জন্য \"Swiggy dinner\" এর মতো বিবরণ দিন।",
      premiumHabitHint: "সঠিক ফোরকাস্টের জন্য একই দিনে লেনদেন লিখুন।",
      scanButton: "AI দিয়ে রসিদ স্ক্যান করুন (ইমেজ বা PDF)",
      fileSizeError: "ফাইল সাইজ 5MB-এর কম হতে হবে।",
      fileTypeError: "দয়া করে ইমেজ বা PDF ফাইল আপলোড করুন।"
    },
    settings: {
      preferredTheme: "আপনার পছন্দের থিম নির্বাচন করুন"
    }
  },
  ta: {
    sidebar: {
      weekFocusHint: "செலவை வருமானத்துக்கு கீழே வைத்துக் கொண்டு ஒவ்வொரு பரிவர்த்தனையும் அதே நாளில் பதிவு செய்யுங்கள்."
    },
    dashboard: {
      performanceHint: "முக்கிய எண்ணிக்கைகளின் மாதாந்திர மாற்றத்தை பார்க்கவும்.",
      spendingHint: "தேர்ந்தெடுக்கப்பட்ட மாதத்திற்கான சமீப செயல்பாடுகள் மற்றும் பிரிவு செறிவு.",
      noActivity: "இந்த மாதம் இன்னும் செயல் இல்லை. இன்சைட் கண்காணிப்பை தொடங்க முதல் பதிவைச் சேர்க்கவும்.",
      noExpenseData: "செலவு பரிவர்த்தனைகளை பதிவு செய்ததும் இங்கு தரவு தோன்றும்."
    },
    reports: {
      noTransactionsYet: "இன்னும் பரிவர்த்தனைகள் இல்லை. முதல் அறிக்கைக்காக பதிவுகளைச் சேர்க்கவும்.",
      noMatches: "இந்த வடிகட்டிகளுக்கு பொருந்தும் பரிவர்த்தனைகள் இல்லை. அனைத்து கணக்குகள் அல்லது வருமானம் + செலவு முயற்சிக்கவும்."
    },
    transaction: {
      createdSuccess: "பரிவர்த்தனை வெற்றிகரமாக உருவாக்கப்பட்டது.",
      updatedSuccess: "பரிவர்த்தனை வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
      categoryHint: "இப்போது அருகிலான பிரிவைத் தேர்ந்தெடுக்கவும். பின்னர் வரலாற்றில் இருந்து பகுப்பாய்வை மேம்படுத்தலாம்.",
      descriptionTip: "குறிப்பு: நல்ல உள்ளடக்கத்திற்காக \"Swiggy dinner\" போன்ற விளக்கத்தைச் சேர்க்கவும்.",
      premiumHabitHint: "துல்லியமான முன்னறிவிப்பிற்காக அதே நாளில் பரிவர்த்தனைகளை பதிவு செய்யுங்கள்.",
      scanButton: "AI மூலம் ரசீதை ஸ்கேன் செய்யுங்கள் (படம் அல்லது PDF)",
      fileSizeError: "கோப்பு அளவு 5MB-க்கு குறைவாக இருக்க வேண்டும்.",
      fileTypeError: "தயவுசெய்து படம் அல்லது PDF கோப்பை பதிவேற்றவும்."
    },
    settings: {
      preferredTheme: "உங்களுக்கு பிடித்த தீமைத் தேர்ந்தெடுக்கவும்"
    }
  },
  te: {
    sidebar: {
      weekFocusHint: "ఖర్చును ఆదాయానికి తగ్గట్టు ఉంచి ప్రతి ట్రాన్సాక్షన్‌ను అదే రోజున నమోదు చేయండి."
    },
    dashboard: {
      performanceHint: "ముఖ్యమైన సంఖ్యల నెలవారీ మార్పును చూడండి.",
      spendingHint: "ఎంచుకున్న నెలకు సంబంధించిన తాజా చట్రం మరియు వర్గ దృష్టి.",
      noActivity: "ఈ నెలలో ఇంకా కార్యకలాపం లేదు. ఇన్‌సైట్ ట్రాకింగ్ కోసం మొదటి ఎంట్రీ జోడించండి.",
      noExpenseData: "ఖర్చు ట్రాన్సాక్షన్లు నమోదు చేసిన తర్వాత ఇక్కడ డేటా కనిపిస్తుంది.",
      insightBudgetRiskTitle: "బడ్జెట్ ప్రమాదం పెరుగుతోంది",
      insightBudgetRiskDetail: "ఈ నెల ఆదాయంలో ఇప్పటికే {pct}% ఖర్చు అయింది.",
      insightCashflowHealthyTitle: "నగదు ప్రవాహం బాగుంది",
      insightCashflowHealthyDetail: "అంచనాకు ముందు ఈ నెలలో మీరు {amount} నిలుపుకుంటున్నారు.",
      insightCategoryConcentrationTitle: "ఒకే వర్గంపై ఎక్కువ ఖర్చు",
      insightCategoryConcentrationDetail: "ఈ నెల ఖర్చులో {topCategory} వాటా {pct}% ఉంది.",
      insightSpendingMixBalancedTitle: "ఖర్చు మిశ్రమం సమతుల్యంలో ఉంది",
      insightSpendingMixBalancedDetail: "ముఖ్య వర్గం ({topCategory}) ఖర్చులో {pct}% ఉంది.",
      insightUnusualExpenseMovementTitle: "అసాధారణ ఖర్చు కదలిక",
      insightUnusualExpenseMovementDetail: "ఇటీవలి {count} ట్రాన్సాక్షన్‌లు సాధారణ ఖర్చు ధోరణికి బయట ఉన్నాయి.",
      insightNoAnomalySignalTitle: "ఈ నెలలో అసాధారణ సంకేతం లేదు",
      insightNoAnomalySignalDetail: "ఇటీవలి ఖర్చు తీరు మీ సాధారణ పరిధిలోనే ఉంది.",
      insightSpendingAcceleratedTitle: "ఖర్చు వేగంగా పెరిగింది",
      insightSpendingAcceleratedDetail: "గత నెలతో పోలిస్తే ఖర్చు {pct}% పెరిగింది.",
      insightGreatMomentumTitle: "గత నెలతో పోలిస్తే మంచి పురోగతి",
      insightGreatMomentumDetail: "గత నెలతో పోలిస్తే ఖర్చు {pct}% తగ్గింది.",
      insightMoMSteadyTitle: "నెలనెలా ఖర్చు స్థిరంగా ఉంది",
      insightMoMSteadyDetail: "గత నెలతో పోలిస్తే వ్యత్యాసం {variance}% ఉంది."
    },
    reports: {
      noTransactionsYet: "ఇంకా ట్రాన్సాక్షన్లు లేవు. మీ మొదటి రిపోర్ట్ కోసం ఎంట్రీలు జోడించండి.",
      noMatches: "ఈ ఫిల్టర్లకు సరిపోయే ట్రాన్సాక్షన్లు లేవు. అన్ని ఖాతాలు లేదా ఆదాయం + ఖర్చులు ప్రయత్నించండి."
    },
    transaction: {
      createdSuccess: "ట్రాన్సాక్షన్ విజయవంతంగా సృష్టించబడింది.",
      updatedSuccess: "ట్రాన్సాక్షన్ విజయవంతంగా నవీకరించబడింది.",
      categoryHint: "ఇప్పుడు దగ్గరైన వర్గాన్ని ఎంచుకోండి. తర్వాత హిస్టరీ నుండి విశ్లేషణను మెరుగుపరచవచ్చు.",
      descriptionTip: "సూచన: మెరుగైన ఇన్‌సైట్స్ కోసం \"Swiggy dinner\" లాంటి వివరణ ఇవ్వండి.",
      premiumHabitHint: "ఖచ్చితమైన ఫోర్‌కాస్ట్ కోసం అదే రోజున ట్రాన్సాక్షన్లు నమోదు చేయండి.",
      scanButton: "AIతో రశీదు స్కాన్ చేయండి (చిత్రం లేదా PDF)",
      fileSizeError: "ఫైల్ పరిమాణం 5MB కంటే తక్కువగా ఉండాలి.",
      fileTypeError: "దయచేసి చిత్రం లేదా PDF ఫైల్ అప్లోడ్ చేయండి."
    },
    settings: {
      preferredTheme: "మీకు నచ్చిన థీమ్‌ను ఎంచుకోండి"
    }
  },
  kn: {
    sidebar: {
      weekFocusHint: "ಖರ್ಚು ಆದಾಯಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಲಿ ಮತ್ತು ಪ್ರತಿಯೊಂದು ವ್ಯವಹಾರವನ್ನು ಅದೇ ದಿನ ದಾಖಲಿಸಿ."
    },
    dashboard: {
      performanceHint: "ಮುಖ್ಯ ಸಂಖ್ಯೆಗಳ ತಿಂಗಳಂತ್ಯದ ಬದಲಾವಣೆಗಳನ್ನು ನೋಡಿ.",
      spendingHint: "ಆಯ್ದ ತಿಂಗಳ ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ ಮತ್ತು ವಿಭಾಗ ಕೇಂದ್ರೀಕರಣ.",
      noActivity: "ಈ ತಿಂಗಳಲ್ಲಿ ಇನ್ನೂ ಚಟುವಟಿಕೆ ಇಲ್ಲ. ಒಳನೋಟ ಟ್ರ್ಯಾಕಿಂಗ್ ಆರಂಭಿಸಲು ಮೊದಲ ಎಂಟ್ರಿ ಸೇರಿಸಿ.",
      noExpenseData: "ಖರ್ಚು ವ್ಯವಹಾರಗಳನ್ನು ದಾಖಲಿಸಿದ ನಂತರ ಇಲ್ಲಿ ಡೇಟಾ ಕಾಣಿಸುತ್ತದೆ."
    },
    reports: {
      noTransactionsYet: "ಇನ್ನೂ ವ್ಯವಹಾರಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ವರದಿಗಾಗಿ ದಾಖಲಾತಿಗಳನ್ನು ಸೇರಿಸಿ.",
      noMatches: "ಈ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದುವ ವ್ಯವಹಾರಗಳಿಲ್ಲ. ಎಲ್ಲಾ ಖಾತೆಗಳು ಅಥವಾ ಆದಾಯ + ಖರ್ಚು ಪ್ರಯತ್ನಿಸಿ."
    },
    transaction: {
      createdSuccess: "ವ್ಯವಹಾರ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ.",
      updatedSuccess: "ವ್ಯವಹಾರ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.",
      categoryHint: "ಈಗ ಸಮೀಪವಾದ ವರ್ಗವನ್ನು ಆರಿಸಿ. ನಂತರ ಇತಿಹಾಸದಿಂದ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಸುಧಾರಿಸಬಹುದು.",
      descriptionTip: "ಸಲಹೆ: ಉತ್ತಮ ಒಳನೋಟಕ್ಕೆ \"Swiggy dinner\" ರೀತಿಯ ವಿವರಣೆ ಸೇರಿಸಿ.",
      premiumHabitHint: "ನಿಖರ ಪೂರ್ವಾನುಮಾನಕ್ಕಾಗಿ ವ್ಯವಹಾರಗಳನ್ನು ಅದೇ ದಿನ ದಾಖಲಿಸಿ.",
      scanButton: "AI ಬಳಸಿ ರಸೀದಿಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ (ಚಿತ್ರ ಅಥವಾ PDF)",
      fileSizeError: "ಫೈಲ್ ಗಾತ್ರ 5MB ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
      fileTypeError: "ದಯವಿಟ್ಟು ಚಿತ್ರ ಅಥವಾ PDF ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
    },
    settings: {
      preferredTheme: "ನಿಮ್ಮ ಇಷ್ಟದ ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ"
    }
  },
  ml: {
    sidebar: {
      weekFocusHint: "ചെലവ് വരുമാനത്തേക്കാൾ കുറച്ച് നിലനിർത്തി ഓരോ ഇടപാടും അതേ ദിവസം രേഖപ്പെടുത്തുക."
    },
    dashboard: {
      performanceHint: "പ്രധാന കണക്കുകളുടെ മാസാന്ത മാറ്റം നോക്കുക.",
      spendingHint: "തിരഞ്ഞെടുത്ത മാസത്തിലെ സമീപകാല പ്രവർത്തനവും വിഭാഗ സാന്ദ്രതയും.",
      noActivity: "ഈ മാസത്തിൽ ഇതുവരെ പ്രവർത്തനം ഇല്ല. ഇൻസൈറ്റ് ട്രാക്കിംഗ് തുടങ്ങാൻ ആദ്യ എൻട്രി ചേർക്കുക.",
      noExpenseData: "ചെലവ് ഇടപാടുകൾ ചേർത്താൽ ഇവിടെ ഡാറ്റ കാണിക്കും."
    },
    reports: {
      noTransactionsYet: "ഇതുവരെ ഇടപാടുകൾ കണ്ടെത്തിയില്ല. ആദ്യ റിപ്പോർട്ടിന് എൻട്രികൾ ചേർക്കൂ.",
      noMatches: "ഈ ഫിൽറ്ററുകൾക്ക് അനുയോജ്യമായ ഇടപാടുകളില്ല. എല്ലാ അക്കൗണ്ടുകളും അല്ലെങ്കിൽ വരുമാനം + ചെലവ് ശ്രമിക്കുക."
    },
    transaction: {
      createdSuccess: "ഇടപാട് വിജയകരമായി സൃഷ്ടിച്ചു.",
      updatedSuccess: "ഇടപാട് വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു.",
      categoryHint: "ഇപ്പോൾ ഏറ്റവും അടുത്ത വിഭാഗം തിരഞ്ഞെടുക്കുക. പിന്നീട് ചരിത്രത്തിൽ നിന്ന് അനലിറ്റിക്സ് മെച്ചപ്പെടുത്താം.",
      descriptionTip: "സൂചന: മികച്ച ഇൻസൈറ്റിനായി \"Swiggy dinner\" പോലൊരു വിവരണം ചേർക്കുക.",
      premiumHabitHint: "കൃത്യമായ ഫോർകാസ്റ്റിനായി ഇടപാടുകൾ അതേ ദിവസം രേഖപ്പെടുത്തുക.",
      scanButton: "AI ഉപയോഗിച്ച് രസീത് സ്കാൻ ചെയ്യുക (ചിത്രം അല്ലെങ്കിൽ PDF)",
      fileSizeError: "ഫയൽ വലുപ്പം 5MB-ൽ താഴെയായിരിക്കണം.",
      fileTypeError: "ദയവായി ചിത്രം അല്ലെങ്കിൽ PDF ഫയൽ അപ്‌ലോഡ് ചെയ്യുക."
    },
    settings: {
      preferredTheme: "നിങ്ങൾക്ക് ഇഷ്ടമുള്ള തീം തിരഞ്ഞെടുക്കുക"
    }
  },
  raj: {
    sidebar: {
      weekFocusHint: "खर्चो आवक सूं नीचो राखो अर हर ट्रांजेक्शन उही दिन लिखो।"
    },
    dashboard: {
      performanceHint: "जरूरी नंबरां में महीना-दर-महीना बदलाव देखो।",
      spendingHint: "चुनेला महीना खातर हाल री गतिविधि अर श्रेणी फोकस।",
      noActivity: "ई महीना में अभी कोई गतिविधि नाय। पहली एंट्री जोड़ो।",
      noExpenseData: "जै ही खर्चा ट्रांजेक्शन जोड़सो, यहां डेटा देखासे।"
    },
    reports: {
      noTransactionsYet: "अभी कोई ट्रांजेक्शन नाय मिल्यो। पहली रिपोर्ट खातर एंट्री जोड़ो।",
      noMatches: "ई फिल्टर में कोई ट्रांजेक्शन मेल नाय खायो। बदा खाता या आवक + खर्चा आजमाओ।"
    },
    transaction: {
      createdSuccess: "ट्रांजेक्शन सफल रीते बन ग्यो।",
      updatedSuccess: "ट्रांजेक्शन सफल रीते अपडेट ग्यो।",
      categoryHint: "हाले नजदीकी श्रेणी चुनो, बाद में हिस्ट्री सूं एनालिटिक्स सुधार सको।",
      descriptionTip: "टिप: बढ़िया इनसाइट खातर \"Swiggy dinner\" जेसो विवरण लिखो।",
      premiumHabitHint: "सही फोरकास्ट खातर ट्रांजेक्शन उही दिन दर्ज करो।",
      scanButton: "AI सूं रसीद स्कैन करो (इमेज या PDF)",
      fileSizeError: "फाइल साइज 5MB सूं कम होणो चाहिए।",
      fileTypeError: "कृपया इमेज या PDF फाइल अपलोड करो।"
    },
    settings: {
      preferredTheme: "थारी पसंद री थीम चुनो"
    }
  },
  pa: {
    sidebar: {
      weekFocusHint: "ਖਰਚਾ ਆਮਦਨ ਤੋਂ ਘੱਟ ਰੱਖੋ ਅਤੇ ਹਰ ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਉਸੇ ਦਿਨ ਦਰਜ ਕਰੋ।"
    },
    dashboard: {
      performanceHint: "ਸਭ ਤੋਂ ਮਹੱਤਵਪੂਰਨ ਅੰਕਾਂ ਦੀ ਮਹੀਨਾਵਾਰ ਚਾਲ ਵੇਖੋ।",
      spendingHint: "ਚੁਣੇ ਮਹੀਨੇ ਲਈ ਤਾਜ਼ਾ ਗਤੀਵਿਧੀ ਅਤੇ ਸ਼੍ਰੇਣੀ ਕੇਂਦ੍ਰਤਾ।",
      noActivity: "ਇਸ ਮਹੀਨੇ ਹਾਲੇ ਕੋਈ ਗਤੀਵਿਧੀ ਨਹੀਂ। ਪਹਿਲੀ ਐਂਟਰੀ ਜੋੜੋ।",
      noExpenseData: "ਖਰਚੇ ਵਾਲੀਆਂ ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਜੋੜਦੇ ਹੀ ਇੱਥੇ ਡਾਟਾ ਦਿਖੇਗਾ।"
    },
    reports: {
      noTransactionsYet: "ਹਾਲੇ ਕੋਈ ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਨਹੀਂ ਮਿਲੀ। ਪਹਿਲੀ ਰਿਪੋਰਟ ਲਈ ਐਂਟਰੀਆਂ ਜੋੜੋ।",
      noMatches: "ਇਨ੍ਹਾਂ ਫਿਲਟਰਾਂ ਨਾਲ ਕੋਈ ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਨਹੀਂ ਮਿਲੀ। ਸਭ ਖਾਤੇ ਜਾਂ ਆਮਦਨ + ਖਰਚਾ ਅਜ਼ਮਾਓ।"
    },
    transaction: {
      createdSuccess: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਸਫਲਤਾਪੂਰਵਕ ਬਣ ਗਈ ਹੈ।",
      updatedSuccess: "ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਹੋ ਗਈ ਹੈ।",
      categoryHint: "ਹੁਣ ਸਭ ਤੋਂ ਨੇੜਲੀ ਸ਼੍ਰੇਣੀ ਚੁਣੋ। ਬਾਅਦ ਵਿੱਚ ਇਤਿਹਾਸ ਤੋਂ ਐਨਾਲਿਟਿਕਸ ਸੁਧਾਰ ਸਕਦੇ ਹੋ।",
      descriptionTip: "ਸੁਝਾਅ: ਵਧੀਆ ਇਨਸਾਈਟ ਲਈ \"Swiggy dinner\" ਵਰਗਾ ਵੇਰਵਾ ਦਿਓ।",
      premiumHabitHint: "ਸਹੀ ਫੋਰਕਾਸਟ ਲਈ ਟ੍ਰਾਂਜ਼ੈਕਸ਼ਨ ਉਸੇ ਦਿਨ ਦਰਜ ਕਰੋ।",
      scanButton: "AI ਨਾਲ ਰਸੀਦ ਸਕੈਨ ਕਰੋ (ਇਮੇਜ ਜਾਂ PDF)",
      fileSizeError: "ਫਾਈਲ ਆਕਾਰ 5MB ਤੋਂ ਘੱਟ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
      fileTypeError: "ਕਿਰਪਾ ਕਰਕੇ ਇਮੇਜ ਜਾਂ PDF ਫਾਈਲ ਅਪਲੋਡ ਕਰੋ।"
    },
    settings: {
      preferredTheme: "ਆਪਣੀ ਮਨਪਸੰਦ ਥੀਮ ਚੁਣੋ"
    }
  },
  or: {
    sidebar: {
      weekFocusHint: "ଖର୍ଚ୍ଚକୁ ଆୟରୁ କମ୍ ରଖନ୍ତୁ ଏବଂ ପ୍ରତ୍ୟେକ ଲେନଦେନ ସେହି ଦିନେ ଲେଖନ୍ତୁ।"
    },
    dashboard: {
      performanceHint: "ମୁଖ୍ୟ ସଂଖ୍ୟାର ମାସିକ ପରିବର୍ତ୍ତନ ଦେଖନ୍ତୁ।",
      spendingHint: "ଚୟନିତ ମାସ ପାଇଁ ସମ୍ପ୍ରତି କାର୍ଯ୍ୟକଳାପ ଏବଂ ଶ୍ରେଣୀ କେନ୍ଦ୍ରୀକରଣ।",
      noActivity: "ଏହି ମାସରେ ଏଯାବତ୍ କାର୍ଯ୍ୟକଳାପ ନାହିଁ। ପ୍ରଥମ ଏଣ୍ଟ୍ରି ଯୋଡନ୍ତୁ।",
      noExpenseData: "ଆପଣ ଖର୍ଚ୍ଚ ଲେନଦେନ ଯୋଡିଲେ ଏଠାରେ ତଥ୍ୟ ଦେଖାଯିବ।"
    },
    reports: {
      noTransactionsYet: "ଏଯାବତ୍ କୌଣସି ଲେନଦେନ ମିଳିନାହିଁ। ପ୍ରଥମ ରିପୋର୍ଟ ପାଇଁ ଏଣ୍ଟ୍ରି ଯୋଡନ୍ତୁ।",
      noMatches: "ଏହି ଫିଲ୍ଟର ସହ କୌଣସି ଲେନଦେନ ମେଳ ହେଲା ନାହିଁ। ସମସ୍ତ ଖାତା କିମ୍ବା ଆୟ + ଖର୍ଚ୍ଚ ଚେଷ୍ଟା କରନ୍ତୁ।"
    },
    transaction: {
      createdSuccess: "ଲେନଦେନ ସଫଳଭାବେ ସୃଷ୍ଟି ହେଲା।",
      updatedSuccess: "ଲେନଦେନ ସଫଳଭାବେ ଅଦ୍ୟତନ ହେଲା।",
      categoryHint: "ଏବେ ସବୁଠୁ ନିକଟ ଶ୍ରେଣୀ ବାଛନ୍ତୁ। ପରେ ଇତିହାସରୁ ବିଶ୍ଳେଷଣ ସୁଧାରନ୍ତୁ।",
      descriptionTip: "ସୁପାରିଶ: ଭଲ ଇନସାଇଟ୍ ପାଇଁ \"Swiggy dinner\" ପରି ବିବରଣୀ ଯୋଡନ୍ତୁ।",
      premiumHabitHint: "ଠିକ୍ ପୂର୍ବାନୁମାନ ପାଇଁ ଲେନଦେନ ସେହି ଦିନେ ଲେଖନ୍ତୁ।",
      scanButton: "AI ଦ୍ୱାରା ରସିଦ ସ୍କାନ୍ କରନ୍ତୁ (ଚିତ୍ର କିମ୍ବା PDF)",
      fileSizeError: "ଫାଇଲ୍ ଆକାର 5MB ରୁ କମ୍ ହେବା ଉଚିତ।",
      fileTypeError: "ଦୟାକରି ଚିତ୍ର କିମ୍ବା PDF ଫାଇଲ୍ ଅପଲୋଡ୍ କରନ୍ତୁ।"
    },
    settings: {
      preferredTheme: "ଆପଣଙ୍କ ପସନ୍ଦର ଥିମ୍ ବାଛନ୍ତୁ"
    }
  },
  gu: {
    sidebar: {
      weekFocusHint: "ખર્ચ આવક કરતાં ઓછો રાખો અને દરેક ટ્રાન્ઝેક્શન એ જ દિવસે નોંધો."
    },
    dashboard: {
      performanceHint: "મહત્વના આંકડાનો મહિનો-દર-મહિનો ફેરફાર જુઓ.",
      spendingHint: "પસંદ કરેલા મહિના માટે તાજેતરની પ્રવૃત્તિ અને કેટેગરી ધ્યાન.",
      noActivity: "આ મહિને હજી કોઈ પ્રવૃત્તિ નથી. ઇન્સાઇટ ટ્રેકિંગ માટે પહેલી એન્ટ્રી ઉમેરો.",
      noExpenseData: "તમે ખર્ચ ટ્રાન્ઝેક્શન ઉમેર્યા પછી અહીં ડેટા દેખાશે."
    },
    reports: {
      noTransactionsYet: "હજુ સુધી કોઈ ટ્રાન્ઝેક્શન મળ્યાં નથી. તમારી પ્રથમ રિપોર્ટ માટે એન્ટ્રીઓ ઉમેરો.",
      noMatches: "આ ફિલ્ટર સાથે કોઈ ટ્રાન્ઝેક્શન મળ્યાં નથી. બધા એકાઉન્ટ્સ અથવા આવક + ખર્ચ અજમાવો."
    },
    transaction: {
      createdSuccess: "ટ્રાન્ઝેક્શન સફળતાપૂર્વક બનાવાયું.",
      updatedSuccess: "ટ્રાન્ઝેક્શન સફળતાપૂર્વક અપડેટ થયું.",
      categoryHint: "હવે નજીકની શ્રેણી પસંદ કરો. પછી ઇતિહાસથી એનાલિટિક્સ સુધારી શકો છો.",
      descriptionTip: "ટિપ: વધુ સારા ઇન્સાઇટ માટે \"Swiggy dinner\" જેવી વિગત ઉમેરો.",
      premiumHabitHint: "ચોક્કસ ફોરકાસ્ટ માટે ટ્રાન્ઝેક્શન એ જ દિવસે નોંધો.",
      scanButton: "AI વડે રસીદ સ્કેન કરો (ઇમેજ અથવા PDF)",
      fileSizeError: "ફાઇલ સાઇઝ 5MBથી ઓછી હોવી જોઈએ.",
      fileTypeError: "કૃપા કરીને ઇમેજ અથવા PDF ફાઇલ અપલોડ કરો."
    },
    settings: {
      preferredTheme: "તમારી પસંદની થીમ પસંદ કરો"
    }
  }
};

function mergeNested(target, source) {
  const output = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = output[key];
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      output[key] = mergeNested(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });
  return output;
}

Object.entries(NATIVE_MODULE_OVERRIDES).forEach(([localeCode, overrides]) => {
  if (!MESSAGES[localeCode]) return;
  MESSAGES[localeCode] = mergeNested(MESSAGES[localeCode], overrides);
});

Object.entries(NATIVE_SENTENCE_OVERRIDES).forEach(([localeCode, overrides]) => {
  if (!MESSAGES[localeCode]) return;
  MESSAGES[localeCode] = mergeNested(MESSAGES[localeCode], overrides);
});

const getValueByPath = (obj, path) => {
  return path.split(".").reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) {
      return value[key];
    }
    return undefined;
  }, obj);
};

const interpolateMessage = (message, values = {}) => {
  if (typeof message !== "string") return message;
  return message.replace(/\{(\w+)\}/g, (_, token) => {
    if (Object.prototype.hasOwnProperty.call(values, token)) {
      return String(values[token]);
    }
    return `{${token}}`;
  });
};

export const getMessagesForLocale = (locale) => {
  const safeLocale = resolveLocale(locale);
  return MESSAGES[safeLocale] ?? MESSAGES[DEFAULT_LOCALE];
};

export const translate = (locale, key, values = {}, fallback) => {
  const safeLocale = resolveLocale(locale);
  const currentMessages = MESSAGES[safeLocale] ?? MESSAGES[DEFAULT_LOCALE];
  const fallbackMessages = MESSAGES[DEFAULT_LOCALE];
  const resolved =
    getValueByPath(currentMessages, key) ??
    getValueByPath(fallbackMessages, key) ??
    fallback ??
    key;

  return interpolateMessage(resolved, values);
};

export const getTranslator = (locale) => {
  return (key, values = {}, fallback) => translate(locale, key, values, fallback);
};
