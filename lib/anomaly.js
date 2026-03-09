/**
 * Z-Score Based Anomaly Detection Module
 * 
 * Implements statistical anomaly detection for financial transactions
 * using Z-score normalization with adaptive thresholds based on
 * spending volatility (coefficient of variation).
 * 
 * Algorithm:
 *   1. Compute μ (mean) and σ (std dev) from recent transaction history
 *   2. Compute Z = |amount - μ| / σ
 *   3. Adaptive threshold τ = 2.0 + 0.5 × (σ / μ)  clamped to [2.0, 2.5]
 *   4. Flag anomaly if Z > τ
 */

/**
 * Compute mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
function mean(values) {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Compute population standard deviation.
 * @param {number[]} values
 * @param {number} mu - precomputed mean
 * @returns {number}
 */
function stdDev(values, mu) {
    if (values.length === 0) return 0;
    const squaredDiffs = values.map((v) => Math.pow(v - mu, 2));
    return Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length);
}

/**
 * Compute the adaptive anomaly detection threshold τ.
 *
 * τ = 2.0 + 0.5 × CV, where CV = σ / μ (coefficient of variation).
 * Clamped to the range [2.0, 2.5].
 *
 * Higher spending volatility → higher threshold (more tolerance),
 * so stable spenders get tighter anomaly detection.
 *
 * @param {number} mu  - mean spending
 * @param {number} sigma - standard deviation
 * @returns {number} threshold τ
 */
function adaptiveThreshold(mu, sigma) {
    if (mu === 0) return 2.0; // fallback for zero-mean edge case
    const cv = sigma / mu; // coefficient of variation
    const tau = 2.0 + 0.5 * cv;
    return Math.max(2.0, Math.min(2.5, tau)); // clamp [2.0, 2.5]
}

/**
 * Detect whether a transaction amount is anomalous relative to
 * the user's recent spending history.
 *
 * @param {number} amount - the transaction amount to evaluate
 * @param {number[]} history - array of recent transaction amounts
 * @returns {{ isAnomaly: boolean, zScore: number, threshold: number, mean: number, stdDev: number }}
 */
export function detectAnomaly(amount, history) {
    // Need at least 5 data points for meaningful statistics
    if (history.length < 5) {
        return {
            isAnomaly: false,
            zScore: 0,
            threshold: 2.0,
            mean: mean(history),
            stdDev: 0,
            reason: "Insufficient history (< 5 transactions)",
        };
    }

    const mu = mean(history);
    const sigma = stdDev(history, mu);

    // If zero variance, any different amount is flagged
    if (sigma === 0) {
        const isAnomaly = amount !== mu;
        return {
            isAnomaly,
            zScore: isAnomaly ? Infinity : 0,
            threshold: 2.0,
            mean: mu,
            stdDev: sigma,
            reason: isAnomaly
                ? "Zero variance in history — amount differs from constant"
                : "Amount matches constant spending pattern",
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
        reason: isAnomaly
            ? `Z-score ${zScore.toFixed(2)} exceeds adaptive threshold ${tau.toFixed(2)}`
            : `Z-score ${zScore.toFixed(2)} within normal range (τ=${tau.toFixed(2)})`,
    };
}

/**
 * Batch anomaly detection — evaluate multiple transactions against a history.
 *
 * @param {number[]} amounts - array of amounts to evaluate
 * @param {number[]} history - baseline history for comparison
 * @returns {{ results: object[], summary: { total: number, anomalies: number, accuracy: number } }}
 */
export function batchDetectAnomalies(amounts, history) {
    const results = amounts.map((amount) => ({
        amount,
        ...detectAnomaly(amount, history),
    }));

    const anomalies = results.filter((r) => r.isAnomaly).length;

    return {
        results,
        summary: {
            total: amounts.length,
            anomalies,
            normalCount: amounts.length - anomalies,
            anomalyRate: parseFloat(((anomalies / amounts.length) * 100).toFixed(2)),
        },
    };
}

/**
 * Budget-based anomaly detection — flags when spending exceeds
 * a percentage of the monthly budget.
 *
 * @param {number} currentExpenses - total current month expenses
 * @param {number} budgetAmount - monthly budget
 * @param {number} warningThreshold - percentage threshold (default 80)
 * @returns {{ isOverBudget: boolean, percentageUsed: number, remaining: number }}
 */
export function checkBudgetAnomaly(
    currentExpenses,
    budgetAmount,
    warningThreshold = 80
) {
    if (budgetAmount <= 0) {
        return {
            isOverBudget: false,
            percentageUsed: 0,
            remaining: 0,
            reason: "No budget set",
        };
    }

    const percentageUsed = (currentExpenses / budgetAmount) * 100;
    const remaining = budgetAmount - currentExpenses;
    const isOverBudget = percentageUsed >= warningThreshold;

    return {
        isOverBudget,
        percentageUsed: parseFloat(percentageUsed.toFixed(2)),
        remaining: parseFloat(remaining.toFixed(2)),
        reason: isOverBudget
            ? `Spending at ${percentageUsed.toFixed(1)}% of budget (threshold: ${warningThreshold}%)`
            : `Spending at ${percentageUsed.toFixed(1)}% — within budget`,
    };
}
