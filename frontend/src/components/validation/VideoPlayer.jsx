import { Box, Paper, Typography } from "@mui/material";

export default function VideoPlayer({ src }) {
  if (!src) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Vídeo do evento
        </Typography>
      </Box>
      <Box sx={{ p: 2, bgcolor: "grey.900" }}>
        <Box
          component="video"
          src={src}
          controls
          autoPlay
          muted
          playsInline
          sx={{ width: "100%", maxWidth: 960, borderRadius: 2 }}
        />
      </Box>
    </Paper>
  );
}
