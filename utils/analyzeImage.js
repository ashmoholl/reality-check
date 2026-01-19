export async function analyzeImage(base64Image) {
  const response = await fetch(
    "https://reality-check-chi.vercel.app/api/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image, // already includes data:image/... prefix
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Backend error:", errorText);
    throw new Error("Backend error");
  }

  const data = await response.json();
  return data;
}

