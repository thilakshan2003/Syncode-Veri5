"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getDashboardData(clinicSlug) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    try {
        const response = await axios.get(`${API_URL}/api/clinics/${clinicSlug}/staff-dashboard`);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Failed to fetch dashboard data");
    }
}

export async function updateTestStatus(verificationId, newStatus) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    try {
        await axios.patch(`${API_URL}/api/verifications/${verificationId}/status`, {
            status: newStatus,
        });

        revalidatePath(`/staff/${session.user.clinicSlug}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating test status:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Failed to update test status");
    }
}
