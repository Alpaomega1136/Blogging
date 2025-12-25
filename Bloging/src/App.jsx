// src/App.jsx
import { useState } from "react";
import { initialPosts } from "./data/posts";
import Home from "./pages/Home";

export default function App() {
  // state posts
  const [posts] = useState(initialPosts);

  // state search
  const [query, setQuery] = useState("");

  // handler search (sementara hanya filter client-side)
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", query);
  };

  // filter posts berdasarkan query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <nav className="navbar">
        <div className="homebutton">
          <a href="/">Blogging.</a>
        </div>

        <form className="search-container" onSubmit={handleSubmitSearch}>
          <input
            type="search"
            className="search-input"
            placeholder="Cari blog..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <i className="fas fa-search" />
          </button>
        </form>

        <ul className="nav-links">
          <li>
            <a href="/new">New Post</a>
          </li>
        </ul>
      </nav>

      <main>
        <Home posts={filteredPosts} />
      </main>
    </>
  );
}
