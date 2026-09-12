import type { FormEvent } from 'react'
import { useTitleStore } from '../../store/titleStore'
import { ICON_BUTTON } from '../ui/buttonStyles'
import { PencilIcon } from '../ui/icons'
import { useInlineEdit } from '../../hooks/useInlineEdit'

function EditableTitle() {
  const title = useTitleStore((state) => state.title)
  const setTitle = useTitleStore((state) => state.setTitle)
  const { isEditing, draft, setDraft, start, commit, handleKeyDown } =
    useInlineEdit({ value: title, onCommit: setTitle })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    commit()
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="min-w-0 flex-1">
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          onFocus={(event) => event.target.select()}
          aria-label="Load order title"
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
        onClick={start}
        aria-label="Edit title"
        className={ICON_BUTTON}
      >
        <PencilIcon />
      </button>
    </div>
  )
}

export default EditableTitle
