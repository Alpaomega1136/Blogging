// src/components/PostCard.jsx
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const hasTags = post.tags?.length > 0;
  const detailPath = `/posts/${post.id}`;
  const actionLabel = post.linkLabel || "Baca Selengkapnya";
  const maxWords = 40;
  const content = post.content ?? "";
  const words = content.trim().split(/\s+/).filter(Boolean);
  const excerpt =
    words.length > maxWords
      ? `${words.slice(0, maxWords).join(" ")}...`
      : content;

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: "32px",
        padding: { xs: "24px", md: "32px" },
        backgroundColor: theme.palette.mode === "dark" ? "#1f2a3d" : "#7e95bf",
        boxShadow: theme.shadows[6],
        color:
          theme.palette.mode === "dark"
            ? "rgba(225, 233, 245, 0.92)"
            : "rgba(248, 251, 255, 0.95)",
        "&::after": {
          content: '""',
          position: "absolute",
          left: "-12%",
          right: "-12%",
          bottom: "-12%",
          height: "clamp(90px, 26%, 140px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(16, 28, 70, 0.18)",
          transform: "rotate(-2deg)",
        },
      })}
    >
      <Stack spacing={1} sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Fraunces", "Times New Roman", serif',
            color: (theme) =>
              theme.palette.mode === "dark" ? "#eef2f8" : "#f5f7ff",
          }}
        >
          {post.title}
        </Typography>

        <Stack spacing={0.5} sx={{ fontSize: "0.9rem" }}>
          <Typography variant="body2">Author: {post.author}</Typography>
          <Typography variant="body2">
            {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>

        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(20, 32, 72, 0.35)",
            borderRadius: "18px",
            padding: "16px",
            boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.12)",
          })}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
            {excerpt}
          </Typography>
        </Box>

        {(hasTags || post.id) && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            {hasTags && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    size="small"
                    label={`#${tag}`}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#f8fbff",
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
            )}

            <Button
              component={Link}
              to={detailPath}
              variant="contained"
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 700,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#f8fbff",
                boxShadow: "0 8px 14px rgba(12, 26, 66, 0.18)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.32)",
                },
              }}
            >
              {actionLabel}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
