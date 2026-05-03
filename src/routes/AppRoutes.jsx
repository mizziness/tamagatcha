import { Account } from '../pages/Account'
import { Collection } from '../pages/Collection'
import { EggSelection } from '../components/EggSelection'
import { GameOver } from '../components/GameOver'
import { Home } from '../pages/Home'
import { PATHS } from '../routes/paths'
import { Play } from '../pages/Play'
import { Register } from '../pages/Register'
import { Routes, Route } from 'react-router-dom'


export function AppRoutes({ onSelectEgg, gameProps }) {
  return (
    <Routes>
      <Route path={PATHS.ACCOUNT}     element={<Account />} />
      <Route path={PATHS.COLLECTION}  element={<Collection />} />
      <Route path={PATHS.GAME_OVER}   element={<GameOver />} />
      <Route path={PATHS.HATCH}       element={<EggSelection selectEgg={onSelectEgg} />} />
      <Route path={PATHS.HOME}        element={<Home />} />
      <Route path={PATHS.PLAY}        element={<Play {...gameProps} />} />
      <Route path={PATHS.REGISTER}    element={<Register />} />
    </Routes>
  )
}
