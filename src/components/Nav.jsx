import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'

export function Nav() {
    const { user, isLoggedIn, logout } = useAuthStore()

    return (
        <nav className="bg-minsk-950 flex items-center justify-between p-4 text-white">
            <ul className="flex w-full items-end justify-end gap-4 px-4 text-right">
                
                {isLoggedIn && (
                    <li>
                        <span className="mr-2">Hello, {user.username}!</span>
                    </li>
                )}
              
                <li>
                    <Link to="/" className="hover:text-minsk-300">Home</Link>
                </li>
                {isLoggedIn && (
                    <>
                        <li>
                            <Link to="/account" className="hover:text-minsk-300">Account</Link>
                        </li>
                        <li>
                            <button onClick={logout} className="hover:text-minsk-300">Logout</button>
                        </li>
                    </>
                )}
                {!isLoggedIn && (
                    <>
                        <li key="register">
                            <Link to="/register" className="hover:text-minsk-300">Login or Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}
