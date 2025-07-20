import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    //! Check the argument exists
    const argument = await prisma.argument.findUnique({
      where: { id: params.id },
      include: { debate: true },
    })

    if (!argument) {
      return NextResponse.json({ error: "Argument not found" }, { status: 404 })
    }

    // Check debate is still active
    if (!argument.debate.isActive || new Date() > argument.debate.expiresAt) {
      return NextResponse.json({ error: "Debate is not active" }, { status: 400 })
    }

    //! Check if user is trying to vote on their own argument
    if (argument.authorId === session.user.id) {
      return NextResponse.json({ error: "Cannot vote on your own argument" }, { status: 400 })
    }

    // Check if user already voted on this argument
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_argumentId: {
          userId: session.user.id,
          argumentId: params.id,
        },
      },
    })

    if (existingVote) {
      // Remove vote (toggle)
      await prisma.vote.delete({
        where: { id: existingVote.id },
      })
      return NextResponse.json({ voted: false })
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId: session.user.id,
          argumentId: params.id,
        },
      })
      return NextResponse.json({ voted: true })
    }
  } catch (error) {
    console.error("Error voting on argument:", error)
    return NextResponse.json({ error: "Failed to vote on argument" }, { status: 500 })
  }
}