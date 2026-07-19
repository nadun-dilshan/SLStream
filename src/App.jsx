import { BrowserRouter, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import AppRoutes from './app/routes'
import useKeyboardNavigation from './hooks/useKeyboardNavigation'
import InstallPrompt from './components/InstallPrompt'

function Layout() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/live/')
  useKeyboardNavigation({ enabled: !isPlayer })

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(229,9,20,0.10),transparent_50%),linear-gradient(180deg,#0b0b0b_0%,#0e0e0e_60%,#0b0b0b_100%)]" />
      {!isPlayer && <Sidebar />}
      {!isPlayer && <Navbar />}
      <main className={isPlayer ? 'min-h-screen' : 'min-h-screen px-4 pb-20 pt-16 sm:px-6 lg:pl-32 lg:pr-8 lg:pt-20 xl:pl-36'}>
        <AppRoutes />
      </main>
      {!isPlayer && <BottomNav />}
      <InstallPrompt />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
