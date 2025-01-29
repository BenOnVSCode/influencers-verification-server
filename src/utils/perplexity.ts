export function extractClaims(response: string): string[] {
    // Find the array start
    const arrayStartIndex = response.indexOf("[");
    const arrayEndIndex = response.lastIndexOf("]");
    
    if (arrayStartIndex === -1 || arrayEndIndex === -1) {
        throw new Error("Invalid format: No array found in response.");
    }

    // Extract and clean the array content
    const arrayContent = response
        .slice(arrayStartIndex + 1, arrayEndIndex) // Get content inside [ ]
        .trim();

    if (!arrayContent) return []; // Return empty array if no content

    // Split claims by commas and clean each claim
    return arrayContent
        .split("|") // Split by comma
        .map(claim => claim.trim()) // Remove extra spaces
        .filter(claim => claim); // Remove empty claims
}
export function parseClaims(data) {
    // Define a function to safely parse the claims from the input string
    const claims = [];
    const claimRegex = /{([^{}]+)}/g;  // Matches JSON-like structure within curly braces
    
    // Find all claims in the input data using regex
    let match;
    while (match = claimRegex.exec(data)) {
        try {
            // Attempt to parse each claim's JSON object
            const claim = JSON.parse(`{${match[1]}}`);
            
            // Ensure the required fields are present and formatted correctly
            if (claim.claim_text && claim.category && claim.confidence_score !== undefined) {
                claims.push(claim);  // Add the claim to the results if valid
            } else {
                console.error("Missing required fields in claim: ", match[1]);
            }
        } catch (error) {
            // If parsing fails, log the error and continue to the next claim
            console.error("Error parsing claim:", error);
        }
    }

    return claims;
}
