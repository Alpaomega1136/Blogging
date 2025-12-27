// src/pages/PostDetail.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link as MuiLink,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const TrashIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9z" />
  </SvgIcon>
);

export default function PostDetail({ posts, isLoading, error, onDeletePost }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const post = posts.find((item) => item.id === id);

  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography align="center" color="text.secondary">
          Loading post...
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

  if (!post) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography align="center">
          Post not found. <RouterLink to="/">Go back</RouterLink>
        </Typography>
      </Container>
    );
  }

  const attachments = post.attachments || [];
  const resolveUrl = (url) =>
    url.startsWith("http") ? url : `${FILE_BASE_URL}${url}`;
  const isImageFile = (file) => {
    if (file?.mimeType) {
      return file.mimeType.startsWith("image/");
    }
    return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file?.originalName || "");
  };
  const canDelete = Boolean(onDeletePost && post);

  const openDeleteDialog = () => {
    if (!canDelete || isDeleting) {
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return;
    }
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!canDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await onDeletePost(post.id);
      setIsDeleteDialogOpen(false);
      navigate("/");
    } catch (deleteFailure) {
      setDeleteError(deleteFailure.message || "Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container sx={{ maxWidth: "980px" }}>
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? "#1f2a3d" : "#7e95bf",
          borderRadius: "32px",
          padding: { xs: "24px", md: "36px" },
          boxShadow: theme.shadows[6],
          color:
            theme.palette.mode === "dark"
              ? "rgba(225, 233, 245, 0.92)"
              : "rgba(248, 251, 255, 0.95)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        })}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#f8fbff",
              boxShadow: "0 8px 16px rgba(8, 37, 74, 0.18)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.32)",
              },
            }}
          >
            Back
          </Button>
          {canDelete && (
            <Tooltip title="Delete post">
              <span>
                <IconButton
                  onClick={openDeleteDialog}
                  disabled={isDeleting}
                  aria-label="Delete post"
                  sx={(theme) => ({
                    color: theme.palette.mode === "dark" ? "#e5edf7" : "#f8fbff",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(8, 19, 44, 0.22)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(8, 19, 44, 0.3)",
                    },
                  })}
                >
                  <TrashIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Stack>

        {deleteError && (
          <Typography color="error" variant="body2">
            {deleteError}
          </Typography>
        )}

        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Fraunces", "Times New Roman", serif',
            color: (theme) =>
              theme.palette.mode === "dark" ? "#eef2f8" : "#f5f7ff",
          }}
        >
          {post.title}
        </Typography>

        <Stack spacing={0.5} sx={{ fontSize: "0.95rem" }}>
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
            padding: "18px",
            boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.12)",
          })}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
            {post.content}
          </Typography>
        </Box>

        <Stack spacing={0.5}>
          <Typography
            variant="subtitle2"
            sx={{ color: (theme) => (theme.palette.mode === "dark" ? "#eef2f8" : "#f5f7ff") }}
          >
            Attachments
          </Typography>
          {attachments.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {attachments.map((file) => {
                const url = resolveUrl(file.url);
                const isImage = isImageFile(file);
                return (
                  <Box key={file.url} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {isImage ? (
                      <MuiLink
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        underline="none"
                        sx={{ display: "inline-flex" }}
                      >
                        <Box
                          component="img"
                          src={url}
                          alt={file.originalName}
                          sx={{
                            width: 120,
                            height: 90,
                            objectFit: "cover",
                            borderRadius: "12px",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            boxShadow: "0 10px 20px rgba(8, 37, 74, 0.2)",
                          }}
                        />
                      </MuiLink>
                    ) : (
                      <MuiLink
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                        underline="always"
                      >
                        {file.originalName}
                      </MuiLink>
                    )}
                    {isImage && (
                      <Typography variant="caption" sx={{ color: "inherit" }}>
                        {file.originalName}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body2">None</Typography>
          )}
        </Stack>

        {post.tags?.length > 0 && (
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
      </Box>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#0f1626" : "#f4f7ff",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(10px)",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(4, 7, 12, 0.7)"
                : "rgba(7, 12, 24, 0.35)",
          },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: '"Fraunces", "Times New Roman", serif' }}
        >
          Delete post?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This post will be deleted permanently along with its attachments.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
