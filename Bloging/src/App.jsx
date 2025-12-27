// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  GlobalStyles,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState("");
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [draft, setDraft] = useState({
    title: "",
    author: "",
    content: "",
    attachments: [],
  });
  const [fileInputKey, setFileInputKey] = useState(0);
  const [formError, setFormError] = useState("");

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
    const controller = new AbortController();

    const loadPosts = async () => {
      try {
        setIsLoadingPosts(true);
        setPostsError("");
        const response = await fetch(`${API_BASE_URL}/posts`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Gagal memuat data post.");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setPostsError(error.message || "Gagal memuat data post.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingPosts(false);
        }
      }
    };

    loadPosts();

    return () => {
      controller.abort();
    };
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
          primary: {
            main: "#2fb4e6",
            contrastText: "#06233a",
          },
          secondary: {
            main: isDark ? "#1f2a3d" : "#7e95bf",
          },
          text: {
            primary: isDark ? "#e3e9f4" : "#0d1b3b",
            secondary: isDark ? "#b8c5d8" : "#27406a",
          },
          background: {
            default: isDark ? "#0b111c" : "#bde6f7",
            paper: isDark ? "#0f1626" : "#ffffff",
          },
        },
        typography: {
          fontFamily: '"Nunito Sans", "Segoe UI", sans-serif',
          h5: {
            fontFamily: '"Fraunces", "Times New Roman", serif',
            fontWeight: 800,
          },
          h4: {
            fontFamily: '"Fraunces", "Times New Roman", serif',
            fontWeight: 800,
          },
        },
      }),
    [isDark]
  );

  const homeElement = (
    <Home
      posts={pagedPosts}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      isLoading={isLoadingPosts}
      error={postsError}
    />
  );

  const handleSubmitSearch = (event) => {
    event.preventDefault();
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const getAttachmentKey = (file) =>
    `${file.name}-${file.size}-${file.lastModified}`;

  const handleAttachmentChange = (event) => {
    const incoming = Array.from(event.target.files || []);
    if (incoming.length === 0) {
      return;
    }

    const merged = [...draft.attachments, ...incoming];
    const limited = merged.slice(0, 5);

    if (merged.length > 5) {
      setFormError("Maksimal 5 attachment. Hanya 5 pertama yang dipakai.");
    } else {
      setFormError("");
    }

    setDraft((prev) => ({ ...prev, attachments: limited }));
    setFileInputKey((prev) => prev + 1);
  };

  const handleRemoveAttachment = (targetKey) => {
    setDraft((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (file) => getAttachmentKey(file) !== targetKey
      ),
    }));
    setFormError((prev) =>
      prev.startsWith("Maksimal 5 attachment") ? "" : prev
    );
  };

  const handleSubmitDraft = (event) => {
    event.preventDefault();
    const title = draft.title.trim();
    const author = draft.author.trim();
    const content = draft.content.trim();

    if (!title || !author || !content) {
      setFormError("Judul, author, dan konten wajib diisi.");
      return;
    }

    if (draft.attachments.length > 5) {
      setFormError("Maksimal 5 attachment.");
      return;
    }

    setFormError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("content", content);
    draft.attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const message = await response.json().catch(() => null);
          throw new Error(message?.message || "Gagal menyimpan post.");
        }
        return response.json();
      })
      .then((savedPost) => {
        const newPost = { ...savedPost, tags: [] };
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setCurrentPage(1);
        setDraft({ title: "", author: "", content: "", attachments: [] });
        setFileInputKey((prev) => prev + 1);
        setIsModalOpen(false);
      })
      .catch((error) => {
        setFormError(error.message || "Gagal menyimpan post.");
      });
  };

  const lightBackground =
    "radial-gradient(circle at 15% 10%, rgba(255, 255, 255, 0.35), transparent 45%),\n" +
    "radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.28), transparent 50%),\n" +
    "linear-gradient(180deg, #bde6f7 0%, #97cdeb 100%)";
  const darkBackground =
    "radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.04), transparent 45%),\n" +
    "radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.03), transparent 55%),\n" +
    "linear-gradient(180deg, #070b13 0%, #0b121f 100%)";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            background: isDark ? darkBackground : lightBackground,
            minHeight: "100vh",
          },
          "#root": {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          },
          a: {
            color: "inherit",
          },
        }}
      />

      <Navbar
        query={query}
        onQueryChange={handleQueryChange}
        onSubmitSearch={handleSubmitSearch}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        isDark={isDark}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: "form",
          onSubmit: handleSubmitDraft,
          sx: {
            borderRadius: 4,
            backgroundColor: isDark ? "#0f1626" : "#f2f6ff",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(12px)",
            backgroundColor: isDark
              ? "rgba(2, 4, 8, 0.75)"
              : "rgba(7, 12, 24, 0.35)",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Fraunces", "Times New Roman", serif' }}>
          Buat Post Baru
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Judul"
              value={draft.title}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, title: event.target.value }))
              }
              required
              fullWidth
            />
            <TextField
              label="Author"
              value={draft.author}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, author: event.target.value }))
              }
              required
              fullWidth
            />
            <TextField
              label="Konten"
              value={draft.content}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, content: event.target.value }))
              }
              required
              fullWidth
              multiline
              minRows={5}
            />
            <Stack spacing={1}>
              <Button variant="outlined" component="label">
                Attachment (maks 5 file)
                <input
                  key={fileInputKey}
                  type="file"
                  hidden
                  multiple
                  onChange={handleAttachmentChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Opsional: pilih hingga 5 file.
              </Typography>
              {draft.attachments.length > 0 && (
                <Stack spacing={0.5}>
                  {draft.attachments.map((file) => {
                    const key = getAttachmentKey(file);
                    return (
                      <Stack
                        key={key}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {file.name}
                        </Typography>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleRemoveAttachment(key)}
                        >
                          Hapus
                        </Button>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Stack>
          {formError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {formError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsModalOpen(false)}>Batal</Button>
          <Button variant="contained" type="submit">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        component="main"
        sx={(currentTheme) => ({
          flex: 1,
          py: { xs: 3, md: 4 },
          backgroundColor:
            currentTheme.palette.mode === "dark" ? "#0b111c" : "transparent",
        })}
      >
        <Routes>
          <Route path="/" element={homeElement} />
          <Route
            path="/posts/:id"
            element={
              <PostDetail
                posts={posts}
                isLoading={isLoadingPosts}
                error={postsError}
              />
            }
          />
          <Route path="*" element={homeElement} />
        </Routes>
      </Box>

      <Box sx={{ py: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          <Link to="/">Blogging.</Link>
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
