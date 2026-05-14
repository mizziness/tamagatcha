import { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import { animated as Animated, useSpring } from "@react-spring/web";
import { buildEggSet, eggParams } from "../helpers/eggSelection";
import { cleanUserInput } from "../helpers/utilities";

const getRandomRestMs = () => 3000 + Math.random() * 6000;
const getRandomWiggleStepDurationMs = () => 70 + Math.random() * 50;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function EggCard({ egg, eggParams }) {
  const [isPageVisible, setIsPageVisible] = useState(() => !document.hidden);
  const [isHovered, setIsHovered] = useState(false);
  const [wiggleSpring, wiggleApi] = useSpring(() => ({ rotateZ: 0 }));
  const eggTagline = `${(egg.rarity + " " + egg.color.split("-")[1].slice(0) + " " + egg.pattern).toLowerCase() + " egg"}`;
  const inputId = `egg-radio-${egg.id}`;

  useEffect(() => {
    const onVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);
  const ringClasses =
    "relative h-full rounded-full p-5 ring-4" +
    " ring-transparent" +
    " focus:ring-4" +
    " focus:ring-minsk-500" +
    " -ring-offset-0" +
    " group-focus-within:ring-4" +
    " group-focus-within:ring-minsk-500" +
    " group-hover:egg-hover-shadow" +
    " transition-shadow duration-300" +
    " hover:egg-hover-shadow" +
    " transition-shadow duration-300";

  useEffect(() => {
    if (isHovered || !isPageVisible) {
      wiggleApi.stop();
      wiggleApi.start({ rotateZ: 0, immediate: true });
      return;
    }
  }, [isHovered, isPageVisible, wiggleApi]);

  useEffect(() => {
    let cancelled = false;

    const runIdleWiggle = async () => {
      // When hidden or hovered, keep the egg still.
      if (!isPageVisible || isHovered) {
        await wiggleApi.start({ rotateZ: 0, immediate: false });
        return;
      }

      while (!cancelled) {
        await new Promise((resolve) => setTimeout(resolve, getRandomRestMs()));

        if (cancelled || !isPageVisible || isHovered) {
          continue;
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
        });
      }
    };

    runIdleWiggle();

    return () => {
      cancelled = true;
      wiggleApi.stop();
    };
  }, [isHovered, isPageVisible, wiggleApi]);

  return (
    <label
      key={egg.id}
      id={`egg-choice-${egg.id}`}
      htmlFor={inputId}
      className="group cursor-pointer"
      aria-labelledby={`egg-${egg.id}`}
      onPointerEnter={() => {
        setIsHovered(true);
      }}
      onPointerLeave={() => {
        setIsHovered(false);
      }}
    >
      <input
        id={inputId}
        type="radio"
        name="eggId"
        value={egg.id}
        className="peer sr-only"
      />

      <div
        className={`rarity-circle ${ringClasses} ${eggParams.rarityStyles[egg.rarity] || eggParams.rarityStyles.common}`}
      >
        {/* Egg Container */}
        <div className="relative mx-auto w-16">
          <Animated.div
            aria-hidden="true"
            className="relative mx-auto box-border block h-20 w-16 origin-bottom"
            style={{
              transform: wiggleSpring.rotateZ.to(
                (rotateZ) => `rotate(${rotateZ}deg)`,
              ),
            }}
          >
            <div className="egg-image-stack group-hover:animate-hover-bounce relative block h-20 w-16">
              <ReactSVG
                src="/images/egg_parts/egg_color_base.svg"
                className={`absolute inset-0 left-0 top-0 block h-20 max-h-20 w-16 ${egg.color}`}
              />
              <img
                src="/images/egg_parts/egg_shading_base.png"
                className="absolute inset-0 left-0 top-0 block h-20 max-h-20 w-16 mix-blend-lighten"
              />
              <img
                src={`/images/egg_parts/${egg.pattern}.png`}
                className="absolute inset-0 left-0 top-0 block h-20 max-h-20 w-16 mix-blend-overlay"
              />
            </div>
          </Animated.div>

          {/* Egg Shadow */}
          <div
            aria-hidden="true"
            role="presentation"
            className="group-hover:animate-hover-shadow opacity-35 blur-xs absolute -bottom-2 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, black 0%, transparent 100%)",
            }}
          />
        </div>
        <div
          className="egg-gender absolute bottom-0 right-0 rounded-full bg-white bg-opacity-75 p-1"
          aria-label={`Egg Gender: ${egg.gender}`}
        >
          <ReactSVG
            wrapper="div"
            src={`/images/icons/${egg.gender === "male" ? "mars" : "venus"}-solid.svg`}
            alt=""
            className={`gender-icon no-sr h-6 w-6 text-[1.5rem] ${egg.gender === "male" ? "fill-sky-500" : "fill-pink-500"}`}
            beforeInjection={(svg) => {
              svg.classList.add("text-[1.5rem]");
              svg.setAttribute("style", `width: 24px; height: 24px;`);
            }}
          />
        </div>
      </div>
      <div
        id={`egg-${egg.id}`}
        className="mt-2 text-center text-xs capitalize leading-[120%] text-gray-700"
      >
        {eggTagline}
      </div>
    </label>
  );
}

export function EggSelection({ selectEgg }) {
  const [eggs, setEggs] = useState(() => buildEggSet());
  const [isRerolling, setIsRerolling] = useState(false);
  const eggSelectionRef = useRef(null);

  const handleRerollEggs = async (e) => {
    e.preventDefault();
    if (isRerolling) return;

    const eggSetElement = eggSelectionRef.current;
    if (!eggSetElement) {
      setEggs(buildEggSet());
      return;
    }

    setIsRerolling(true);

    try {
      const fadeOut = eggSetElement.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 250,
        easing: "ease-in-out",
        fill: "forwards",
      });
      await fadeOut.finished;

      setEggs(buildEggSet());
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await wait(1000);

      const fadeIn = eggSetElement.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        easing: "ease-in-out",
        fill: "forwards",
      });
      await fadeIn.finished;
    } finally {
      setIsRerolling(false);
    }
  };

  return (
    <div
      id="custom-container"
      className="mt-30 mx-auto w-full max-w-4xl rounded-2xl bg-white text-center shadow-lg"
    >
      <form
        className="mx-auto max-w-lg p-8"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const petName = formData.get("petName");
          const eggId = formData.get("eggId");
          const eggDetails = eggs.find((e) => e.id === eggId);
          const cleanedPetName = cleanUserInput(petName);
          if (cleanedPetName && eggId && eggDetails) {
            selectEgg(cleanedPetName, eggDetails);
          } else {
            alert("Please enter a valid name for your pet and select an egg!");
          }
        }}
      >
        <label className="text-lg font-semibold">
          <span>Choose a Name:</span>
          <input
            type="text"
            name="petName"
            required
            minLength="3"
            className="mb-4 w-full rounded border p-2"
          />
        </label>

        <hr className="border-minsk-300 my-6" />

        <fieldset className="my-4">
          <legend className="text-lg font-semibold">Pick an Egg:</legend>
          <div
            ref={eggSelectionRef}
            id="egg-selection"
            className="my-4 grid grid-cols-3 items-start justify-center gap-6"
          >
            {eggs.map((egg) => {
              return <EggCard key={egg.id} egg={egg} eggParams={eggParams} />;
            })}
          </div>
        </fieldset>

        <p
          role="status"
          aria-live="polite"
          className={`text-minsk-700 my-2 text-sm font-medium transition-opacity duration-150 ${isRerolling ? "opacity-100" : "opacity-0"}`}
        >
          Rerolling eggs...
        </p>

        <button
          type="button"
          onClick={handleRerollEggs}
          disabled={isRerolling}
          className={`border-minsk-300 text-minsk-800 rounded-lg border bg-white px-4 py-2 leading-4 transition ${isRerolling ? "cursor-wait opacity-80" : "hover:bg-minsk-50 hover:cursor-pointer"}`}
        >
          <span aria-hidden="true" className="mr-2">
            <ReactSVG
              src="/images/icons/sync-alt-solid.svg"
              className={`inline-block ${isRerolling ? "animate-spin" : ""}`}
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 16px; height: 16px;");
                svg.classList.add("fill-sky-600");
              }}
            />
          </span>
          {isRerolling ? "Rerolling..." : "Re-roll Eggs"}
        </button>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-violet-400 px-4 py-2 font-semibold text-white transition hover:bg-violet-500"
        >
          Hatch!
        </button>
      </form>
    </div>
  );
}
