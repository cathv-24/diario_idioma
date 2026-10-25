import illustrations from "../assets/journal-illustrations.webp";

/** Six illustrated scenes prepared from the user's reference; one cached sprite. */
export default function JournalArt({ scene }: { scene: "write" | "learn" | "remember" }) {
  return <span className={`journal-art art-${scene}`} style={{ backgroundImage: `url(${illustrations})` }} aria-hidden="true" />;
}
