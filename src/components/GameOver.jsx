export function GameOver({ pet, isAlive, formatAge, resetGame }) {
    const base = 'px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'

    if ( isAlive == false ) {
        return (
            <div className="flex flex-col items-center align-center mt-8">
                <div className="text-center p-6 bg-red-100 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4 text-red-600">Game Over</h2>
                    <p className="text-lg text-gray-700 mb-2">Your pet {pet.name} has passed away.</p>
                    <p className="text-sm text-gray-500">Age at passing: {formatAge(pet.age)}</p>
                    <p className="text-9xl text-gray-500 mt-4">💀</p>

                    <button
                        className={`${base} mt-8 bg-violet-400 hover:bg-violet-500 text-white`}
                        onClick={resetGame}
                    >
                        Restart
                    </button>
                </div>
            </div>
        )
    }
}