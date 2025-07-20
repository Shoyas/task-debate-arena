import { authOptions } from "@/lib/auth"
import { checkToxicContent } from "@/lib/moderation"
import { prisma } from "@/lib/prisma"
import { createArgumentSchema } from "@/lib/validations/debate"
import { getServerSession } from "next-auth"
import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, side } = createArgumentSchema.parse(body)

    //! Check for toxic content using simple word filtering
    const moderationResult = checkToxicContent(content)
    if (moderationResult.isToxic) {
      return NextResponse.json(
        {
          error: "Your argument contains inappropriate language",
          toxicWords: moderationResult.toxicWords,
        },
        { status: 400 },
      )
    }

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

    // Check if user joined this debate on the correct side
    const participation = await prisma.debateParticipation.findUnique({
      where: {
        userId_debateId: {
          userId: session.user.id,
          debateId: params.id,
        },
      },
    })

    if (!participation) {
      return NextResponse.json({ error: "Must join debate first" }, { status: 400 })
    }

    if (participation.side !== side) {
      return NextResponse.json({ error: "Cannot post argument for opposite side" }, { status: 400 })
    }

    const argument = await prisma.argument.create({
      data: {
        content,
        side,
        authorId: session.user.id,
        debateId: params.id,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { votes: true },
        },
      },
    })

    // Update participation to mark first argument posted
    if (!participation.firstArgumentPostedAt) {
      await prisma.debateParticipation.update({
        where: { id: participation.id },
        data: { firstArgumentPostedAt: new Date() },
      })
    }

    return NextResponse.json(argument, { status: 201 })
  } catch (error) {
    console.error("Error creating argument:", error)
    return NextResponse.json({ error: "Failed to create argument" }, { status: 500 })
  }
}