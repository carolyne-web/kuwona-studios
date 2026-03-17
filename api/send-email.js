// Vercel Serverless Function for sending emails via Resend
// This function handles contact form submissions

import { Resend } from 'resend';
import { ApiKeySession, ProfilesApi } from 'klaviyo-api';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Klaviyo
const klaviyoSession = new ApiKeySession(process.env.KLAVIYO_PRIVATE_API_KEY);
const profilesApi = new ProfilesApi(klaviyoSession);

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
    const data = await resend.emails.send({
      from: 'Kuwona <onboarding@resend.dev>',
      to: ['carolyne@kuwonastudios.com'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name} | Kuwona Studios`,
      html: emailContent,
    });

    // Add to Klaviyo newsletter list if newsletter signup is checked
    if (newsletter) {
      try {
        await profilesApi.subscribeProfiles({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              list_id: 'U7rH4d',
              subscriptions: [
                {
                  email: email,
                  phone_number: null,
                  channels: {
                    email: ['MARKETING']
                  }
                }
              ]
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: 'U7rH4d'
                }
              }
            }
          }
        });

        // Also create/update profile with additional info
        await profilesApi.createOrUpdateProfile({
          data: {
            type: 'profile',
            attributes: {
              email: email,
              first_name: name.split(' ')[0],
              last_name: name.split(' ').slice(1).join(' ') || '',
              properties: {
                'Signed Up From': 'Contact Form',
                'How Heard About Us': hearAbout || 'Not specified'
              }
            }
          }
        });
      } catch (klaviyoError) {
        // Log Klaviyo error but don't fail the whole request
        console.error('Klaviyo subscription error:', klaviyoError);
      }
    }

    return res.status(200).json({
      success: true,
      messageId: data.id
    });

  } catch (error) {
    console.error('Error sending email:', error);

    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}
