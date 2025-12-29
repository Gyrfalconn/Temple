import Sanscript from 'sanscript';

/**
 * Post-processing step to align ITRANS conjunct output with Telugu orthographic norms.
 * Telugu readers prefer anusvāra (ం) over explicit nasal conjuncts in names.
 */
const fixTeluguNasalClusters = (telugu: string): string => {
  return telugu
    .replace(/న్గ/g, "ంగ")
    .replace(/న్ద/g, "ంద")
    .replace(/న్క/g, "ంక")
    .replace(/న్త/g, "ంత")
    // Adding retroflex variants commonly found in names like Konda
    .replace(/న్డ/g, "ండ")
    .replace(/న్ట/g, "ంట");
};

/**
 * Stage 1: Basic Normalization
 * Aligns common phonetic English inputs with standard ITRANS markers.
 */
export const basicNormalize = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\bram\b/g, "raam")
    .replace(/kou/g, "kau")
    .replace(/co/g, "ko")
    .replace(/sri/g, "shrii");
};

/**
 * Core transliteration function for a single word.
 * Converts letters to Telugu and preserves trailing digits.
 */
export function transliterateWord(word: string): string {
  // Allow letters followed by optional numbers (e.g., nandini45)
  const match = word.match(/^([a-zA-Z]+)(\d*)$/);
  if (!match) return word;

  const [, letters, digits] = match;
  const normalized = basicNormalize(letters);
  
  // Transliterate to Telugu script
  let telugu = Sanscript.t(normalized, "itrans", "telugu");

  // Apply the critical post-processing fix for Telugu nasal clusters
  telugu = fixTeluguNasalClusters(telugu);

  return telugu + digits;
}

/**
 * Helper to transliterate only the last word of a string at a boundary (Space/Blur).
 */
export function transliterateLastWord(value: string): string {
  if (!value) return "";
  
  // Split by whitespace but preserve the separators
  const parts = value.split(/(\s+)/);
  const lastIndex = parts.length - 1;

  const word = parts[lastIndex];
  // Only attempt conversion if the part contains English letters
  if (!/[a-zA-Z]/.test(word)) return value;

  parts[lastIndex] = transliterateWord(word);
  return parts.join("");
}

/**
 * Back-conversion for display in English mode if needed.
 */
export const toEnglishPhonetic = (input: string): string => {
  if (!input) return '';
  return Sanscript.t(input, 'telugu', 'itrans');
};

/**
 * Script detection helpers
 */
export const hasEnglishLetters = (text: string): boolean => /[a-zA-Z]/.test(text);
export const hasTeluguLetters = (text: string): boolean => /[\u0C00-\u0C7F]/.test(text);

/**
 * Formatter for displaying data based on the current UI language.
 */
export const formatForMode = (text: string, mode: 'en' | 'te'): string => {
  if (!text) return '';

  if (text.includes(' / ')) {
    const parts = text.split(' / ');
    return mode === 'en' ? parts[0] : parts[1];
  }

  if (mode === 'te') {
    if (hasEnglishLetters(text)) {
      const parts = text.split(/(\s+)/);
      return parts.map(p => {
        if (/[a-zA-Z]/.test(p)) return transliterateWord(p);
        return p;
      }).join('');
    }
    return text;
  } else {
    if (hasTeluguLetters(text)) return toEnglishPhonetic(text);
    return text;
  }
};