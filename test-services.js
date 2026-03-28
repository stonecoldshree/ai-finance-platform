const { Resend } = require('resend');
const twilio = require('twilio');

async function testServices() {
  console.log('Testing Email...');
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'shree@example.com',
      subject: 'Test Email',
      html: '<p>Test.</p>'
    });
    console.log('Email result:', data);
  } catch (error) {
    console.error('Email error:', error);
  }

  console.log('\nTesting SMS...');
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const msg = await client.messages.create({
      body: 'Test from CLI',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+1234567890'
    });
    console.log('SMS result:', msg.sid);
  } catch (error) {
    console.error('SMS error:', error.message);
  }
}

testServices();
