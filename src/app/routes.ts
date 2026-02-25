import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { PhilosophyPage } from "./pages/PhilosophyPage";
import { MusicLandingPage } from "./pages/MusicLandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/philosophy",
    Component: PhilosophyPage,
  },
  {
    path: "/music",
    Component: MusicLandingPage,
  },
]);
