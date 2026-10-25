import type { Entry } from "../lib/types";
import { correctionRanges } from "../lib/correction-ranges";
export default function InlineCorrections({
  entry,
  original,
  active,
  onSelect,
}: {
  entry: Entry;
  original: boolean;
  active: number | null;
  onSelect: (index: number) => void;
}) {
  const ranges = correctionRanges(entry.textoOriginal, entry.correcciones);
  let cursor = 0;
  const parts: { text: string; index?: number }[] = [];
  for (const range of ranges) {
    parts.push({ text: entry.textoOriginal.slice(cursor, range.start) });
    parts.push({
      text: original
        ? entry.textoOriginal.slice(range.start, range.end)
        : range.replacement,
      index: range.index,
    });
    cursor = range.end;
  }
  parts.push({ text: entry.textoOriginal.slice(cursor) });
  // Dependencias entre reglas o correcciones históricas pueden no tener una posición inequívoca.
  // En ese caso conservamos el texto real, sin resaltar una palabra equivocada.
  if (
    !original &&
    parts.map((part) => part.text).join("") !== entry.textoCorregido
  )
    return (
      <p className="result-text" lang="en">
        {entry.textoCorregido}
      </p>
    );
  return (
    <div>
      <p className="result-text" lang="en">
        {parts.map((part, i) =>
          part.index === undefined ? (
            part.text
          ) : (
            <button
              type="button"
              key={i}
              className="inline-change"
              aria-pressed={active === part.index}
              aria-label={`Ver explicación de ${part.text}`}
              onClick={() => onSelect(part.index!)}
            >
              {part.text}
            </button>
          ),
        )}
      </p>
      {ranges.length > 0 && (
        <p className="inline-hint">
          Selecciona una palabra resaltada para entender el cambio.
        </p>
      )}
    </div>
  );
}
