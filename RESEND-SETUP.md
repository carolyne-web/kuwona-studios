# Resend Email Setup Guide

This guide will help you set up Resend to handle contact form submissions and forward them to your Gmail account.

## Prerequisites

- A domain name (e.g., kuwonastudios.com)
- Access to your domain's DNS settings
- A Vercel account (or similar serverless platform)
- A Resend account

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address
3. You'll start with a free tier (100 emails/day, 3,000 emails/month)

## Step 2: Verify Your Domain

1. In the Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain: `kuwonastudios.com`
4. Resend will provide DNS records to add:
   - **SPF Record** (TXT)
   - **DKIM Record** (TXT)
   - **DMARC Record** (TXT)

### Adding DNS Records

Depending on your domain provider (GoDaddy, Namecheap, Cloudflare, etc.):

1. Log in to your domain provider
2. Navigate to DNS settings
3. Add each TXT record provided by Resend:

   **Example:**
   ```
   Type: TXT
   Name: @ (or leave blank for root domain)
   Value: [provided by Resend]
   ```

4. Wait for DNS propagation (can take 5-60 minutes)
5. Return to Resend and click **Verify Domain**

## Step 3: Get Your API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: `Kuwona Contact Form`
4. Select permission: **Full Access** or **Sending Access**
5. Copy the API key (you won't see it again!)

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **Add New Project**
3. Import your GitHub repository: `kuwona-studios`
4. Configure your project:
   - Framework Preset: **Other**
   - Build Command: (leave empty)
   - Output Directory: `.` (root)
5. Add Environment Variable:
   - Key: `RESEND_API_KEY`
   - Value: [paste your Resend API key]
6. Click **Deploy**

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to your project
cd /Users/michaelkleynhans/Documents/code/kuwona-studios

# Install dependencies
npm install

# Add environment variable
vercel env add RESEND_API_KEY

# When prompted, paste your Resend API key

# Deploy
vercel --prod
```

## Step 5: Update Your Domain Settings

1. After Vercel deployment, you'll get a URL like: `kuwona-studios.vercel.app`
2. To use your custom domain:
   - In Vercel dashboard, go to **Settings** → **Domains**
   - Add: `kuwonastudios.com` and `www.kuwonastudios.com`
   - Follow DNS instructions to point your domain to Vercel

## Step 6: Configure the "From" Email

In `/api/send-email.js`, update the `from` field:

```javascript
from: 'Kuwona Contact Form <contact@kuwonastudios.com>',
```

**Important:** The email domain must match your verified domain in Resend.

## Step 7: Test Your Contact Form

1. Visit your deployed site: `https://kuwonastudios.com/contact.html`
2. Fill out the contact form
3. Submit
4. Check your Gmail inbox at `info@kuwonastudios.com`

## Email Forwarding to Gmail

Resend will send emails TO your Gmail address (`info@kuwonastudios.com`), but it sends FROM your verified domain (`contact@kuwonastudios.com`).

### Set Up Gmail to Receive

1. Make sure `info@kuwonastudios.com` is a valid Gmail address
2. Emails will arrive in your inbox automatically
3. You can reply directly to the user (the `replyTo` field is set to the user's email)

## Troubleshooting

### Emails Not Sending

- Check Vercel logs: `vercel logs` or in Vercel dashboard
- Verify your Resend API key is correct in Vercel environment variables
- Check Resend dashboard for error logs

### Domain Not Verified

- Wait longer for DNS propagation (can take up to 24 hours)
- Use `dig` or `nslookup` to check if DNS records are active:
  ```bash
  dig TXT kuwonastudios.com
  ```

### CORS Errors

- The API endpoint is serverless, so CORS shouldn't be an issue
- If you encounter issues, you can add CORS headers in `/api/send-email.js`:
  ```javascript
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  ```

## Pricing

**Resend Free Tier:**
- 100 emails/day
- 3,000 emails/month
- 1 verified domain

**Resend Pro ($20/month):**
- 50,000 emails/month
- Unlimited domains
- Better deliverability

**Vercel:**
- Free tier includes 100GB bandwidth
- Serverless functions are free for hobby projects

## Next Steps

- [ ] Set up email templates in Resend for better formatting
- [ ] Add newsletter integration (Resend Audiences API)
- [ ] Set up automated responses to users
- [ ] Configure form spam protection (honeypot, reCAPTCHA)

## Support

- **Resend Docs:** https://resend.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Resend Support:** support@resend.com
