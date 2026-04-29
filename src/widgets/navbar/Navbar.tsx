"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/src/shared/lib/utils";
import { Button } from "@/src/shared/ui/button";
import { BrandLogo } from "@/src/shared/ui/brand-logo";
import { LanguageSwitcher } from "@/src/shared/ui/language-switcher";
import {
  NotificationOverlay,
  type NotificationItem,
} from "@/src/widgets/navbar/NotificationOverlay";
import { getAuthenticatedUser } from "@/src/features/auth/model/auth-sessions";
import {
  getApiErrorMessage,
  logoutUser,
} from "@/src/features/auth/model/auth-api";
import type { PublicUser } from "@/src/features/auth/model/types";

const NAV_LINKS = [
  { key: "home", href: "" },
  { key: "pricing", href: "/pricing" },
  { key: "explore", href: "/explore" },
  { key: "contact", href: "/contact" },
] as const;

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "New recipe suggestion",
    description:
      "Based on your interests, we prepared a quick healthy meal for tonight.",
    time: "5m ago",
    isUnread: true,
  },
  {
    id: "n-2",
    title: "Subscription reminder",
    description: "Your current plan renews in 2 days.",
    time: "1h ago",
    isUnread: true,
  },
  {
    id: "n-3",
    title: "Order update",
    description: "Your recent order has been delivered successfully.",
    time: "Yesterday",
  },
];

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<PublicUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  /* â”€â”€ sync auth state â”€â”€ */
  useEffect(() => {
    setUser(getAuthenticatedUser());

    const syncUser = () => setUser(getAuthenticatedUser());
    window.addEventListener("wajbaAi:auth-session-changed", syncUser);
    return () =>
      window.removeEventListener("wajbaAi:auth-session-changed", syncUser);
  }, []);

  /* â”€â”€ close popovers on outside click â”€â”€ */
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* â”€â”€ close mobile menu on route change â”€â”€ */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      setIsDropdownOpen(false);
      router.replace(`/${locale}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("auth.logoutError")));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === "") {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(fullPath);
  };

  const avatarInitial = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const unreadCount = SAMPLE_NOTIFICATIONS.filter((item) => item.isUnread).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* â”€â”€ Logo â”€â”€ */}
        <Link href={`/${locale}`} className="shrink-0">
          <BrandLogo locale={locale === "ar" ? "ar" : "en"} />
        </Link>

        {/* â”€â”€ Desktop nav â”€â”€ */}
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {NAV_LINKS.map(({ key, href }) => (
            <Link
              key={key}
              href={`/${locale}${href}`}
              className={cn(
                "relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                isActive(href)
                  ? "text-primary"
                  : "text-foreground hover:text-primary",
              )}
            >
              {t(`links.${key}`)}
              {isActive(href) && (
                <span className="absolute bottom-0.5 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* â”€â”€ Desktop right section â”€â”€ */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen((v) => !v);
                setIsDropdownOpen(false);
              }}
              className="relative flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary/50 hover:bg-muted"
              aria-label="Open notifications"
            >
              <Bell className="size-4.5" />
              {unreadCount > 0 ? (
                <span className="absolute -inset-e-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            {isNotificationsOpen ? (
              <NotificationOverlay
                items={SAMPLE_NOTIFICATIONS}
                className="absolute inset-e-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))]"
              />
            ) : null}
          </div>

          <LanguageSwitcher />

          {user ? (
            /* Authenticated */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-muted"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-white">
                  {avatarInitial}
                </span>
                <span className="max-w-28 truncate text-foreground">
                  {user.name}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                    isDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute inset-e-0 top-full z-50 mt-2 min-w-48 rounded-2xl border border-border bg-card p-1.5 shadow-xl">
                  <div className="border-b border-border px-3 pb-2.5 pt-2">
                    <p className="text-[11px] text-muted-foreground">
                      {t("auth.greeting")}
                    </p>
                    <p className="mt-0.5 max-w-44 truncate text-sm font-bold text-foreground">
                      {user.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-60"
                  >
                    <LogOut className="size-4 shrink-0" />
                    {isLoggingOut ? t("auth.logoutLoading") : t("auth.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest */
            <>
              <Button
                variant="ghost"
                className="h-9 rounded-full px-4 font-semibold"
                asChild
              >
                <Link href={`/${locale}/login`}>{t("auth.login")}</Link>
              </Button>
              <Button
                className="h-9 rounded-full px-5 font-semibold shadow-sm"
                asChild
              >
                <Link href={`/${locale}/register`}>{t("auth.register")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* â”€â”€ Mobile hamburger â”€â”€ */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((v) => !v);
              setIsMenuOpen(false);
              setIsDropdownOpen(false);
            }}
            className="relative flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label="Open notifications"
          >
            <Bell className="size-4.5" />
            {unreadCount > 0 ? (
              <span className="absolute -inset-e-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => {
              setIsMenuOpen((v) => !v);
              setIsNotificationsOpen(false);
            }}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isNotificationsOpen ? (
        <>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(false)}
            aria-label="Close notifications"
            className="fixed inset-0 z-40 bg-black/35 md:hidden"
          />
          <div className="fixed inset-x-3 top-20 z-50 md:hidden">
            <NotificationOverlay items={SAMPLE_NOTIFICATIONS} />
          </div>
        </>
      ) : null}

      {/* â”€â”€ Mobile menu â”€â”€ */}
      {isMenuOpen && (
        <div className="border-t border-border bg-card px-4 pb-5 pt-3 md:hidden">
          {/* Nav links */}
          <nav className="flex flex-col gap-0.5">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={`/${locale}${href}`}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  isActive(href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted hover:text-primary",
                )}
              >
                {t(`links.${key}`)}
              </Link>
            ))}
          </nav>

          {/* Auth section */}
          <div className="mt-4 space-y-2.5 border-t border-border pt-4">
            {user ? (
              <>
                {/* User info card */}
                <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                    {avatarInitial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">
                      {t("auth.greeting")}
                    </p>
                    <p className="truncate text-sm font-bold text-foreground">
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                >
                  <LogOut className="size-4 shrink-0" />
                  {isLoggingOut ? t("auth.logoutLoading") : t("auth.logout")}
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-full border-2 font-semibold"
                  asChild
                >
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("auth.login")}
                  </Link>
                </Button>
                <Button
                  className="h-10 w-full rounded-full font-semibold shadow-sm"
                  asChild
                >
                  <Link
                    href={`/${locale}/register`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("auth.register")}
                  </Link>
                </Button>
              </>
            )}

            {/* Language switcher */}
            <div className="flex justify-center pt-1">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

