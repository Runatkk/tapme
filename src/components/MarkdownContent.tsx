import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ body }: { body: string }) {
  return (
    <div className="prose prose-neutral max-w-none prose-img:rounded-lg">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
