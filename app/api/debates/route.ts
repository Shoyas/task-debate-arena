/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDebateSchema } from "@/lib/validations/debate";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const category = searchParams.get("category")
  const tag = searchParams.get("tag")
  const sort = searchParams.get("sort") || "newest"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  const where: any = {
    isActive: true,
  }

  if(search){
    where.OR = [
      {title: {contains: search, mode: 'insensitive'}},
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  //! Filter by category if it's != empty & != "all"
  if(category && category !== 'all') {
    where.category = category 
  }
  if(tag){
    where.tags = {has: tag}
  }

  const orderBy: any = {}
  switch (sort) {
    case "newest":
      orderBy.createdAt = "desc"
      break
    case "oldest":
      orderBy.createdAt = "asc"
      break
    case "ending-soon":
      orderBy.expiresAt = "asc"
      break
    case "most-voted":
      //! Here will be the complex query with vote counts
      orderBy.createdAt = "desc"
      break
    default:
      orderBy.createdAt = "desc"
  }

  try {
    const [debates, total] = await Promise.all([
      prisma.debate.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      prisma.debate.count({ where }),
    ])

    return NextResponse.json({
      debates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching debates:", error)
    return NextResponse.json({ error: "Failed to fetch debates" }, { status: 500 })
  }

}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
      return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const body = await request.json()
    const validatedData = createDebateSchema.parse(body)

    const expiresAt = new Date(Date.now() + validatedData.duration * 60 * 1000)

    const debate = await prisma.debate.create({
      data: {
        ...validatedData,
        expiresAt,
        creatorId: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(debate, {
      status: 201
    })


  } catch (error) {
    console.error('Error creating debate:', error)
    return NextResponse.json({error: 'Failed to create debate'}, {status: 500})
  }
}