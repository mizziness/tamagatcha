import { useAuthStore } from "../store/authStore";
import { usePetStore } from "../store/petStore";
import { Link } from "react-router-dom";

export function Nav() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const activePet = usePetStore(
    (state) => state.pets.find((p) => p.id === state.activePetId) ?? null,
  );

  return (
    <nav className="bg-minsk-950 flex items-center justify-between p-4 text-white">
      <ul className="flex w-full items-end justify-start gap-4 px-4 text-left">
        {isLoggedIn && (
          <li>
            <span className="mr-2">Hello, {user.username}!</span>
          </li>
        )}

        {isLoggedIn && activePet && (
          <li>
            <Link to="/play" className="mr-2">Active Pet: {activePet.name}</Link>
          </li>
        )}
      </ul>
      <ul className="flex w-full items-end justify-end gap-4 px-4 text-right">
        <li>
          <Link to="/" className="hover:text-minsk-300">
            Home
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <Link to="/collection" className="hover:text-minsk-300">
                Collection
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-minsk-300">
                Account
              </Link>
            </li>
            <li>
              <button onClick={logout} className="hover:text-minsk-300">
                Logout
              </button>
            </li>
          </>
        )}
        {!isLoggedIn && (
          <>
            <li key="register">
              <Link to="/register" className="hover:text-minsk-300">
                Login or Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
