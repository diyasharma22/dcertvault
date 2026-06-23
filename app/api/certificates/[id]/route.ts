import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.certificate.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const cert = await prisma.certificate.update({
    where: { id },
    data: {
      ...(body.visibility && { visibility: body.visibility }),
      ...(body.title && { title: body.title }),
      ...(body.issuer && { issuer: body.issuer }),
      ...(body.recipientName !== undefined && { recipientName: body.recipientName }),
      ...(body.credentialId !== undefined && { credentialId: body.credentialId }),
      ...(body.verificationUrl !== undefined && { verificationUrl: body.verificationUrl }),
      ...(body.category && { category: body.category }),
    }
  })

  return NextResponse.json({ cert })
}