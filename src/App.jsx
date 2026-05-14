import "./App.css";
import { AppRoutes } from "./routes/AppRoutes";
import { DebugPanel } from "./components/DebugPanel";
import { Nav } from "./components/Nav";
import { PATHS } from "./routes/paths";
import { useAuthStore } from "./store/authStore";
import { useSettingsStore } from "./store/settingsStore";
import { useNavigate, useLocation } from "react-router-dom";
import { usePetActions } from "./helpers/usePetActions";
import { usePetStore } from "./store/petStore";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createPet, activePetId } = usePetStore();
  const { speed } = useSettingsStore();
  const showDebugPanel = import.meta.env.DEV;

  // Run the game loop at the app level so it survives page navigation
  const gameProps = usePetActions(activePetId !== null, speed);

  const handleSelectEgg = (petName, egg) => {
    if (!user) {
      navigate(PATHS.REGISTER, { replace: true });
      return;
    }

    createPet(user.username, petName, egg);
    navigate(PATHS.PLAY, { replace: true });
  };

  return (
    <main className="pt-22">
      <div id="top-nav" className="fixed left-0 top-0 z-10 w-full">
        <Nav />
      </div>
      <div className="container mx-auto">
        <AppRoutes onSelectEgg={handleSelectEgg} gameProps={gameProps} />

        {showDebugPanel && <DebugPanel route={location.pathname} />}
      </div>
    </main>
  );
}

export default App;
