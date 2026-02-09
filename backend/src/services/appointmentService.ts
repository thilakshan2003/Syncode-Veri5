import { prisma } from '../config/db.js';
import { AppointmentStatus, AppointmentSlotMode } from '../../generated/prisma/client.js';

export const createAppointment = async (userId: string | number, slotId: string | number) => {
    const uId = BigInt(userId);
    const sId = BigInt(slotId);

    // Start a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
        // 1. Fetch the slot
        const slot = await tx.appointmentSlot.findUnique({
            where: { id: sId },
        });

        if (!slot) {
            throw new Error("Slot not found");
        }

        if (!slot.isAvailable) {
            throw new Error("Slot is no longer available");
        }

        // 2. Create the appointment
        const appointment = await tx.appointment.create({
            data: {
                userId: uId,
                slotId: sId,
                status: AppointmentStatus.booked,
            },
        });

        // 3. Mark the slot as unavailable
        await tx.appointmentSlot.update({
            where: { id: sId },
            data: { isAvailable: false },
        });

        return appointment;
    });
};
