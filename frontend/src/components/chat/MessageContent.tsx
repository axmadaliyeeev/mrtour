import { Fragment } from "react";

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

/**
 * Renders AI replies: **bold** becomes real emphasis, bare URLs become
 * clickable links, everything else stays exactly as the model wrote it
 * (line breaks, box-drawing characters, emoji headers from the tour-plan
 * format) — no full markdown engine, just the two things model output
 * actually uses.
 */
export function MessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const segments = line.split(BOLD_RE);
        return (
          <span key={i} className="block">
            {segments.map((seg, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-bold">
                  {linkify(seg, `${i}-${j}`)}
                </strong>
              ) : (
                <Fragment key={j}>{linkify(seg, `${i}-${j}`)}</Fragment>
              )
            )}
            {line === "" && " "}
          </span>
        );
      })}
    </>
  );
}
