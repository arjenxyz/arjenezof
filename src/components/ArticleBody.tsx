import { isCodeLikeContent } from "@/lib/nodes-shared";

type Props = {
  content: string;
  className?: string;
};

export function ArticleBody({ content, className = "" }: Props) {
  const technical = isCodeLikeContent(content);

  return (
    <article
      className={`prose-thought ${technical ? "prose-thought-code" : ""} ${className}`}
    >
      {content}
    </article>
  );
}
