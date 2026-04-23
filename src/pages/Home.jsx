import { useAuthStore } from '../store/authStore'
import { usePetStore } from '../store/petStore'

export function Home() {
    const { user, isLoggedIn } = useAuthStore()
    const { pets, activePetId } = usePetStore()
    const activePet = pets.find(p => p.id === activePetId) || null


    return (
        <div id="custom-container" className="mx-auto mt-20 w-full max-w-3xl rounded-lg bg-white p-4 text-center shadow-lg">

            {isLoggedIn && (
                <div>
                    <h1>Welcome, {user.username}!</h1>

                    <div className="mt-4 text-lg">
                        { activePet && (
                            <>Your current pet is <strong>{activePet.name}</strong>, a {formatAge(activePet.age)} old {activePet.species} with a {activePet.mood} mood. </>
                        )}

                        { !activePet && (
                            <>
                                You don't have an active pet right now. Head to the hatchery to get one!
                                <button className="bg-minsk-500 hover:bg-minsk-700 ml-2 mt-4 rounded-lg px-4 py-2 text-white">
                                    <a href="/hatchery">Go to Hatchery</a>
                                </button>
                            </>
                        )}
                    </div>

                </div>
            )}
            {!isLoggedIn && (
                <div>
                    <h1>Welcome to the Virtual Pet Game!</h1>
                    <p>Please log in or register to start playing.</p>
                </div>
            )}

        </div>
    )
}