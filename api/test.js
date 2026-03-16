// Test endpoint to verify environment variables
export default async function handler(req, res) {
  const hasResendKey = !!process.env.RESEND_API_KEY;
  const keyPrefix = process.env.RESEND_API_KEY?.substring(0, 7) || 'NOT_SET';

  return res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: {
      hasResendKey,
      keyPrefix,
      nodeVersion: process.version,
      platform: process.platform
    }
  });
}
