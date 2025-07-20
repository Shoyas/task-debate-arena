import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "all-time"
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let dateFilter = {}
  const now = new Date()

  switch (period) {
    case "weekly":
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      dateFilter = { createdAt: { gte: weekAgo } }
      break
    case "monthly":
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      dateFilter = { createdAt: { gte: monthAgo } }
      break
    default:
      dateFilter = {}
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        arguments: {
          where: dateFilter,
          select: {
            _count: {
              select: { votes: true },
            },
          },
        },
        participations: {
          where: {
            debate: dateFilter,
          },
        },
      },
    })

    const scoreboard = users
      .map((user) => ({
        id: user.id,
        name: user.name,
        image: user.image,
        totalVotes: user.arguments.reduce((sum, arg) => sum + arg._count.votes, 0),
        debatesParticipated: user.participations.length,
      }))
      .filter((user) => user.totalVotes > 0 || user.debatesParticipated > 0)
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, limit)

    return NextResponse.json(scoreboard)
  } catch (error) {
    console.error("Error fetching scoreboard:", error)
    return NextResponse.json({ error: "Failed to fetch scoreboard" }, { status: 500 })
  }
}