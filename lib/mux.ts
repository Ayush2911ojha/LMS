export async function deleteMuxAsset(assetId: string) {
  const muxTokenId = process.env.MUX_TOKEN_ID!;
  const muxTokenSecret = process.env.MUX_TOKEN_SECRET!;

  try {
    const response = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${muxTokenId}:${muxTokenSecret}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json(); // Capture error details if deletion fails
      throw new Error(`Failed to delete asset with ID: ${assetId}, Status: ${response.status}, Details: ${JSON.stringify(errorDetails)}`);
    }

    console.log(`Asset with ID ${assetId} deleted successfully.`);

    // Check if the response has content before trying to parse it as JSON
    const text = await response.text(); // Read response as plain text
    return text ? JSON.parse(text) : {}; // If there's no response body, return an empty object
  } catch (error) {
    console.error(`Error deleting Mux asset:`, error);
    throw error; // Rethrow to let the caller handle the error
  }
}
