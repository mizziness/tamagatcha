import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'

import { usePetActions } from './usePetActions'
import { DebugPanel } from './components/DebugPanel'
import { Nav } from './components/Nav'
import { AppRoutes } from './routes/AppRoutes'


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
    <main>
      <div id="top-nav" className="fixed left-0 top-0 z-10 w-full">
        <Nav />
      </div>
      <div className='container mx-auto'>
        <AppRoutes
          pet={pet}
          isAlive={isAlive}
          feed={feed}
          play={play}
          sleep={sleep}
          clean={clean}
          formatAge={formatAge}
          onSelectEgg={(eggId, petName) => {
            setPetName(petName)
            navigate(PATHS.PLAY, { replace: true })
          }}
          onReset={handleReset}
        />

        {showDebugPanel && (
          <DebugPanel
            route={location.pathname}
            pet={pet}
            gameActive={gameActive}
            isAlive={isAlive}
          />
        )}
      </div>
    </main>
  )
}

export default App
