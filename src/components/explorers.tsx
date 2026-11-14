'use client'

import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useMemo, useState, type ReactNode } from 'react'
import { gridFor } from '@/lib/grid'

/** Filter pills with a sliding active background, and a grid whose cards animate in and out. */
export type FilterItem = { key: string | number; category: string; node: ReactNode }
export function FilterGrid({ items, categories, gridClass, label, empty }: {
  items: FilterItem[]; categories: { value: string; label: string }[]; gridClass?: string; label: string; empty?: ReactNode
}) {
  const [active, setActive] = useState('all')
  const available = useMemo(() => categories.filter((c) => items.some((i) => i.category === c.value)), [categories, items])
  const shown = active === 'all' ? items : items.filter((i) => i.category === active)
  if (!items.length) return <>{empty}</>
  return (
    <>
      {available.length > 1 && (
        <LayoutGroup id={label}>
          <div className="filters" role="group" aria-label={label}>
            {[{ value: 'all', label: 'All' }, ...available].map((c) => (
              <button key={c.value} type="button" className="filter-btn" aria-pressed={active === c.value} onClick={() => setActive(c.value)}>
                {active === c.value && <motion.span layoutId="pill" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                {c.label}
                <span className="count">{c.value === 'all' ? items.length : items.filter((i) => i.category === c.value).length}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      )}
      <motion.div layout className={gridClass ?? gridFor(shown.length)}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((item, i) => (
            <motion.div key={item.key} layout initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05, duration: 0.6 } }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}>
              {item.node}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export function Tabs({ tabs, label }: { tabs: { label: string; content: ReactNode }[]; label: string }) {
  const [active, setActive] = useState(0)
  return (
    <>
      <LayoutGroup id={label}>
        <div className="community-tabs" role="tablist" aria-label={label}>
          {tabs.map((t, i) => (
            <button key={t.label} id={`${label}-tab-${i}`} type="button" role="tab" className="filter-btn" aria-selected={active === i} aria-controls={`${label}-panel`} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)}
              onKeyDown={(e) => {
                const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : null
                if (next === null) return
                e.preventDefault(); setActive(next); document.getElementById(`${label}-tab-${next}`)?.focus()
              }}>
              {active === i && <motion.span layoutId="tab-pill" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              {t.label}
            </button>
          ))}
        </div>
      </LayoutGroup>
      <div id={`${label}-panel`} role="tabpanel" aria-labelledby={`${label}-tab-${active}`}>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }}>
            {tabs[active]?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

/** Home page “find your path” selector: list on the left, animated detail panel on the right. */
export function PathExplorer({ items }: { items: { title: string; summary: string; text: string; points: string[]; action: ReactNode; image: ReactNode }[] }) {
  const [active, setActive] = useState(0)
  const current = items[active]!
  return (
    <div className="explorer">
      <div className="explorer-list" role="tablist" aria-label="Explore IFF">
        {items.map((item, i) => (
          <button key={item.title} type="button" role="tab" className="explorer-item" aria-selected={active === i} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
            <span className="num">0{i + 1}</span>
            <span><strong>{item.title}</strong><small>{item.summary}</small></span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        ))}
      </div>
      <div className="explorer-panel" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div key={active} className="panel-bg" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>{current.image}</motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div key={active} className="explorer-panel-inner" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
            <span className="eyebrow light">Your IFF experience</span>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            <ul className="pill-list">{current.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <div>{current.action}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
