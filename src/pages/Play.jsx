import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePetActions, formatAge } from '../usePetActions'
import { usePetStore } from '../store/petStore'
import { Pet } from '../components/Pet'
import { StatusBars } from '../components/StatusBars'
import { ActionButtons } from '../components/ActionButtons'
import { PATHS } from '../routes/AppRoutes'

export function Play() {
  const navigate = useNavigate()
  const { pet, isAlive, feed, play, sleep, clean } = usePetActions(true)

  // No active pet in store? Send them to the hatchery
  useEffect(() => {
    if (!usePetStore.getState().getActivePet()) {
      navigate(PATHS.HATCH, { replace: true })
    }
  }, [])

  // Pet died — carry its info to GameOver via navigation state
  useEffect(() => {
    if (!isAlive) {
      navigate(PATHS.GAME_OVER, {
        replace: true,
        state: { petName: pet.name, petAge: formatAge(pet.age) }
      })
    }
  }, [isAlive, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-8 text-4xl font-bold">Virtual Pet</h1>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <Pet pet={pet} isAlive={isAlive} />
        <StatusBars pet={pet} />
        <ActionButtons feed={feed} play={play} sleep={sleep} clean={clean} isAlive={isAlive} />
      </div>
    </div>
  )
}