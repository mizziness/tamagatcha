import './App.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { usePetStore } from './store/petStore'
import { DebugPanel } from './components/DebugPanel'
import { Nav } from './components/Nav'
import { AppRoutes, PATHS } from './routes/AppRoutes'

function App() {
  const location       = useLocation()
  const navigate       = useNavigate()
  const { user }       = useAuthStore()
  const { createPet }  = usePetStore()
  const showDebugPanel = import.meta.env.DEV

  const handleSelectEgg = (eggId, petName) => {
    if (user) createPet(user.username, petName, eggId)
    navigate(PATHS.PLAY, { replace: true })
  }

  return (
    <main>
      <div id="top-nav" className="fixed left-0 top-0 z-10 w-full">
        <Nav />
      </div>
      <div className='container mx-auto'>
        <AppRoutes onSelectEgg={handleSelectEgg} />

        {showDebugPanel && (
          <DebugPanel route={location.pathname} />
        )}
      </div>
    </main>
  )
}

export default App
