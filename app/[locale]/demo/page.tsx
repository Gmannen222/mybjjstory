'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BeltDisplay, BELT_LABELS } from '@/components/ui/BeltBadge'
import AvatarSVG, { DEFAULT_AVATAR, type AvatarConfig } from '@/components/avatar/AvatarSVG'

// Mock data for preview
const MOCK_AVATAR: AvatarConfig = {
  skinTone: '#D4A574',
  hairStyle: 'short',
  hairColor: '#2C1810',
  outfit: 'gi_white',
  beltRank: 'blue',
  academyColor: '#3b82f6',
  showInjuries: [],
  gender: 'male',
  facialHair: 'stubble',
  glasses: 'none',
  noseShape: 'default',
  faceShape: 'oval',
  bodyType: 'athletic',
  earType: 'cauliflower',
  eyeColor: '#4A7CB5',
  eyeShape: 'default',
  eyebrowStyle: 'normal',
  mouthStyle: 'smile',
  fingerTape: true,
  headband: false,
  mouthguard: false,
  kneePads: false,
  freckles: false,
  scar: 'eyebrow',
}

const AVATAR_GALLERY: { name: string; desc: string; belt: string; config: AvatarConfig }[] = [
  {
    name: 'Erik', desc: 'Erfaren competitor, liker no-gi', belt: 'purple',
    config: { ...DEFAULT_AVATAR, skinTone: '#FADCBC', hairStyle: 'buzz', hairColor: '#D4A76A', outfit: 'nogi_dark', beltRank: 'purple', gender: 'male', facialHair: 'stubble', bodyType: 'athletic', earType: 'cauliflower', eyeColor: '#4A7CB5', eyeShape: 'default', mouthStyle: 'serious', fingerTape: true, scar: 'eyebrow' },
  },
  {
    name: 'Sofia', desc: 'Nybegynner med mye energi', belt: 'white',
    config: { ...DEFAULT_AVATAR, skinTone: '#D4A574', hairStyle: 'ponytail', hairColor: '#6B3A2A', outfit: 'gi_white', beltRank: 'white', gender: 'female', bodyType: 'slim', eyeColor: '#4A7C59', eyeShape: 'almond', mouthStyle: 'grin', freckles: true },
  },
  {
    name: 'Marcus', desc: 'Old school, spiller half guard', belt: 'brown',
    config: { ...DEFAULT_AVATAR, skinTone: '#8D5524', hairStyle: 'bald', hairColor: '#1a1a1a', outfit: 'gi_blue', beltRank: 'brown', gender: 'male', facialHair: 'full_beard', bodyType: 'heavy', faceShape: 'square', eyeColor: '#2C1810', eyebrowStyle: 'thick', mouthStyle: 'neutral', kneePads: true },
  },
  {
    name: 'Nora', desc: 'Konkurransemaskin, elsker spider guard', belt: 'blue',
    config: { ...DEFAULT_AVATAR, skinTone: '#FADCBC', hairStyle: 'braids', hairColor: '#1a1a1a', outfit: 'gi_white', beltRank: 'blue', gender: 'female', bodyType: 'athletic', eyeColor: '#7B8B9A', eyeShape: 'round', mouthStyle: 'smile', headband: true, academyColor: '#ef4444' },
  },
  {
    name: 'Kenji', desc: 'Instructor og mentor', belt: 'black',
    config: { ...DEFAULT_AVATAR, skinTone: '#C68642', hairStyle: 'short', hairColor: '#1a1a1a', outfit: 'gi_black', beltRank: 'black', gender: 'male', facialHair: 'goatee', bodyType: 'athletic', faceShape: 'long', eyeColor: '#2C1810', eyeShape: 'narrow', eyebrowStyle: 'arched', mouthStyle: 'smile' },
  },
  {
    name: 'Lena', desc: 'Hobbyutøver, trener 3x i uka', belt: 'blue',
    config: { ...DEFAULT_AVATAR, skinTone: '#FADCBC', hairStyle: 'medium', hairColor: '#D4A76A', outfit: 'gi_white', beltRank: 'blue', gender: 'female', bodyType: 'average', eyeColor: '#4A7CB5', eyeShape: 'almond', glasses: 'round', mouthStyle: 'smile', freckles: true },
  },
  {
    name: 'Andre', desc: 'Ung talent, no-gi spesialist', belt: 'white',
    config: { ...DEFAULT_AVATAR, skinTone: '#5C3310', hairStyle: 'curly', hairColor: '#1a1a1a', outfit: 'nogi', beltRank: 'white', gender: 'male', bodyType: 'slim', faceShape: 'round', eyeColor: '#2C1810', eyeShape: 'round', mouthStyle: 'grin', mouthguard: true },
  },
  {
    name: 'Ingrid', desc: 'Comeback etter skade, sterk vilje', belt: 'purple',
    config: { ...DEFAULT_AVATAR, skinTone: '#D4A574', hairStyle: 'bun', hairColor: '#B24513', outfit: 'gi_blue', beltRank: 'purple', gender: 'female', bodyType: 'athletic', earType: 'cauliflower', eyeColor: '#4A7C59', eyeShape: 'default', eyebrowStyle: 'arched', mouthStyle: 'serious', fingerTape: true, kneePads: true, scar: 'cheek' },
  },
  {
    name: 'Thomas', desc: 'Trener for moro, elsker open mat', belt: 'white',
    config: { ...DEFAULT_AVATAR, skinTone: '#FADCBC', hairStyle: 'mohawk', hairColor: '#2C1810', outfit: 'nogi_dark', beltRank: 'white', gender: 'male', facialHair: 'mustache', bodyType: 'heavy', faceShape: 'round', eyeColor: '#8B7355', eyeShape: 'default', glasses: 'sport', mouthStyle: 'grin' },
  },
  {
    name: 'Amina', desc: 'Teknisk, fokuserer på submissions', belt: 'brown',
    config: { ...DEFAULT_AVATAR, skinTone: '#8D5524', hairStyle: 'long', hairColor: '#1a1a1a', outfit: 'gi_black', beltRank: 'brown', gender: 'female', bodyType: 'slim', faceShape: 'oval', eyeColor: '#2C1810', eyeShape: 'almond', eyebrowStyle: 'thin', mouthStyle: 'neutral', headband: true, academyColor: '#a855f7' },
  },
]

export default function DemoPage() {
  const [view, setView] = useState<'profile' | 'dashboard' | 'avatars'>('avatars')

  return (
    <div className="min-h-screen">
      {/* View switcher */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5 px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <span className="text-xs text-muted mr-2">DEMO:</span>
          {(['avatars', 'dashboard', 'profile'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === v ? 'bg-primary text-background' : 'text-muted hover:text-foreground'}`}
            >
              {v === 'avatars' ? 'Avatarer' : v === 'dashboard' ? 'Dashboard' : 'Profil'}
            </button>
          ))}
        </div>
      </div>

      {view === 'avatars' ? <DemoAvatarGallery /> : view === 'dashboard' ? <DemoDashboard /> : <DemoProfile />}
    </div>
  )
}

function DemoAvatarGallery() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Avatar-galleri</h1>
        <p className="text-muted text-sm">10 eksempler som viser mulighetene i avatar-systemet</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {AVATAR_GALLERY.map(({ name, desc, belt, config }) => (
          <div key={name} className="group relative bg-surface rounded-2xl border border-white/5 hover:border-primary/30 p-4 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_-8px_rgba(201,168,76,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex justify-center mb-3">
                <div className="bg-background rounded-xl p-2 border border-white/5 group-hover:border-primary/20 transition-colors">
                  <AvatarSVG config={config} size={120} />
                </div>
              </div>
              <h3 className="font-bold text-sm">{name}</h3>
              <div className="mt-1.5 w-full">
                <BeltDisplay rank={belt} degrees={belt === 'black' ? 3 : belt === 'brown' ? 1 : belt === 'purple' ? 2 : belt === 'blue' ? 1 : 0} size="sm" />
              </div>
              <p className="text-[11px] text-muted mt-2 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-muted mb-4">Tilpass hudfarge, frisyre, ansiktsform, kroppsbygning, gi/no-gi, BJJ-utstyr og mer</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['10 frisyrer', '6 hudtoner', '4 ansiktsformer', '4 kroppstyper', '4 øyeformer', '5 antrekk', 'Skjegg/bart', 'Briller', 'Tape/pannebånd', 'Fregner/arr'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-surface border border-white/5 rounded-full text-[11px] text-muted">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function DemoDashboard() {
  const weekCount = 2
  const weekGoal = 3
  const weekProgress = weekCount / weekGoal

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Hero card */}
      <div className="relative bg-surface rounded-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with progress ring */}
            <div className="group relative flex-shrink-0">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]" viewBox="0 0 100 200">
                  <ellipse cx="50" cy="100" rx="48" ry="98" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  <ellipse cx="50" cy="100" rx="48" ry="98" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${weekProgress * 300} 1000`} transform="rotate(-90, 50, 100)" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="relative bg-background rounded-2xl p-3 border border-white/10 group-hover:border-primary/40 transition-all duration-300">
                  <AvatarSVG config={MOCK_AVATAR} size={110} />
                </div>
              </div>
            </div>

            {/* Welcome + belt */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Velkommen, Gman!
              </h1>
              <div className="mt-3 flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-36 sm:w-44">
                  <BeltDisplay rank="blue" degrees={2} size="md" />
                </div>
                <span className="text-xs text-muted">Blått</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Frontline Academy
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  4 år
                </span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <button className="p-2.5 border border-white/10 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
              <button className="px-5 py-2.5 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-all hover:scale-105 hover:shadow-[0_0_20px_-3px_rgba(201,168,76,0.4)] text-sm whitespace-nowrap">
                + Ny trening
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="relative bg-surface rounded-xl p-4 text-center border border-orange-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent" />
          <div className="relative">
            <div className="text-lg mb-1">🔥</div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-400">5</div>
            <div className="text-xs text-muted mt-0.5">Streak</div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-white/5">
          <div className="text-lg mb-1">📅</div>
          <div className="text-2xl sm:text-3xl font-bold">2<span className="text-sm font-normal text-muted">/3</span></div>
          <div className="text-xs text-muted mt-0.5">Denne uka</div>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-white/5">
          <div className="text-lg mb-1">📊</div>
          <div className="text-2xl sm:text-3xl font-bold">8</div>
          <div className="text-xs text-muted mt-0.5">Denne måneden</div>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-white/5">
          <div className="text-lg mb-1">🥋</div>
          <div className="text-2xl sm:text-3xl font-bold text-primary">127</div>
          <div className="text-xs text-muted mt-0.5">Totalt</div>
        </div>
      </div>

      {/* Injury alert */}
      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
        <span className="text-2xl">🩹</span>
        <div>
          <div className="font-semibold text-red-400">1 aktiv skade</div>
          <div className="text-xs text-muted">Trykk for å se detaljer</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Hurtigvalg</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {[
            { icon: '🥋', label: 'Ny trening', accent: 'hover:border-blue-500/30' },
            { icon: '📋', label: 'Treninger', accent: 'hover:border-green-500/30' },
            { icon: '🏆', label: 'Konkurranser', accent: 'hover:border-yellow-500/30' },
            { icon: '📰', label: 'Feed', accent: 'hover:border-purple-500/30' },
            { icon: '🏅', label: 'Graderinger', accent: 'hover:border-orange-500/30' },
            { icon: '🩹', label: 'Skader', accent: 'hover:border-red-500/30' },
          ].map(({ icon, label, accent }) => (
            <div key={label} className={`bg-surface border border-white/5 rounded-xl p-3 text-center transition-all duration-200 hover:scale-[1.05] hover:shadow-lg cursor-pointer ${accent}`}>
              <div className="text-xl sm:text-2xl mb-1">{icon}</div>
              <div className="text-[11px] sm:text-xs font-medium text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent training */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Siste treninger</h2>
          <span className="text-xs text-primary font-medium">Se alle →</span>
        </div>
        <div className="space-y-2">
          {[
            { date: 'ons. 9. apr', type: 'Gi', icon: '🥋', duration: 90 },
            { date: 'tir. 8. apr', type: 'No-Gi', icon: '💪', duration: 60 },
            { date: 'man. 7. apr', type: 'Gi', icon: '🥋', duration: 90 },
            { date: 'lør. 5. apr', type: 'Open Mat', icon: '🤸', duration: 120 },
            { date: 'fre. 4. apr', type: 'Konkurranse', icon: '🏆', duration: 45 },
          ].map((s) => (
            <div key={s.date} className="flex items-center justify-between bg-surface hover:bg-surface-hover border border-white/5 hover:border-primary/20 rounded-xl p-4 transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <span className="font-medium text-sm">{s.date}</span>
                  <span className="text-xs text-muted ml-2">{s.type}</span>
                </div>
              </div>
              <span className="text-xs text-muted bg-surface-hover px-2 py-1 rounded-lg">{s.duration} min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active injuries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Aktive skader</h2>
          <span className="text-xs text-primary font-medium">Se alle →</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-surface hover:bg-surface-hover border border-white/5 rounded-xl p-4 transition-colors border-l-4 border-l-red-400 cursor-pointer">
            <div>
              <span className="font-medium text-sm">Kne</span>
              <span className="text-xs ml-2 text-yellow-400">Mild</span>
            </div>
            <span className="text-xs text-muted">3. apr</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoProfile() {
  const avatarConfig: AvatarConfig = {
    ...DEFAULT_AVATAR,
    ...MOCK_AVATAR,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Hero section */}
      <div className="relative bg-surface rounded-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative p-6 sm:p-8">
          <div className="flex justify-end gap-2 mb-4">
            <button className="px-4 py-2 bg-primary text-background font-semibold rounded-lg text-sm">Rediger</button>
            <button className="px-3 py-2 border border-white/10 rounded-lg text-sm text-muted">⚙</button>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Large avatar with glow */}
            <div className="group relative mb-5">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-background rounded-2xl p-4 border border-white/10 group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-[0_0_30px_-5px_rgba(201,168,76,0.3)]">
                <AvatarSVG config={avatarConfig} size={140} />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-surface-hover rounded text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                Rediger
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">Gman</h1>
            <p className="text-sm text-muted mt-1">@gman222</p>

            {/* Belt */}
            <div className="mt-4 w-48 sm:w-56">
              <BeltDisplay rank="blue" degrees={2} size="xl" />
              <p className="text-xs text-muted mt-1.5">Blått belte · 2 striper</p>
            </div>

            <p className="mt-4 text-sm text-muted max-w-md leading-relaxed">
              BJJ-utøver og evig nybegynner. Elsker guard play og de lange rundene.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Frontline Academy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                4 år med BJJ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Medlem siden apr. 2022
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { value: 2, label: 'Denne uka', icon: '🔥', highlight: false },
          { value: 127, label: 'Totalt trent', icon: '🥋', highlight: false },
          { value: 5, label: 'Graderinger', icon: '🏅', highlight: false },
          { value: 3, label: 'Konkurranser', icon: '🏆', highlight: false },
        ].map(({ value, label, icon, highlight }) => (
          <div key={label} className={`relative bg-surface rounded-xl p-4 text-center border transition-all duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer ${highlight ? 'border-primary/30' : 'border-white/5 hover:border-primary/20'}`}>
            <div className="text-lg mb-1">{icon}</div>
            <div className={`text-2xl sm:text-3xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</div>
            <div className="text-xs text-muted mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Injury alert */}
      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
        <span className="text-xl">🩹</span>
        <span className="font-semibold text-red-400 text-sm">1 aktiv skade</span>
      </div>

      {/* Details cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-surface rounded-xl p-5 border border-white/5">
          <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Favoritter</h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Guard</span>
              <span className="text-sm font-semibold text-blue-400">Half Guard</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Submission</span>
              <span className="text-sm font-semibold text-red-400">Guillotine</span>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 border border-white/5">
          <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Synlighet</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-sm font-medium">Kun følgere</span>
          </div>
          <p className="text-xs text-muted mt-2">Vises som: Gman</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: '🥋', label: 'Logg trening' },
          { icon: '🏅', label: 'Graderinger' },
          { icon: '🎨', label: 'Rediger avatar' },
        ].map(({ icon, label }) => (
          <div key={label} className="bg-surface hover:bg-surface-hover border border-white/5 hover:border-primary/20 rounded-xl p-4 text-center transition-all duration-200 cursor-pointer">
            <div className="text-2xl mb-1.5">{icon}</div>
            <div className="text-xs font-medium text-muted">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
