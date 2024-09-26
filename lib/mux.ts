export async function deleteMuxAsset(assetId: string) {
    const muxTokenId = process.env.MUX_TOKEN_ID!;
    const muxTokenSecret = process.env.MUX_TOKEN_SECRET!;
  
    const response = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${muxTokenId}:${muxTokenSecret}`).toString('base64')}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to delete asset with ID: ${assetId}`);
    }
  
    return response.json(); // Optionally return a response
  }
  