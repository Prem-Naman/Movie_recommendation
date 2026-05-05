const API_BASE = "https://emocine-backend-370437339760.us-central1.run.app";

export async function detectEmotion(imageBase64: string) {
  try {
    const res = await fetch(`${API_BASE}/detect-emotion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64 }),
    });
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Emotion detection failed:", error);
    return null;
  }
}

export async function getRecommendations(emotion: string) {
  try {
    const res = await fetch(`${API_BASE}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emotion }),
    });
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Recommendations fetch failed:", error);
    return [];
  }
}
