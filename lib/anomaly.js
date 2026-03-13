


















function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}







function stdDev(values, mu) {
  if (values.length === 0) return 0;
  const squaredDiffs = values.map((v) => Math.pow(v - mu, 2));
  return Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length);
}














function adaptiveThreshold(mu, sigma) {
  if (mu === 0) return 2.0;
  const cv = sigma / mu;
  const tau = 2.0 + 0.5 * cv;
  return Math.max(2.0, Math.min(2.5, tau));
}









export function detectAnomaly(amount, history) {

  if (history.length < 5) {
    return {
      isAnomaly: false,
      zScore: 0,
      threshold: 2.0,
      mean: mean(history),
      stdDev: 0,
      reason: "Insufficient history (< 5 transactions)"
    };
  }

  const mu = mean(history);
  const sigma = stdDev(history, mu);


  if (sigma === 0) {
    const isAnomaly = amount !== mu;
    return {
      isAnomaly,
      zScore: isAnomaly ? Infinity : 0,
      threshold: 2.0,
      mean: mu,
      stdDev: sigma,
      reason: isAnomaly ?
      "Zero variance in history — amount differs from constant" :
      "Amount matches constant spending pattern"
    };
  }

  const zScore = Math.abs(amount - mu) / sigma;
  const tau = adaptiveThreshold(mu, sigma);
  const isAnomaly = zScore > tau;

  return {
    isAnomaly,
    zScore: parseFloat(zScore.toFixed(4)),
    threshold: parseFloat(tau.toFixed(4)),
    mean: parseFloat(mu.toFixed(2)),
    stdDev: parseFloat(sigma.toFixed(2)),
    reason: isAnomaly ?
    `Z-score ${zScore.toFixed(2)} exceeds adaptive threshold ${tau.toFixed(2)}` :
    `Z-score ${zScore.toFixed(2)} within normal range (τ=${tau.toFixed(2)})`
  };
}








export function batchDetectAnomalies(amounts, history) {
  const results = amounts.map((amount) => ({
    amount,
    ...detectAnomaly(amount, history)
  }));

  const anomalies = results.filter((r) => r.isAnomaly).length;

  return {
    results,
    summary: {
      total: amounts.length,
      anomalies,
      normalCount: amounts.length - anomalies,
      anomalyRate: parseFloat((anomalies / amounts.length * 100).toFixed(2))
    }
  };
}










export function checkBudgetAnomaly(
currentExpenses,
budgetAmount,
warningThreshold = 80)
{
  if (budgetAmount <= 0) {
    return {
      isOverBudget: false,
      percentageUsed: 0,
      remaining: 0,
      reason: "No budget set"
    };
  }

  const percentageUsed = currentExpenses / budgetAmount * 100;
  const remaining = budgetAmount - currentExpenses;
  const isOverBudget = percentageUsed >= warningThreshold;

  return {
    isOverBudget,
    percentageUsed: parseFloat(percentageUsed.toFixed(2)),
    remaining: parseFloat(remaining.toFixed(2)),
    reason: isOverBudget ?
    `Spending at ${percentageUsed.toFixed(1)}% of budget (threshold: ${warningThreshold}%)` :
    `Spending at ${percentageUsed.toFixed(1)}% — within budget`
  };
}
