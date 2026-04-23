import { formatAge } from '../usePetActions'

export function Pet({ pet, isAlive }) {

    // Helper: Get pet mood
    const getMood = () => {
        const avgStats = (pet.hunger + pet.happiness + pet.energy + pet.health + pet.cleanliness) / 5

        if ( !isAlive ) return 'dead'
        if (avgStats > 70) return 'happy'
        if (avgStats > 40) return 'neutral'
        return 'sad'
    }

    // Helper: Get mood emoji
    const getMoodEmoji = () => {
        const mood = getMood()
        if (mood === 'happy') return '😄'
        if (mood === 'neutral') return '😐'
        if (mood === 'sad') return '😢'
        return '💀'
    }

    const scale = 1 + (Math.sin(Date.now() / 500) * 0.05) // Subtle breathing animation

    return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="text-9xl transition-transform ease-in-out duration-300"
        style={{ transform: `scale(${scale})` }}
      >
        {getMoodEmoji()}
      </div>
      <div className="text-xl font-semibold">{pet.name}</div>
      <div className="text-sm text-gray-600">
        Age: {formatAge(pet.age)} | Stage: {pet.stage} | Mood: {getMood()}
      </div>
    </div>
  )
}