import { prisma } from '../config/db.js';
import { AppointmentStatus, AppointmentSlotMode } from '../../generated/prisma/client.js';

export const createAppointment = async (userId: string | number, slotId: string | number) => {
    const uId = BigInt(userId);
    const sId = BigInt(slotId);

    // Start a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
        // 1. Fetch the slot
        const slot = await tx.appointment_slots.findUnique({
            where: { id: sId },
        });

        if (!slot) {
            throw new Error("Slot not found");
        }

        if (!slot.isAvailable) {
            throw new Error("Slot is no longer available");
        }

        // 2. Create the appointment
        const appointment = await tx.appointments.create({
            data: {
                userId: uId,
                slotId: sId,
                status: AppointmentStatus.booked,
            },
        });

        // 3. Mark the slot as unavailable
        await tx.appointment_slots.update({
            where: { id: sId },
            data: { isAvailable: false },
        });

        return appointment;
    });
};

export const cancelAppointment = async (userId: string | number, appointmentId: string | number) => {
    const uId = BigInt(userId);
    const aId = BigInt(appointmentId);

    // Start a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
        // 1. Fetch the appointment
        const appointment = await tx.appointments.findUnique({
            where: { id: aId },
            include: { slot: true }
        });

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        // 2. Verify the appointment belongs to the user
        if (appointment.userId !== uId) {
            throw new Error("Unauthorized: This appointment doesn't belong to you");
        }

        // 3. Check if appointment is already cancelled or completed
        if (appointment.status === AppointmentStatus.cancelled) {
            throw new Error("Appointment is already cancelled");
        }

        if (appointment.status === AppointmentStatus.completed) {
            throw new Error("Cannot cancel a completed appointment");
        }

        // 4. Update appointment status to cancelled
        const cancelledAppointment = await tx.appointments.update({
            where: { id: aId },
            data: { status: AppointmentStatus.cancelled }
        });

        // 5. Make the slot available again
        await tx.appointment_slots.update({
            where: { id: appointment.slotId },
            data: { isAvailable: true }
        });

        return cancelledAppointment;
    });
};
