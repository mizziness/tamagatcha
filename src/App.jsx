import './App.css'
import { useState, useEffect } from 'react'
import { usePetActions } from './usePetActions'
import { Pet } from './components/Pet'
import { DebugPanel } from './components/DebugPanel'
import { StatusBars } from './components/StatusBars'
import { ActionButtons } from './components/ActionButtons'
import { GameOver } from './components/GameOver'
import { EggSelection } from './components/EggSelection'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'

function App() {
  const [petName, setPetName] = useState('Tama')
  const location = useLocation()
  const navigate = useNavigate()
  const gameActive = location.pathname === '/play'
  const { pet, isAlive, stage, feed, play, sleep, clean, formatAge, resetGame } = usePetActions(petName, gameActive)
  const handleReset = () => { resetGame(); navigate('/egg-selection', { replace: true }) }
  const showDebugPanel = import.meta.env.DEV

  useEffect(() => {
    if (location.pathname === '/play' && !isAlive) {
      navigate('/game-over', { replace: true })
    }
  }, [isAlive, location.pathname, navigate])

  return (
    <div className='container mx-auto'>
      <Routes>
        <Route path="/" element={<EggSelection selectEgg={(eggId, petName) => {
          setPetName(petName)
          navigate('/play', { replace: true })
        }} />} />
        <Route path="/play" element={
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-8">Virtual Pet</h1>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <Pet pet={pet} isAlive={isAlive} />
              <StatusBars pet={pet} />
              <ActionButtons feed={feed} play={play} sleep={sleep} clean={clean} isAlive={isAlive} />
              <p className="text-xs text-gray-400 mt-4 break-all mt-2">{JSON.stringify(pet)}</p>
            </div>
          </div>
        } />
        <Route path="/game-over" element={<GameOver pet={pet} isAlive={isAlive} formatAge={formatAge} resetGame={handleReset} />} />
      </Routes>

      {showDebugPanel && (
        <DebugPanel
          route={location.pathname}
          pet={pet}
          gameActive={gameActive}
          isAlive={isAlive}
        />
      )}

    </div>
  )
}

export default App
