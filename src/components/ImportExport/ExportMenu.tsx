import { useEffect, useState } from 'react'
import { exportCsv } from '../../lib/exporters/exportCsv'
import { exportTxt } from '../../lib/exporters/exportTxt'
import { exportXlsx } from '../../lib/exporters/exportXlsx'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import { SECONDARY_BUTTON } from '../ui/buttonStyles'

type ExportFormat = 'txt' | 'csv' | 'xlsx'

const MIME_TYPES: Record<ExportFormat, string> = {
  txt: 'text/plain',
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10)
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function ExportMenu() {
  const mods = useLoadOrderStore((state) => state.mods)
  const categories = useLoadOrderStore((state) => state.categories)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleExport = async (format: ExportFormat) => {
    const fileName = `skyrim-load-order-${todayStamp()}.${format}`
    const content =
      format === 'txt'
        ? exportTxt(mods)
        : format === 'csv'
          ? exportCsv(mods, categories)
          : await exportXlsx(mods, categories)

    downloadBlob(new Blob([content], { type: MIME_TYPES[format] }), fileName)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={SECONDARY_BUTTON}
      >
        Exporter
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            aria-label="Formats d'export"
            className="absolute right-0 z-50 mt-2 flex w-48 flex-col gap-1 rounded-lg border border-neutral-700 bg-neutral-900 p-2 shadow-xl"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => handleExport('txt')}
              className="rounded-lg px-3 py-3 text-left text-sm text-neutral-100 transition-colors hover:bg-neutral-800 focus-visible:bg-neutral-800 focus-visible:outline-none"
            >
              Exporter en .txt
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleExport('csv')}
              className="rounded-lg px-3 py-3 text-left text-sm text-neutral-100 transition-colors hover:bg-neutral-800 focus-visible:bg-neutral-800 focus-visible:outline-none"
            >
              Exporter en .csv
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleExport('xlsx')}
              className="rounded-lg px-3 py-3 text-left text-sm text-neutral-100 transition-colors hover:bg-neutral-800 focus-visible:bg-neutral-800 focus-visible:outline-none"
            >
              Exporter en .xlsx
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ExportMenu
