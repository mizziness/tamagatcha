export const eggParams = {
    colors: ['fill-red-300', 'fill-pink-300', 'fill-amber-400', 'fill-sky-400', 'fill-emerald-400', 'fill-gray-400', 'fill-lime-400', 'fill-orange-400', 'fill-cyan-400', 'fill-indigo-400', 'fill-violet-400', 'fill-blue-400'],
    patterns: ['plain', 'speckled'],
    genders: ['male', 'female'],
    rarityWeights: {
        common: 70,
        uncommon: 12,
        rare: 10,
        epic: 5,
        legendary: 2,
        mythic: 0.9,
        divine: 0.1,
    },
    rarityStyles: {
        common: 'border-6 border-slate-300 bg-slate-100',
        uncommon: 'border-6 border-emerald-300 bg-emerald-100',
        rare: 'border-6 border-sky-300 bg-sky-100',
        epic: 'border-6 border-violet-300 bg-violet-100',
        legendary: 'border-6 border-amber-300 bg-amber-100',
        mythic: 'border-6 border-fuchsia-300 bg-fuchsia-100',
        divine: 'border-6 border-rose-300 bg-rose-100',
    },
}

function pickRarity(rarityWeights) {
    const entries = Object.entries(rarityWeights)
    const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0)

    if (totalWeight <= 0) return 'common'

    let roll = Math.random() * totalWeight
    for (const [rarity, weight] of entries) {
        roll -= weight
        if (roll <= 0) return rarity
    }

    return entries[entries.length - 1][0]
}

function generateEggs(params) {
    const eggs = []
    const numberOfEggs = 3

    for (const color of params.colors) {
        for (const pattern of params.patterns) {
            for (const gender of params.genders) {
                if (eggs.colors?.includes(color) && eggs.patterns?.includes(pattern) && eggs.genders?.includes(gender)) continue

                eggs.push({
                    color,
                    pattern,
                    gender,
                    rarity: pickRarity(params.rarityWeights),
                })
            }
        }
    }

    return eggs.sort(() => 0.5 - Math.random()).slice(0, numberOfEggs)
}

export function buildEggSet() {
    return generateEggs(eggParams).map((egg, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
        color: egg.color,
        pattern: egg.pattern,
        gender: egg.gender,
        rarity: egg.rarity,
    }))
}