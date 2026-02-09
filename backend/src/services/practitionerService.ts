import { prisma } from '../config/db.js';
import { AppointmentSlotMode } from '../../generated/prisma/client.js';

export const getAllPractitioners = async () => {
    const practitioners = await prisma.practitioner.findMany({
        include: {
            user: true,
            appointmentSlots: {
                where: {
                    startsAt: {
                        gte: new Date(), // Only future slots interact with availability
                    },
                },
                include: {
                    clinic: true
                }
            },
        },
    });

    return practitioners.map((p) => {
        const slots = p.appointmentSlots;
        const tags = new Set<string>();

        const onlineSlots = slots.filter(s => s.mode === AppointmentSlotMode.online);
        const physicalSlots = slots.filter(s => s.mode === AppointmentSlotMode.physical);
        const freeSlots = slots.filter(s => s.priceCents === 0);

        const hasWeekendOnline = onlineSlots.some(s => {
            const day = s.startsAt.getDay();
            return day === 0 || day === 6;
        });

        const hasWeekdayOnline = onlineSlots.some(s => {
            const day = s.startsAt.getDay();
            return day !== 0 && day !== 6;
        });

        const hasDailyOnline = hasWeekendOnline && hasWeekdayOnline;

        if (hasDailyOnline) {
            tags.add("Daily Online Channeling");
        } else {
            if (hasWeekendOnline) tags.add("Weekends Online Channeling");
            if (hasWeekdayOnline) tags.add("Weekdays Online Channeling");
        }

        const hasWeekendPhysical = physicalSlots.some(s => {
            const day = s.startsAt.getDay();
            return day === 0 || day === 6;
        });

        const hasWeekdayPhysical = physicalSlots.some(s => {
            const day = s.startsAt.getDay();
            return day !== 0 && day !== 6;
        });

        if (hasWeekendPhysical) tags.add("Weekends Clinic consultations");
        if (hasWeekdayPhysical) tags.add("Weekdays Clinic consultations");

        freeSlots.forEach(s => {
            if (s.clinic) {
                tags.add(`Free consultations at ${s.clinic.name.replace('National Hospital Sri Lanka (NHS)', 'NHS')}`);
            } else {
                tags.add("Free consultations");
            }
        });


        return {
            ...p,
            availabilityTags: Array.from(tags),
            // We don't need to send all slots to the frontend list view
            appointmentSlots: undefined
        };
    });
};

export const getPractitionerById = async (id: string | number) => {
    // Convert to BigInt safely
    const practitionerId = BigInt(id);

    const practitioner = await prisma.practitioner.findUnique({
        where: { id: practitionerId },
        include: {
            user: true,
            appointmentSlots: {
                where: {
                    startsAt: {
                        gte: new Date(),
                    },
                    isAvailable: true, // Only fetch available slots
                },
                orderBy: {
                    startsAt: 'asc',
                },
                include: {
                    clinic: true
                }
            },
            clinics: {
                include: {
                    clinic: true
                }
            }
        },
    });

    if (!practitioner) return null;

    return {
        ...practitioner,
        id: practitioner.id.toString(),
        appointmentSlots: practitioner.appointmentSlots.map(slot => ({
            ...slot,
            id: slot.id.toString(),
            practitionerId: slot.practitionerId.toString(),
            clinicId: slot.clinicId?.toString(),
            priceCents: slot.priceCents
        }))
    };
};

export const getPractitionersByClinic = async (clinicId: bigint) => {
  return prisma.practitionerClinic.findMany({
    where: { clinicId },
    include: { practitioner: true },
  });
};