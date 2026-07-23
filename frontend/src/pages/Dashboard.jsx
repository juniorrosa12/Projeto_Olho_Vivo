import { Box } from "@mui/material";
import StatsGrid from "../components/dashboard/StatsGrid";
import Timeline from "../components/dashboard/Timeline";
import LiveEvents from "../components/dashboard/LiveEvents";

export default function Dashboard() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <StatsGrid />
      <Timeline />
      <LiveEvents />
    </Box>
  );
}

