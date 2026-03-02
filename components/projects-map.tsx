"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nOScgdmlld0JveD0nMCAwIDE2IDknIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzknIGZpbGw9JyNlNWU3ZWInLz48L3N2Zz4="

type ProjectData = {
  id: string
  title: string
  country: string
  region: string
  cover: string
  location?: string
  description: string
  coordinates: { x: number; y: number }
  media: string[]
}

function isVideoSrc(src: string): boolean {
  return src.toLowerCase().endsWith(".mp4")
}

function MapPinItem({
  project,
  isSelected,
  onSelect,
}: {
  project: ProjectData
  isSelected: boolean
  onSelect: () => void
}) {
  const thumbSrc = project.cover ?? project.media[0] ?? "/images/gallery/g1.jpg"

  return (
    <button
      type="button"
      className="absolute cursor-pointer touch-manipulation"
      style={{
        left: `${project.coordinates.x}%`,
        top: `${project.coordinates.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      aria-label={`查看 ${project.title} 项目详情`}
      aria-pressed={isSelected}
    >
      <motion.div
        className="relative z-10 h-12 w-12 overflow-hidden rounded-full border-2 border-white ring-2 ring-primary/30 md:h-14 md:w-14"
        animate={{
          scale: isSelected ? 1.3 : 1,
          boxShadow: isSelected
            ? "0 0 0 4px rgba(26, 111, 181, 0.4), 0 8px 24px rgba(0,0,0,0.3)"
            : "0 2px 8px rgba(0,0,0,0.2)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Image
          src={thumbSrc}
          alt={project.title}
          fill
          className="object-cover bg-black object-center"
          sizes="56px"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onError={() => {
            console.warn(`Warning: missing project thumbnail ${thumbSrc}`)
          }}
        />
      </motion.div>
    </button>
  )
}

function ProjectDetailModal({
  project,
  open,
  onClose,
}: {
  project: ProjectData | null
  open: boolean
  onClose: () => void
}) {

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [mediaModeBySrc, setMediaModeBySrc] = useState<
    Record<string, "portrait" | "landscape">
  >({})

  useEffect(() => {
    if (!carouselApi) return
    const updateCurrent = () => setActiveIndex(carouselApi.selectedScrollSnap())
    updateCurrent()
    carouselApi.on("select", updateCurrent)
    carouselApi.on("reInit", updateCurrent)
    return () => {
      carouselApi.off("select", updateCurrent)
      carouselApi.off("reInit", updateCurrent)
    }
  }, [carouselApi])

  if (!project) return null
  const mediaList = project.media.filter((item) => Boolean(item && item.trim()))
  const renderMediaItem = (item: string, idx: number) => {
    const isPortrait = mediaModeBySrc[item] === "portrait"

    return (
      <CarouselItem key={item} className="h-full bg-sky-200/20 pl-0">
        {isVideoSrc(item) ? (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sky-200/20">
            {isPortrait && (
              <video
                src={item}
                className="pointer-events-none absolute inset-0 m-auto max-h-full max-w-full scale-125 object-contain object-center blur-2xl opacity-35"
                muted
                autoPlay
                loop
                playsInline
                aria-hidden
              />
            )}
            <video
              src={item}
              controls
              className="relative z-10 max-h-full max-w-full object-contain object-center"
              muted
              autoPlay
              loop
              playsInline
              onLoadedMetadata={(event) => {
                const video = event.currentTarget
                setMediaModeBySrc((prev) => ({
                  ...prev,
                  [item]:
                    video.videoHeight > video.videoWidth
                      ? "portrait"
                      : "landscape",
                }))
              }}
            />
          </div>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sky-200/20">
            {isPortrait && (
              <img
                src={item}
                alt=""
                className="pointer-events-none absolute inset-0 m-auto max-h-full max-w-full scale-125 object-contain object-center blur-2xl opacity-35"
                aria-hidden
              />
            )}
            <button
              type="button"
              onClick={() => setLightboxSrc(item)}
              className="relative z-10 flex h-full w-full cursor-zoom-in items-center justify-center"
              aria-label="打开大图预览"
            >
              <img
                src={item}
                alt={`${project.title} - 图片 ${idx + 1}`}
                className="max-h-full max-w-full object-contain object-center"
                loading="lazy"
                onLoad={(event) => {
                  const image = event.currentTarget
                  setMediaModeBySrc((prev) => ({
                    ...prev,
                    [item]:
                      image.naturalHeight > image.naturalWidth
                        ? "portrait"
                        : "landscape",
                  }))
                }}
                onError={() => {
                  console.warn(`Warning: missing project media image ${item}`)
                }}
              />
            </button>
          </div>
        )}
      </CarouselItem>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent
          className="flex max-h-[90vh] flex-col overflow-y-auto border-0 bg-white/90 p-0 shadow-2xl backdrop-blur-xl dark:bg-card/90 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto max-md:max-h-[92vh] max-md:translate-y-0 max-md:rounded-t-2xl max-md:border-t md:max-w-xl"
          showCloseButton={true}
        >
          <DialogTitle className="sr-only">
            {project.title} Project Details
          </DialogTitle>
          {/* Top: Media Carousel */}
          <div className="relative flex aspect-video max-h-[50vh] shrink items-center justify-center overflow-hidden bg-sky-200/20">
            <Carousel
              opts={{ align: "start", loop: true }}
              className="h-full w-full [&>[data-slot=carousel-content]]:h-full [&>[data-slot=carousel-content]>div]:h-full [&_[data-slot=carousel-item]]:h-full"
              setApi={setCarouselApi}
            >
              <CarouselContent className="h-full">
                {mediaList.length === 0 ? (
                  <CarouselItem className="h-full bg-sky-200/20 pl-0">
                    <div className="flex h-full w-full items-center justify-center bg-gray-900 text-sm text-gray-300">
                      Loading media...
                    </div>
                  </CarouselItem>
                ) : (
                  mediaList.map((item, idx) => renderMediaItem(item, idx))
                )}
              </CarouselContent>
              <CarouselPrevious className="left-3 z-30 border-white/35 bg-black/65 text-white hover:bg-black/80 disabled:opacity-40" />
              <CarouselNext className="right-3 z-30 border-white/35 bg-black/65 text-white hover:bg-black/80 disabled:opacity-40" />
            </Carousel>

            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center">
              <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-1 backdrop-blur-sm">
                {mediaList.map((item, index) => (
                  <button
                    key={`dot-${item}`}
                    type="button"
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/55 hover:bg-white/80"
                    }`}
                    aria-label={`切换到第 ${index + 1} 张媒体`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: Text Content */}
          <div className="grow p-6">
            <h3 className="text-base font-semibold text-foreground">
              {project.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {project.location ?? `${project.region}, ${project.country}`}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {project.description}
            </p>
            
          </div>
        </DialogContent>
      </Dialog>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            onClick={() => setLightboxSrc(null)}
            aria-label="关闭大图预览"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightboxSrc}
            alt="Lightbox preview"
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

const galleryImages = [
  { src: "/images/gallery/g1.jpg", alt: "现场案例图 1" },
  { src: "/images/gallery/g2.jpg", alt: "现场案例图 2" },
  { src: "/images/gallery/g3.jpg", alt: "现场案例图 3" },
  { src: "/images/gallery/g4.jpg", alt: "现场案例图 4" },
  { src: "/images/gallery/g5.jpg", alt: "现场案例图 5" },
]

const MAP_VIEWBOX = { width: 2000, height: 857 }

export function ProjectsMap({
  projectsData,
}: {
  projectsData: ProjectData[]
}) {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)

  const handleSelect = useCallback((project: ProjectData) => {
    setActiveProject((prev) => (prev?.id === project.id ? null : project))
  }, [])

  const handleClose = useCallback(() => {
    setActiveProject(null)
  }, [])

  const handleMapClick = useCallback(() => {
    setActiveProject(null)
  }, [])

  return (
    <main className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Global Projects
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
            Trusted by Clients in 5+ Countries
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            From luxury island resorts to urban fitness clubs, our surfing
            machines are making waves worldwide. Click on a pin to explore each
            project.
          </p>
        </div>

        {/* Map Container - click blank area to close modal */}
        <div
          className="relative mb-20 cursor-default overflow-hidden rounded-2xl border border-border bg-[oklch(0.95_0.04_210)]"
          onClick={handleMapClick}
          role="presentation"
        >
          <div
            className="relative w-full"
            style={{
              aspectRatio: `${MAP_VIEWBOX.width} / ${MAP_VIEWBOX.height}`,
            }}
          >
            {/* World Map Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/world-map.svg"
                alt=""
                className="h-full w-full object-contain"
                style={{
                  opacity: 0.45,
                  filter: "brightness(1.1) contrast(1.1)",
                }}
              />
            </div>

            <div
              className="pointer-events-none absolute inset-0 mix-blend-overlay"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(100, 180, 255, 0.08) 0%, transparent 70%)",
              }}
            />

            {/* Interactive Pins */}
            <div className="absolute inset-0">
              {projectsData.map((project) => (
                <MapPinItem
                  key={project.id}
                  project={project}
                  isSelected={activeProject?.id === project.id}
                  onSelect={() => handleSelect(project)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={activeProject ?? null}
          open={!!activeProject}
          onClose={handleClose}
        />

        {/* Project Gallery Carousel */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            On-Site Gallery
          </h2>
          <div className="relative">
            <Carousel
              opts={{ align: "start", loop: true, slidesToScroll: 1 }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {galleryImages.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
                  >
                    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover bg-black object-center transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                          onError={() => {
                            console.warn(`Warning: missing gallery image ${item.src}`)
                          }}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 hidden md:flex" />
              <CarouselNext className="-right-4 hidden md:flex" />
            </Carousel>
          </div>
        </section>
      </div>
    </main>
  )
}
