'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { StoryConfig, StoryScene, StoryEffects } from '@/data/stories/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/* ─── Color tokens (OKLCH — child wonder palette) ───────────────────────── */
const c = {
  night:      'oklch(12% 0.04 270)',
  nightDeep:  'oklch(8% 0.03 270)',
  text:       'oklch(93% 0.01 80)',
  textSoft:   'oklch(85% 0.015 80 / 0.7)',
  gold:       'oklch(78% 0.14 80)',
  goldGlow:   'oklch(78% 0.14 80 / 0.3)',
  bar:        'oklch(93% 0.01 80 / 0.15)',
  pill:       'oklch(93% 0.01 80 / 0.08)',
  pillBorder: 'oklch(93% 0.01 80 / 0.1)',
}

/* ─── Easing ────────────────────────────────────────────────────────────── */
const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  outBack: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  spring: { type: 'spring' as const, stiffness: 300, damping: 24, mass: 0.8 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 18, mass: 0.6 },
  springGentle: { type: 'spring' as const, stiffness: 120, damping: 20, mass: 1 },
}

type DialogueLine = NonNullable<StoryScene['secondDialogue']>
const FULL_FRAME_STORY_IDS = new Set([
  'tanda',
  'viking-origin',
  'ratoncito-perez',
  'korea',
  'waraba-edge-light',
  'daga-one-year-wish',
  'anna-bogle',
])

function drawHrefForStory(story: StoryConfig, rawHref?: string) {
  const href = rawHref || '/toothfairy/app'
  if (href === '/toothfairy/app') {
    return `/toothfairy/app/draw?from=story&slug=${encodeURIComponent(story.id)}`
  }
  return href
}

function saveStoryContext(story: StoryConfig) {
  try {
    localStorage.setItem(
      'tfn-story-context',
      JSON.stringify({
        traditionSlug: story.id,
        storyId: story.id,
        storyTitle: story.title,
      })
    )
  } catch {
    // Navigate anyway; the story banner is optional if storage is unavailable.
  }
}

function speakerAlign(speaker?: string, fallback: CSSProperties['alignSelf'] = 'center'): CSSProperties['alignSelf'] {
  if (!speaker) return fallback
  return speaker.toLowerCase().includes('tanda') ? 'flex-end' : 'flex-start'
}

function dialogueBubbleStyle(
  color: string,
  speaker?: string,
  fallback: CSSProperties['alignSelf'] = 'center'
): CSSProperties {
  const hasSpeaker = Boolean(speaker)
  return {
    alignSelf: speakerAlign(speaker, fallback),
    background: hasSpeaker
      ? `linear-gradient(135deg, ${color}28, rgba(12, 18, 24, 0.76))`
      : 'rgba(12, 18, 24, 0.58)',
    border: `1px solid ${color}${hasSpeaker ? '55' : '30'}`,
    borderLeft: hasSpeaker ? `4px solid ${color}` : `1px solid ${color}30`,
    boxShadow: `0 14px 34px ${color}18`,
    backdropFilter: 'blur(10px)',
  }
}

function storybookPanelStyle(accentColor: string): CSSProperties {
  return {
    background: `linear-gradient(180deg, rgba(12, 18, 24, 0.84), rgba(7, 11, 18, 0.96))`,
    border: `1px solid ${accentColor}30`,
    borderBottom: 0,
    boxShadow: `0 -18px 54px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255,255,255,0.08)`,
    backdropFilter: 'blur(18px)',
  }
}

function storybookPanelClass(storybookFrame?: boolean) {
  return storybookFrame
    ? 'rounded-t-[28px] px-5 py-5 -mx-1 max-h-[47dvh] overflow-y-auto'
    : ''
}

function DialogueBubble({
  line,
  color,
  delay,
  fallback = 'center',
  emphasis = false,
}: {
  line: DialogueLine
  color: string
  delay: number
  fallback?: CSSProperties['alignSelf']
  emphasis?: boolean
}) {
  const align = speakerAlign(line.speaker, fallback)
  const x = align === 'flex-end' ? 34 : align === 'flex-start' ? -34 : 0

  return (
    <motion.div
      className="rounded-[18px] px-4 py-3 max-w-[82%]"
      style={dialogueBubbleStyle(color, line.speaker, fallback)}
      initial={{ opacity: 0, x, y: 12 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, ...ease.spring }}
    >
      {line.speaker && (
        <p
          className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5"
          style={{ color }}
        >
          {line.speaker}
        </p>
      )}
      <p
        className={emphasis ? 'text-base font-semibold leading-relaxed' : 'text-base leading-relaxed'}
        style={{
          color: c.text,
          fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
        }}
      >
        {line.text}
      </p>
    </motion.div>
  )
}

/* ─── Ambient Effects ───────────────────────────────────────────────────── */

function Particles({ config }: { config: NonNullable<StoryEffects['particles']> }) {
  const particles = useMemo(() =>
    Array.from({ length: config.count }).map((_, i) => ({
      size: config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin),
      x: Math.random() * 100,
      dur: config.durationMin + Math.random() * (config.durationMax - config.durationMin),
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * config.drift * 2,
      opacity: 0.3 + Math.random() * 0.4,
    })), [config])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: -10,
            background: config.glow
              ? `radial-gradient(circle, ${config.color} 0%, transparent 70%)`
              : config.color,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, typeof window !== 'undefined' ? window.innerHeight + 20 : 900],
            x: [0, p.drift],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear',
            x: { duration: p.dur * 0.7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
          }}
        />
      ))}
    </div>
  )
}

function Aurora({ config }: { config: NonNullable<StoryEffects['aurora']> }) {
  const bands = config.bands || 3
  return (
    <div className="absolute top-0 left-0 right-0 h-[40%] overflow-hidden pointer-events-none z-[3]">
      {Array.from({ length: bands }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[200%] h-[120px]"
          style={{
            top: `${10 + i * 15}%`,
            left: '-50%',
            background: `linear-gradient(90deg, transparent 0%, ${config.colors[0]} 20%, ${config.colors[1] || config.colors[0]} 40%, ${config.colors[2] || config.colors[0]} 60%, ${config.colors[0]} 80%, transparent 100%)`,
            filter: 'blur(30px)',
          }}
          animate={{
            x: ['-10%', '10%', '-10%'],
            opacity: [0.4, 0.7, 0.4],
            scaleY: [1, 1.3, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  )
}

function Sparkles({ active, color }: { active: boolean; color: string }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none z-[6]">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const dist = 60 + Math.random() * 80
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: '50%', top: '50%', width: 6, height: 6 }}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
            }}
            transition={{ duration: 0.8, delay: i * 0.04, ease: ease.out }}
          >
            <svg width="8" height="8" viewBox="0 0 16 16" fill={color}>
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
            </svg>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ─── Page Dots ─────────────────────────────────────────────────────────── */
function PageDots({ total, current, color }: { total: number; current: number; color: string }) {
  return (
    <div className="flex gap-2 items-center justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ background: i === current ? color : c.bar }}
          animate={{
            width: i === current ? 24 : 6,
            height: 6,
            opacity: i === current ? 1 : 0.4,
          }}
          transition={ease.spring}
        />
      ))}
    </div>
  )
}

/* ─── Sparkle Divider ───────────────────────────────────────────────────── */
function SparkleDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
      <div className="h-px w-8" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill={color} opacity="0.6" />
      </svg>
      <div className="h-px w-8" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}

/* ─── Typewriter ────────────────────────────────────────────────────────── */
function TypewriterText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setDisplayText('')
    setIsComplete(false)
    let index = 0
    intervalRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsComplete(true)
        onComplete()
      }
    }, 28)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [text])

  const skipToEnd = useCallback(() => {
    if (!isComplete) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplayText(text)
      setIsComplete(true)
      onComplete()
    }
  }, [isComplete, text, onComplete])

  return (
    <span onClick={skipToEnd} className="cursor-pointer">
      {displayText}
      {!isComplete && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block ml-0.5">|</motion.span>
      )}
    </span>
  )
}

/* ─── Scene Layout Renderers ────────────────────────────────────────────── */

function CoverLayout({ scene, accentColor }: { scene: StoryScene; accentColor: string }) {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...ease.springGentle, delay: 0.2 }}
      >
        <h1
          className="text-4xl sm:text-5xl font-bold leading-[1.15] whitespace-pre-line"
          style={{
            color: accentColor,
            fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
            textShadow: `0 0 60px ${accentColor}66`,
          }}
        >
          {scene.dialogue.text}
        </h1>
        {scene.dialogue.subtext && (
          <motion.p
            className="mt-6 text-base tracking-wide"
            style={{ color: c.textSoft, fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: ease.out }}
          >
            {scene.dialogue.subtext}
          </motion.p>
        )}
        <motion.div
          className="mt-10 flex items-center gap-2 justify-center"
          style={{ color: `${accentColor}80` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs tracking-widest uppercase">Tap to begin</span>
          <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>&rarr;</motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}

function CharacterLayout({ scene, accentColor }: { scene: StoryScene; accentColor: string }) {
  const isLeft = scene.character?.position === 'left'
  const speakerColor = scene.dialogue.speakerColor || accentColor

  return (
    <div className="relative z-20 flex flex-col h-full">
      {scene.character && (
        <div className={`flex-1 flex items-center ${isLeft ? 'justify-start pl-4' : 'justify-end pr-4'} pt-16`}>
          <motion.div
            className="relative"
            style={{ width: '55%', maxWidth: 240 }}
            initial={{ opacity: 0, x: isLeft ? -80 : 80, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={ease.springBouncy}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
            >
              <img
                src={scene.character.image}
                alt={scene.dialogue.speaker || ''}
                className="w-full h-auto rounded-3xl"
                style={{
                  boxShadow: `0 8px 40px ${speakerColor}50`,
                  border: `2px solid ${speakerColor}40`,
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      )}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: ease.out }}
        >
          {scene.dialogue.speaker && (
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: speakerColor }}>
              {scene.dialogue.speaker}
            </p>
          )}
          <p
            className="text-2xl sm:text-3xl font-bold leading-snug"
            style={{
              color: c.text,
              fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            {scene.dialogue.text}
          </p>
          {scene.dialogue.subtext && (
            <motion.p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: c.textSoft }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {scene.dialogue.subtext}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function DramaticLayout({
  scene,
  accentColor,
  storybookFrame = false,
}: {
  scene: StoryScene
  accentColor: string
  storybookFrame?: boolean
}) {
  const speakerColor = scene.dialogue.speakerColor || accentColor
  const secondColor = scene.secondDialogue?.speakerColor || accentColor
  const thirdColor = scene.thirdDialogue?.speakerColor || accentColor

  return (
    <div className={`relative z-20 flex flex-col h-full px-6 ${storybookFrame ? 'justify-end pb-20' : 'justify-center'}`}>
      <div
        className={storybookPanelClass(storybookFrame)}
        style={storybookFrame ? storybookPanelStyle(accentColor) : undefined}
      >
      {scene.dialogue.speaker && scene.characterAvatar && (
        <motion.div
          className="flex items-center gap-2.5 justify-center mb-4"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: ease.out, delay: 0.1 }}
        >
          <SpeakerAvatar image={scene.characterAvatar.image} color={speakerColor} alt={scene.characterAvatar.alt} />
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: speakerColor }}>
            {scene.dialogue.speaker}
          </p>
        </motion.div>
      )}
      <motion.p
        className={`${storybookFrame ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} leading-relaxed text-center`}
        style={{
          color: c.text,
          fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
          fontStyle: 'italic',
          textShadow: '0 2px 30px rgba(0,0,0,0.6)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: ease.out }}
      >
        {scene.dialogue.text}
      </motion.p>
      {scene.dialogue.subtext && (
        <motion.p
          className="mt-4 text-base leading-relaxed text-center"
          style={{ color: c.textSoft, fontStyle: 'italic' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: ease.out }}
        >
          {scene.dialogue.subtext}
        </motion.p>
      )}

      {(scene.secondDialogue || scene.thirdDialogue) && (
        <div className="mt-8 flex flex-col gap-4">
          {scene.secondDialogue && (
            <DialogueBubble line={scene.secondDialogue} color={secondColor} delay={0.6} fallback="flex-start" />
          )}
          {scene.thirdDialogue && (
            <DialogueBubble line={scene.thirdDialogue} color={thirdColor} delay={1.0} fallback="flex-end" />
          )}
        </div>
      )}
      </div>
    </div>
  )
}

function VictoryLayout({
  scene,
  accentColor,
  storybookFrame = false,
}: {
  scene: StoryScene
  accentColor: string
  storybookFrame?: boolean
}) {
  const secondColor = scene.secondDialogue?.speakerColor || accentColor
  const thirdColor = scene.thirdDialogue?.speakerColor || accentColor

  return (
    <div className={`relative z-20 flex flex-col h-full px-6 ${storybookFrame ? 'justify-end pb-20' : 'justify-center'}`}>
      <div
        className={storybookPanelClass(storybookFrame)}
        style={storybookFrame ? storybookPanelStyle(accentColor) : undefined}
      >
      <motion.h2
        className={`${storybookFrame ? 'text-2xl sm:text-3xl mb-5' : 'text-3xl sm:text-4xl mb-8'} font-bold text-center`}
        style={{
          color: c.gold,
          fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
          textShadow: `0 0 40px ${c.goldGlow}`,
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={ease.springBouncy}
      >
        {scene.dialogue.text}
      </motion.h2>

      <div className="flex flex-col gap-3">
        {scene.secondDialogue && (
          <DialogueBubble line={scene.secondDialogue} color={secondColor} delay={0.5} fallback="flex-end" />
        )}
        {scene.thirdDialogue && (
          <DialogueBubble line={scene.thirdDialogue} color={thirdColor} delay={0.8} fallback="flex-start" emphasis />
        )}
      </div>
      </div>
    </div>
  )
}

/** Small circular portrait shown beside a speaker name. */
function SpeakerAvatar({ image, color, alt }: { image: string; color: string; alt?: string }) {
  return (
    <motion.div
      className="rounded-full overflow-hidden flex-shrink-0"
      style={{
        width: 36,
        height: 36,
        border: `2px solid ${color}`,
        boxShadow: `0 0 18px ${color}66, 0 2px 10px rgba(0,0,0,0.4)`,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...ease.springBouncy, delay: 0.15 }}
    >
      <img src={image} alt={alt || ''} className="w-full h-full object-cover" />
    </motion.div>
  )
}

function NarrativeLayout({ scene, accentColor, typewriterDone, onTypewriterDone, storybookFrame = false }: {
  scene: StoryScene; accentColor: string; typewriterDone: boolean; onTypewriterDone: () => void; storybookFrame?: boolean
}) {
  const speakerColor = scene.dialogue.speakerColor || accentColor
  const secondColor = scene.secondDialogue?.speakerColor || accentColor
  const thirdColor = scene.thirdDialogue?.speakerColor || accentColor

  return (
    <div className={`relative z-20 flex flex-col justify-end h-full px-6 ${storybookFrame ? 'pb-20' : 'pb-24'}`}>
      <motion.div
        className={storybookPanelClass(storybookFrame)}
        style={storybookFrame ? storybookPanelStyle(accentColor) : undefined}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.out, delay: 0.3 }}
      >
        {scene.dialogue.speaker && (
          <motion.div
            className="flex items-center gap-2.5 mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: ease.out }}
          >
            {scene.characterAvatar && (
              <SpeakerAvatar
                image={scene.characterAvatar.image}
                color={speakerColor}
                alt={scene.characterAvatar.alt}
              />
            )}
            <p
              className="text-lg font-bold"
              style={{
                color: speakerColor,
                fontFamily: "var(--font-display, 'Alegreya'), serif",
                textShadow: `0 0 20px ${speakerColor}4d`,
              }}
            >
              {scene.dialogue.speaker}
            </p>
          </motion.div>
        )}
        <p
          className={`${storybookFrame ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} leading-relaxed whitespace-pre-line`}
          style={{
            color: c.text,
            fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
            fontStyle: 'italic',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            lineHeight: 1.7,
          }}
        >
          <TypewriterText
            key={scene.id}
            text={scene.dialogue.text}
            onComplete={onTypewriterDone}
          />
        </p>
        {scene.dialogue.subtext && typewriterDone && (
          <motion.p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: c.textSoft }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {scene.dialogue.subtext}
          </motion.p>
        )}
        {typewriterDone && (scene.secondDialogue || scene.thirdDialogue) && (
          <div className="mt-4 flex flex-col gap-3">
            {scene.secondDialogue && (
              <DialogueBubble line={scene.secondDialogue} color={secondColor} delay={0.15} />
            )}
            {scene.thirdDialogue && (
              <DialogueBubble line={scene.thirdDialogue} color={thirdColor} delay={0.3} emphasis />
            )}
          </div>
        )}
        {typewriterDone && <SparkleDivider color={accentColor} />}
      </motion.div>
    </div>
  )
}

function ProseLayout({ scene, accentColor }: { scene: StoryScene; accentColor: string }) {
  return (
    <div className="relative z-20 flex flex-col justify-end h-full px-5 pb-24">
      <motion.div
        className="overflow-y-auto"
        style={{
          maxHeight: '65%',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 4px, black calc(100% - 4px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 4px, black calc(100% - 4px), transparent 100%)',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.out, delay: 0.15 }}
      >
        {scene.dialogue.speaker && (
          <p className="text-sm font-bold uppercase tracking-widest mb-3"
             style={{ color: scene.dialogue.speakerColor || accentColor }}>
            {scene.dialogue.speaker}
          </p>
        )}
        <p
          className="text-[15px] sm:text-base leading-[1.85] whitespace-pre-line"
          style={{
            color: c.text,
            fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
            textShadow: '0 1px 10px rgba(0,0,0,0.7)',
          }}
        >
          {scene.dialogue.text}
        </p>
      </motion.div>
    </div>
  )
}

/** Interactive layout — asks the reader a question, captures answer to localStorage,
 *  then advances the story. Used for Tanda Scene 8 "The Question". */
function InteractiveLayout({
  scene, accentColor, storyId, onAdvance,
}: {
  scene: StoryScene
  accentColor: string
  storyId: string
  onAdvance: () => void
}) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const speakerColor = scene.dialogue.speakerColor || accentColor
  const ix = scene.interactive
  if (!ix) return null

  const handleSubmit = () => {
    const trimmed = answer.trim()
    try {
      if (trimmed.length > 0) {
        localStorage.setItem(ix.storageKey, trimmed)
      }
      if (ix.contextKey) {
        localStorage.setItem(
          ix.contextKey,
          JSON.stringify({
            traditionSlug: storyId,
            storyId,
            sceneId: scene.id,
            sourcedFromStory: true,
          })
        )
      }
    } catch {
      // localStorage unavailable — continue anyway
    }
    setSubmitted(true)
    // short pause for the "saved" beat, then advance
    setTimeout(onAdvance, 900)
  }

  const handleSkip = () => {
    setSubmitted(true)
    setTimeout(onAdvance, 200)
  }

  return (
    <div className="relative z-20 flex flex-col justify-between h-full px-5 pt-20 pb-8">
      {/* Top: Tanda avatar + speaker */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease.out }}
      >
        {scene.characterAvatar && (
          <div style={{ transform: 'scale(1.4)' }}>
            <SpeakerAvatar image={scene.characterAvatar.image} color={speakerColor} alt={scene.characterAvatar.alt} />
          </div>
        )}
        {scene.dialogue.speaker && (
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: speakerColor }}>
            {scene.dialogue.speaker}
          </p>
        )}
      </motion.div>

      {/* Middle: Tanda's question */}
      <motion.div
        className="text-center px-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: ease.out }}
      >
        <p
          className="text-xl sm:text-2xl leading-snug mb-3"
          style={{
            color: c.text,
            fontFamily: "var(--font-display, 'Alegreya'), serif",
            fontStyle: 'italic',
          }}
        >
          {scene.dialogue.text}
        </p>
        {scene.dialogue.subtext && (
          <p className="text-[15px] leading-relaxed" style={{ color: c.textSoft }}>
            {scene.dialogue.subtext}
          </p>
        )}
      </motion.div>

      {/* Bottom: input + CTAs */}
      <motion.div
        className="w-full flex flex-col gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: ease.out }}
      >
        <label className="text-xs uppercase tracking-widest" style={{ color: `${c.textSoft}` }}>
          {ix.prompt}
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={ix.placeholder}
          rows={3}
          disabled={submitted}
          className="w-full rounded-2xl px-4 py-3 text-base resize-none outline-none"
          style={{
            background: c.pill,
            border: `1.5px solid ${submitted ? speakerColor : c.pillBorder}`,
            color: c.text,
            fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
            boxShadow: submitted ? `0 0 0 3px ${speakerColor}22` : 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
          maxLength={500}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="flex-1 rounded-full py-3.5 text-base font-bold"
            style={{
              background: speakerColor,
              color: c.nightDeep,
              boxShadow: `0 4px 22px ${speakerColor}55`,
              opacity: submitted ? 0.6 : 1,
              cursor: submitted ? 'default' : 'pointer',
              fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
            }}
          >
            {submitted ? 'Saved — Tanda has it' : ix.ctaLabel}
          </button>
          {!submitted && ix.skipLabel && (
            <button
              onClick={handleSkip}
              className="rounded-full px-5 py-3.5 text-sm font-medium"
              style={{
                background: 'transparent',
                color: c.textSoft,
                border: `1px solid ${c.pillBorder}`,
                fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
              }}
            >
              {ix.skipLabel}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function CtaLayout({ scene, accentColor, nextStory, story }: {
  scene: StoryScene; accentColor: string;
  nextStory?: { id: string; title: string; region: string } | null;
  story?: StoryConfig;
}) {
  const router = useRouter()

  // Detect if this CTA is the "Draw a tooth for this story" entry point.
  // We write story context to localStorage before navigating so the app flow
  // can surface a banner even if the route query params are lost
  // (Phantom mobile strips query strings on deep-link redirects).
  const rawHref = scene.choiceHref || '/toothfairy/app'
  const href = story ? drawHrefForStory(story, rawHref) : rawHref
  const isDrawCta = story && href.startsWith('/toothfairy/app/draw')

  const handleDrawCtaClick = useCallback((e: React.MouseEvent) => {
    if (!isDrawCta || !story) return
    e.preventDefault()
    saveStoryContext(story)
    try {
      localStorage.setItem(
        'tfn-story-context',
        JSON.stringify({
          traditionSlug: story.id,
          storyId: story.id,
          storyTitle: story.title,
        })
      )
    } catch {
      // localStorage unavailable (private browsing) — navigate anyway; banner just won't render
    }
    router.push(href)
  }, [isDrawCta, story, href, router])

  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.out }}
      >
        <motion.div
          className="mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="56" height="56" viewBox="0 0 16 16" fill={c.gold}>
            <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
          </svg>
        </motion.div>

        {scene.dialogue.text && (
          <p
            className="text-xl sm:text-2xl leading-relaxed mb-8"
            style={{
              color: c.text,
              fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
              fontStyle: 'italic',
            }}
          >
            {scene.dialogue.text}
          </p>
        )}

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            href={href}
            onClick={isDrawCta ? handleDrawCtaClick : undefined}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg no-underline"
            style={{
              background: c.gold,
              color: c.nightDeep,
              boxShadow: `0 4px 30px ${c.goldGlow}, 0 0 60px oklch(78% 0.14 80 / 0.15)`,
              fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill={c.nightDeep}>
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
            </svg>
            {scene.choiceText || 'Create Your Keepsake'}
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/toothfairy/stories" className="text-xs no-underline" style={{ color: c.textSoft }}>
            &larr; All stories
          </Link>
          {nextStory && (
            <Link href={`/toothfairy/story/${nextStory.id}`} className="text-xs no-underline" style={{ color: accentColor }}>
              Next: {nextStory.title} &rarr;
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ─── Main StoryPlayer ──────────────────────────────────────────────────── */
function splitParagraphs(text?: string) {
  return (text || '')
    .split(/\n{2,}/)
    .map(part => part.trim())
    .filter(Boolean)
}

function ReaderParagraphs({
  text,
  className = '',
}: {
  text?: string
  className?: string
}) {
  const paragraphs = splitParagraphs(text)
  if (paragraphs.length === 0) return null

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        const lines = paragraph.split('\n')
        return (
          <p key={index} className={className}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </>
  )
}

function ReaderDialogueLine({
  line,
  color,
}: {
  line?: DialogueLine
  color: string
}) {
  if (!line) return null

  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}35`,
        boxShadow: `0 14px 34px ${color}12`,
      }}
    >
      {line.speaker && (
        <p
          className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ color }}
        >
          {line.speaker}
        </p>
      )}
      <ReaderParagraphs
        text={line.text}
        className="mb-2 last:mb-0 text-[17px] leading-relaxed"
      />
    </div>
  )
}

function FullFrameReader({
  story,
  scene,
  current,
  direction,
  accentColor,
  nextStory,
  goPrev,
  goNext,
}: {
  story: StoryConfig
  scene: StoryScene
  current: number
  direction: number
  accentColor: string
  nextStory?: { id: string; title: string; region: string } | null
  goPrev: () => void
  goNext: () => void
}) {
  const layout = scene.layout || 'narrative'
  const isCover = layout === 'cover'
  const isCta = layout === 'cta'
  const secondColor = scene.secondDialogue?.speakerColor || accentColor
  const thirdColor = scene.thirdDialogue?.speakerColor || accentColor
  const router = useRouter()
  const rawHref = scene.choiceHref || '/toothfairy/app'
  const href = drawHrefForStory(story, rawHref)
  const isDrawCta = href.startsWith('/toothfairy/app/draw')
  const canGoPrev = current > 0
  const canGoNext = current < story.scenes.length - 1 && !isCta

  const handleDrawCtaClick = useCallback((e: React.MouseEvent) => {
    if (!isDrawCta) return
    e.preventDefault()
    saveStoryContext(story)
    router.push(href)
  }, [isDrawCta, story, href, router])

  const handleReaderSurfaceClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null
    if (target?.closest('a, button, input, textarea, select, [role="button"]')) return

    if (e.clientX < window.innerWidth / 2) {
      goPrev()
    } else {
      goNext()
    }
  }, [goPrev, goNext])

  const pageVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28, scale: 0.985 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -20 : 20, scale: 0.99 }),
  }

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-hidden select-none"
      style={{ background: c.nightDeep, color: c.text }}
      onClick={handleReaderSurfaceClick}
    >
      <img
        src={scene.background}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-3xl"
        style={{ objectPosition: 'center center' }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${c.nightDeep} 0%, rgba(12,18,24,0.88) 46%, ${accentColor}20 100%)`,
        }}
      />

      <div className="relative z-20 mx-auto flex min-h-[100dvh] w-full max-w-[1260px] flex-col px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
        <header className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <Link
            href="/toothfairy/stories"
            className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] no-underline"
            style={{
              color: c.text,
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid ${accentColor}26`,
            }}
          >
            All stories
          </Link>
          <div className="min-w-0 text-right">
            <p className="truncate text-xs font-bold uppercase tracking-[0.16em]" style={{ color: `${c.textSoft}` }}>
              {story.title}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: accentColor }}>
              {current + 1} / {story.scenes.length}
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={scene.id}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: ease.out }}
            className="grid flex-1 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:items-center"
          >
            <figure
              className="relative mx-auto flex aspect-[4/5] max-h-[56dvh] w-full max-w-[520px] items-center justify-center overflow-hidden rounded-lg p-2 sm:aspect-[4/3] sm:max-h-[58dvh] sm:max-w-[760px] lg:aspect-[4/3] lg:max-h-[calc(100dvh-148px)] lg:max-w-none lg:p-3"
              style={{
                background: `linear-gradient(145deg, rgba(255,255,255,0.065), rgba(5,8,13,0.72)), ${c.nightDeep}`,
                border: `1px solid ${accentColor}38`,
                boxShadow: '0 28px 80px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <span
                className="pointer-events-none absolute inset-2 rounded-md"
                style={{
                  border: `1px solid ${accentColor}22`,
                  boxShadow: `inset 0 0 42px ${accentColor}12`,
                }}
              />
              <img
                src={scene.background}
                alt=""
                className="relative z-10 block h-full w-full rounded-md object-contain"
                style={{ filter: 'drop-shadow(0 20px 44px rgba(0,0,0,0.36))' }}
              />
            </figure>

            <article
              className="rounded-lg p-4 sm:p-5 lg:max-h-[calc(100dvh-148px)] lg:overflow-y-auto lg:p-6"
              style={{
                background: 'linear-gradient(180deg, rgba(12, 18, 24, 0.88), rgba(7, 11, 18, 0.96))',
                border: `1px solid ${accentColor}36`,
                boxShadow: '0 24px 70px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p
                  className="m-0 text-[11px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: accentColor }}
                >
                  {story.region}
                </p>
                <span
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(90deg, ${accentColor}55, transparent)` }}
                />
              </div>

              {scene.dialogue.speaker && (
                <p
                  className="mb-2 text-sm font-bold"
                  style={{ color: scene.dialogue.speakerColor || accentColor }}
                >
                  {scene.dialogue.speaker}
                </p>
              )}

              <h1
                className={`${isCover ? 'text-3xl sm:text-5xl' : 'text-[1.45rem] sm:text-3xl'} mb-4 font-bold leading-[1.08]`}
                style={{
                  color: isCover ? accentColor : c.text,
                  fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
                  textShadow: isCover ? `0 0 52px ${accentColor}55` : 'none',
                }}
              >
                {scene.dialogue.text}
              </h1>

              <ReaderParagraphs
                text={scene.dialogue.subtext}
                className="mb-4 text-[16px] leading-relaxed sm:text-[17px]"
              />

              <div className="flex flex-col gap-3">
                <ReaderDialogueLine line={scene.secondDialogue} color={secondColor} />
                <ReaderDialogueLine line={scene.thirdDialogue} color={thirdColor} />
              </div>

              {isCta && (
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={href}
                    onClick={isDrawCta ? handleDrawCtaClick : undefined}
                    className="inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-base font-bold no-underline"
                    style={{
                      background: accentColor,
                      color: c.nightDeep,
                      boxShadow: `0 12px 36px ${accentColor}38`,
                    }}
                  >
                    {scene.choiceText || 'Create Your Keepsake'}
                  </Link>
                  {nextStory && (
                    <Link
                      href={`/toothfairy/story/${nextStory.id}`}
                      className="text-sm no-underline"
                      style={{ color: accentColor }}
                    >
                      Next: {nextStory.title}
                    </Link>
                  )}
                </div>
              )}
            </article>
          </motion.section>
        </AnimatePresence>

        <footer className="mt-3 flex flex-col items-center gap-3 pb-1 sm:mt-4">
          <PageDots total={story.scenes.length} current={current} color={accentColor} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="rounded-full px-5 py-2.5 text-sm font-bold disabled:opacity-35"
              style={{
                color: c.text,
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${accentColor}26`,
              }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="rounded-full px-5 py-2.5 text-sm font-bold disabled:opacity-35"
              style={{
                color: c.nightDeep,
                background: accentColor,
                border: `1px solid ${accentColor}`,
                boxShadow: `0 10px 28px ${accentColor}24`,
              }}
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

interface StoryPlayerProps {
  story: StoryConfig
  nextStory?: { id: string; title: string; region: string } | null
}

export default function StoryPlayer({ story, nextStory }: StoryPlayerProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [typewriterDone, setTypewriterDone] = useState(false)

  const scene = story.scenes[current]
  const accentColor = story.colors?.accent || story.color
  const effects = story.effects

  const layout = scene?.layout || 'narrative'
  const fullFrameArtwork = FULL_FRAME_STORY_IDS.has(story.id)
  // Determine if current scene uses typewriter (narrative without special layout)
  const needsTypewriter = layout === 'narrative' && !fullFrameArtwork
  const isProse = layout === 'prose'

  const goNext = useCallback(() => {
    if (needsTypewriter && !typewriterDone) return
    if (layout === 'cta') return
    if (layout === 'interactive') return // interactive scene advances via its own buttons
    if (current < story.scenes.length - 1) {
      setDirection(1)
      setCurrent(c => c + 1)
      setTypewriterDone(false)
    }
  }, [current, story.scenes.length, typewriterDone, needsTypewriter, layout])

  const advanceFromInteractive = useCallback(() => {
    if (current < story.scenes.length - 1) {
      setDirection(1)
      setCurrent(c => c + 1)
      setTypewriterDone(false)
    }
  }, [current, story.scenes.length])

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1)
      setCurrent(c => c - 1)
      setTypewriterDone(false)
    }
  }, [current])

  useEffect(() => {
    // Non-typewriter layouts auto-complete
    if (!needsTypewriter || isProse) setTypewriterDone(true)
  }, [current, needsTypewriter, isProse])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [goNext, goPrev])

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: c.night, color: c.text }}>
        <p className="text-lg" style={{ opacity: 0.6 }}>This story is coming soon.</p>
      </div>
    )
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0, scale: 0.95 }),
  }

  // Should sparkles show?
  const showSparkles = effects?.sparkleOn?.includes(layout) || false

  if (fullFrameArtwork) {
    return (
      <FullFrameReader
        story={story}
        scene={scene}
        current={current}
        direction={direction}
        accentColor={accentColor}
        nextStory={nextStory}
        goPrev={goPrev}
        goNext={goNext}
      />
    )
  }

  function renderScene() {
    switch (layout) {
      case 'cover':
        return <CoverLayout scene={scene} accentColor={accentColor} />
      case 'character':
        return <CharacterLayout scene={scene} accentColor={accentColor} />
      case 'dramatic':
        return <DramaticLayout scene={scene} accentColor={accentColor} storybookFrame={fullFrameArtwork} />
      case 'victory':
        return <VictoryLayout scene={scene} accentColor={accentColor} storybookFrame={fullFrameArtwork} />
      case 'prose':
        return <ProseLayout scene={scene} accentColor={accentColor} />
      case 'cta':
        return <CtaLayout scene={scene} accentColor={accentColor} nextStory={nextStory} story={story} />
      case 'interactive':
        return <InteractiveLayout scene={scene} accentColor={accentColor} storyId={story.id} onAdvance={advanceFromInteractive} />
      default:
        return (
          <NarrativeLayout
            scene={scene}
            accentColor={accentColor}
            typewriterDone={typewriterDone}
            onTypewriterDone={() => setTypewriterDone(true)}
            storybookFrame={fullFrameArtwork}
          />
        )
    }
  }

  return (
    <div
      className="relative w-full h-[100dvh] max-w-[480px] mx-auto overflow-hidden select-none"
      style={{ background: c.nightDeep }}
    >
      {/* Ambient effects */}
      {effects?.aurora && <Aurora config={effects.aurora} />}
      {effects?.particles && <Particles config={effects.particles} />}
      <Sparkles active={showSparkles} color={accentColor} />

      {/* Background image with crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={scene.background}
          className="absolute inset-0 z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          {fullFrameArtwork && (
            <img
              src={scene.background}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-45"
              style={{ objectPosition: 'center center' }}
            />
          )}
          <img
            src={scene.background}
            alt=""
            className={fullFrameArtwork
              ? 'absolute left-0 right-0 top-0 w-full h-[52dvh] object-contain'
              : 'absolute inset-0 w-full h-full object-cover'
            }
            style={{
              objectPosition: fullFrameArtwork ? 'center top' : 'center 30%',
              filter: fullFrameArtwork ? 'drop-shadow(0 18px 42px rgba(0,0,0,0.38))' : undefined,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: fullFrameArtwork
                ? `linear-gradient(to bottom, transparent 0%, transparent 35%, ${c.nightDeep}88 53%, ${c.nightDeep}f7 72%, ${c.nightDeep} 100%)`
                : isProse
                ? `linear-gradient(to top, ${c.nightDeep} 0%, ${c.nightDeep}ee 35%, ${c.nightDeep}88 55%, ${c.nightDeep}44 75%, ${c.nightDeep}22 100%)`
                : `linear-gradient(to top, ${c.nightDeep}f5 0%, ${c.nightDeep}cc 30%, ${c.nightDeep}66 60%, ${c.nightDeep}33 100%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Character sprite — renders on ANY scene that has a character, except 'character' layout (which renders its own) */}
      <AnimatePresence mode="wait">
        {scene.character && layout !== 'character' && layout !== 'cover' && layout !== 'cta' && (
          <motion.div
            key={`char-${scene.id}`}
            className="absolute z-[12]"
            style={{
              left: scene.character.position === 'left' ? '5%' :
                    scene.character.position === 'right' ? '55%' : '15%',
              top: '8%',
              width: scene.character.position === 'center' ? '70%' : '42%',
              maxHeight: '40%',
            }}
            initial={{
              x: scene.character.enter === 'left' ? '-100%' :
                 scene.character.enter === 'right' ? '100%' : 0,
              y: scene.character.enter === 'top' ? '-100%' :
                 scene.character.enter === 'bottom' ? '100%' : 0,
              opacity: 0, scale: 0.85,
            }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={{
              x: scene.character.exit === 'left' ? '-100%' :
                 scene.character.exit === 'right' ? '100%' : 0,
              y: scene.character.exit === 'top' ? '-80%' :
                 scene.character.exit === 'bottom' ? '80%' : 0,
              opacity: 0, scale: 0.85,
            }}
            transition={ease.springBouncy}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
            >
              <img
                src={scene.character.image}
                alt={scene.dialogue.speaker || ''}
                className="w-full h-auto rounded-3xl"
                style={{
                  boxShadow: `0 8px 40px ${(scene.dialogue.speakerColor || accentColor)}50`,
                  border: `2px solid ${(scene.dialogue.speakerColor || accentColor)}40`,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content with slide animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={scene.id}
          className="absolute inset-0 z-20"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: ease.out }}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>

      {/* Tap zones — suppressed on CTA + interactive scenes (they have their own controls) */}
      {layout !== 'cta' && layout !== 'interactive' && (
        <div className="absolute inset-0 z-[35] flex">
          <div className="w-1/3 h-full" onClick={goPrev} />
          <div className="w-2/3 h-full" onClick={goNext} />
        </div>
      )}

      {/* Bottom: page dots + counter */}
      <div className="absolute bottom-0 left-0 right-0 z-40 pb-6 flex flex-col items-center gap-2">
        <PageDots total={story.scenes.length} current={current} color={accentColor} />
        <p className="text-[10px] tracking-wider" style={{ color: `${c.textSoft}` }}>
          {current + 1} / {story.scenes.length}
        </p>
      </div>

      {/* Corner vignette */}
      <div
        className="absolute inset-0 z-[15] pointer-events-none"
        style={{ boxShadow: `inset 0 0 120px ${c.nightDeep}` }}
      />
    </div>
  )
}
