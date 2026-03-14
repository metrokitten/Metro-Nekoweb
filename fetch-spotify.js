import { promises as fs } from "node:fs";
import fetch from "node-fetch";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

async function refreshSpotifyToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  return await response.json();
}

async function fetchNowPlaying(token) {
  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.status === 200 ? await response.json() : null;
}

// --- Top-level await ---
const tokenData = await refreshSpotifyToken();
const trackData = await fetchNowPlaying(tokenData.access_token);

const nowPlaying = trackData?.item
  ? {
      isPlaying: true,
      song: trackData.item.name,
      artist: trackData.item.artists.map(a => a.name).join(", "),
      albumArt: trackData.item.album.images[0]?.url || null,
      spotifyUrl: trackData.item.external_urls.spotify || null,
    }
  : { isPlaying: false };

await fs.writeFile("data/now-playing.json", JSON.stringify(nowPlaying, null, 2));