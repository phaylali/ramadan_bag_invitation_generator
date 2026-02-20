import reshapeArabic from 'arabic-reshaper';

const testText = "المملكة المغربية";

// 1. Reshape only
const reshaped = reshapeArabic.convertArabic(testText);
console.log("Reshaped Only:", reshaped);
console.log("Reshaped Hex:", reshaped.split('').map((c: string) => c.charCodeAt(0).toString(16)).join(' '));

// 2. Reshape + Simple Reverse
const reversed = reshaped.split('').reverse().join('');
console.log("Reshaped + Simple Reverse:", reversed);
console.log("Reversed Hex:", reversed.split('').map((c: string) => c.charCodeAt(0).toString(16)).join(' '));
