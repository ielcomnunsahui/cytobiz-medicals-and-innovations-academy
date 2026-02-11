import { useMemo } from "react";

interface LessonContentProps {
  content: string;
}

/**
 * Renders lesson markdown content, including embedded images.
 * Supports: ![lesson-image](url) and plain text paragraphs.
 */
export function LessonContent({ content }: LessonContentProps) {
  const elements = useMemo(() => {
    return content.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      // Match markdown image: ![alt](url)
      const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        return (
          <img
            key={i}
            src={imgMatch[2]}
            alt={imgMatch[1] || "Lesson image"}
            className="rounded-xl max-w-full h-auto my-4 border border-border shadow-sm"
            loading="lazy"
          />
        );
      }

      // Inline images within a paragraph
      const inlineImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      if (inlineImgRegex.test(trimmed)) {
        // Split into text and image parts
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let match;
        while ((match = regex.exec(trimmed)) !== null) {
          if (match.index > lastIndex) {
            parts.push(trimmed.slice(lastIndex, match.index));
          }
          parts.push(
            <img
              key={`${i}-${match.index}`}
              src={match[2]}
              alt={match[1] || "Lesson image"}
              className="inline-block rounded-lg max-w-full h-auto my-2 border border-border"
              loading="lazy"
            />
          );
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < trimmed.length) {
          parts.push(trimmed.slice(lastIndex));
        }
        return <div key={i}>{parts}</div>;
      }

      // Regular text paragraph
      return <p key={i}>{trimmed}</p>;
    });
  }, [content]);

  return (
    <div className="prose prose-lg max-w-none text-muted-foreground mb-8 space-y-1">
      {elements}
    </div>
  );
}
