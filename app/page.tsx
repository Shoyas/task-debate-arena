import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatTimeRemaining } from "@/lib/utils/time"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-3xl blur-3xl -z-10" />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-2xl border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-blue-500 rounded-2xl shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400">Community Debate Arena</h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the ultimate battle of opinions. Create compelling debates, choose your stance, and let the most
              persuasive arguments triumph in our vibrant community.
            </p>
            {session ? (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/debates/create">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Debate
                  </Button>
                </Link>
                <Link href="/debates">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-1 border-blue-500 text-blue-600 hover:bg-blue-500 dark:hover:bg-blue-900/20 bg-transparent"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Browse Debates
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg">
                  <Star className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Debates */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg shadow">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Trending Debates</h2>
              </div>
              <Link href="/debates">
                <Button
                  variant="outline"
                  className="hover:bg-blue-500 dark:hover:bg-blue-900/20 border-blue-500 text-blue-600 bg-transparent"
                >
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid gap-6">
              {recentDebates.map((debate, index) => (
                <Card
                  key={debate.id}
                  className="bg-white dark:bg-slate-900 dark:border-blue-900/30 shadow-lg hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0"
                          >
                            {debate.category}
                          </Badge>
                          {index < 3 && (
                            <Badge className="bg-amber-500 text-white border-0">
                              <Star className="mr-1 h-3 w-3" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2 mb-3 text-xl text-foreground">
                          <Link
                            href={`/debates/${debate.id}`}
                            className="text-slate-800 dark:text-slate-200 hover:underline"
                          >
                            {debate.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                          {debate.description}
                        </CardDescription>
                      </div>
                      {debate.imageUrl && (
                        <div className="ml-6 relative">
                          <Image
                            src={debate.imageUrl || "/placeholder.png"}
                            alt={debate.title}
                            className="w-24 h-24 object-cover rounded-xl shadow-lg"
                            width={96}
                            height={96}
                          />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {debate.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
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
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">{debate._count.arguments}</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{formatTimeRemaining(debate.expiresAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={debate.creator?.image || "/person-placeholder.png"} />
                          <AvatarFallback className="text-xs bg-blue-500 text-white">
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
            <Card className="bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-lg shadow">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl text-slate-800 dark:text-slate-200">Hall of Fame</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDebaters.map((debater, index) => (
                    <div
                      key={debater.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-amber-100 dark:border-amber-900/30"
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow ${
                          index === 0
                            ? "bg-amber-500 text-white"
                            : index === 1
                              ? "bg-blue-500 text-white"
                              : index === 2
                                ? "bg-purple-500 text-white"
                                : "bg-blue-500 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={debater.image || ""} />
                        <AvatarFallback className="bg-blue-500 text-white">{debater.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{debater.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-amber-600 dark:text-amber-400">{debater.totalVotes}</span>{" "}
                          votes earned
                        </p>
                      </div>
                      {index < 3 && (
                        <div className="text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Link href="/scoreboard">
                  <Button
                    variant="outline"
                    className="w-full mt-6 bg-white/90 dark:bg-slate-800/80 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                  >
                    View Full Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg shadow">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl text-slate-800 dark:text-slate-200">Platform Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-slate-700/60"
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
    { label: "Active Debates", value: totalDebates, color: "bg-blue-500", icon: MessageSquare },
    { label: "Community Members", value: totalUsers, color: "bg-purple-500", icon: Users },
    { label: "Arguments Shared", value: totalArguments, color: "bg-amber-500", icon: Zap },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-purple-100 dark:border-purple-900/30"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 ${stat.color} rounded-lg shadow`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">{stat.label}</span>
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{stat.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}
