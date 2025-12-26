// src/App.jsx
import { useEffect, useState } from "react";
import { initialPosts } from "./data/posts";
import Home from "./pages/Home";

export default function App() {
  // state posts
  const [posts] = useState(initialPosts);

  // state search
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [draft, setDraft] = useState({
    title: "",
    author: "",
    content: "",
    attachment: null,
  });
  const [fileInputKey, setFileInputKey] = useState(0);

  // handler search (sementara hanya filter client-side)
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", query);
  };

  // filter posts berdasarkan query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pagedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleSubmitDraft = (event) => {
    event.preventDefault();
    console.log("Draft post:", draft);
    setDraft({ title: "", author: "", content: "", attachment: null });
    setFileInputKey((prev) => prev + 1);
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="brand-group">
          <div className="homebutton">
            <a href="/">Blogging.</a>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setIsDark((prev) => !prev)}
            aria-pressed={isDark}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <form className="search-container" onSubmit={handleSubmitSearch}>
          <input
            type="search"
            className="search-input"
            placeholder="Cari blog..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </form>

        <ul className="nav-links">
          <li>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-expanded={isModalOpen}
              aria-controls="create-post-modal"
            >
              New Post
            </button>
          </li>
        </ul>
      </nav>

      <div
        className={`modal-overlay ${isModalOpen ? "open" : ""}`}
        onClick={() => setIsModalOpen(false)}
        aria-hidden={!isModalOpen}
      >
        <section
          id="create-post-modal"
          className={`modal ${isModalOpen ? "open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!isModalOpen}
          aria-labelledby="modal-title"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsModalOpen(false);
            }
          }}
        >
          <header className="modal-header">
            <h2 id="modal-title" className="modal-title">
              Buat Post Baru
            </h2>
            <button
              type="button"
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              X
            </button>
          </header>

          <form className="modal-form" onSubmit={handleSubmitDraft}>
            <label className="modal-field">
              <span>Judul</span>
              <input
                type="text"
                className="modal-input"
                placeholder="Masukkan judul post"
                value={draft.title}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, title: event.target.value }))
                }
                required
              />
            </label>

            <label className="modal-field">
              <span>Author</span>
              <input
                type="text"
                className="modal-input"
                placeholder="Nama penulis"
                value={draft.author}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, author: event.target.value }))
                }
                required
              />
            </label>

            <label className="modal-field">
              <span>Konten</span>
              <textarea
                className="modal-textarea"
                placeholder="Tulis isi post di sini"
                rows={6}
                value={draft.content}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, content: event.target.value }))
                }
                required
              />
            </label>

            <label className="modal-field">
              <span>Attachment</span>
              <input
                key={fileInputKey}
                type="file"
                className="modal-input"
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    attachment: event.target.files?.[0] ?? null,
                  }))
                }
              />
              <small className="modal-hint">Opsional: lampirkan file.</small>
              {draft.attachment && (
                <span className="modal-file">File: {draft.attachment.name}</span>
              )}
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </button>
              <button type="submit" className="modal-submit">
                Simpan
              </button>
            </div>
          </form>
        </section>
      </div>

      <main>
        <Home
          posts={pagedPosts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}
