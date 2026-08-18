require('dotenv').config();
const brevo = require('@getbrevo/brevo');

async function testBrevo() {
    console.log('📧 Testing Brevo API...');
    console.log('API Key:', process.env.BREVO_API_KEY ? '✅ Set' : '❌ Not Set');

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: 'ankitparida386@gmail.com' }];
    sendSmtpEmail.sender = {
        email: process.env.BREVO_SENDER_EMAIL || 'ankitparida386@gmail.com',
        name: 'MovieMate'
    };
    sendSmtpEmail.subject = '✅ Test Email from MovieMate';
    sendSmtpEmail.htmlContent = '<h1>🎬 MovieMate</h1><p>Brevo is working!</p>';

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Test email sent successfully!');
        console.log('Response:', response.response?.statusCode || 'OK');
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response);
        }
    }
}

testBrevo();