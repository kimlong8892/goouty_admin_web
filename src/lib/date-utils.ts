/**
 * Format a date to a consistent string format (YYYY-MM-DD)
 * This ensures server and client render the same output, avoiding hydration errors
 */
export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return "N/A";

    const d = typeof date === "string" ? new Date(date) : date;

    // Return ISO date format (YYYY-MM-DD) which is consistent across server/client
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Format a date to a more readable format (e.g., "Jan 10, 2026")
 * Uses a consistent format to avoid hydration errors
 */
export function formatDateReadable(date: Date | string | null | undefined): string {
    if (!date) return "N/A";

    const d = typeof date === "string" ? new Date(date) : date;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    return `${month} ${day}, ${year}`;
}
