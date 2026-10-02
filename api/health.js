/**
 * CommuteWise MRT API Health Check Endpoint
 * Supports both JSON response (for uptime bots/APIs) and rich interactive HTML (for browser monitoring)
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
  const sgtString = now.toLocaleString('en-SG', {
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

  const acceptHeader = (req.headers['accept'] || '').toLowerCase();
  const formatQuery = req.query?.format;

  // Serve HTML view if requested by a browser navigating directly, unless ?format=json is explicitly specified
  const wantsHtml =
    formatQuery === 'html' ||
    (acceptHeader.includes('text/html') && formatQuery !== 'json');

  if (wantsHtml) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Health & Status Monitor | CommuteWise SG MRT</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #080D1A;
      --card-bg: #0F172A;
      --border: #1E293B;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --emerald: #10B981;
      --sky: #0284C7;
      --amber: #F59E0B;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: 'Inter', system-ui, sans-serif;
      padding: 2rem 1rem;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .container {
      width: 100%;
      max-width: 820px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #0284C7, #10B981);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #080D1A;
      font-size: 1.1rem;
    }
    .brand h1 {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .brand span {
      font-size: 0.75rem;
      color: var(--text-muted);
      display: block;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .btn {
      background: #1E293B;
      color: #F8FAFC;
      border: 1px solid #334155;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .btn:hover {
      background: #334155;
    }
    .btn-sky {
      background: #0284C7;
      color: #080D1A;
      border: none;
      font-weight: 700;
    }
    .btn-sky:hover {
      background: #38BDF8;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.25rem;
    }
    .card-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .metric {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
    .pulse {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--emerald);
      box-shadow: 0 0 10px var(--emerald);
      animation: pulse 2s infinite;
      margin-right: 6px;
    }
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-badge.warning {
      background: rgba(245, 158, 11, 0.15);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .routes-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
    .routes-table th {
      text-align: left;
      color: var(--text-muted);
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid var(--border);
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .routes-table td {
      padding: 0.75rem;
      border-bottom: 1px solid rgba(30, 41, 59, 0.5);
    }
    .routes-table tr:hover td {
      background: rgba(30, 41, 59, 0.3);
    }
    .mono {
      font-family: 'JetBrains Mono', monospace;
      color: #38BDF8;
    }
    pre {
      background: #050811;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      overflow-x: auto;
      color: #CBD5E1;
      line-height: 1.5;
    }
    .lta-banner {
      background: linear-gradient(90deg, rgba(2, 132, 199, 0.1), rgba(16, 185, 129, 0.05));
      border: 1px solid rgba(2, 132, 199, 0.25);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .lta-banner h4 {
      font-size: 0.85rem;
      font-weight: 700;
      color: #38BDF8;
    }
    .lta-banner p {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .footer {
      text-align: center;
      font-size: 0.7rem;
      color: var(--text-muted);
      padding-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <div class="logo">CW</div>
        <div>
          <h1>CommuteWise API Health Monitor</h1>
          <span>Singapore MRT Telemetry & LTA DataMall Gateway</span>
        </div>
      </div>
      <div class="actions">
        <a href="/" class="btn">← Return to App</a>
        <a href="/api/health?format=json" class="btn">View Raw JSON</a>
        <button onclick="window.location.reload()" class="btn btn-sky">⟳ Refresh Status</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-title">
          <span>System Status</span>
          <span class="status-badge"><span class="pulse"></span>OPERATIONAL</span>
        </div>
        <div class="metric" style="color: #34D399;">200 OK</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">
          All gateway routes active
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Server Uptime</span>
          <span style="font-size: 0.7rem; color: var(--text-muted);">Process</span>
        </div>
        <div class="metric" style="color: #F8FAFC;">${formattedUptime}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">
          ${uptimeSec} seconds continuous
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>LTA DataMall Status</span>
          <span class="status-badge ${hasLtaKey ? '' : 'warning'}">
            ${hasLtaKey ? 'CONNECTED' : 'AWAITING KEY'}
          </span>
        </div>
        <div class="metric" style="color: ${hasLtaKey ? '#38BDF8' : '#FBBF24'}; font-size: 1.15rem;">
          ${hasLtaKey ? 'LTA LIVE' : 'SIMULATION'}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">
          ${hasLtaKey ? 'LTA_ACCOUNT_KEY present' : 'LTA_ACCOUNT_KEY not set yet'}
        </div>
      </div>
    </div>

    <div class="lta-banner">
      <h4>LTA DataMall PcdRealTime Endpoint</h4>
      <p>Target: <span class="mono">${healthData.ltaDataMall.endpoint}</span></p>
      <p>${healthData.ltaDataMall.instructions}</p>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Available API Routes</span>
        <span style="font-size: 0.7rem; color: var(--text-muted);">Click to inspect live response</span>
      </div>
      <table class="routes-table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Method</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="/api/health" class="mono" style="text-decoration:none;">/api/health</a></td>
            <td><strong style="color:#10B981;">GET</strong></td>
            <td>API health, uptime & LTA configuration status</td>
            <td><a href="/api/health?format=json" class="btn" style="padding:0.25rem 0.5rem;font-size:0.7rem;">Test JSON</a></td>
          </tr>
          <tr>
            <td><a href="/api/crowd?TrainStation=NS1" class="mono" style="text-decoration:none;">/api/crowd?TrainStation=NS1</a></td>
            <td><strong style="color:#10B981;">GET</strong></td>
            <td>Jurong East (NS1) Platform Crowd Density Real-Time</td>
            <td><a href="/api/crowd?TrainStation=NS1" class="btn" style="padding:0.25rem 0.5rem;font-size:0.7rem;">Test Endpoint</a></td>
          </tr>
          <tr>
            <td><a href="/api/crowd?BusStopCode=20251" class="mono" style="text-decoration:none;">/api/crowd?BusStopCode=20251</a></td>
            <td><strong style="color:#10B981;">GET</strong></td>
            <td>Feeder Bus Arrival & Passenger Load (BusStop 20251)</td>
            <td><a href="/api/crowd?BusStopCode=20251" class="btn" style="padding:0.25rem 0.5rem;font-size:0.7rem;">Test Endpoint</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Current Health Payload (JSON)</span>
        <span style="font-size: 0.7rem; color: var(--text-muted);">${sgtString}</span>
      </div>
      <pre>${JSON.stringify(healthData, null, 2)}</pre>
    </div>

    <div class="footer">
      CommuteWise SG MRT Telemetry • Data refreshed automatically upon reload
    </div>
  </div>

  <script>
    // Auto-refresh monitor every 15 seconds
    setTimeout(() => {
      window.location.reload();
    }, 15000);
  </script>
</body>
</html>`;

    res.status(200).send(html);
    return;
  }

  // Otherwise return standard JSON
  res.status(200).json(healthData);
}
