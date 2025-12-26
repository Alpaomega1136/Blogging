// src/components/PostCard.jsx
export default function PostCard({ post }) {
  const hasTags = post.tags?.length > 0;
  const hasLink = Boolean(post.link);
  const maxWords = 40;
  const content = post.content ?? "";
  const words = content.trim().split(/\s+/).filter(Boolean);
  const excerpt =
    words.length > maxWords
      ? `${words.slice(0, maxWords).join(" ")}...`
      : content;

  return (
    <article className="post-card">
      <h2 className="post-title">{post.title}</h2>

      <div className="post-meta">
        <span className="post-author">Author: {post.author}</span>
        <span className="post-date">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="post-body">
        <p className="post-excerpt">{excerpt}</p>
      </div>

      {(hasTags || hasLink) && (
        <div className="post-footer">
          {hasTags && (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {hasLink && (
            <a
              className="post-action"
              href={post.link}
              target="_blank"
              rel="noreferrer"
            >
              {post.linkLabel || "Lihat Detail"}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
