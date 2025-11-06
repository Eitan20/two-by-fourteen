require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { Resend } = require('resend');

const app = express();
const PORT = 3001;

// Load API keys from environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Proxy endpoint for Anthropic API
app.post('/api/generate', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Email endpoint
app.post('/api/send-emails', async (req, res) => {
  try {
    const { email, businessName, businessType, differentiator, painPoints, whatWeOffer, smsSequence } = req.body;

    // Format SMS sequence for email
    let sequenceHtml = '<div style="font-family: Arial, sans-serif; margin-top: 20px;">';
    let sequenceText = '';

    smsSequence.forEach((msg, index) => {
      sequenceHtml += `
        <div style="margin-bottom: 15px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3b82f6; border-radius: 4px;">
          <strong style="color: #475569; font-size: 13px;">DAY ${msg.day} - ${msg.time} MESSAGE</strong>
          <p style="margin: 8px 0 0 0; color: #1e293b; font-size: 14px; line-height: 1.5;">${msg.message}</p>
        </div>
      `;
      sequenceText += `Day ${msg.day} - ${msg.time}:\n${msg.message}\n\n`;
    });
    sequenceHtml += '</div>';

    // Create downloadable content
    const downloadContent = `${businessName} - 14-Day SMS Marketing Sequence
Generated: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════
BUSINESS INFORMATION
═══════════════════════════════════════════

Business Name: ${businessName}
Business Type: ${businessType}
What Sets You Apart: ${differentiator}
Pain Points: ${painPoints}
Services Offered: ${whatWeOffer}

═══════════════════════════════════════════
YOUR 14-DAY SMS SEQUENCE (28 Messages)
═══════════════════════════════════════════

${sequenceText}

═══════════════════════════════════════════
Ready to use these messages in your SMS platform!
═══════════════════════════════════════════
`;

    // Send email to the lead with their sequence
    let leadEmailSuccess = false;
    try {
      console.log(`Attempting to send email to lead: ${email}`);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `Your ${businessName} SMS Sequence is Ready! 🎉`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0;">🎉 Your SMS Sequence is Ready!</h1>
            <p style="color: #f0f0f0; font-size: 16px; margin: 10px 0 0 0;">14 days of proven SMS marketing for ${businessName}</p>
          </div>

          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi there! 👋</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Your custom 14-day SMS marketing sequence has been generated and is ready to use. Below you'll find all <strong>${smsSequence.length} messages</strong> tailored specifically for your business.
          </p>

          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #3b82f6;">
            <h3 style="margin-top: 0; color: #334155; font-size: 18px;">📋 Your Business Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 180px;">Business Name:</td>
                <td style="padding: 8px 0; color: #1e293b;">${businessName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Business Type:</td>
                <td style="padding: 8px 0; color: #1e293b;">${businessType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">What Sets You Apart:</td>
                <td style="padding: 8px 0; color: #1e293b;">${differentiator}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Pain Points:</td>
                <td style="padding: 8px 0; color: #1e293b;">${painPoints}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Services Offered:</td>
                <td style="padding: 8px 0; color: #1e293b;">${whatWeOffer}</td>
              </tr>
            </table>
          </div>

          <h2 style="color: #1e293b; font-size: 22px; margin-top: 35px; margin-bottom: 20px;">📱 Your Complete SMS Sequence</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Copy and paste these messages into your SMS platform. Each message is optimized for engagement and conversions.</p>

          ${sequenceHtml}

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; margin: 30px 0; border: 2px dashed #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">💡 Quick Start Guide</h3>
            <ol style="color: #475569; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
              <li>Copy each message and paste it into your SMS marketing platform</li>
              <li>Set up the schedule: 2 messages per day (AM & PM) for 14 days</li>
              <li>Test the sequence with your team first</li>
              <li>Launch and watch your engagement grow!</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 40px 0 20px 0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">Copy this entire sequence for easy reference:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e2e8f0; font-family: 'Courier New', monospace; font-size: 12px; text-align: left; max-height: 200px; overflow-y: auto; color: #334155;">
              <pre style="margin: 0; white-space: pre-wrap;">${downloadContent}</pre>
            </div>
          </div>

          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 10px; margin: 30px 0; text-align: center;">
            <p style="color: #475569; font-size: 15px; margin: 0 0 10px 0;">🚀 <strong>Ready to convert more leads?</strong></p>
            <p style="color: #64748b; font-size: 14px; margin: 0;">Start using these messages today and watch your response rates soar!</p>
          </div>

          <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">Generated with SMS Sequence Generator</p>
            <p style="color: #cbd5e1; font-size: 12px; margin: 5px 0 0 0;">${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
      });
      leadEmailSuccess = true;
      console.log(`✅ Successfully sent email to lead: ${email}`);
    } catch (leadEmailError) {
      console.error(`❌ Failed to send email to lead (${email}):`, leadEmailError);
      console.error('Note: If using Resend sandbox mode, emails can only be sent to verified addresses.');
      console.error('To send to arbitrary addresses, verify your domain in Resend and use a verified "from" address.');
    }

    // Send notification to admin about new signup with full details
    let adminEmailSuccess = false;
    try {
      console.log(`Attempting to send notification email to admin: ${NOTIFICATION_EMAIL}`);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: NOTIFICATION_EMAIL,
        subject: `🎯 New Lead: ${businessName} - SMS Sequence Generator`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0;">🎉 New Lead Captured!</h1>
            <p style="color: #f0f0f0; font-size: 16px; margin: 10px 0 0 0;">SMS Sequence Generator Lead Magnet</p>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e; font-size: 18px;">📧 Lead Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: rgba(255,255,255,0.5);">
                <td style="padding: 12px; color: #78350f; font-weight: 700; width: 140px;">Email:</td>
                <td style="padding: 12px; color: #451a03; font-weight: 600; font-size: 15px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #78350f; font-weight: 700;">Timestamp:</td>
                <td style="padding: 12px; color: #451a03;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #78350f; font-weight: 700;">Lead Email Status:</td>
                <td style="padding: 12px; color: #451a03;">${leadEmailSuccess ? '✅ Sent' : '❌ Failed (see server logs)'}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #3b82f6;">
            <h3 style="margin-top: 0; color: #334155; font-size: 18px;">🏢 Business Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 180px;">Business Name:</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 15px;">${businessName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Business Type:</td>
                <td style="padding: 10px 0; color: #1e293b;">${businessType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">What Sets Them Apart:</td>
                <td style="padding: 10px 0; color: #1e293b;">${differentiator}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Pain Points:</td>
                <td style="padding: 10px 0; color: #1e293b;">${painPoints}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Services Offered:</td>
                <td style="padding: 10px 0; color: #1e293b;">${whatWeOffer}</td>
              </tr>
            </table>
          </div>

          <h2 style="color: #1e293b; font-size: 22px; margin-top: 35px; margin-bottom: 20px;">📱 Generated SMS Sequence (${smsSequence.length} Messages)</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Here's the complete SMS sequence that was generated for this lead:</p>

          ${sequenceHtml}

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px solid #e2e8f0;">
            <h3 style="color: #334155; margin-top: 0; font-size: 16px;">📋 Full Sequence Copy (Text Format)</h3>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 11px; max-height: 300px; overflow-y: auto; color: #334155; border: 1px solid #cbd5e1;">
              <pre style="margin: 0; white-space: pre-wrap;">${downloadContent}</pre>
            </div>
          </div>

          <div style="background-color: #d1fae5; padding: 20px; border-radius: 10px; margin: 30px 0; text-align: center; border: 2px solid #10b981;">
            <p style="color: #065f46; font-size: 16px; margin: 0 0 8px 0;">✅ <strong>Action Required</strong></p>
            <p style="color: #047857; font-size: 14px; margin: 0;">Follow up with this lead at: <strong>${email}</strong></p>
          </div>

          <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">SMS Sequence Generator - Lead Notification</p>
            <p style="color: #cbd5e1; font-size: 12px; margin: 5px 0 0 0;">Delivered: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
      });
      adminEmailSuccess = true;
      console.log(`✅ Successfully sent notification email to admin: ${NOTIFICATION_EMAIL}`);
    } catch (adminEmailError) {
      console.error(`❌ Failed to send notification email to admin (${NOTIFICATION_EMAIL}):`, adminEmailError);
    }

    // Return success/failure status
    if (!leadEmailSuccess && !adminEmailSuccess) {
      res.status(500).json({
        success: false,
        message: 'Both emails failed to send. Check server logs for details.'
      });
    } else if (!leadEmailSuccess) {
      res.json({
        success: true,
        warning: 'Admin notification sent, but lead email failed. This may be due to Resend sandbox mode.',
        message: 'Admin notification sent successfully, but lead email may have failed. Check server logs.'
      });
    } else if (!adminEmailSuccess) {
      res.json({
        success: true,
        warning: 'Lead email sent, but admin notification failed.',
        message: 'Lead email sent successfully, but admin notification failed. Check server logs.'
      });
    } else {
      res.json({
        success: true,
        message: 'Both emails sent successfully'
      });
    }
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
