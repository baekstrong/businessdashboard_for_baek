import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, BarChart3, ShoppingCart, Trophy, Users, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import ContentCalendar from './pages/ContentCalendar'
import Analytics from './pages/Analytics'
import Conversions from './pages/Conversions'
import ContentRanking from './pages/ContentRanking'
import MemberFunnel from './pages/MemberFunnel'

const navItems = [
  { path: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { path: '/calendar', label: '콘텐츠 캘린더', icon: Calendar },
  { path: '/analytics', label: '채널 분석', icon: BarChart3 },
  { path: '/conversions', label: '구매 전환', icon: ShoppingCart },
  { path: '/ranking', label: '성과 랭킹', icon: Trophy },
  { path: '/funnel', label: '회원 전환', icon: Users },
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-border
        flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">이지스트렝스</h1>
            <p className="text-xs text-slate-500">비즈니스 대시보드</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-xs font-medium text-slate-600">백</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">백승덕</p>
              <p className="text-xs text-slate-500">관장</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-bold text-slate-900">이지스트렝스</h1>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/conversions" element={<Conversions />} />
            <Route path="/ranking" element={<ContentRanking />} />
            <Route path="/funnel" element={<MemberFunnel />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
