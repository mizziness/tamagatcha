export function ActionButtons({ feed, play, sleep, clean, isAlive }) {
  const base =
    'px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button
        className={`${base}bg-rose-400 text-white hover:bg-rose-500`}
        onClick={feed}
        disabled={!isAlive}
      >
        Feed
      </button>
      <button
        className={`${base}bg-amber-400 text-white hover:bg-amber-500`}
        onClick={play}
        disabled={!isAlive}
      >
        Play
      </button>
      <button
        className={`${base}bg-sky-400 text-white hover:bg-sky-500`}
        onClick={sleep}
        disabled={!isAlive}
      >
        Sleep
      </button>
      <button
        className={`${base}bg-emerald-400 text-white hover:bg-emerald-500`}
        onClick={clean}
        disabled={!isAlive}
      >
        Clean
      </button>
    </div>
  )
}
