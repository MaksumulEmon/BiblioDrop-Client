const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/**
 * Ask BiblioBot for context-aware book recommendations and conversation.
 * @param {string} message - User query or mood prompt
 * @param {Array} history - Previous conversation messages (optional)
 * @returns {Promise<{reply: string, books: Array, suggestedFollowUps: Array}>}
 */
export const askBiblioBot = async (message, history = []) => {
    try {
        const res = await fetch(`${baseUrl}/api/ai/recommend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, history }),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Server returned ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("Error asking BiblioBot:", err);
        throw err;
    }
};

/**
 * Scan a book cover image with Multimodal AI Vision to extract metadata.
 * @param {string} imageBase64 - Base64 encoded image string
 * @param {string} mimeType - Image mime type e.g. "image/jpeg"
 * @param {string} fileName - Optional original file name hint
 * @returns {Promise<{success: boolean, book: {title: string, author: string, category: string, deliveryFee: number, description: string, tags: string[]}}>}
 */
export const scanBookWithAI = async (imageBase64, mimeType = "image/jpeg", fileName = "") => {
    try {
        const res = await fetch(`${baseUrl}/api/ai/scan-book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageBase64, mimeType, fileName }),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.error || (res.status === 404 ? "Server AI endpoint not found. Please restart backend server (node index.js)." : `Server returned ${res.status}`);
            throw new Error(msg);
        }

        return await res.json();
    } catch (err) {
        console.error("Error scanning book with AI:", err);
        throw err;
    }
};

/**
 * Fetch AI Book X-Ray (reading metrics, key takeaways, voice teaser script).
 * @param {string} bookId
 * @returns {Promise<{success: boolean, xray: {readingLevel: string, readingTime: string, targetAudience: string, keyTakeaways: string[], moodTags: string[], audioScript: string}}>}
 */
export const getBookXRay = async (bookId) => {
    try {
        const res = await fetch(`${baseUrl}/api/ai/book-xray/${bookId}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Server returned ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("Error fetching book X-Ray:", err);
        throw err;
    }
};

/**
 * Ask a book-specific question via AI.
 * @param {string} bookId
 * @param {string} question
 * @returns {Promise<{success: boolean, answer: string}>}
 */
export const askBookQA = async (bookId, question) => {
    try {
        const res = await fetch(`${baseUrl}/api/ai/book-qa/${bookId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Server returned ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("Error asking book QA:", err);
        throw err;
    }
};

/**
 * Fetch all detected order anomalies for Admin.
 * @param {string} token - JWT bearer token
 * @returns {Promise<{success: boolean, summary: object, anomalies: Array}>}
 */
export const getAdminAnomalies = async (token) => {
    try {
        const res = await fetch(`${baseUrl}/api/admin/anomalies`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Server returned ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("Error fetching anomalies:", err);
        throw err;
    }
};

/**
 * Review an order anomaly without auto-banning.
 * @param {string} token
 * @param {string} userId
 * @param {string} reviewStatus - "Reviewed" | "Pending Review"
 * @param {string} adminNote
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const reviewAnomaly = async (token, userId, reviewStatus = "Reviewed", adminNote = "") => {
    try {
        const res = await fetch(`${baseUrl}/api/admin/anomalies/review/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reviewStatus, adminNote }),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Server returned ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("Error reviewing anomaly:", err);
        throw err;
    }
};

/**
 * Seed demo anomalies for presentation and testing.
 * @param {string} token
 */
export const seedDemoAnomalies = async (token) => {
    try {
        const res = await fetch(`${baseUrl}/api/admin/anomalies/seed-demo`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to seed demo data");
        return await res.json();
    } catch (err) {
        console.error("Error seeding demo anomalies:", err);
        throw err;
    }
};

/**
 * Clear demo anomalies from database.
 * @param {string} token
 */
export const clearDemoAnomalies = async (token) => {
    try {
        const res = await fetch(`${baseUrl}/api/admin/anomalies/seed-demo`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to clear demo data");
        return await res.json();
    } catch (err) {
        console.error("Error clearing demo anomalies:", err);
        throw err;
    }
};

/**
 * Check a user's daily order limit.
 * @param {string} userId
 * @returns {Promise<{ordersToday: number, maxLimit: number, canOrder: boolean, remaining: number}>}
 */
export const checkDailyOrderLimit = async (userId) => {
    try {
        const res = await fetch(`${baseUrl}/api/orders/daily-limit-check/${userId}`, {
            cache: "no-store",
        });
        if (!res.ok) return { ordersToday: 0, maxLimit: 2, canOrder: true, remaining: 2 };
        return await res.json();
    } catch (err) {
        console.warn("Error checking daily limit:", err);
        return { ordersToday: 0, maxLimit: 2, canOrder: true, remaining: 2 };
    }
};

/**
 * Cancel a pending order/delivery.
 * @param {string} deliveryId
 * @param {string} token
 * @param {string} reason
 */
export const cancelOrder = async (deliveryId, token, reason = "Cancelled by user") => {
    try {
        const res = await fetch(`${baseUrl}/api/deliveries/${deliveryId}/cancel`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reason }),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Server returned ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("Error cancelling order:", err);
        throw err;
    }
};

/**
 * Record a failed or cancelled payment attempt.
 */
export const recordFailedPayment = async (data) => {
    try {
        const res = await fetch(`${baseUrl}/api/payments/record-failed`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch (err) {
        console.warn("Failed to record payment cancellation:", err);
    }
};


