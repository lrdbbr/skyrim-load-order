import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  applyImport,
  importCsv,
  importTxt,
  importXlsx,
  summarizeImport,
  type ImportMode,
  type ParsedModRow,
} from '../../lib/importers'
import {
  DANGER_BUTTON,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from '../ui/buttonStyles'

type ImportStatus =
  | { kind: 'idle' }
  | { kind: 'error'; message: string }
  | { kind: 'confirm'; rows: ParsedModRow[]; fileName: string }

async function parseFile(file: File): Promise<ParsedModRow[]> {
  const extension = file.name.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'txt':
      return importTxt(await file.text())
    case 'csv':
      return importCsv(await file.text())
    case 'xls':
    case 'xlsx':
      return importXlsx(await file.arrayBuffer())
    default:
      throw new Error(
        `Unsupported file format (.${extension ?? '?'}). Use .txt, .csv, .xls or .xlsx.`,
      )
  }
}

function ImportButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<ImportStatus>({ kind: 'idle' })
  const [mode, setMode] = useState<ImportMode>('append')

  const reset = () => setStatus({ kind: 'idle' })

  useEffect(() => {
    if (status.kind !== 'confirm') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') reset()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [status.kind])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const rows = await parseFile(file)
      setMode('append')
      setStatus({ kind: 'confirm', rows, fileName: file.name })
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to read this file.',
      })
    }
  }

  const confirmImport = () => {
    if (status.kind !== 'confirm') return
    applyImport(status.rows, mode)
    reset()
  }

  const summary =
    status.kind === 'confirm' ? summarizeImport(status.rows) : null

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv,.xls,.xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={SECONDARY_BUTTON}
      >
        Import
      </button>

      {status.kind === 'error' && (
        <div
          role="alert"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border border-red-900 bg-red-950 p-4 text-sm text-red-200"
        >
          <p>{status.message}</p>
          <button
            type="button"
            onClick={reset}
            className={`mt-3 ${DANGER_BUTTON}`}
          >
            Close
          </button>
        </div>
      )}

      {status.kind === 'confirm' && summary && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
          onClick={reset}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm import"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full flex-col gap-4 rounded-t-2xl bg-neutral-900 p-5 sm:max-w-[420px] sm:rounded-2xl"
          >
            <h2 className="text-lg font-semibold text-neutral-100">
              Import "{status.fileName}"
            </h2>
            <p className="text-sm text-neutral-300">
              {summary.modsImported} mod
              {summary.modsImported > 1 ? 's' : ''} will be imported,{' '}
              {summary.categoriesCreated} new categor
              {summary.categoriesCreated > 1 ? 'ies' : 'y'} will be created.
            </p>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium text-neutral-300">
                What should happen to the current list?
              </legend>
              <label className="flex items-center gap-2 rounded-lg px-1 py-3 text-sm text-neutral-200">
                <input
                  type="radio"
                  name="import-mode"
                  checked={mode === 'append'}
                  onChange={() => setMode('append')}
                  autoFocus
                  className="h-4 w-4"
                />
                Add to the current list
              </label>
              <label className="flex items-center gap-2 rounded-lg px-1 py-3 text-sm text-neutral-200">
                <input
                  type="radio"
                  name="import-mode"
                  checked={mode === 'replace'}
                  onChange={() => setMode('replace')}
                  className="h-4 w-4"
                />
                Replace the current list
              </label>
            </fieldset>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={reset} className={SECONDARY_BUTTON}>
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmImport}
                className={PRIMARY_BUTTON}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImportButton
