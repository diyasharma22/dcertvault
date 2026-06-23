'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Certificate {
  id: string
  title: string
  issuer: string
  recipientName: string
  category: string
  issueDate: string | null
  expiryDate: string | null
  credentialId: string
  verificationUrl: string
  skills: string[]
  visibility: string
  fileUrl: string
  aiSummary: string
}

interface FormState {
  title: string
  issuer: string
  recipientName: string
  credentialId: string
  verificationUrl: string
  category: string
}

export default function CertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [cert, setCert] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [resolvedId, setResolvedId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    title: '', issuer: '', recipientName: '',
    credentialId: '', verificationUrl: '', category: ''
  })

  useEffect(() => {
    params.then(p => setResolvedId(p.id))
  }, [params])

  useEffect(() => {
    if (!resolvedId) return
    const stored = localStorage.getItem('dcertvault_user')
    if (!stored) { router.push('/login'); return }
    fetchCert(resolvedId)
  }, [resolvedId, router])

  const fetchCert = async (id: string) => {
    const res = await fetch(`/api/certificates/detail?id=${id}`)
    const data = await res.json()
    if (data.certificate) {
      setCert(data.certificate)
      setForm({
        title: data.certificate.title || '',
        issuer: data.certificate.issuer || '',
        recipientName: data.certificate.recipientName || '',
        credentialId: data.certificate.credentialId || '',
        verificationUrl: data.certificate.verificationUrl || '',
        category: data.certificate.category || 'General',
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!resolvedId) return
    await fetch(`/api/certificates/${resolvedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setEditing(false)
    fetchCert(resolvedId)
  }

  const handleReanalyze = async () => {
    if (!cert || !resolvedId) return
    setAiLoading(true)
    await fetch('/api/certificates/reanalyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certId: cert.id, fileUrl: cert.fileUrl }),
    })
    setAiLoading(false)
    fetchCert(resolvedId)
  }

  const categories = ['Programming','AI & ML','Data Science','Cloud','Cybersecurity','Web Development','Internship','Workshop','Hackathon','Soft Skills','General']

  const fields: { label: string; key: keyof FormState }[] = [
    { label: 'Title', key: 'title' },
    { label: 'Issuer', key: 'issuer' },
    { label: 'Recipient Name', key: 'recipientName' },
    { label: 'Credential ID', key: 'credentialId' },
    { label: 'Verification URL', key: 'verificationUrl' },
  ]

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading certificate...</p>
      </main>
    )
  }

  if (!cert) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Certificate not found</p>
          <Link href="/vault" className="text-purple-400 hover:text-purple-300">Back to Vault</Link>
        </div>
      </main>
    )
  }

  const isPDF = cert.fileUrl.toLowerCase().includes('.pdf')

  const detailRows = [
    { label: '🏛️ Issuer', value: cert.issuer },
    { label: '👤 Recipient', value: cert.recipientName },
    { label: '🗂️ Category', value: cert.category },
    { label: '🔑 Credential ID', value: cert.credentialId },
    { label: '📅 Issue Date', value: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : null },
    { label: '⏳ Expiry', value: cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : null },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <Link href="/vault" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-white font-bold text-xl">D_CertVault</span>
        </Link>
        <Link href="/vault" className="text-gray-400 hover:text-white text-sm transition">
          Back to Vault
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4">
              {isPDF ? (
                <div className="h-80 flex flex-col items-center justify-center gap-3">
                  <div className="text-6xl">📄</div>
                  <p className="text-gray-400">PDF Certificate</p>
                  <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">
                    Open PDF
                  </a>
                </div>
              ) : (
                <img src={cert.fileUrl} alt={cert.title} className="w-full object-contain max-h-80" />
              )}
            </div>

            <div className="flex gap-3">
              <a href={cert.fileUrl} download className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-xl text-center transition">
                📥 Download
              </a>
              <button onClick={handleReanalyze} disabled={aiLoading} className="flex-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-sm py-2 px-4 rounded-xl transition disabled:opacity-50">
                {aiLoading ? '🤖 Analyzing...' : '🤖 Re-analyze with AI'}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-white leading-tight flex-1 mr-3">
                {cert.title || 'Untitled Certificate'}
              </h1>
              <button onClick={() => setEditing(!editing)} className="text-purple-400 hover:text-purple-300 text-sm border border-purple-500/30 px-3 py-1 rounded-lg transition shrink-0">
                {editing ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-3 mb-6">
                {fields.map(field => (
                  <div key={field.key}>
                    <label className="text-gray-400 text-xs mb-1 block">{field.label}</label>
                    <input
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-800 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500">
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm transition">
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {detailRows.filter(f => f.value).map(field => (
                  <div key={field.label} className="flex items-start gap-3">
                    <span className="text-gray-400 text-sm w-32 shrink-0">{field.label}</span>
                    <span className="text-white text-sm">{field.value}</span>
                  </div>
                ))}
                {cert.verificationUrl && (
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 text-sm w-32 shrink-0">🔗 Verify</span>
                    <a href={cert.verificationUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 text-sm transition">
                      Verify Certificate
                    </a>
                  </div>
                )}
              </div>
            )}

            {cert.aiSummary && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-5">
                <p className="text-purple-300 text-xs font-semibold mb-2">🤖 AI Summary</p>
                <p className="text-gray-300 text-sm leading-relaxed">{cert.aiSummary}</p>
              </div>
            )}

            {cert.skills?.length > 0 && (
              <div>
                <p className="text-gray-400 text-xs font-semibold mb-3">⚡ Skills Identified</p>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map(skill => (
                    <span key={skill} className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}