import * as GameConfig from '../../gameConfig.js'

// Calculate pet stage based on age in ticks
export const getPetLifeStage = (ageInTicks, speed = 1) => {
  const speedMul = GameConfig.clampSpeed(speed)
  const ticksPerPetYear = GameConfig.ticksPerPetYear(speedMul)
  const years = ageInTicks / ticksPerPetYear
  if (years < 0.5) return 'baby'
  if (years < 2) return 'child'
  if (years < 4) return 'adult'
  return 'elderly'
}

// Check if pet is dead based on stats and age
export const checkIfDead = (pet, speed = 1) => {
  const speedMul = GameConfig.clampSpeed(speed)
  const maxAge = GameConfig.maxAgeTicks(speedMul)
  return [pet.hunger, pet.happiness, pet.energy, pet.health, pet.cleanliness].filter(s => s <= 0).length >= 3 || pet.age > maxAge
}
