import { formatAge } from "../helpers/usePetActions";
import { ReactSVG } from "react-svg";

const scale = 1 + Math.sin(Math.random() * 500) * 0.05;

export function Pet({ pet, isAlive }) {
  // Helper: Get pet mood
  const getMood = () => {
    const avgStats = (pet.hunger + pet.happiness + pet.energy + pet.health + pet.cleanliness) / 5;
    if (!isAlive) return "dead";
    if (avgStats > 70) return "happy";
    if (avgStats > 40) return "neutral";
    return "sad";
  };

  // Helper: Get mood emoji
  const getMoodEmoji = () => {
    const mood = getMood();
    if (mood === "happy") return "😄";
    if (mood === "neutral") return "😐";
    if (mood === "sad") return "😢";
    return "💀";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="text-9xl transition-transform duration-300 ease-in-out"
        style={{ transform: `scale(${scale})` }}
      >

      </div>
      <div className="flex items-center gap-2 text-xl font-semibold">
        <div>{pet.name}</div>
        <div>{getMoodEmoji()}</div>
        <div
          className="egg-gender rounded-full bg-white bg-opacity-75 p-1"
          aria-label={`Egg Gender: ${pet.egg?.gender ?? "unknown"}`}
        >
          <ReactSVG
            wrapper="div"
            src={`/images/icons/${pet.egg?.gender === "male" ? "mars" : "venus"}-solid.svg`}
            alt=""
            className={`gender-icon no-sr h-6 w-6 text-[1.5rem] ${pet.egg?.gender === "male" ? "fill-sky-500" : "fill-pink-500"}`}
            beforeInjection={(svg) => {
              svg.classList.add("text-[1.5rem]");
              svg.setAttribute("style", `width: 24px; height: 24px;`);
            }}
          />
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Age: {formatAge(pet.age)}
        <br />
        Stage: {pet.stage} | Mood: {getMood()}
      </div>
    </div>
  );
}
