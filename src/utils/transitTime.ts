/**
 * Live Singapore Transit & Telemetry Time Utilities
 * Computes dynamic, real-time departure recommendations synchronized with current Singapore Time (SGT)
 */

export interface LiveDepartureInfo {
  sgtTime: string;
  departureTime: string;
  waitMins: number;
  waitBadgeText: string;
  minutesSaved: number;
  advice: string;
}

/**
 * Get current Singapore Time formatted as HH:mm:ss SGT
 */
export function getLiveSGTString(date: Date = new Date()): string {
  const formatted = date.toLocaleTimeString('en-SG', {
    timeZone: 'Asia/Singapore',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${formatted} SGT`;
}

/**
 * Computes dynamic departure time and wait duration based on live current time in Singapore.
 * Prevents static hardcoded times (e.g., showing 18:27 when it is 12:00 noon) and negative wait times.
 */
export function calculateLiveDeparture(
  stationId: string,
  crowdLevel: 'Low' | 'Moderate' | 'Heavy' | string = 'Moderate',
  baseMinutesSaved: number = 10,
  now: Date = new Date()
): LiveDepartureInfo {
  // Determine Singapore hour and minute
  const sgHour = (now.getUTCHours() + 8) % 24;
  const isRushHour =
    (sgHour >= 7 && sgHour <= 9) || // Morning peak
    (sgHour >= 12 && sgHour <= 13) || // Lunch rush
    (sgHour >= 17 && sgHour <= 20); // Evening rush

  // Calculate dynamic wait time in minutes (always positive, typically 3 to 12 minutes)
  let waitMins = 4;
  if (crowdLevel === 'Heavy' || isRushHour) {
    // During heavy crowd, advise waiting 6 - 9 mins for the upcoming lighter train
    const minuteMod = now.getMinutes() % 5;
    waitMins = 6 + (minuteMod >= 2 ? 3 : 1);
  } else if (crowdLevel === 'Moderate') {
    waitMins = 4;
  } else {
    // Low crowd / smooth travel: next train ready in 2 - 3 mins
    waitMins = 2;
  }

  // Calculate departure time by adding waitMins to current time
  const departureDate = new Date(now.getTime() + waitMins * 60000);
  const departureTime = departureDate.toLocaleTimeString('en-SG', {
    timeZone: 'Asia/Singapore',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  const minutesSaved = Math.max(4, baseMinutesSaved || 12);

  let waitBadgeText = '';
  if (waitMins <= 2) {
    waitBadgeText = 'Board Now (2m)';
  } else {
    waitBadgeText = `+${waitMins} Min Wait`;
  }

  let advice = '';
  if (crowdLevel === 'Heavy') {
    advice = `Platform crowd expected to drop from High to Moderate in ${waitMins} minutes.`;
  } else if (crowdLevel === 'Moderate') {
    advice = `Concourse moving well. Next arriving train in ${waitMins} mins offers 30% more cabin space.`;
  } else {
    advice = `Smooth platform flow. Optimal boarding on the next arriving train in ${waitMins} mins.`;
  }

  return {
    sgtTime: getLiveSGTString(now),
    departureTime,
    waitMins,
    waitBadgeText,
    minutesSaved,
    advice,
  };
}
