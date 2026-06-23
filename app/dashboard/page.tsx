'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Stats {
  total: number
  public: number
  private: number
  skills: number
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; email: string; username: string } | null>(null)
  const [stats, setStats] = useState<Stats>({ total: 0, public: 0, private: 0, skills: 0 })

  useEffect(() => {
    const stored = localStorage.getItem('dcertvault_user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored)
    setUser(u)
    fetchStats(u.id)
  }, [router])

  const fetchStats = async (userId: string) => {
    const res = await fetch(`/api/certificates?userId=${userId}`)
    const data = await res.json()
    const certs = data.certificates || []
    const allSkills = new Set(certs.flatMap((c: { skills: string[] }) => c.skills || []))
    setStats({
      total: certs.length,
      public: certs.filter((c: { visibility: string }) => c.visibility === 'public').length,
      private: certs.filter((c: { visibility: string }) => c.visibility === 'private').length,
      skills: allSkills.size,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('dcertvault_user')
    router.push('/')
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-white font-bold text-xl">D_CertVault</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Hello, {user.name.split(' ')[0]} 👋</span>
          <Link href="/vault" className="text-gray-300 hover:text-white text-sm transition">Vault</Link>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}! 🎓</h1>
          <p className="text-gray-400 mt-1">Manage and showcase your certificates from one place.</p>
        </div>

        {/* Real Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Certificates', value: stats.total, icon: '📜' },
            { label: 'Public', value: stats.public, icon: '🌐' },
            { label: 'Private', value: stats.private, icon: '🔒' },
            { label: 'Skills Identified', value: stats.skills, icon: '⚡' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upload CTA */}
        <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-8 text-center mb-10">
          <div className="text-4xl mb-3">📤</div>
          <h2 className="text-white text-xl font-semibold mb-2">
            {stats.total === 0 ? 'Upload your first certificate' : 'Upload more certificates'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">AI will automatically extract all the details for you.</p>
          <Link href="/vault" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition">
            Go to Vault →
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🗂️', title: 'My Vault', desc: 'View and manage all certificates', href: '/vault' },
            { icon: '👤', title: 'Public Profile', desc: `/${user.username}`, href: `/profile/${user.username}` },
            { icon: '📊', title: 'Analytics', desc: 'View your learning progress', href: '#' },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-white font-medium mb-1">{item.title}</div>
              <div className="text-gray-400 text-sm">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}