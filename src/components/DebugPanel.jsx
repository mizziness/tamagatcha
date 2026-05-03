import { usePetStore } from "../store/petStore";
import { useAuthStore } from "../store/authStore";

export function DebugPanel({ route }) {
  const { pets, activePetId } = usePetStore();
  const { user, isLoggedIn } = useAuthStore();
  const activePet = pets.find((p) => p.id === activePetId) || null;

  return (
    <details className="mt-4 rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs text-slate-700">
      <summary className="cursor-pointer font-semibold">Dev Debug</summary>
      <pre className="mt-2 overflow-auto whitespace-pre-wrap break-all">
        {JSON.stringify(
          {
            route,
            isLoggedIn,
            user,
            activePetId,
            activePet,
            totalPets: pets.length,
          },
          null,
          2,
        )}
      </pre>
    </details>
  );
}
