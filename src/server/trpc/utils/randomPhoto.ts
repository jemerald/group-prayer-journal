import { env } from "../../../env/server.mjs";

export async function getRandomPhoto(
  topic = "nature"
): Promise<{ url: string; color: string; blurHash: string } | null> {
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
      return {
        url: data.urls.regular,
        color: data.color,
        blurHash: data.blur_hash,
      };
    }
  }
  return null;
}
