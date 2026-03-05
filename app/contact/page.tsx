import type { Metadata } from "next"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ContactForm } from "@/components/contact-form"
import { SocialLinks } from "@/components/social-links"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - SurfSmart",
  description:
    "Get in touch with SurfSmart for surfing machine quotes, technical support, or partnership inquiries.",
}

const faqItems = [
  {
    trigger: "Site Requirements",
    content:
      "As long as the dimensions fit, we can build it anywhere.",
  },
  {
    trigger: "Power Consumption",
    content:
      "37kW per pump. High efficiency, optimized for Middle East energy standards.",
  },
  {
    trigger: "Lead Time",
    content:
      "3 months for production in China + 1 month for global shipping.",
  },
  {
    trigger: "Installation",
    content:
      "Professional onsite guidance, completion within 30 days.",
  },
  {
    trigger: "Warranty",
    content:
      "12-month worry-free international warranty.",
  },
]

export default function ContactPage() {
  return (
    <main className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Contact Us
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
            Let{"'"}s Build Your Wave
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Whether you need a quote, technical consultation, or want to visit
            our factory, our team is ready to help. Reach out today and we will
            get back to you within 24 hours.
          </p>
        </div>

        {/* Two-column layout: FAQ (left) + Form (right) */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Expert Q&A */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Expert Q&A: Your Surfing Business, Solved.
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.trigger}
                  value={item.trigger}
                  className="border-border"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                    {item.trigger}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Right: Contact Form */}
          <section>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg ring-1 ring-primary/10 dark:border-primary/20 dark:bg-card dark:shadow-xl sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                Get a Quote
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info & Social Links */}
            <div className="mt-10 space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Reach Us Directly
              </h3>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <a
                  href="mailto:surfsmart_inc@163.com"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  surfsmart_inc@163.com
                </a>
                <a
                  href="tel:+8618628145993"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  +86 186 2814 5993
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  Qingdao, Shandong, China
                </span>
              </div>
              <div className="flex items-center gap-3">
                <SocialLinks variant="contact" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
