import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// Dummy data for preview
const PREVIEW_DATA = {
  monthlyReport: {
    userName: "Rahul Sharma",
    type: "monthly-report",
    data: {
      month: "December",
      stats: {
        totalIncome: 5000,
        totalExpenses: 3500,
        byCategory: {
          housing: 1500,
          groceries: 600,
          transportation: 400,
          entertainment: 300,
          utilities: 700,
        },
      },
      insights: [
        "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
        "Great job keeping entertainment expenses under control this month!",
        "Setting up automatic savings could help you save 20% more of your income.",
      ],
    },
  },
  budgetAlert: {
    userName: "Rahul Sharma",
    type: "budget-alert",
    data: {
      percentageUsed: 85,
      budgetAmount: 4000,
      totalExpenses: 3400,
    },
  },
};

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {data?.month}:
            </Text>

            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Income</Text>
                <Text style={styles.heading}>₹{data?.stats.totalIncome}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Expenses</Text>
                <Text style={styles.heading}>₹{data?.stats.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Net</Text>
                <Text style={styles.heading}>
                  ₹{data?.stats.totalIncome - data?.stats.totalExpenses}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={styles.row}>
                      <Text style={styles.text}>{category}</Text>
                      <Text style={styles.text}>₹{amount}</Text>
                    </div>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Gullak Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using Gullak. Keep tracking your finances for better
              financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>₹{data?.budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>₹{data?.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  ₹{data?.budgetAmount - data?.totalExpenses}
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "welcome") {
    return (
      <Html>
        <Head />
        <Preview>Welcome to Gullak</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Welcome to Gullak</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              We&rsquo;re excited to have you on board! Gullak helps you track
              your expenses, set budgets, and achieve your financial goals with
              the help of AI.
            </Text>
            <Section style={styles.section}>
              <Heading style={styles.heading}>Getting Started</Heading>
              <Text style={styles.text}>
                1. Set up your accounts to track balances.
              </Text>
              <Text style={styles.text}>
                2. Add your transactions regularly.
              </Text>
              <Text style={styles.text}>
                3. Create a monthly budget to stay on track.
              </Text>
            </Section>
            <Text style={styles.footer}>
              If you have any questions, feel free to reply to this email.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "account-created") {
    return (
      <Html>
        <Head />
        <Preview>New Account Created</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>New Account Added</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You have successfully created a new account: <strong>{data?.accountName}</strong>.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Initial Balance</Text>
                <Text style={styles.heading}>₹{data?.balance}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Type</Text>
                <Text style={styles.heading}>{data?.type}</Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "transaction-success") {
    return (
      <Html>
        <Head />
        <Preview>Transaction Logged</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Transaction Logged</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              A new transaction has been successfully logged.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Amount</Text>
                <Text style={styles.heading}>₹{data?.amount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Detailed Description</Text>
                <Text style={styles.heading}>{data?.description}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Category</Text>
                <Text style={styles.heading}>{data?.category}</Text>
              </div>
            </Section>

            {/* AI Advice */}
            {data?.advice && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Smart Spending Tips</Heading>
                {data.advice.map((tip, index) => (
                  <Text key={index} style={styles.text}>
                    • {tip}
                  </Text>
                ))}
              </Section>
            )}
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-coach") {
    return (
      <Html>
        <Head />
        <Preview>Your Weekly Budget Coach</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Weekly Budget Coach</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here is your weekly financial advice to keep you on track!
            </Text>

            {/* Weekly Stats */}
            <Section style={styles.statsContainer}>
              <Heading style={styles.heading}>Last Week's Snapshot</Heading>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Spent</Text>
                <Text style={styles.heading}>₹{data?.stats?.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining Monthly Budget</Text>
                <Text style={styles.heading}>₹{data?.stats?.remainingBudget}</Text>
              </div>
            </Section>

            {/* AI Advice */}
            {data?.advice && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Smart Advice</Heading>
                {data.advice.map((tip, index) => (
                  <Text key={index} style={styles.text}>
                    • {tip}
                  </Text>
                ))}
              </Section>
            )}
          </Container>
        </Body>
      </Html>
    );
  }
  if (type === "budget-created") {
    return (
      <Html>
        <Head />
        <Preview>Budget Set & AI Advice</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Set Successfully</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You have successfully set your monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Monthly Budget</Text>
                <Text style={styles.heading}>₹{data?.budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Current Account Balance</Text>
                <Text style={styles.heading}>₹{data?.balance}</Text>
              </div>
            </Section>

            {/* AI Advice */}
            {data?.advice && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>AI Financial Advice</Heading>
                {data.advice.map((tip, index) => (
                  <Text key={index} style={styles.text}>
                    • {tip}
                  </Text>
                ))}
              </Section>
            )}
          </Container>
        </Body>
      </Html>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};
