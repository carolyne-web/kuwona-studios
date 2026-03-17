// Newsletter subscription API endpoint

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

    // Parse name into first and last name
    const firstName = name ? name.trim().split(' ')[0] : '';
    const lastName = name ? name.trim().split(' ').slice(1).join(' ') : '';

    // Step 1: Subscribe to list with email only
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
                  attributes: {
                    email: email
                  }
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
      console.error('Klaviyo API error:', errorText);
      throw new Error(`Klaviyo API returned ${klaviyoResponse.status}: ${errorText}`);
    }

    // Step 2: Update profile with name information if provided
    if (name && firstName) {
      try {
        const profileUpdateResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
          method: 'POST',
          headers: {
            'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
            'Content-Type': 'application/json',
            'revision': '2024-10-15'
          },
          body: JSON.stringify({
            data: {
              type: 'profile',
              attributes: {
                email: email,
                first_name: firstName,
                ...(lastName && { last_name: lastName })
              }
            }
          })
        });

        if (!profileUpdateResponse.ok) {
          const errorText = await profileUpdateResponse.text();
          console.error('Klaviyo profile update error:', errorText);
        }
      } catch (profileError) {
        console.error('Error updating profile with name:', profileError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      error: 'Failed to subscribe',
      details: error.message,
      debug: {
        hasApiKey: !!process.env.KLAVIYO_PRIVATE_API_KEY,
        errorType: error.constructor.name,
        stack: error.stack
      }
    });
  }
}
