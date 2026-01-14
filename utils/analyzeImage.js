export async function analyzeImage(base64) {
  const response = await fetch(
    "https://reality-check-backend.vercel.app/api/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${base64}`, // IMPORTANT FIX
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Backend error");
  }

  const data = await response.json();
  return data;
}

