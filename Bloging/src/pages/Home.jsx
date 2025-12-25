// src/pages/Home.jsx
import PostCard from "../components/PostCard";

export default function Home({ posts }) {
  if (posts.length === 0) {
    return <p>No posts yet. Click “New Post” to add one.</p>;
  }

  return (
    <section className="home">
      <h3 className="home-title">Latest Posts</h3>

      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
