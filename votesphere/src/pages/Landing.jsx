import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Vote,
  BarChart3,
  Fingerprint,
  Lock,
  Eye,
  ArrowRight,
  CheckCheck,
} from 'lucide-react'
import Logo from '../components/Logo'
import { getAllCandidates, getVoteCount, extractList } from '../services/candidateService'

const howItWorks = [
  {
    step: '01',
    title: 'Register with your Aadhaar',
    description: 'Create your voter account in minutes. Your identity is verified against a single, unique Aadhaar number.',
  },
  {
    step: '02',
    title: 'Review the candidates',
    description: 'Browse every registered candidate and their party before you decide — no pressure, no time limit.',
  },
  {
    step: '03',
    title: 'Cast your vote once',
    description: 'Confirm your choice and submit. The system permanently records that your ballot was cast.',
  },
  {
    step: '04',
    title: 'Watch results update',
    description: 'Vote tallies are available the moment they change, broken down by party.',
  },
]

export default function Landing() {
  const [stats, setStats] = useState({ candidates: null, votesCast: null });

  useEffect(() => {
    let cancelled = false
    async function loadStats() {
      try {
        const [candidatesRes, countRes] = await Promise.allSettled([getAllCandidates(), getVoteCount()])
        if (cancelled) return
        const candidates = candidatesRes.status === 'fulfilled' ? extractList(candidatesRes.value) : []
        const counts = countRes.status === 'fulfilled' ? extractList(countRes.value) : []
        const votesCast = counts.length
          ? counts.reduce((sum, c) => sum + (c.count ?? c.voteCount ?? 0), 0)
          : candidates.reduce((sum, c) => sum + (c.voteCount ?? 0), 0)
        setStats({ candidates: candidates.length, votesCast })
      } catch {
        if (!cancelled) setStats({ candidates: null, votesCast: null })
      }
    }
    loadStats()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        <div
          className="absolute inset-0 opacity-[0.07] ballot-rule"
          style={{ backgroundImage: 'none' }}
        />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-2 gap-16 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-gold-300 text-xs font-medium tracking-wide mb-6">
              <ShieldCheck size={14} />
              Secure • Transparent • Digital Voting 
              <br />
         
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold text-white mb-6 text-balance">
              Your vote. Your voice.<br />Your future.
            </h1>
            <p className="text-ink-300 text-lg leading-relaxed mb-9 max-w-md">
              A secure and transparent digital voting platform designed to make elections simple, accessible and
              trustworthy.
            </p>

             <p className="inline-flex items-center gap-2 text-gold-500 text-m font-medium tracking-wide mb-6"> •Designed By Siddharth Pant</p>
           
            <div className="flex flex-wrap items-center gap-4">
              
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-sm bg-gold-500 text-ink-900 font-medium text-sm hover:bg-gold-300 transition-colors"
              >
                Cast your vote
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-ink-700 text-white font-medium text-sm hover:bg-ink-800 transition-colors"
              >
                Log in
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-lg bg-ink-800 border border-ink-700 p-6 shadow-raised">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-medium text-ink-400 tracking-wide">SAMPLE BALLOT</span>
                <span className="text-xs text-civic-300 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-civic-300" /> Live
                </span>
              </div>
              {['Siddharth Pant', 'Rohan Prajapati', 'Ankit Kumar'].map((name, i) => (
                <div
                  key={name}
                  className={`flex items-center justify-between py-3.5 ${i !== 2 ? 'border-b border-ink-700/70' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-ink-700 text-gold-300 text-xs font-semibold flex items-center justify-center">
                      {name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <span className="text-sm text-white">{name}</span>
                  </div>
                  <span className="h-5 w-5 rounded-full border-2 border-ink-500 flex items-center justify-center">
                    {i === 0 && <CheckCheck size={12} className="text-gold-300" />}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-500 mt-3 text-center">Illustrative preview — not a real ballot</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat label="Registered candidates" value={stats.candidates} />
          <Stat label="Votes cast" value={stats.votesCast} />
          <Stat label="Election status" value="Open" isText />
          <Stat label="Ballot security" value="JWT + bcrypt" isText />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <div className="max-w-lg mb-14">
          <h2 className="font-display text-3xl font-semibold text-ink-900 mb-3">How it works</h2>
          <p className="text-ink-500 leading-relaxed">
            Four steps stand between registering and seeing your vote counted.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-100 rounded-lg overflow-hidden border border-ink-100">
          {howItWorks.map((item) => (
            <div key={item.step} className="bg-white p-6">
              <span className="font-mono text-xs text-gold-600">{item.step}</span>
              <h3 className="font-display text-base font-semibold text-ink-900 mt-3 mb-2">{item.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="bg-ink-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white mb-4">Built on real security, not promises</h2>
            <p className="text-ink-300 leading-relaxed max-w-md">
              VoteSphere doesn't just say it's secure — every account and ballot is backed by industry-standard
              authentication and one-vote enforcement at the database level.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <SecurityItem icon={Lock} title="Hashed passwords" description="Every password is hashed with bcrypt before it ever touches the database." />
            <SecurityItem icon={Fingerprint} title="Unique identity" description="Aadhaar numbers tie one account to one real, verifiable person." />
            <SecurityItem icon={ShieldCheck} title="Signed sessions" description="JSON Web Tokens authenticate every request and expire after 24 hours." />
            <SecurityItem icon={Vote} title="One vote, enforced" description="The backend rejects a second vote from an account, regardless of what the interface shows." />
          </div>
        </div>
      </section>

      {/* Transparent results */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 rounded-lg border border-ink-100 bg-white p-6 shadow-card">
          <div className="flex items-center gap-2 text-ink-400 text-xs font-medium mb-6">
            <BarChart3 size={14} /> RESULTS PREVIEW
          </div>
          {[
            { party: 'Party A', pct: 58 },
            { party: 'Party B', pct: 34 },
            { party: 'Party C', pct: 8 },
          ].map((row) => (
            <div key={row.party} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-ink-700">{row.party}</span>
                <span className="text-ink-400 font-mono">{row.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                <div className="h-full rounded-full bg-gold-500" style={{ width: `${row.pct}%` }} />
              </div>
            </div>
          ))}
          <p className="text-xs text-ink-400 mt-5">Illustrative distribution — see the Results page for live counts.</p>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="font-display text-3xl font-semibold text-ink-900 mb-4">Results, in the open</h2>
          <p className="text-ink-500 leading-relaxed mb-6 max-w-md">
            Every vote count comes straight from the database, broken down by party. No estimates, no delays that
            can't be explained — you refresh, you see the current tally.
          </p>
          <Link to="/results" className="inline-flex items-center gap-2 text-sm font-medium text-ink-900 hover:text-gold-600 transition-colors">
            View live results <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Why VoteSphere */}
      <section className="border-t border-ink-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
          <h2 className="font-display text-3xl font-semibold text-ink-900 mb-14">Why VoteSphere?</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            <WhyItem
              icon={Eye}
              title="Transparent by design"
              description="Every candidate, party and vote count is visible to registered voters at all times."
            />
            <WhyItem
              icon={ShieldCheck}
              title="Accountable infrastructure"
              description="Authentication, roles and vote integrity are enforced on the server, not just the interface."
            />
            <WhyItem
              icon={Vote}
              title="Built for everyone"
              description="A responsive, accessible interface that works the same on a laptop or a phone at a polling kiosk."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-900 border-t border-ink-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo variant="light" size="sm" />
          <p className="text-xs text-ink-400 text-center sm:text-right">
            Built as a demonstration project. Not affiliated with any government election commission.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Stat({ label, value, isText }) {
  return (
    <div>
      <p className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">
        {value === null || value === undefined ? (
          <span className="text-ink-300">—</span>
        ) : isText ? (
          value
        ) : (
          value.toLocaleString()
        )}
      </p>
      <p className="text-xs text-ink-500 mt-1">{label}</p>
    </div>
  )
}

function SecurityItem({ icon: Icon, title, description }) {
  return (
    <div className="rounded-lg border border-ink-800 bg-ink-800/60 p-5">
      <Icon size={18} className="text-gold-300 mb-3" />
      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-ink-400 leading-relaxed">{description}</p>
    </div>
  )
}

function WhyItem({ icon: Icon, title, description }) {
  return (
    <div>
      <div className="h-10 w-10 rounded-full bg-paper-100 flex items-center justify-center mb-4">
        <Icon size={18} className="text-ink-700" />
      </div>
      <h3 className="font-display text-base font-semibold text-ink-900 mb-2">{title}</h3>
      <p className="text-sm text-ink-500 leading-relaxed">{description}</p>
    </div>
  )
}
