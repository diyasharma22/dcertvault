import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { certId, fileUrl } = await req.json()

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: fileUrl } },
            {
              type: 'text',
              text: `Analyze this certificate image in detail and return ONLY a JSON object:
              {
                "title": "exact certificate title",
                "issuer": "issuing organization name",
                "recipientName": "name of person receiving the certificate",
                "credentialId": "credential or certificate ID if visible, else empty string",
                "verificationUrl": "verification URL if visible, else empty string",
                "category": "one of: Programming, AI & ML, Data Science, Cloud, Cybersecurity, Web Development, Internship, Workshop, Hackathon, Soft Skills, General",
                "skills": ["skill1", "skill2", "skill3", "skill4"],
                "summary": "2-3 sentences describing what this certificate demonstrates, what was learned, and its significance"
              }`
            }
          ]
        }
      ],
      max_tokens: 800
    })

    const content = response.choices[0].message.content || ''
    const cleaned = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    await prisma.certificate.update({
      where: { id: certId },
      data: {
        title: parsed.title,
        issuer: parsed.issuer,
        recipientName: parsed.recipientName || '',
        credentialId: parsed.credentialId || '',
        verificationUrl: parsed.verificationUrl || '',
        category: parsed.category,
        skills: parsed.skills || [],
        aiSummary: parsed.summary || '',
      }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}