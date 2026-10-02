/**
 * CommuteWise MRT API Health Check Endpoint
 * For Vercel Serverless Functions & Uptime Monitors
 */

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim().length > 0);

  const healthData = {
    status: 'ok',
    service: 'CommuteWise SG MRT Telemetry API',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    ltaDataMall: {
      accountKeyConfigured: hasLtaKey,
      endpoint: 'http://datamall2.mytransport.sg/ltaodataservice/$metadata#PcdRealTime',
      status: hasLtaKey ? 'READY_FOR_UPSTREAM_REQUESTS' : 'AWAITING_LTA_ACCOUNT_KEY',
    },
    availableRoutes: [
      { path: '/api/health', method: 'GET', description: 'API health and LTA connection status' },
      { path: '/api/crowd', method: 'GET', description: 'Platform crowd density (PcdRealTime) by train station code' },
      { path: '/api/bus-arrival', method: 'GET', description: 'Feeder bus arrival and passenger load by bus stop code' },
    ],
  };

  res.status(200).json(healthData);
}
