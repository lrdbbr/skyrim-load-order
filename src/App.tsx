import EditableTitle from './components/Header/EditableTitle'
import ModList from './components/ModList/ModList'
import Toolbar from './components/Toolbar/Toolbar'
import SessionRestoredNotice from './components/Toolbar/SessionRestoredNotice'
import { useApplyTheme } from './hooks/useApplyTheme'

function App() {
  useApplyTheme()

  return (
    <div className="min-h-svh bg-neutral-950 text-neutral-100">
      <div className="sticky top-0 z-20 bg-neutral-950 px-4 pt-6 pb-4 sm:px-6 sm:pt-10">
        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt=""
              className="header-logo h-10 w-auto shrink-0 sm:h-12"
            />
            <EditableTitle />
          </div>

          <Toolbar />
        </div>
      </div>

      <div className="px-4 pb-6 sm:px-6 sm:pb-10">
        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6">
          <SessionRestoredNotice />

          <ModList />
        </div>
      </div>
    </div>
  )
}

export default App
