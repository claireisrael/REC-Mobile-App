export const formatTimeWithTimezone = (isoDateTime?: string) => {
  if (!isoDateTime) return { kampala: '', local: '', timezone: '' };

  const utcDate = new Date(isoDateTime);

  const kampalaTime = utcDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Kampala',
  });

  const localTime = utcDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const localTimezone =
    new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
      .formatToParts(utcDate)
      .find((part) => part.type === 'timeZoneName')?.value || '';

  return { kampala: kampalaTime, local: localTime, timezone: localTimezone };
};

export const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
  }

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
};

export const getDayDate = (conferenceStartDate: string, dayNumber: number) => {
  if (!conferenceStartDate) return '';
  const startDate = new Date(conferenceStartDate);
  const dayDate = new Date(startDate);
  dayDate.setDate(startDate.getDate() + (dayNumber - 1));
  return dayDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getSessionsByDay = <T extends { day: number }>(sessions: T[], day: number) =>
  sessions.filter((session) => session.day === day);

export const getFilteredSessions = <T extends { venueHall?: string }>(
  daySessions: T[],
  selectedHall: string
) => {
  if (selectedHall === 'all') return daySessions;
  return daySessions.filter((session) => session.venueHall === selectedHall);
};

export const groupSessionsByTimeSlot = <
  T extends { startTime: string; toTime: string },
>(daySessions: T[]) => {
  const grouped: Record<
    string,
    { startTime: string; toTime: string; sessions: T[] }
  > = {};

  daySessions.forEach((session) => {
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.toTime);
    const timeKey = `${startTime.toISOString()}-${endTime.toISOString()}`;

    if (!grouped[timeKey]) {
      grouped[timeKey] = {
        startTime: session.startTime,
        toTime: session.toTime,
        sessions: [],
      };
    }
    grouped[timeKey].sessions.push(session);
  });

  return grouped;
};
