import { useEffect, useState } from 'react'
import { hadPersistedDataOnLoad } from '../../store/loadOrderStore'

const AUTO_HIDE_MS = 4000

function SessionRestoredNotice() {
  const [visible, setVisible] = useState(hadPersistedDataOnLoad)

  useEffect(() => {
    if (!visible) return
    const timeout = setTimeout(() => setVisible(false), AUTO_HIDE_MS)
    return () => clearTimeout(timeout)
  }, [visible])

  if (!visible) return null

  return (
    <div
      role="status"
      className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-300"
    >
      Session précédente restaurée
    </div>
  )
}

export default SessionRestoredNotice
