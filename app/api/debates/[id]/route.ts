// import { prisma } from "@/lib/prisma"
// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const debate = await prisma.debate.findUnique({
//       where: { id: params?.id },
//       include: {
//         creator: {
//           select: { id: true, name: true, image: true },
//         },
//         participations: {
//           include: {
//             user: {
//               select: { id: true, name: true, image: true },
//             },
//           },
//         },
//         arguments: {
//           include: {
//             author: {
//               select: { id: true, name: true, image: true },
//             },
//             _count: {
//               select: { votes: true },
//             },
//           },
//           orderBy: { createdAt: "desc" },
//         },
//         _count: {
//           select: {
//             participations: true,
//             arguments: true,
//           },
//         },
//       },
//     })

//     if (!debate) {
//       return NextResponse.json({ error: "Debate not found" }, { status: 404 })
//     }

//     return NextResponse.json(debate)
//   } catch (error) {
//     console.error("Error fetching debate:", error)
//     return NextResponse.json({ error: "Failed to fetch debate" }, { status: 500 })
//   }
// }

//! Try - 1
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop()

    if (!id) {
      return NextResponse.json({ error: "Missing debate ID" }, { status: 400 })
    }

    const debate = await prisma.debate.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, image: true },
        },
        participations: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        arguments: {
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
            _count: {
              select: { votes: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            participations: true,
            arguments: true,
          },
        },
      },
    })

    if (!debate) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 })
    }

    return NextResponse.json(debate)
  } catch (error) {
    console.error("Error fetching debate:", error)
    return NextResponse.json({ error: "Failed to fetch debate" }, { status: 500 })
  }
}
