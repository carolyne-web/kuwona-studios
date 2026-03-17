// Newsletter subscription API endpoint
import { ApiKeySession, ProfilesApi } from 'klaviyo-api';

const klaviyoSession = new ApiKeySession(process.env.KLAVIYO_PRIVATE_API_KEY);
const profilesApi = new ProfilesApi(klaviyoSession);

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Subscribe to Klaviyo list
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

    // Create/update profile with name if provided
    if (name) {
      await profilesApi.createOrUpdateProfile({
        data: {
          type: 'profile',
          attributes: {
            email: email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '',
            properties: {
              'Signed Up From': 'Newsletter Footer'
            }
          }
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      error: 'Failed to subscribe',
      details: error.message
    });
  }
}
