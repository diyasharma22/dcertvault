import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-white font-bold text-xl">D_CertVault</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition text-sm">
            Login
          </Link>
          <Link href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-32">
        <div className="inline-block bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm px-4 py-1 rounded-full mb-6">
          AI-Powered Certificate Management
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Upload Once.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Showcase Everywhere.
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
          Store, organize, verify, and showcase all your certificates in one intelligent digital vault. Let AI do the heavy lifting.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-base font-medium transition">
            Start for Free
          </Link>
          <Link href="/login" className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-xl text-base transition">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'AI Analysis', desc: 'Automatically extract title, issuer, skills, and dates from any certificate.' },
            { icon: '🔐', title: 'Secure Vault', desc: 'All your certificates in one place, organized and always accessible.' },
            { icon: '🌐', title: 'Public Showcase', desc: 'Share your achievements with a beautiful public profile link.' },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}