import { Fragment } from "react";
import { cn } from "@/lib/utils";

const URL_RE = /(https?:\/\/[^\s)]+)/g;
const BOLD_RE = /\*\*(.+?)\*\*/g;

function linkify(text: string, keyPrefix: string): React.ReactNode[] {
  // split() with a capturing group returns [text, match, text, match, ...] —
  // odd indices are always the captured URLs, so no need to re-test them
  // (re-testing a *global* regex via .test() would advance its lastIndex
  // and silently skip/misclassify later matches).
  const parts = text.split(URL_RE);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={`${keyPrefix}-url-${i}`}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-dotted underline-offset-2 text-indigo-500 dark:text-indigo-400 hover:text-indigo-400"
      >
        {part}
      </a>
    ) : (
      <Fragment key={`${keyPrefix}-txt-${i}`}>{part}</Fragment>
    )
  );
}

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const segments = text.split(BOLD_RE);
  return segments.map((seg, j) =>
    j % 2 === 1 ? (
      <strong key={`${keyPrefix}-b-${j}`} className="font-bold text-[var(--foreground)]">
        {linkify(seg, `${keyPrefix}-${j}`)}
      </strong>
    ) : (
      <Fragment key={`${keyPrefix}-t-${j}`}>{linkify(seg, `${keyPrefix}-${j}`)}</Fragment>
    )
  );
}

/**
 * A small, purpose-built markdown renderer for AI replies — not a full
 * CommonMark engine, just the subset the system prompt actually asks the
 * model to use: ##/### headings, **bold**, "- " bullet lists, bare URLs,
 * and blank-line paragraph breaks. Everything else is left as plain text.
 */
export function MessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  function flushList(key: string) {
    if (!listBuffer.length) return;
    blocks.push(
      <ul key={key} className="my-1.5 space-y-1 list-none">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-indigo-400 shrink-0 select-none">•</span>
            <span>{inline(item, `${key}-li-${i}`)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  lines.forEach((rawLine, i) => {
    const line = rawLine.trimEnd();
    const key = `b${i}`;
    const bullet = /^[•\-*]\s+(.*)/.exec(line);
    const h3 = /^###\s+(.*)/.exec(line);
    const h2 = /^##\s+(.*)/.exec(line);

    if (bullet) {
      listBuffer.push(bullet[1]);
      return;
    }
    flushList(`${key}-list`);

    if (h2 || h3) {
      const content = (h2 ?? h3)![1];
      blocks.push(
        <p
          key={key}
          className={cn(
            "font-display font-bold text-[var(--foreground)]",
            h2 ? "text-base mt-3 mb-1" : "text-sm mt-2.5 mb-1 text-indigo-400"
          )}
        >
          {inline(content, key)}
        </p>
      );
    } else if (line === "") {
      blocks.push(<div key={key} className="h-1.5" />);
    } else {
      blocks.push(
        <p key={key} className="leading-relaxed">
          {inline(line, key)}
        </p>
      );
    }
  });
  flushList("tail-list");

  return <>{blocks}</>;
}
