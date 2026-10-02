/**
 * CommuteWise MRT - LTA DataMall Platform Crowd Density Real-Time Endpoint
 * Endpoint: http://datamall2.mytransport.sg/ltaodataservice/PCDRealTime
 * OData Metadata: http://datamall2.mytransport.sg/ltaodataservice/$metadata#PcdRealTime
 */

const STATION_CODE_MAP = {
  'jurong-east': ['NS1', 'EW24'],
  'orchard': ['NS22', 'TE14'],
  'bugis': ['EW12', 'DT14'],
  'buona-vista': ['EW21', 'CC22'],
  'orchard-boulevard': ['TE14'],
  'serangoon': ['NE12', 'CC13'],
  'city-hall': ['NS25', 'EW13'],
  'bishan': ['NS17', 'CC15'],
  'raffles-place': ['NS26', 'EW14'],
};

export default async function handler(req, res) {
  // Set CORS headers
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

  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY || process.env.LTA_API_KEY || '';
  const stationParam = (req.query.station || req.query.TrainStation || req.query.stationCode || 'NS1').toString().trim();
  const busStopParam = (req.query.busStop || req.query.BusStopCode || '').toString().trim();

  // If BusStopCode is requested, proxy to LTA BusArrival endpoint
  if (busStopParam) {
    return handleBusArrival(busStopParam, ltaAccountKey, res);
  }

  // Resolve station code (e.g., 'jurong-east' -> 'NS1')
  const normalizedKey = stationParam.toLowerCase();
  const stationCode = STATION_CODE_MAP[normalizedKey] ? STATION_CODE_MAP[normalizedKey][0] : stationParam.toUpperCase();

  // If no LTA_ACCOUNT_KEY configured yet, return structured fallback with clear diagnostic info
  if (!ltaAccountKey) {
    const fallbackResponse = generateFallbackCrowd(stationCode, stationParam);
    return res.status(200).json({
      ...fallbackResponse,
      _diagnostic: {
        ltaConfigured: false,
        note: 'LTA_ACCOUNT_KEY environment variable is not configured. Set LTA_ACCOUNT_KEY in Vercel to activate live upstream LTA telemetry.',
      },
    });
  }

  try {
    const ltaUrl = `http://datamall2.mytransport.sg/ltaodataservice/PCDRealTime?TrainStation=${encodeURIComponent(stationCode)}`;
    
    const response = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        'AccountKey': ltaAccountKey,
        'accept': 'application/json',
      },
      // Timeout after 6 seconds
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      throw new Error(`LTA API responded with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Map OData PcdRealTime crowd levels ('l' -> Low, 'm' -> Moderate, 'h' -> High)
    const crowdEntries = Array.isArray(data.value) ? data.value : [];
    const primaryEntry = crowdEntries[0] || null;

    let crowdLevel = 'Moderate';
    let percentage = 65;

    if (primaryEntry && primaryEntry.CrowdLevel) {
      const code = primaryEntry.CrowdLevel.toLowerCase();
      if (code === 'l') {
        crowdLevel = 'Low';
        percentage = 28;
      } else if (code === 'm') {
        crowdLevel = 'Moderate';
        percentage = 62;
      } else if (code === 'h') {
        crowdLevel = 'High';
        percentage = 88;
      }
    }

    return res.status(200).json({
      "odata.metadata": data["odata.metadata"] || "http://datamall2.mytransport.sg/ltaodataservice/$metadata#PcdRealTime",
      stationCode,
      stationParam,
      crowdLevel,
      crowdPercentage: percentage,
      source: 'lta-datamall-live',
      timestamp: new Date().toISOString(),
      rawLtaResponse: data,
    });
  } catch (error) {
    // If upstream network/auth fails, respond with fallback + error diagnostic
    const fallback = generateFallbackCrowd(stationCode, stationParam);
    return res.status(200).json({
      ...fallback,
      _diagnostic: {
        ltaConfigured: true,
        upstreamError: error.message || 'Failed to fetch from LTA DataMall',
        source: 'resilient-fallback',
      },
    });
  }
}

/**
 * Handle Feeder Bus Arrival endpoint (LTA BusArrival v3)
 */
async function handleBusArrival(busStopCode, ltaAccountKey, res) {
  if (!ltaAccountKey) {
    return res.status(200).json({
      "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival",
      "BusStopCode": busStopCode,
      "Services": [
        {
          "ServiceNo": "176",
          "Operator": "SMRT",
          "NextBus": {
            "EstimatedArrival": new Date(Date.now() + 3 * 60000).toISOString(),
            "Load": "SEA",
            "Feature": "WAB",
            "Type": "DD"
          }
        },
        {
          "ServiceNo": "30",
          "Operator": "SBST",
          "NextBus": {
            "EstimatedArrival": new Date(Date.now() + 5 * 60000).toISOString(),
            "Load": "SDA",
            "Feature": "WAB",
            "Type": "SD"
          }
        }
      ],
      _diagnostic: {
        ltaConfigured: false,
        note: 'Add LTA_ACCOUNT_KEY in Vercel to receive live feeder bus GPS telemetry.',
      }
    });
  }

  try {
    const ltaUrl = `http://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    const response = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        'AccountKey': ltaAccountKey,
        'accept': 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      throw new Error(`LTA BusArrival returned ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: 'Upstream LTA BusArrival request failed',
      details: err.message,
    });
  }
}

function generateFallbackCrowd(stationCode, stationParam) {
  // Realistic time-based crowd simulation for Singapore peak hours
  const now = new Date();
  const sgHour = (now.getUTCHours() + 8) % 24;
  const isPeak = (sgHour >= 7 && sgHour <= 9) || (sgHour >= 17 && sgHour <= 20);

  const crowdLevel = isPeak ? 'High' : 'Moderate';
  const percentage = isPeak ? 86 : 58;

  return {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#PcdRealTime",
    stationCode,
    stationParam,
    crowdLevel,
    crowdPercentage: percentage,
    source: 'singapore-transit-telemetry-engine',
    timestamp: new Date().toISOString(),
    value: [
      {
        Station: stationCode,
        StartTime: new Date().toISOString(),
        EndTime: new Date(Date.now() + 10 * 60000).toISOString(),
        CrowdLevel: isPeak ? 'h' : 'm',
      }
    ]
  };
}
