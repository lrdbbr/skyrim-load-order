import {
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { useTitleStore } from '../../store/titleStore'
import { ICON_BUTTON } from '../ui/buttonStyles'

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" />
    </svg>
  )
}

function EditableTitle() {
  const title = useTitleStore((state) => state.title)
  const setTitle = useTitleStore((state) => state.setTitle)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  const startEditing = () => {
    setDraft(title)
    setIsEditing(true)
  }

  const commit = () => {
    setTitle(draft)
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(title)
    setIsEditing(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    commit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      cancel()
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="min-w-0 flex-1">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          onFocus={(event) => event.target.select()}
          aria-label="Titre du load order"
          className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-2xl font-semibold text-neutral-100 focus:border-accent focus:outline-none sm:text-3xl"
        />
      </form>
    )
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <h1 className="truncate text-2xl font-semibold sm:text-3xl">
        {title}
      </h1>
      <button
        type="button"
        onClick={startEditing}
        aria-label="Modifier le titre"
        className={ICON_BUTTON}
      >
        <PencilIcon />
      </button>
    </div>
  )
}

export default EditableTitle
