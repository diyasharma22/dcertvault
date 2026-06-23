import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { name, username, email, contact, password } = await req.json()

  if (!name || !username || !email || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  })

  if (existing) {
    return NextResponse.json({ error: 'Email or username already taken' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, username, email, contact, password: hashed }
  })

  return NextResponse.json({ success: true, userId: user.id })
}