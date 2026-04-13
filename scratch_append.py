import os

with open('lib/i18n/translations.js', 'a', encoding='utf-8') as f:
    f.write('''
Object.assign(MESSAGES.en, {
  notifications: {
    welcomeSMS: 'Welcome to Gullak, {userName}! Get started: Create an account, add transactions, and check your dashboard for AI insights.',
    monthlyReport: 'Gullak {month} Report: Income \u20b9{totalIncome} | Expenses \u20b9{totalExpenses} | Net \u20b9{net}.',
    topSpend: ' Top spend: {category} (\u20b9{amount}).',
    budgetAlert: 'Budget Alert ({accountName}): {percentageUsed}% used - \u20b9{totalExpenses} of \u20b9{budgetAmount} budget. Remaining: \u20b9{remaining}.',
    budgetCoach: 'Weekly Budget Coach: Spent \u20b9{totalExpenses} this week. Budget remaining: \u20b9{remainingBudget}.',
    accountCreated: 'Gullak: Account \\"{accountName}\\" created! Type: {accountType}, Balance: \u20b9{balance}.',
    transactionSuccess: 'Gullak: \u20b9{amount} logged for \\"{description}\\" ({category}).',
    defaultSMS: 'Gullak: You have a new notification. Check your email for details.',
    monthlySub: 'Your Monthly Financial Report - {month}',
    budgetSub: 'Budget Alert for {accountName}',
    coachSub: 'Your Weekly Budget Digest - Gullak',
    welcomeSub: 'Welcome to Gullak',
  }
});
if (MESSAGES.hi) {
  Object.assign(MESSAGES.hi, {
    notifications: {
      welcomeSMS: 'Gullak में आपका स्वागत है, {userName}! शुरू करें: खाता बनाएं, लेन-देन जोड़ें, और AI जानकारी के लिए डैशबोर्ड देखें।',
      monthlyReport: 'Gullak {month} रिपोर्ट: आय \u20b9{totalIncome} | खर्च \u20b9{totalExpenses} | शेष \u20b9{net}.',
      topSpend: ' सबसे ज्यादा खर्च: {category} (\u20b9{amount}).',
      budgetAlert: 'बजट अलर्ट ({accountName}): {percentageUsed}% उपयोग - \u20b9{budgetAmount} में से \u20b9{totalExpenses}. बचा हुआ: \u20b9{remaining}.',
      budgetCoach: 'साप्ताहिक बजट कोच: इस सप्ताह \u20b9{totalExpenses} खर्च किए। शेष बजट: \u20b9{remainingBudget}.',
      accountCreated: 'Gullak: खाता \\"{accountName}\\" बनाया गया! प्रकार: {accountType}, बैलेंस: \u20b9{balance}.',
      transactionSuccess: 'Gullak: \\"{description}\\" ({category}) के लिए \u20b9{amount} जोड़े गए।',
      defaultSMS: 'Gullak: आपके पास एक नया अलर्ट है। विवरण के लिए अपना ईमेल जांचें।',
      monthlySub: 'आपकी मासिक वित्तीय रिपोर्ट - {month}',
      budgetSub: 'बजट अलर्ट: {accountName}',
      coachSub: 'साप्ताहिक बजट कोच - Gullak',
      welcomeSub: 'Gullak में आपका स्वागत है',
    }
  });
}
''')
