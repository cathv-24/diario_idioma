export function speechWords(text: string) {
  return text.toLowerCase().replace(/[’]/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) || [];
}

// Sequence alignment avoids treating every later word as wrong after one omission.
export function compareSpeech(expected: string, heard: string) {
  const a = speechWords(expected), b = speechWords(heard);
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      table[i][j] = a[i] === b[j] ? 1 + table[i + 1][j + 1] : Math.max(table[i + 1][j], table[i][j + 1]);
  const missing: string[] = [], extra: string[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; }
    else if (table[i + 1][j] >= table[i][j + 1]) missing.push(a[i++]);
    else extra.push(b[j++]);
  }
  return { missing: [...missing, ...a.slice(i)], extra: [...extra, ...b.slice(j)] };
}

export function speak(text: string, onError: (message: string) => void) {
  if (!("speechSynthesis" in window)) { onError("Este navegador no puede leer el ejemplo en voz alta."); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.85;
  const voice = speechSynthesis.getVoices().find(v => v.lang === "en-GB");
  if (voice) utterance.voice = voice;
  utterance.onerror = event => { if (event.error !== "interrupted" && event.error !== "canceled") onError("No pudimos reproducir la voz. Prueba de nuevo."); };
  speechSynthesis.speak(utterance);
}
