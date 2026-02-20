import reshapeArabic from 'arabic-reshaper';
import bidiFactory from 'bidi-js';

const bidi = bidiFactory();

const testText = "المملكة المغربية";
const reshaped = reshapeArabic.convertArabic(testText);

const embeddingLevels = bidi.getEmbeddingLevels(reshaped);
const flips = bidi.getReorderSegments(reshaped, embeddingLevels);
const chars = reshaped.split('');

flips.forEach(([start, end]) => {
    const sub = chars.slice(start, end + 1).reverse();
    chars.splice(start, sub.length, ...sub);
});

const mirrored = bidi.getMirroredCharactersMap(reshaped, embeddingLevels);
mirrored.forEach((char, index) => {
    chars[index] = char;
});

const reordered = chars.join('');

console.log("Original: ", testText);
console.log("Reshaped: ", reshaped);
console.log("Reordered: ", reordered);

// Check character by character
console.log("Original Chars: ", testText.split('').map((c: string) => c.charCodeAt(0).toString(16)).join(' '));
console.log("Reordered Chars: ", reordered.split('').map((c: string) => c.charCodeAt(0).toString(16)).join(' '));
