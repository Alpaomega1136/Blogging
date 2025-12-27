// src/components/Navbar.jsx
import {
  AppBar,
  Box,
  Button,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar({
  query,
  onQueryChange,
  onSubmitSearch,
  onToggleTheme,
  isDark,
  onOpenModal,
}) {
  const theme = useTheme();
  const navGradient =
    theme.palette.mode === "dark"
      ? "linear-gradient(120deg, #161f49, #1f2a5d)"
      : "linear-gradient(120deg, #2f369d, #3c44b7)";
  const navText = theme.palette.mode === "dark" ? "#b6beca" : "#ffffff";
  const navButtonBg = theme.palette.mode === "dark" ? "#262f45" : "#2bb5e6";
  const navButtonText = theme.palette.mode === "dark" ? "#c8ced8" : "#06233a";
  const navButtonHover = theme.palette.mode === "dark" ? "#303b54" : "#4fd1f0";

  return (
    <AppBar position="sticky" elevation={0} sx={{ background: navGradient }}>
      <Toolbar sx={{ gap: 2, flexWrap: "wrap", py: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flex: { xs: "1 1 100%", md: "0 0 auto" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              fontFamily: '"Fraunces", "Times New Roman", serif',
              fontWeight: 800,
              letterSpacing: "0.02em",
              color: navText,
              textDecoration: "none",
            }}
          >
            Blogging.
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={onToggleTheme}
            sx={{
              borderRadius: "999px",
              borderColor: "rgba(255, 255, 255, 0.35)",
              color: navText,
              textTransform: "none",
              fontWeight: 700,
              px: 2,
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.28)",
              },
            }}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </Box>

        <Box
          component="form"
          onSubmit={onSubmitSearch}
          sx={{
            flex: { xs: "1 1 100%", md: 1 },
            order: { xs: 3, md: 0 },
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search posts..."
            value={query}
            onChange={onQueryChange}
            InputProps={{
              sx: {
                borderRadius: "999px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#0f1626" : "#ffffff",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.35)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.55)",
              },
              "& .MuiInputBase-input::placeholder": {
                color:
                  theme.palette.mode === "dark" ? "#9aa7bb" : "#5a6a7f",
                opacity: 1,
              },
              "& .MuiInputBase-input": {
                color: theme.palette.mode === "dark" ? "#eef2f8" : "#0b1330",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 auto" },
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          <Button
            variant="contained"
            onClick={onOpenModal}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              backgroundColor: navButtonBg,
              color: navButtonText,
              boxShadow: "0 8px 16px rgba(8, 37, 74, 0.25)",
              "&:hover": {
                backgroundColor: navButtonHover,
              },
            }}
          >
            New Post
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
