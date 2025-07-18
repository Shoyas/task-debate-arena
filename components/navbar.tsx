"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Plus, Trophy, MessageSquare, User, LogOut, Sparkles } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Debates", href: "/debates", icon: MessageSquare },
    { name: "Leaderboard", href: "/scoreboard", icon: Trophy },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Debate Arena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 group"
              >
                <div className="p-1 rounded-lg group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900 dark:group-hover:to-purple-900 transition-all duration-300">
                  <item.icon className="h-4 w-4" />
                </div>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {session ? (
              <>
                <Button
                  asChild
                  size="sm"
                  className="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
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
                    <div className="flex items-center justify-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg m-2">
                      <Avatar className="h-12 w-12 shadow-lg">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
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
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950"
                    >
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950 dark:hover:to-pink-950 text-red-600 dark:text-red-400"
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                  className="md:hidden hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900 dark:hover:to-purple-900"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-0"
              >
                <div className="flex flex-col space-y-6 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 text-lg font-medium p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                        <item.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  {session && (
                    <Link
                      href="/debates/create"
                      className="flex items-center space-x-3 text-lg font-medium p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
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