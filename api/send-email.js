// Vercel Serverless Function for sending emails via Resend
// This function handles contact form submissions

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Add CORS headers to allow requests from GitHub Pages
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, hearAbout, message, newsletter } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Compose email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${hearAbout ? `<p><strong>How they heard about us:</strong> ${hearAbout}</p>` : ''}
      <p><strong>Newsletter Signup:</strong> ${newsletter ? 'Yes' : 'No'}</p>
      <hr>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send email using Resend
    console.log('Attempting to send email...');
    console.log('API Key exists:', !!process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'Kuwona Contact Form <onboarding@resend.dev>', // Using Resend's verified domain for now
      to: ['info@kuwonastudios.com'], // Your email address
      replyTo: email, // User's email for easy replies
      subject: `New Contact Form Submission from ${name}`,
      html: emailContent,
    });

    console.log('Email sent successfully:', data);

    // If newsletter signup is checked, you can add them to your mailing list
    // This would require additional Resend audience API calls or integration with your email service

    return res.status(200).json({
      success: true,
      messageId: data.id
    });

  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
      debug: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        errorType: error.constructor.name
      }
    });
  }
}
