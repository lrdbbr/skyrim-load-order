import ModList from './components/ModList/ModList'
import Toolbar from './components/Toolbar/Toolbar'
import SessionRestoredNotice from './components/Toolbar/SessionRestoredNotice'

function App() {
  return (
    <div className="min-h-svh bg-neutral-950 px-4 py-6 text-neutral-100 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Skyrim Load Order
        </h1>

        <SessionRestoredNotice />

        <Toolbar />

        <ModList />
      </div>
    </div>
  )
}

export default App
