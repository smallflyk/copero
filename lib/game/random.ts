export function hashSeed(seed: string): number { let hash=2166136261; for (const char of seed) hash=Math.imul(hash ^ char.charCodeAt(0),16777619); return hash >>> 0 || 1 }
export function generator(seed: number) { let cursor=seed; return { next: () => { cursor ^= cursor << 13; cursor ^= cursor >>> 17; cursor ^= cursor << 5; cursor >>>=0; return cursor/4294967296 }, state: () => cursor } }
