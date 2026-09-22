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

