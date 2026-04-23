import { useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../routes/AppRoutes'

export function GameOver() {
    const { state } = useLocation()
    const navigate  = useNavigate()

    const petName = state?.petName || 'Your pet'
    const petAge  = state?.petAge  || 'unknown'

    const base = 'px-4 py-2 rounded-lg font-semibold transition'

    return (
        <div className="flex flex-col items-center align-center mt-8">
            <div className="text-center p-6 bg-red-100 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-red-600">Game Over</h2>
                <p className="text-lg text-gray-700 mb-2">{petName} has passed away.</p>
                <p className="text-sm text-gray-500">Age at passing: {petAge}</p>
                <p className="text-9xl text-gray-500 mt-4">💀</p>

                <button
                    className={`${base} mt-8 bg-violet-400 hover:bg-violet-500 text-white`}
                    onClick={() => navigate(PATHS.HATCH, { replace: true })}
                >
                    Hatch a New Egg
                </button>
            </div>
        </div>
    )
}