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
import { initialPosts } from "./data/posts";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
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
    />
  );

  const handleSubmitSearch = (event) => {
    event.preventDefault();
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSubmitDraft = (event) => {
    event.preventDefault();
    const title = draft.title.trim();
    const author = draft.author.trim();
    const content = draft.content.trim();

    if (!title || !author || !content) {
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      title,
      author,
      content,
      createdAt: new Date().toISOString().slice(0, 10),
      tags: [],
      attachment: draft.attachment ? draft.attachment.name : null,
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setCurrentPage(1);
    setDraft({ title: "", author: "", content: "", attachment: null });
    setFileInputKey((prev) => prev + 1);
    setIsModalOpen(false);
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
                Attachment
                <input
                  key={fileInputKey}
                  type="file"
                  hidden
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      attachment: event.target.files?.[0] ?? null,
                    }))
                  }
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Opsional: lampirkan file.
              </Typography>
              {draft.attachment && (
                <Typography variant="body2">
                  File: {draft.attachment.name}
                </Typography>
              )}
            </Stack>
          </Stack>
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
          <Route path="/posts/:id" element={<PostDetail posts={posts} />} />
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
