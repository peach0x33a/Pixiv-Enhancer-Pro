/**
 * 从 URL 中获取 artid
 * @returns artid or null
 */
function getArtId(): number {
  const match = window.location.href.match(/artworks\/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

export const currentArtId = getArtId();