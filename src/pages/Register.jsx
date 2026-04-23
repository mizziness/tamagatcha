import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { PATHS } from '../routes/AppRoutes'

export function Register() {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuthStore()
    const { login, register } = useAuthStore()

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            {!isLoggedIn && (
                <>
                    <div className="mt-4 w-full max-w-md">
                        <p className="text-center text-xl">Already have an account?</p>

                        <form id="login-form" className="p-4" onSubmit={(e) => {
                            e.preventDefault()
                            const username = e.target.username.value
                            const password = e.target.password.value

                            const result = login(username, password)
                            if (result.ok) {
                                navigate(PATHS.ACCOUNT, { replace: true })
                            } else {
                                alert(result.error)
                            }
                        }}>
                            <input type="text" name="username" placeholder="Username" autoComplete='username' required className="mb-4 w-full rounded border bg-white p-2" />
                            <input type="password" name="password" placeholder="Password" autoComplete='current-password' required className="mb-4 w-full rounded border bg-white p-2" />

                            <button type='submit' className="mx-auto mt-4 block rounded border border-rose-950 bg-white px-4 py-2 text-rose-950 transition duration-300 ease-in-out hover:bg-rose-100">
                               Login
                            </button>

                        </form>

                        <p className="mt-8 text-center text-xl">Otherwise, register for a new account:</p>
                        
                        <form id="register-form" className="border-minsk-950 text-minsk-950 mt-4 rounded border bg-white p-4" onSubmit={(e) => {
                            e.preventDefault()
                            const username = e.target.username.value
                            const password = e.target.password.value
                            const email = e.target.email.value
                            const result = register(username, email, password)
                            if (result.ok) {
                                navigate(PATHS.ACCOUNT, { replace: true })
                            } else {
                                alert(result.error)
                            }
                        }}>

                            <input type="text" name="username" placeholder="Username" autoComplete='username' required className="mb-4 w-full rounded border p-2" />
                            <input type="password" name="password" placeholder="Password" autoComplete='new-password' required className="mb-4 w-full rounded border p-2" />
                            <input type="email" name="email" placeholder="Email" autoComplete='email' required className="mb-4 w-full rounded border p-2" />

                            <button type='submit' className="bg-minsk-500 border-minsk-950 hover:bg-minsk-600 mx-auto mt-4 block w-full rounded border px-4 py-2 text-white transition duration-300 ease-in-out">
                                Register
                            </button>

                        </form>
                    </div>
                </>
            )}
        </div>
    )
}
