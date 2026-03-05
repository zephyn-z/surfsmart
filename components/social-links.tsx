"use client"

import Image from "next/image"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const SOCIAL_ICONS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    src: "/images/social/whatsapp.svg",
    href: "https://www.linkedin.com/in/%E7%90%AA%E8%B5%9F-%E5%BC%A0-0565763b3/",
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    src: "/images/social/instagram.svg",
    href: "https://www.instagram.com/surfsmart_inc?igsh=aTRzdmM1b28yZ241/",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    src: "/images/social/linkedin.svg",
    href: "https://www.linkedin.com/in/%E7%90%AA%E8%B5%9F-%E5%BC%A0-0565763b3/",
    external: true,
  },
  {
    id: "wechat",
    label: "WeChat",
    src: "/images/social/wechat.svg",
    external: false,
  },
] as const

type SocialLinksVariant = "footer" | "contact"

const variantStyles = {
  footer: {
    iconSize: 24,
    className:
      "flex h-6 w-6 items-center justify-center opacity-80 transition-all duration-200 hover:scale-105 hover:opacity-100",
    wrapperClassName: "",
  },
  contact: {
    iconSize: 48,
    className:
      "flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-200 hover:scale-105 dark:border-white/10 dark:bg-white/5",
    wrapperClassName:
      "hover:border-primary/50 hover:bg-primary/10 dark:hover:border-primary/30",
  },
} as const

function SocialIcon({
  item,
  variant,
}: {
  item: (typeof SOCIAL_ICONS)[number]
  variant: SocialLinksVariant
}) {
  const styles = variantStyles[variant]
  const iconClass = variant === "footer" ? "h-6 w-6" : "h-7 w-7"

  const iconEl = (
    <Image
      src={item.src}
      alt=""
      width={styles.iconSize}
      height={styles.iconSize}
      className={iconClass}
    />
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.label}
        className={`${styles.className} ${styles.wrapperClassName}`}
      >
        {iconEl}
      </a>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={item.label}
          className={`${styles.className} ${styles.wrapperClassName}`}
        >
          {iconEl}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={8}
        className="w-auto border-border bg-card/95 p-4 backdrop-blur-md"
      >
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/social/wechat-qr.jpg"
            alt="WeChat QR Code"
            width={200}
            height={200}
            className="rounded-lg"
          />
          <p className="text-center text-sm text-muted-foreground">
            扫描二维码添加微信
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function SocialLinks({ variant }: { variant: SocialLinksVariant }) {
  return (
    <div className="flex items-center gap-4">
      {SOCIAL_ICONS.map((item) => (
        <SocialIcon key={item.id} item={item} variant={variant} />
      ))}
    </div>
  )
}
