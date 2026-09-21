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
