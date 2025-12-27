// src/pages/Home.jsx
import { Box, Container, Pagination, Stack, Typography } from "@mui/material";
import PostCard from "../components/PostCard";

export default function Home({
  posts,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  error,
}) {
  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography align="center" color="text.secondary">
          Loading posts...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography align="center" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (posts.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography
          align="center"
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(15, 22, 38, 0.9)"
                : "rgba(255, 255, 255, 0.7)",
            color: theme.palette.text.primary,
            borderRadius: 3,
            px: 3,
            py: 2,
            fontWeight: 600,
          })}
        >
          No posts yet. Click "New Post" to add one.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ maxWidth: "1100px" }}>
      <Typography
        variant="overline"
        sx={{
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        Latest Posts
      </Typography>

      <Stack spacing={3} sx={{ mt: 2 }}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Stack>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
}
