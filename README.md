# Full Stack AI Fianace Platform with Next JS, Supabase, Tailwind, Prisma, Inngest, ArcJet, Shadcn UI Tutorial 🔥🔥
## https://youtu.be/egS6fnZAdzk

<img width="1470" alt="Screenshot 2024-12-10 at 9 45 45 AM" src="https://github.com/user-attachments/assets/1bc50b85-b421-4122-8ba4-ae68b2b61432">

### Make sure to create a `.env` file with following variables -

```
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=

ARCJET_KEY=

ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
SMS_CRITICAL_ONLY=true

ENABLE_REALTIME_AI_ADVICE=false
ENABLE_SCHEDULED_AI_INSIGHTS=false
GEMINI_DAILY_LIMIT=250
GEMINI_PER_MINUTE_LIMIT=20
INNGEST_MAX_USERS_PER_RUN=25

ENABLE_BENCHMARK_API=false
BENCHMARK_API_TOKEN=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### Launch Readiness

Run launch checks locally:

```bash
npm run check:launch
```

Health endpoint for deployment verification:

```bash
GET /api/health
```

Expected behavior in launch mode:

- Email is the primary channel for weekly/monthly digests.
- SMS is reserved for critical alerts by default.
- Dashboard insights continue with rule-based logic if AI quota is exhausted.
