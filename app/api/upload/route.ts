import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file: File | null = formData.get('file') as unknown as File

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = `${uuid()}-${file.name}`
  const filePath = path.join(process.cwd(), 'public/uploads', fileName)

  await writeFile(filePath, buffer)

  return NextResponse.json({ url: `/uploads/${fileName}` })
}