const emailjs = require('@emailjs/nodejs');
const twilio = require('twilio');

async function testServices() {
  console.log('Testing Email...');
  try {
    if (!process.env.TEST_TO_EMAIL) {
      throw new Error('Missing TEST_TO_EMAIL. Set a real recipient in your .env file.');
    }

    const data = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: process.env.TEST_TO_EMAIL,
        subject: 'Gullak EmailJS Test',
        title: 'Gullak EmailJS Test',
        name: 'Gullak User',
        message_html: '<p>EmailJS test from Gullak.</p>',
        message_text: 'EmailJS test from Gullak.'
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    );
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
