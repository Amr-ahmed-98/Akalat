import { getTranslations } from "next-intl/server";

import { TestimonialCard } from "./TestimonialCard";
import { QuoteIcon } from "./QuoteIcon";

type TestimonialsSectionProps = {
  locale: string;
};

type TestimonialMessage = {
  name: string;
  role: string;
  content: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function createAvatarDataUri(
  name: string,
  startColor: string,
  endColor: string,
) {
  const initials = getInitials(name);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112">
      <defs>
        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="112" height="112" rx="56" fill="url(#avatarGradient)" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        fill="#ffffff"
        font-family="Arial, sans-serif"
        font-size="36"
        font-weight="700"
      >
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export async function TestimonialsSection({
  locale,
}: TestimonialsSectionProps) {
  const t = await getTranslations("TestimonialsSection");
  const isArabic = locale === "ar";
  const testimonialMessages = t.raw("testimonials") as TestimonialMessage[];
  const avatarColors = [
    { start: "#FB5A2A", end: "#F9896B" },
    { start: "#011937", end: "#FB5A2A" },
  ];

  const testimonials = testimonialMessages.map((testimonial, index) => ({
    id: index + 1,
    ...testimonial,
    image: createAvatarDataUri(
      testimonial.name,
      avatarColors[index % avatarColors.length].start,
      avatarColors[index % avatarColors.length].end,
    ),
    delay: index * 200,
  }));

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Testimonials Cards - Left Side */}
          <div className="order-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:order-1 lg:col-span-8 lg:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                image={testimonial.image}
                delay={testimonial.delay}
                isArabic={isArabic}
              />
            ))}
          </div>

          {/* Heading & Stats - Right Side */}
          <div className="order-1 space-y-8 lg:order-2 lg:col-span-4 lg:sticky lg:top-32">
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-foreground">{t("title.first")} </span>
                <span className="text-primary inline-flex items-start gap-1.5 md:gap-2">
                  <span>{t("title.highlight")}</span>
                  <QuoteIcon className="h-5 w-5 shrink-0 -translate-y-1 text-accent opacity-60 md:h-7 md:w-7" />
                </span>
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>

            {/* Stats Text */}
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {t("description")}
            </p>

            {/* Decorative Element */}
            <div className="hidden lg:flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-sm">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-card bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {t("stats.joined")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("stats.desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
