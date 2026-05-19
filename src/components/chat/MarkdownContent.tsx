import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/shared/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  /** "chat" (compact, texte small) | "document" (tailles réelles, rendu document) */
  variant?: "chat" | "document";
}

export function MarkdownContent({ content, className, variant = "chat" }: MarkdownContentProps) {
  const isDoc = variant === "document";

  return (
    <div className={cn("break-words", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={cn(
              "font-bold mb-3 mt-5 first:mt-0 pb-1 border-b border-border",
              isDoc ? "text-2xl" : "text-base mt-3"
            )}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className={cn(
              "font-bold mb-2 mt-4 first:mt-0",
              isDoc ? "text-xl" : "text-sm mt-3"
            )}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className={cn(
              "font-semibold mb-1.5 mt-3 first:mt-0",
              isDoc ? "text-lg" : "text-sm mt-2"
            )}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className={cn(
              "font-semibold mb-1 mt-2 first:mt-0",
              isDoc ? "text-base" : "text-sm"
            )}>{children}</h4>
          ),
          p: ({ children }) => (
            <p className={cn(
              "mb-2 last:mb-0 leading-relaxed",
              isDoc ? "text-base" : "text-sm"
            )}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul className={cn(
              "mb-3 ml-5 list-disc space-y-1",
              isDoc ? "text-base" : "ml-4 text-sm"
            )}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className={cn(
              "mb-3 ml-5 list-decimal space-y-1",
              isDoc ? "text-base" : "ml-4 text-sm"
            )}>{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          code: ({ children, className: codeClass }) => {
            const isBlock = codeClass?.includes("language-");
            if (isBlock) {
              return (
                <code className={cn(
                  "block rounded-lg bg-muted p-3 font-mono leading-relaxed overflow-x-auto",
                  isDoc ? "text-sm" : "text-xs"
                )}>
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-lg bg-muted p-3">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className={cn(
              "mb-3 border-l-4 border-primary/40 pl-4 italic text-muted-foreground",
              isDoc ? "text-base" : "text-sm pl-3"
            )}>
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className={cn("border-border", isDoc ? "my-6" : "my-3")} />,

          // Tableaux — rendu complet avec styles document
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-lg border border-border">
              <table className="min-w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/60">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/20 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className={cn(
              "border-b border-border px-3 py-2 text-left font-semibold text-foreground",
              isDoc ? "text-sm" : "text-xs"
            )}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={cn(
              "px-3 py-2 border-r border-border last:border-r-0",
              isDoc ? "text-sm" : "text-xs"
            )}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
