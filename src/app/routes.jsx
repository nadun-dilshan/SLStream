import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PageSkeleton from '../components/PageSkeleton'

const Home = lazy(() => import('../pages/Home'))
const Player = lazy(() => import('../pages/Player'))
const Favorites = lazy(() => import('../pages/Favorites'))
const Category = lazy(() => import('../pages/Category'))
const Search = lazy(() => import('../pages/Search'))
const Settings = lazy(() => import('../pages/Settings'))
const NotFound = lazy(() => import('../pages/NotFound'))

export default function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<PageSkeleton />}>
      {/* CSS fade keyed by path - replaces framer-motion page transitions */}
      <div key={location.pathname} className="animate-fade-in min-h-full">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Navigate to="/" replace />} />
          <Route path="/live/:id" element={<Player />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/category/:name" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Suspense>
  )
}
