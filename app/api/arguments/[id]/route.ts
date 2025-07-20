import { authOptions } from "@/lib/auth";
import { checkToxicContent } from "@/lib/moderation";
import { prisma } from "@/lib/prisma";
import { canEditArgument } from "@/lib/utils/time";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if(!session?.user?.id){
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const body = await request.json()
    const {content} = body;

    if(!content || content.trim().length < 20){
      return NextResponse.json({error: 'Content must be at least 20 characters'}, {status: 400})
    }

    //! Get the argument
    const argument = await prisma.argument.findUnique({
      where: {id: params.id},
      include: {debate: true}
    })

    if(!argument){
      return NextResponse.json({error: "Argument not found"}, {status: 404})
    }
    
    // Check the user is author
    if(argument.authorId !== session.user.id){
      return NextResponse.json({error: 'You can only edit your own arguments'}, {status: 403})
    }

    //! Check debate is still active or not
    if (!argument.debate.isActive || new Date() > argument.debate.expiresAt) {
      return NextResponse.json({ error: "Debate is not active" }, { status: 400 })
    }

    //! Check 5 minutes edit permission
    if (!canEditArgument(new Date(argument.createdAt))) {
      return NextResponse.json({ error: "Edit time window has expired" }, { status: 400 })
    }

    //! Check toxic words
    const moderationResult = checkToxicContent(content)
    if(moderationResult.isToxic){
      return NextResponse.json(
        {
          error: 'Your argument contains inappropriate language',
          toxicWords: moderationResult.toxicWords,
        },
        {status: 400},
      )
    }

    //! Update the argument
    const updatedArgument = await prisma.argument.update({
      where: { id: params.id },
      data: { content, updatedAt: new Date() },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { votes: true },
        },
      },
    })

    return NextResponse.json(updatedArgument)

  } catch (error) {
    console.error('Error updating argument', error)
    return NextResponse.json({error: 'Failed to update argument'}, {status: 500})
  }
}

export async function DELETE(request: NextRequest, {params}: {params: {id: string}}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    //! Get the argument
    const argument = await prisma.argument.findUnique({
      where: { id: params.id },
      include: { debate: true },
    })

    if (!argument) {
      return NextResponse.json({ error: "Argument not found" }, { status: 404 })
    }

    // Check if user is the author
    if (argument.authorId !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own arguments" }, { status: 403 })
    }

    //! Check debate is still active or not
    if (!argument.debate.isActive || new Date() > argument.debate.expiresAt) {
      return NextResponse.json({ error: "Debate is not active" }, { status: 400 })
    }

    //! Check 5 minutes edit permission
    if (!canEditArgument(new Date(argument.createdAt))) {
      return NextResponse.json({ error: "Delete time window has expired" }, { status: 400 })
    }

    //! Delete the argument
    await prisma.argument.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting argument: ', error)
    return NextResponse.json({error: 'Failed to delete argument'}, {status: 500})
  }
}