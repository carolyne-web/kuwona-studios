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
        // Parse name into first and last name
        const firstName = name.trim().split(' ')[0];
        const lastName = name.trim().split(' ').slice(1).join(' ');

        // Build profile attributes with properties
        const profileAttributes = {
          email: email,
          properties: {
            first_name: firstName,
            'Signed Up From': 'Contact Form'
          }
        };

        if (lastName) {
          profileAttributes.properties.last_name = lastName;
        }

        if (hearAbout) {
          profileAttributes.properties['How Heard About Us'] = hearAbout;
        }

        // Subscribe to Klaviyo list using REST API
        const klaviyoResponse = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
          method: 'POST',
          headers: {
            'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
            'Content-Type': 'application/json',
            'revision': '2024-10-15'
          },
          body: JSON.stringify({
            data: {
              type: 'profile-subscription-bulk-create-job',
              attributes: {
                profiles: {
                  data: [
                    {
                      type: 'profile',
                      attributes: profileAttributes
                    }
                  ]
                }
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
          })
        });

        if (!klaviyoResponse.ok) {
          const errorText = await klaviyoResponse.text();
          console.error('Klaviyo subscription error:', errorText);
        }
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
