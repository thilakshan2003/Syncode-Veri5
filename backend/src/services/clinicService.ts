import { prisma } from '../config/db.js';

// Helper function to check if clinic is currently open
const isClinicOpen = (availableTime: string | null): boolean => {
  if (!availableTime) return false;

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

  const timeStr = availableTime.toLowerCase().trim();

  // If 24/7 is mentioned
  if (timeStr.includes('24/7') || timeStr.includes('24 hours')) {
    return true;
  }

  // Check day validity
  let isDayValid = false;

  // Check if it's a weekday clinic (Mon-Fri)
  if (timeStr.includes('mon-fri') || timeStr.includes('weekday')) {
    isDayValid = currentDay >= 1 && currentDay <= 5; // Monday to Friday
  }
  // Check if it's weekend only
  else if (timeStr.includes('weekend')) {
    isDayValid = currentDay === 0 || currentDay === 6; // Saturday or Sunday
  }
  // Check for specific days or default to always valid for time check
  else {
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDayName = dayNames[currentDay];
    // If a day is mentioned in the string, check if it's today
    const hasDayMention = dayNames.some(day => timeStr.includes(day));
    if (hasDayMention) {
      isDayValid = timeStr.includes(currentDayName);
    } else {
      // No day mentioned, assume open all days (check only time)
      isDayValid = true;
    }
  }

  if (!isDayValid) return false;

  // Extract time range (e.g., "08:00 - 20:00" or "08:00-20:00")
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const startHour = parseInt(timeMatch[1]);
    const startMin = parseInt(timeMatch[2]);
    const endHour = parseInt(timeMatch[3]);
    const endMin = parseInt(timeMatch[4]);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime <= endTime;
  }

  // If we passed day check but no time found, assume open
  return true;
};

export const getAllClinics = async () => {
  const clinics = await prisma.clinic.findMany();
  return clinics.map(clinic => ({
    ...clinic,
    isOpen: isClinicOpen(clinic.availableTime),
  }));
};

export const getClinicById = async (id: bigint) => {
  const clinic = await prisma.clinic.findUnique({
    where: { id },
  });
  if (!clinic) return null;
  return {
    ...clinic,
    isOpen: isClinicOpen(clinic.availableTime),
  };
};

export const searchClinicsByName = async (name: string) => {
  const clinics = await prisma.clinic.findMany({
    where: {
      name: { contains: name, mode: 'insensitive' },
    },
  });
  return clinics.map(clinic => ({
    ...clinic,
    isOpen: isClinicOpen(clinic.availableTime),
  }));
};