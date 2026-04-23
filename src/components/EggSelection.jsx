import { useEffect, useRef, useState } from 'react'
import { ReactSVG } from 'react-svg'
import { animated as Animated, useSpring } from '@react-spring/web'
import { buildEggSet, eggParams } from './eggSelection.utils'

const getRandomRestMs = () => 3000 + Math.random() * 6000
const getRandomWiggleStepDurationMs = () => 70 + Math.random() * 50
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function EggCard({ egg, eggParams }) {
    const [isPageVisible, setIsPageVisible] = useState(() => !document.hidden)
    const [isHovered, setIsHovered] = useState(false)
    const [wiggleSpring, wiggleApi] = useSpring(() => ({ rotateZ: 0 }))
    const eggName = `${(egg.rarity + ' ' + egg.color.split('-')[1].slice(0) + ' ' + egg.pattern).toLowerCase() + ' egg'}`

    useEffect(() => {
        const onVisibilityChange = () => {
            setIsPageVisible(!document.hidden)
        }

        document.addEventListener('visibilitychange', onVisibilityChange)
        return () => document.removeEventListener('visibilitychange', onVisibilityChange)
    }, [])

    useEffect(() => {
        if (isHovered || !isPageVisible) {
            wiggleApi.stop()
            wiggleApi.start({ rotateZ: 0, immediate: true })
            return
        }
    }, [isHovered, isPageVisible, wiggleApi])

    useEffect(() => {
        let cancelled = false

        const runIdleWiggle = async () => {
            // When hidden or hovered, keep the egg still.
            if (!isPageVisible || isHovered) {
                await wiggleApi.start({ rotateZ: 0, immediate: false })
                return
            }

            while (!cancelled) {
                await new Promise((resolve) => setTimeout(resolve, getRandomRestMs()))

                if (cancelled || !isPageVisible || isHovered) {
                    continue
                }

                await wiggleApi.start({
                    from: { rotateZ: 0 },
                    to: [
                        { rotateZ: -4 },
                        { rotateZ: 4 },
                        { rotateZ: -6 },
                        { rotateZ: 6 },
                        { rotateZ: 0 },
                    ],
                    config: { duration: getRandomWiggleStepDurationMs() },
                })
            }
        }

        runIdleWiggle()

        return () => {
            cancelled = true
            wiggleApi.stop()
        }
    }, [isHovered, isPageVisible, wiggleApi])

    return (
        <label
            key={egg.id}
            className="group cursor-pointer"
            aria-labelledby={`egg-${egg.id}`}
            onPointerEnter={() => {
                setIsHovered(true)
            }}
            onPointerLeave={() => {
                setIsHovered(false)
            }}
        >
            <input
                type="radio"
                name="eggId"
                value={egg.id}
                className="sr-only hidden"
            />

            <div aria-hidden="true" className={`relative h-full rounded-full px-3 py-6 ${eggParams.rarityStyles[egg.rarity] || eggParams.rarityStyles.common}`}>
                <div className="relative mx-auto w-16">
                    <Animated.div
                        className="relative mx-auto box-border block h-20 w-16 origin-bottom"
                        style={{
                            transform: wiggleSpring.rotateZ.to((rotateZ) => `rotate(${rotateZ}deg)`),
                        }}
                    >
                        <div className="egg-image-stack group-hover:animate-hover-bounce relative block h-20 w-16">
                            <ReactSVG src="/images/egg_parts/egg_color_base.svg" className={`absolute inset-0 left-0 top-0 block h-20 max-h-[80px] w-16 ${egg.color}`} />
                            <img src="/images/egg_parts/egg_shading_base.png" className="absolute inset-0 left-0 top-0 block h-20 max-h-[80px] w-16 mix-blend-lighten" />
                            <img src={`/images/egg_parts/${egg.pattern}.png`} className="absolute inset-0 left-0 top-0 block h-20 max-h-[80px] w-16 mix-blend-overlay" />
                        </div>
                    </Animated.div>
                    <div className="group-hover:animate-hover-shadow opacity-35 blur-xs absolute -bottom-2 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(ellipse at center, black 0%, transparent 100%)' }} />
                </div>
                <div className='egg-gender absolute bottom-0 right-0 rounded-full bg-white bg-opacity-75 p-1' aria-label={`Egg Gender: ${egg.gender}`}>
                    <ReactSVG 
                        wrapper="div" 
                        src={`/images/icons/${egg.gender === 'male' ? 'mars' : 'venus'}-solid.svg`} 
                        alt="" 
                        className={`gender-icon no-sr h-6 w-6 text-[1.5rem] ${egg.gender === 'male' ? 'fill-sky-500' : 'fill-pink-500'}`} 
                        beforeInjection={(svg) => {
                            svg.classList.add('text-[1.5rem]')
                            svg.setAttribute('style', `width: 24px; height: 24px;`)
                        }}
                    />
                </div>
            </div>
            <div id={`egg-${egg.id}`} className="mt-2 text-center text-xs capitalize leading-[120%] text-gray-700">
                {eggName}
            </div>
        </label>
    )
}

export function EggSelection({ selectEgg }) {
    const [eggs, setEggs] = useState(() => buildEggSet())
    const [isRerolling, setIsRerolling] = useState(false)
    const eggSelectionRef = useRef(null)

    const handleRerollEggs = async (e) => {
        e.preventDefault()
        if (isRerolling) return

        const eggSetElement = eggSelectionRef.current
        if (!eggSetElement) {
            setEggs(buildEggSet())
            return
        }

        setIsRerolling(true)

        try {
            const fadeOut = eggSetElement.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: 250, easing: 'ease-in-out', fill: 'forwards' }
            )
            await fadeOut.finished

            setEggs(buildEggSet())
            await new Promise((resolve) => requestAnimationFrame(resolve))
            await wait(1000)

            const fadeIn = eggSetElement.animate(
                [{ opacity: 0 }, { opacity: 1 }],
                { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
            )
            await fadeIn.finished
        } finally {
            setIsRerolling(false)
        }
    } 

    return (
        <div
            id="custom-container"
            className="mt-30 mx-auto w-full max-w-4xl rounded-2xl bg-white text-center shadow-lg"
        >
            <form className="mx-auto max-w-lg bg-white p-8" onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const petName = formData.get('petName')
                const eggId = formData.get('eggId')
                if (petName && eggId) {
                    selectEgg(eggId, petName)
                } else {
                    alert('Please enter a name for your pet!')
                }
            }}>
                <label className="text-lg font-semibold">
                    <span>Choose a Name:</span>
                    <input type="text" name="petName" required className="mb-4 w-full rounded border p-2" />
                </label>

                <hr className="border-minsk-300 my-6" />

                <p className="text-lg font-semibold">
                    Pick an Egg:
                </p>

                <div ref={eggSelectionRef} id="egg-selection" className="my-4 grid grid-cols-3 items-start justify-center gap-6">
                    {eggs.map((egg) => (
                        <EggCard key={egg.id} egg={egg} eggParams={eggParams} />
                    ))}
                </div>

                <p
                    role="status"
                    aria-live="polite"
                    className={`text-minsk-700 my-2 text-sm font-medium transition-opacity duration-150 ${isRerolling ? 'opacity-100' : 'opacity-0'}`}
                >
                    Rerolling eggs...
                </p>

                <button
                    type="button"
                    onClick={handleRerollEggs}
                    disabled={isRerolling}
                    className={`border-minsk-300 text-minsk-800 rounded-lg border bg-white px-4 py-2 leading-4 transition ${isRerolling ? 'cursor-wait opacity-80' : 'hover:bg-minsk-50 hover:cursor-pointer'}`}
                >
                    <span aria-hidden="true" className="mr-2">
                        <ReactSVG src="/images/icons/sync-alt-solid.svg" className={`inline-block ${isRerolling ? 'animate-spin' : ''}`} beforeInjection={(svg) => {
                            svg.setAttribute('style', 'width: 16px; height: 16px;')
                            svg.classList.add("fill-sky-600")
                        }} />
                    </span>
                    {isRerolling ? 'Rerolling...' : 'Re-roll Eggs'}
                </button>

                <button type="submit" className="mt-6 w-full rounded-lg bg-violet-400 px-4 py-2 font-semibold text-white transition hover:bg-violet-500">
                    Hatch!
                </button>
            </form>
        </div>
    )
}
