import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { joinDebateSchema } from "@/lib/validations/debate"
import { prisma } from "@/lib/prisma"


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { side } = joinDebateSchema.parse(body)

    // Check if debate exists and is active
    const debate = await prisma.debate.findUnique({
      where: { id: params.id },
    })

    if (!debate) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 })
    }

    if (!debate.isActive || new Date() > debate.expiresAt) {
      return NextResponse.json({ error: "Debate is not active" }, { status: 400 })
    }

    //! Check if user already joined this debate
    const existingParticipation = await prisma.debateParticipation.findUnique({
      where: {
        userId_debateId: {
          userId: session.user.id,
          debateId: params.id,
        },
      },
    })

    if (existingParticipation) {
      return NextResponse.json({ error: "Already joined this debate" }, { status: 400 })
    }

    const participation = await prisma.debateParticipation.create({
      data: {
        userId: session.user.id,
        debateId: params.id,
        side,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    return NextResponse.json(participation, { status: 201 })
  } catch (error) {
    console.error("Error joining debate:", error)
    return NextResponse.json({ error: "Failed to join debate" }, { status: 500 })
  }
}