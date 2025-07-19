import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatTimeRemaining } from "@/lib/utils/time"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Clock, MessageSquare, Plus, Star, TrendingUp, Trophy, Users, Zap } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"


async function getRecentDebates() {
  return await prisma.debate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      creator: {
        select: { id: true, name: true, image: true },
      },
      _count: {
        select: {
          participations: true,
          arguments: true,
        },
      },
    },
  })
}

async function getTopDebaters() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      arguments: {
        select: {
          _count: {
            select: { votes: true },
          },
        },
      },
    },
  })

  return users
    .map((user) => ({
      ...user,
      totalVotes: user.arguments.reduce((sum, arg) => sum + arg._count.votes, 0),
    }))
    .filter((user) => user.totalVotes > 0)
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5)
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const [recentDebates, topDebaters] = await Promise.all([getRecentDebates(), getTopDebaters()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl -z-10" />
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Community Debate Arena
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the ultimate battle of opinions. Create compelling debates, choose your stance, and let the most
              persuasive arguments triumph in our vibrant community.
            </p>
            {session ? (
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/debates/create">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Debate
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-300 bg-transparent"
                >
                  <Link href="/debates">
                    <Zap className="mr-2 h-5 w-5" />
                    Browse Debates
                  </Link>
                </Button>
              </div>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/auth/signin">
                  <Star className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Debates */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Trending Debates</h2>
              </div>
              <Button
                variant="outline"
                asChild
                className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950 dark:hover:to-emerald-950 bg-transparent"
              >
                <Link href="/debates">View All</Link>
              </Button>
            </div>

            <div className="grid gap-6">
              {recentDebates.map((debate, index) => (
                <Card
                  key={debate.id}
                  className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 border-0"
                          >
                            {debate.category}
                          </Badge>
                          {index < 3 && (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                              <Star className="mr-1 h-3 w-3" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2 mb-3 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          <Link href={`/debates/${debate.id}`} className="hover:underline">
                            {debate.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base leading-relaxed">
                          {debate.description}
                        </CardDescription>
                      </div>
                      {debate.imageUrl && (
                        <div className="ml-6 relative">
                          <Image
                            src={debate.imageUrl || "/placeholder.svg"}
                            alt={debate.title}
                            className="w-24 h-24 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                            width={96}
                            height={96}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {debate.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-300 cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{debate._count.participations}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">{debate._count.arguments}</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{formatTimeRemaining(debate.expiresAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 ring-2 ring-white dark:ring-slate-800 shadow-md">
                          <AvatarImage src={debate.creator.image || ""} />
                          <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {debate.creator.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{debate.creator.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Top Debaters */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl dark:text-white">Hall of Fame</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDebaters.map((debater, index) => (
                    <div
                      key={debater.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                            : index === 1
                              ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
                              : index === 2
                                ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
                                : "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-700 shadow-md">
                        <AvatarImage src={debater.image || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {debater.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{debater.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-orange-600 dark:text-orange-400">{debater.totalVotes}</span>{" "}
                          votes earned
                        </p>
                      </div>
                      {index < 3 && (
                        <div className="text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-6 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-0 shadow-md"
                  asChild
                >
                  <Link href="/scoreboard">View Full Leaderboard</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl">Platform Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-slate-800/60"
                        >
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  }
                >
                  <StatsDisplay />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

async function StatsDisplay() {
  const [totalDebates, totalUsers, totalArguments] = await Promise.all([
    prisma.debate.count(),
    prisma.user.count(),
    prisma.argument.count(),
  ])

  const stats = [
    { label: "Active Debates", value: totalDebates, color: "from-blue-500 to-cyan-500", icon: MessageSquare },
    { label: "Community Members", value: totalUsers, color: "from-green-500 to-emerald-500", icon: Users },
    { label: "Arguments Shared", value: totalArguments, color: "from-purple-500 to-pink-500", icon: Zap },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">{stat.label}</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {stat.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}