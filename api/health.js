/**
 * CommuteWise MRT API Health Check Endpoint
 * Returns JSON status and diagnostic information for /api/health
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim().length > 0);
  const uptimeSec = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSec / 3600);
  const mins = Math.floor((uptimeSec % 3600) / 60);
  const secs = uptimeSec % 60;
  const formattedUptime = `${hours}h ${mins}m ${secs}s`;

  const now = new Date();
  const sgtString =
    now.toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      hour12: false,
      dateStyle: 'medium',
      timeStyle: 'medium',
    }) + ' SGT';

  const healthData = {
    status: 'ok',
    service: 'CommuteWise SG MRT Telemetry API',
    timestamp: now.toISOString(),
    sgtTime: sgtString,
    uptimeSeconds: uptimeSec,
    uptimeHuman: formattedUptime,
    ltaDataMall: {
      accountKeyConfigured: hasLtaKey,
      endpoint: 'http://datamall2.mytransport.sg/ltaodataservice/$metadata#PcdRealTime',
      status: hasLtaKey ? 'READY_FOR_UPSTREAM_REQUESTS' : 'AWAITING_LTA_ACCOUNT_KEY',
      instructions: hasLtaKey
        ? 'LTA Key is active. Live crowdsourced and official platform telemetry connected.'
        : 'To connect live LTA data in Vercel: go to Project Settings -> Environment Variables -> add LTA_ACCOUNT_KEY.',
    },
    availableRoutes: [
      {
        path: '/api/health',
        method: 'GET',
        description: 'System health check and LTA connection diagnostic',
      },
      {
        path: '/api/crowd?TrainStation=NS1',
        method: 'GET',
        description: 'Platform crowd density (PCDRealTime) by train station code',
      },
      {
        path: '/api/crowd?BusStopCode=20251',
        method: 'GET',
        description: 'Feeder bus arrivals and passenger load by bus stop code',
      },
    ],
  };

  res.status(200).json(healthData);
}
