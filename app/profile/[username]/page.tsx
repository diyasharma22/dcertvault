import { prisma } from '@/app/lib/prisma'
import { notFound } from 'next/navigation'

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      certificates: {
        where: { visibility: 'public' },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) return notFound()

  const allSkills = [...new Set(user.certificates.flatMap(c => c.skills || []))]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-white font-bold text-xl">D_CertVault</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">{user.name[0].toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{user.name}</h1>
          <p className="text-purple-400 mt-1">@{user.username}</p>
          {user.bio && <p className="text-gray-400 mt-3 max-w-md mx-auto">{user.bio}</p>}

          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.certificates.length}</div>
              <div className="text-gray-400 text-sm">Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{allSkills.length}</div>
              <div className="text-gray-400 text-sm">Skills</div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {allSkills.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white font-semibold text-lg mb-4">⚡ Skills</h2>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <span key={skill} className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">🎓 Public Certificates</h2>
          {user.certificates.length === 0 ? (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-4xl mb-3">🔒</div>
              <p className="text-gray-400">No public certificates yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.certificates.map(cert => (
                <div key={cert.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{cert.title}</h3>
                      <p className="text-purple-400 text-sm mt-0.5">{cert.issuer}</p>
                    </div>
                    {cert.category && (
                      <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full shrink-0 ml-2">
                        {cert.category}
                      </span>
                    )}
                  </div>
                  {cert.aiSummary && (
                    <p className="text-gray-400 text-sm mb-3">{cert.aiSummary}</p>
                  )}
                  {cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map(skill => (
                        <span key={skill} className="bg-white/10 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}