import { useRef, useState, type ChangeEvent } from 'react'
import {
  applyImport,
  importCsv,
  importTxt,
  importXlsx,
  summarizeImport,
  type ImportMode,
  type ParsedModRow,
} from '../../lib/importers'

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
        `Format de fichier non supporté (.${extension ?? '?'}). Utilisez .txt, .csv, .xls ou .xlsx.`,
      )
  }
}

function ImportButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<ImportStatus>({ kind: 'idle' })
  const [mode, setMode] = useState<ImportMode>('append')

  const reset = () => setStatus({ kind: 'idle' })

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
            : 'Impossible de lire ce fichier.',
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
        className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-100"
      >
        Importer
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
            className="mt-3 rounded-lg border border-red-800 px-3 py-2 text-xs font-medium text-red-200"
          >
            Fermer
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
            aria-label="Confirmer l'import"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full flex-col gap-4 rounded-t-2xl bg-neutral-900 p-5 sm:max-w-[420px] sm:rounded-2xl"
          >
            <h2 className="text-lg font-semibold text-neutral-100">
              Importer « {status.fileName} »
            </h2>
            <p className="text-sm text-neutral-300">
              {summary.modsImported} mod
              {summary.modsImported > 1 ? 's' : ''}{' '}
              {summary.modsImported > 1
                ? 'vont être importés'
                : 'va être importé'}
              , {summary.categoriesCreated} nouvelle
              {summary.categoriesCreated > 1 ? 's' : ''} catégorie
              {summary.categoriesCreated > 1 ? 's' : ''}{' '}
              {summary.categoriesCreated > 1 ? 'seront créées' : 'sera créée'}.
            </p>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium text-neutral-300">
                Que faire de la liste actuelle ?
              </legend>
              <label className="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="radio"
                  name="import-mode"
                  checked={mode === 'append'}
                  onChange={() => setMode('append')}
                  className="h-4 w-4"
                />
                Ajouter à la liste actuelle
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="radio"
                  name="import-mode"
                  checked={mode === 'replace'}
                  onChange={() => setMode('replace')}
                  className="h-4 w-4"
                />
                Remplacer la liste actuelle
              </label>
            </fieldset>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmImport}
                className="rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-900"
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImportButton
