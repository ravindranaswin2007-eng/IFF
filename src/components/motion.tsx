'use client'

import { animate, motion, MotionConfig, useInView, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ ease }}>{children}</MotionConfig>
}

export function Reveal({ children, delay = 0, y = 32, className, as = 'div' }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'section' | 'li' | 'article' }) {
  const Tag = motion[as]
  return (
    <Tag className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ duration: 0.9, delay, ease }}>
      {children}
    </Tag>
  )
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }
const item: Variants = { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } } }

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>{children}</motion.div>
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={item}>{children}</motion.div>
}

/** Animates the numeric part of values like "5,000+" once the number scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/)
  const target = match ? Number(match[2]!.replaceAll(',', '')) : 0
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value)
  useEffect(() => {
    if (!match) return
    if (!inView) return
    if (reduce) { setDisplay(value); return }
    const controls = animate(0, target, { duration: 2, ease, onUpdate: (v) => setDisplay(`${match[1]}${Math.round(v).toLocaleString('en-IN')}${match[3]}`) })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce])
  return <span ref={ref} aria-label={value}><span aria-hidden>{match ? display : value}</span></span>
}

/** Background layer that drifts slower than the page for depth. */
export function Parallax({ children, className, distance = 80 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance])
  return <motion.div ref={ref} className={className} style={{ y }}>{children}</motion.div>
}

/** Hero photo: slow zoom-out on load, then gentle parallax on scroll. */
export function HeroMedia({ children, className }: { children: ReactNode; className?: string }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, 160])
  return (
    <motion.div className={className} style={{ y }} initial={{ scale: 1.14, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2.4, ease }}>
      {children}
    </motion.div>
  )
}

const heroContainer: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } }
const heroItem: Variants = { hidden: { opacity: 0, y: 40, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease } } }
export function HeroText({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={heroContainer} initial="hidden" animate="show">{children}</motion.div>
}
export function HeroLine({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={heroItem}>{children}</motion.div>
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div className="progress-bar" style={{ scaleX }} aria-hidden />
}

export function DrawLine({ className }: { className?: string }) {
  return <motion.span className={className} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease }} aria-hidden />
}
