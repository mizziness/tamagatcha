import { Account } from '../pages/Account'
import { Collection } from '../pages/Collection'
import { EggSelection } from '../components/EggSelection'
import { GameOver } from '../components/GameOver'
import { Home } from '../pages/Home'
import { PATHS } from '../routes/paths'
import { Play } from '../pages/Play'
import { Register } from '../pages/Register'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'


export function AppRoutes({ onSelectEgg, gameProps }) {
  return (
    <Routes>
      <Route path={PATHS.ACCOUNT}     element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path={PATHS.COLLECTION}  element={<ProtectedRoute><Collection /></ProtectedRoute>} />
      <Route path={PATHS.GAME_OVER}   element={<ProtectedRoute><GameOver /></ProtectedRoute>} />
      <Route path={PATHS.HATCH}       element={<ProtectedRoute><EggSelection selectEgg={onSelectEgg} /></ProtectedRoute>} />
      <Route path={PATHS.HOME}        element={<Home />} />
      <Route path={PATHS.PLAY}        element={<ProtectedRoute><Play {...gameProps} /></ProtectedRoute>} />
      <Route path={PATHS.REGISTER}    element={<Register />} />
    </Routes>
  )
}
