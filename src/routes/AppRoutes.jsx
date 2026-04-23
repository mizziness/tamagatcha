import { Routes, Route } from 'react-router-dom'
import { Account } from '../pages/Account'
import { Register } from '../pages/Register'
import { Play } from '../pages/Play'
import { GameOver } from '../components/GameOver'
import { EggSelection } from '../components/EggSelection'
import { Home } from '../pages/Home'

export const PATHS = {
  HOME: '/',
  PLAY: '/play',
  GAME_OVER: '/game-over',
  ACCOUNT: '/account',
  REGISTER: '/register',
  LOGIN: '/login',
  HATCH: '/hatchery'
}

export function AppRoutes({ onSelectEgg }) {
    return (
        <Routes>
            <Route path={PATHS.HOME}      element={<Home />} />
            <Route path={PATHS.ACCOUNT}   element={<Account />} />
            <Route path={PATHS.REGISTER}  element={<Register />} />
            <Route path={PATHS.GAME_OVER} element={<GameOver />} />
            <Route path={PATHS.HATCH}     element={<EggSelection selectEgg={onSelectEgg} />} />
            <Route path={PATHS.PLAY}      element={<Play />} />
        </Routes>
    )
}
