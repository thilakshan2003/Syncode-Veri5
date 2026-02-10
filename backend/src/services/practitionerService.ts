import { prisma } from '../config/db.js';
import { AppointmentSlotMode } from '../../generated/prisma/client.js';

interface PractitionerFilters {
    clinicId?: bigint;
    role?: string;
    availability?: string; // 'weekdays' | 'weekends' | 'online'
}

export const getAllPractitioners = async (filters: PractitionerFilters = {}) => {
    const { clinicId, role, availability } = filters;

    const where: any = {};

    if (role) {
        where.specialization = {
            contains: role,
            mode: 'insensitive',
        };
    }

    if (clinicId) {
        where.clinics = {
            some: {
                clinicId: clinicId
            }
        };
    }
    const practitioners = await prisma.practitioners.findMany({
        where: where,
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

    let filteredPractitioners = practitioners;

    if (availability) {
        const availLower = availability.toLowerCase();
        filteredPractitioners = practitioners.filter(p => {
            const slots = p.appointmentSlots;
            const onlineSlots = slots.filter(s => s.mode === AppointmentSlotMode.online);
            const physicalSlots = slots.filter(s => s.mode === AppointmentSlotMode.physical);

            if (availLower.includes('online')) {
                // Check if has any online slots
                return onlineSlots.length > 0;
            }
            if (availLower.includes('weekends')) {
                // Check if has weekend slots (online or physical)
                return slots.some(s => {
                    const day = s.startsAt.getDay();
                    return day === 0 || day === 6;
                });
            }
            if (availLower.includes('weekdays')) {
                // Check if has weekday slots (online or physical)
                return slots.some(s => {
                    const day = s.startsAt.getDay();
                    return day !== 0 && day !== 6;
                });
            }
            return true;
        });
    }

    return filteredPractitioners.map((p) => {
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

export const getSpecializations = async () => {
    const result = await prisma.practitioners.groupBy({
        by: ['specialization'],
        _count: {
            specialization: true
        }
    });
    return (result as any[]).map(r => r.specialization);
};

export const getPractitionerById = async (id: string | number) => {
    // Convert to BigInt safely
    const practitionerId = BigInt(id);

    const practitioner = await prisma.practitioners.findUnique({
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
    return prisma.practitioner_clinics.findMany({
        where: { clinicId },
        include: { practitioner: true },
    });
};