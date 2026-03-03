"use client"

import { useState, useRef, useCallback } from "react"
import { motion, useInView, AnimatePresence, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const models = [
  {
    name: "Mobile version of the surfing simulator",
    subtitle: "SS-M-Z30--2",
    image: "/images/models/model-1.jpg",
    badge: null,
    description:
      "Mobile assembly, all stainless steel structure, 2*30KW axial flow pumps",
  },
  {
    name: "Mobile upgraded version of the surfing simulator",
    subtitle: "SS-M-Z37-2",
    image: "/images/models/model-2.jpg",
    badge: null,
    description:
      "Mobile assembly, all stainless steel structure, 2*37KW axial flow pumps",
  },
  {
    name: "Double professional surfing simulator",
    subtitle: "SS-PH-Z37-6",
    image: "/images/models/model-3.jpg",
    badge: "Concrete / Stainless Steel",
    description:
      "6 *37KW custom axial flow pump and concrete structure pool",
  },
  {
    name: "Triple professional surfing simulators",
    subtitle: "SS-PH-Z37-8",
    image: "/images/models/model-4.jpg",
    badge: "Concrete / Stainless Steel",
    description:
      "8*37KW axial flow pumps and concrete structure pool",
  },
]

/* ─── Shared card component ─── */
function ModelCard({
  model,
  isActive,
  compact = false,
}: {
  model: (typeof models)[number]
  isActive: boolean
  compact?: boolean
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
        isActive
          ? "border-primary/30 bg-card shadow-2xl shadow-primary/10"
          : "border-border bg-card shadow-lg"
      }`}
    >
      <div
        className={`relative overflow-hidden ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`}
      >
        <Image
          src={model.image}
          alt={model.name}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          draggable={false}
          onError={() => {
            console.warn(`Warning: missing model image ${model.image}`)
          }}
        />
        {model.badge ? (
          <div
            className={`absolute ${compact ? "bottom-2 left-2" : "bottom-3 left-3"}`}
          >
            <span
              className={`rounded-md bg-foreground/80 font-medium text-background backdrop-blur-sm ${
                compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
              }`}
            >
              {model.badge}
            </span>
          </div>
        ) : null}
      </div>

      <div className={compact ? "p-3" : "p-5"}>
        <p
          className={`font-semibold uppercase tracking-wider text-primary ${
            compact ? "mb-0.5 text-[10px]" : "mb-1 text-xs"
          }`}
        >
          {model.subtitle}
        </p>
        <h3
          className={`font-bold text-foreground ${
            compact ? "text-sm" : "mb-2 text-lg"
          }`}
        >
          {model.name}
        </h3>
        {isActive && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`leading-relaxed text-muted-foreground ${
              compact ? "mt-1 text-[11px]" : "text-sm"
            }`}
          >
            {model.description}
          </motion.p>
        )}
      </div>
    </div>
  )
}

/* ─── Mobile / Tablet: single-center-card carousel (<1024px) ─── */
function MobileSlider({
  activeIndex,
  goTo,
}: {
  activeIndex: number
  goTo: (i: number) => void
}) {
  const [[page, direction], setPage] = useState([activeIndex, 0])

  const paginate = useCallback(
    (newDir: number) => {
      const next = activeIndex + newDir
      if (next >= 0 && next < models.length) {
        setPage([next, newDir])
        goTo(next)
      }
    },
    [activeIndex, goTo]
  )

  /* Keep in sync when parent changes activeIndex (e.g. dot click) */
  if (page !== activeIndex) {
    setPage([activeIndex, activeIndex > page ? 1 : -1])
  }

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const swipe = Math.abs(info.offset.x) * info.velocity.x
      if (info.offset.x < -40 || swipe < -800) paginate(1)
      else if (info.offset.x > 40 || swipe > 800) paginate(-1)
    },
    [paginate]
  )

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1, zIndex: 1 },
    exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0, scale: 0.92, zIndex: 0 }),
  }

  return (
    <div className="relative">
      {/* Peek edges of adjacent cards */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-0 flex w-10 items-center justify-center sm:w-16">
        {activeIndex > 0 && (
          <div className="h-4/5 w-full rounded-r-xl bg-muted/60" />
        )}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 flex w-10 items-center justify-center sm:w-16">
        {activeIndex < models.length - 1 && (
          <div className="h-4/5 w-full rounded-l-xl bg-muted/60" />
        )}
      </div>

      {/* Center card */}
      <div className="relative mx-auto w-[78vw] max-w-[420px] overflow-hidden sm:w-[65vw]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <ModelCard model={models[activeIndex]} isActive compact />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        onClick={() => paginate(-1)}
        disabled={activeIndex === 0}
        className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-lg transition-all hover:bg-secondary disabled:opacity-30 sm:left-2 sm:p-2.5"
        aria-label="Previous model"
      >
        <ChevronLeft className="h-4 w-4 text-foreground" />
      </button>
      <button
        onClick={() => paginate(1)}
        disabled={activeIndex === models.length - 1}
        className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-lg transition-all hover:bg-secondary disabled:opacity-30 sm:right-2 sm:p-2.5"
        aria-label="Next model"
      >
        <ChevronRight className="h-4 w-4 text-foreground" />
      </button>
    </div>
  )
}

/* ─── Desktop: multi-card center-magnify (>=1024px) ─── */
function DesktopSlider({
  activeIndex,
  setActiveIndex,
  goTo,
}: {
  activeIndex: number
  setActiveIndex: (i: number) => void
  goTo: (i: number) => void
}) {
  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-6 xl:gap-8">
        {models.map((model, index) => {
          const isActive = index === activeIndex
          const distance = Math.abs(index - activeIndex)

          return (
            <motion.div
              key={model.name}
              className="cursor-pointer"
              animate={{
                scale: isActive ? 1 : 0.85,
                opacity: distance > 1 ? 0.4 : isActive ? 1 : 0.7,
                zIndex: isActive ? 10 : 5 - distance,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => setActiveIndex(index)}
              style={{ flex: isActive ? "0 0 400px" : "0 0 260px" }}
            >
              <ModelCard model={model} isActive={isActive} />
            </motion.div>
          )
        })}
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo(activeIndex - 1)}
        disabled={activeIndex === 0}
        className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-3 shadow-lg transition-all hover:bg-secondary disabled:opacity-30"
        aria-label="Previous model"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button
        onClick={() => goTo(activeIndex + 1)}
        disabled={activeIndex === models.length - 1}
        className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-3 shadow-lg transition-all hover:bg-secondary disabled:opacity-30"
        aria-label="Next model"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>
    </div>
  )
}

/* ─── Main section ─── */
export function ProductSlider() {
  const [activeIndex, setActiveIndex] = useState(1)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const goTo = useCallback((idx: number) => {
    if (idx >= 0 && idx < models.length) setActiveIndex(idx)
  }, [])

  return (
    <section
      id="models"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-12 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center sm:mb-16"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Product Lineup
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            4 Core Models
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            From indoor compact machines to large outdoor commercial wave pools,
            SurfSmart covers every surfing scenario.
          </p>
        </motion.div>

        {/* Mobile / Tablet carousel (<lg) */}
        <div className="lg:hidden">
          <MobileSlider activeIndex={activeIndex} goTo={goTo} />
        </div>

        {/* Desktop multi-card (>=lg) */}
        <div className="hidden lg:block">
          <DesktopSlider
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            goTo={goTo}
          />
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:mt-10">
          {models.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Go to model ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
