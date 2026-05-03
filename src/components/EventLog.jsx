import { useMemo } from "react"
import { useAuthStore } from "../store/authStore"
import { safeParseEvents } from "../helpers/utilities"

export function EventLog({ username, petId }) {
  const session = useAuthStore((state) => state.user)
  const getEventsKey = `tamagacha_events_${username}_${petId}`
  const events = useMemo(() => {
    if (!session || !username || !petId) return []

    return safeParseEvents(localStorage.getItem(getEventsKey))
  }, [session, username, petId, getEventsKey])

  const ordered = useMemo(() => [...events].reverse(), [events])

  const prettyDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  return (
    <div id="event-log-container">
      <h2 className="text-normal mb-2 w-full font-semibold">Event Log</h2>
      {ordered.length === 0 && <div className="text-sm italic text-gray-500">No events yet...</div>}
      <div className="border-minsk-300 scroller max-h-64 overflow-y-auto rounded-lg border-2 p-4 text-sm">
        <ul>
          {ordered.map((event) => (
            <li key={event.id ?? `${event.timestamp}-${event.type}`}>{prettyDate(event.timestamp)} - {event.message}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
