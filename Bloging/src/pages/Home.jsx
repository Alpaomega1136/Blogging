// src/pages/Home.jsx
import PostCard from "../components/PostCard";

export default function Home({ posts, currentPage, totalPages, onPageChange }) {
  if (posts.length === 0) {
    return (
      <p className="empty-state">
        No posts yet. Click "New Post" to add one.
      </p>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="home">
      <h3 className="home-title">Latest Posts</h3>

      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Post pages">
          <button
            type="button"
            className="page-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <div className="page-numbers">
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                className={`page-btn ${page === currentPage ? "active" : ""}`}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="page-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
