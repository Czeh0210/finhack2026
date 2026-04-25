/**
 * Transaction Service
 * 
 * Handles communication with the AWS Lambda fraud risk evaluation backend.
 * Used when a transfer amount exceeds the user's configured safety limit.
 */

/**
 * Starts a transaction and triggers fraud risk evaluation.
 *
 * @param {Object} params
 * @param {string} params.userId   - The user initiating the transaction
 * @param {number} params.amount   - The transfer amount in RM
 * @param {string} params.recipient - Phone number or account ID of the recipient
 * @returns {Promise<{ txId: string, status: "SAFE" | "PENDING", score1: number }>}
 * @throws {Error} If the request fails or the response is not OK
 */
export async function startTransaction({ userId, amount, recipient }) {
  // Routed through Next.js API proxy to avoid CORS
  const endpoint = "/api/transaction/start";

  console.log("[TransactionService] Starting transaction:", {
    userId,
    amount,
    recipient,
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, recipient }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "[TransactionService] API error:",
        response.status,
        errorBody
      );
      throw new Error(
        `Transaction API returned ${response.status}: ${errorBody}`
      );
    }

    const data = await response.json();

    console.log("[TransactionService] Response received:", data);

    return data;
  } catch (error) {
    console.error("[TransactionService] Request failed:", error.message);
    throw error;
  }
}
