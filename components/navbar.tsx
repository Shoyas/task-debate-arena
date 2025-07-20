"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogOut, Menu, MessageSquare, Plus, Sparkles, Trophy, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Debates", href: "/debates", icon: MessageSquare },
    { name: "Leaderboard", href: "/scoreboard", icon: Trophy },
  ]

  const isActive = (href: string) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-blue-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
              Debate Arena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:scale-105 group ${
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div
                    className={`p-1 rounded-lg transition-colors ${
                      active
                        ? "bg-blue-500"
                        : "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        active ? "text-white" : "text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    />
                  </div>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {session ? (
              <>
                <Button
                  asChild
                  size="sm"
                  className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/debates/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Debate
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800 transition-all duration-300"
                    >
                      <Avatar className="h-10 w-10 shadow-lg">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="bg-blue-500 text-white font-semibold">
                          {session.user?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-0 shadow-2xl"
                    align="end"
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg m-2">
                      <Avatar className="h-12 w-12 shadow-lg">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="bg-blue-500 text-white font-semibold">
                          {session.user?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user?.name && (
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{session.user.name}</p>
                        )}
                        {session.user?.email && (
                          <p className="w-[180px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                      onSelect={(event) => {
                        event.preventDefault()
                        signOut({ callbackUrl: "/" })
                      }}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/auth/signin">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-blue-100 dark:hover:bg-blue-900/20"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-0"
              >
                <div className="flex flex-col space-y-6 mt-8 p-6">
                  {navigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 text-lg font-medium p-3 rounded-xl transition-colors duration-300 ${
                          active
                            ? "bg-blue-500 text-white"
                            : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            active
                              ? "bg-white text-blue-600"
                              : "bg-blue-100 dark:bg-blue-900"
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 ${
                              active ? "text-blue-600" : "text-blue-600 dark:text-blue-400"
                            }`}
                          />
                        </div>
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}

                  {session && (
                    <Link
                      href="/debates/create"
                      className="flex items-center space-x-3 text-lg font-medium p-3 rounded-xl bg-amber-500 text-white shadow-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Create Debate</span>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}