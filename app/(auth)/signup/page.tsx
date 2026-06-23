'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', username: '', email: '', contact: '', password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
    } else {
      router.push('/login?registered=true')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-white font-bold text-2xl">D_CertVault</span>
          </Link>
          <h1 className="text-white text-2xl font-bold">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Start managing your certificates today</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Full Name</label>
              <input
                type="text" name="name" required
                placeholder="Diya Sharma"
                value={form.name} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">Username</label>
              <input
                type="text" name="username" required
                placeholder="diya_sharma"
                value={form.username} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">Email Address</label>
              <input
                type="email" name="email" required
                placeholder="diya@example.com"
                value={form.email} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">Contact Number</label>
              <input
                type="text" name="contact"
                placeholder="+91 98765 43210"
                value={form.contact} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">Password</label>
              <input
                type="password" name="password" required
                placeholder="••••••••"
                value={form.password} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}