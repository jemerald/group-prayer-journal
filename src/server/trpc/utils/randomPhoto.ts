import { env } from "../../../env/server.mjs";

export async function getRandomPhotoUrl(
  topic = "nature"
): Promise<string | null> {
  const accessKey = env.UNSPLASH_ACCESS_KEY;
  if (accessKey) {
    const resp = await fetch(
      `https://api.unsplash.com/photos/random?topic=${topic}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );
    if (resp.ok) {
      const data = await resp.json();
      return data.urls.regular;
    }
  }
  return null;
}
