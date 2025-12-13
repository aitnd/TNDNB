/**
 * Resolves an input to an email address.
 * If input contains '@', assumes it's an email.
 * If not, appends '@gmail.com' to create an ID-based email.
 */
export const resolveEmailFromUsername = async (input: string): Promise<string> => {
    const trimmedInput = input.trim();
    if (trimmedInput.includes('@')) {
        return trimmedInput;
    }

    // Simple rule: If no '@', assume it's a Gmail ID
    return `${trimmedInput}@gmail.com`;
};
