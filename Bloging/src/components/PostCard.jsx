// src/components/PostCard.jsx
export default function PostCard({ post }) {
  const excerpt =
    post.content.length > 120
      ? post.content.slice(0, 120) + "..."
      : post.content;

  return (
    <article className="post-card">
      <h2 className="post-title">{post.title}</h2>

      <div className="post-meta">
        <span className="post-author">{post.author}</span>
        <span className="post-date">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="post-excerpt">{excerpt}</p>

      {post.tags?.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
