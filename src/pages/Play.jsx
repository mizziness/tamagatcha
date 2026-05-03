import { ActionButtons } from "../components/ActionButtons";
import { formatAge } from "../helpers/usePetActions";
import { EventLog } from "../components/EventLog";
import { PATHS } from "../routes/paths";
import { Pet } from "../components/Pet";
import { StatusBars } from "../components/StatusBars";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePetStore } from "../store/petStore";
import { useAuthStore } from "../store/authStore";

export function Play({ pet, isAlive, feed, play, sleep, clean }) {
  const navigate = useNavigate();
  const activePet = usePetStore(
    (state) => state.pets.find((p) => p.id === state.activePetId) || null,
  );
  const session = useAuthStore((state) => state.user);
  const owner = session?.username ?? activePet?.owner ?? null;
  const petId = activePet?.id ?? null;

  // No active pet in store? Send them to the hatchery
  useEffect(() => {
    if (!usePetStore.getState().getActivePet()) {
      navigate(PATHS.HATCH, { replace: true });
    }
  }, [navigate]);

  // Pet died — carry its info to GameOver via navigation state
  useEffect(() => {
    if (!isAlive) {
      navigate(PATHS.GAME_OVER, {
        replace: true,
        state: { petName: pet.name, petAge: formatAge(pet.age) },
      });
    }
  }, [isAlive, navigate, pet]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <Pet pet={pet} isAlive={isAlive} />
          <StatusBars pet={pet} />
          <ActionButtons
            feed={feed}
            play={play}
            sleep={sleep}
            clean={clean}
            isAlive={isAlive}
          />
        </div>
        <div className="my-6 w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
          <EventLog username={owner} petId={petId} />
        </div>
      </div>
    </div>
  );
}
