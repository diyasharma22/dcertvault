'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Certificate {
  id: string
  title: string
  issuer: string
  category: string
  issueDate: string
  skills: string[]
  visibility: string
  fileUrl: string
  aiSummary: string
}

export default function VaultPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; username: string } | null>(null)
  const [certs, setCerts] = useState<Certificate[]>([])
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [search, setSearch] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('dcertvault_user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored)
    setUser(u)
    fetchCerts(u.id)
  }, [router])

  const fetchCerts = async (userId: string) => {
    const res = await fetch(`/api/certificates?userId=${userId}`)
    const data = await res.json()
    setCerts(data.certificates || [])
  }

  const handleFile = async (file: File) => {
    if (!user) return
    setUploading(true)
    setAnalyzing(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user.id)

    const res = await fetch('/api/certificates/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setUploading(false)
    setAnalyzing(false)

    if (res.ok) {
      fetchCerts(user.id)
    } else {
      alert(data.error || 'Upload failed')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDelete = async (e: React.MouseEvent, certId: string) => {
    e.stopPropagation()
    if (!confirm('Delete this certificate?')) return
    await fetch(`/api/certificates/${certId}`, { method: 'DELETE' })
    if (user) fetchCerts(user.id)
  }

  const handleToggleVisibility = async (e: React.MouseEvent, certId: string, current: string) => {
    e.stopPropagation()
    const newVis = current === 'public' ? 'private' : 'public'
    await fetch(`/api/certificates/${certId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility: newVis }),
    })
    if (user) fetchCerts(user.id)
  }

  const filtered = certs.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-white font-bold text-xl">D_CertVault</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">Dashboard</Link>
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition">Home</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Certificate Vault</h1>
          <p className="text-gray-400 mt-1">{certs.length} certificate{certs.length !== 1 ? 's' : ''} stored</p>
        </div>

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center mb-8 transition cursor-pointer ${dragOver ? 'border-purple-400 bg-purple-500/20' : 'border-white/20 hover:border-purple-500/50 bg-white/5'}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
          />
          {uploading ? (
            <div>
              <div className="text-4xl mb-3">{analyzing ? '🤖' : '📤'}</div>
              <p className="text-white font-medium">{analyzing ? 'AI is analyzing your certificate...' : 'Uploading...'}</p>
              <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-3">📤</div>
              <p className="text-white font-medium">Drag & drop your certificate here</p>
              <p className="text-gray-400 text-sm mt-1">or click to browse — PDF, PNG, JPG supported</p>
            </div>
          )}
        </div>

        {/* Search */}
        {certs.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, issuer, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
            />
          </div>
        )}

        {/* Certificates Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-gray-400">No certificates yet. Upload your first one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cert) => (
              <div
                key={cert.id}
                onClick={() => router.push(`/vault/${cert.id}`)}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition cursor-pointer"
              >
                {/* Preview */}
                <div className="bg-white/10 rounded-xl h-32 flex items-center justify-center mb-4 overflow-hidden">
                  {cert.fileUrl.includes('.pdf') ? (
                    <div className="text-center">
                      <div className="text-3xl">📄</div>
                      <p className="text-gray-400 text-xs mt-1">PDF Certificate</p>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cert.fileUrl} alt={cert.title} className="h-full w-full object-cover rounded-xl" />
                  )}
                </div>

                {/* Title + Badge */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm leading-tight flex-1 mr-2">
                    {cert.title || 'Untitled'}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${cert.visibility === 'public' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {cert.visibility}
                  </span>
                </div>

                <p className="text-purple-400 text-xs mb-2">{cert.issuer}</p>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">{cert.aiSummary}</p>

                {/* Skills */}
                {cert.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cert.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 3 && (
                      <span className="text-gray-500 text-xs px-1">+{cert.skills.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    onClick={(e) => handleToggleVisibility(e, cert.id, cert.visibility)}
                    className="text-blue-400 hover:text-blue-300 text-xs transition"
                  >
                    {cert.visibility === 'public' ? '🔒 Make Private' : '🌐 Make Public'}
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, cert.id)}
                    className="text-red-400 hover:text-red-300 text-xs transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}