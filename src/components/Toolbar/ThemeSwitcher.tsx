import { useEffect, useState } from 'react'
import { THEMES, useThemeStore } from '../../store/themeStore'
import { SECONDARY_BUTTON } from '../ui/buttonStyles'

function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const activeTheme = THEMES.find((candidate) => candidate.id === theme)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-2 ${SECONDARY_BUTTON}`}
      >
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 rounded-full border border-neutral-600"
          style={{ backgroundColor: activeTheme?.accent }}
        />
        Theme
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            aria-label="Color themes"
            className="absolute right-0 z-50 mt-2 flex w-56 flex-col gap-1 rounded-lg border border-neutral-700 bg-neutral-900 p-2 shadow-xl"
          >
            {THEMES.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                role="menuitemradio"
                aria-checked={candidate.id === theme}
                onClick={() => {
                  setTheme(candidate.id)
                  setIsOpen(false)
                }}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-neutral-100 transition-colors hover:bg-neutral-800 focus-visible:bg-neutral-800 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 rounded-full border border-neutral-600"
                  style={{ backgroundColor: candidate.accent }}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">
                    {candidate.label}
                  </span>
                  <span className="truncate text-xs text-neutral-400">
                    {candidate.description}
                  </span>
                </span>
                {candidate.id === theme && (
                  <span aria-hidden="true" className="shrink-0 text-accent">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeSwitcher
