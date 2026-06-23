import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const certificate = await prisma.certificate.findUnique({ where: { id } })
  if (!certificate) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ certificate })
}