export const isVersionLower = (v1: string, v2: string): boolean => {
  const parts1 = v1.replace(/^v/, '').trim().split('.').map(Number);
  const parts2 = v2.replace(/^v/, '').trim().split('.').map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 < p2) return true;
    if (p1 > p2) return false;
  }
  return false;
};

export const normalizeVersion = (v: string): string => {
  return v.replace(/^v/, '').trim();
};
