import { useMemo } from "react";
import { useEggStore } from "../store/eggStore";
import { usePetStore } from "../store/petStore";

export function Collection() {
  const { eggs } = useEggStore();
  const { pets } = usePetStore();

  const livingPets = useMemo(() => pets.filter((p) => p.isAlive), [pets]);

  return (
    <div
      id="custom-container"
      className="mt-30 mx-auto w-full max-w-4xl rounded-2xl bg-white text-center shadow-lg"
    >
      <h1 className="page-heading m-0 p-0 text-2xl">Your Collection</h1>

      <div className="content-box px-10">
        <h2 className="border-minsk-500 mb-4 mt-8 w-full border-b-2 text-left text-2xl font-bold">
          Eggs
        </h2>
        <div id="egg-collection" className="egg-collection">
          {eggs.length === 0 ? (
            <p className="text-lg text-gray-600">
              No eggs in your collection. Head to the hatchery to get started!
            </p>
          ) : (
            <ul className="egg-list">
              {eggs.map((egg) => (
                <li key={egg.id} className="egg-item">
                  {egg.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <h2 className="border-minsk-500 mb-4 mt-8 w-full border-b-2 text-left text-2xl font-bold">
          Pets
        </h2>
        <div id="pet-collection" className="pet-collection">
          {livingPets.length === 0 ? (
            <p className="text-lg text-gray-600">
              No living pets in your collection. Head to the hatchery to get
              started!
            </p>
          ) : (
            <ul className="pet-list">
              {livingPets.map((pet) => (
                <li key={pet.id} className="pet-item">
                  {pet.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
