import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import OpenAI from 'openai'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })
    }

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'dcertvault', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as { secure_url: string })
        }
      ).end(buffer)
    })

    const fileUrl = uploadResult.secure_url

    // AI Analysis with OpenAI
    let title = 'Certificate'
    let issuer = 'Unknown'
    let category = 'General'
    let aiSummary = ''
    let skills: string[] = []

    try {
      const isImage = file.type.startsWith('image/')

      if (isImage) {
        const base64 = buffer.toString('base64')
        const mediaType = file.type

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: `data:${mediaType};base64,${base64}` }
                },
                {
                  type: 'text',
                  text: `Analyze this certificate image and return ONLY a JSON object with these fields:
                  {
                    "title": "certificate title",
                    "issuer": "issuing organization",
                    "category": "one of: Programming, AI & ML, Data Science, Cloud, Cybersecurity, Web Development, Internship, Workshop, Hackathon, Soft Skills, General",
                    "skills": ["skill1", "skill2", "skill3"],
                    "summary": "one sentence describing what this certificate demonstrates"
                  }`
                }
              ]
            }
          ],
          max_tokens: 500
        })

        const content = response.choices[0].message.content || ''
        const cleaned = content.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)

        title = parsed.title || title
        issuer = parsed.issuer || issuer
        category = parsed.category || category
        skills = parsed.skills || []
        aiSummary = parsed.summary || ''
      } else {
        aiSummary = 'PDF certificate uploaded. AI analysis available for image certificates.'
      }
    } catch {
      aiSummary = 'Certificate uploaded successfully.'
    }

    // Save to database
    const certificate = await prisma.certificate.create({
      data: {
        title,
        issuer,
        recipientName: '',
        category,
        aiSummary,
        skills,
        fileUrl,
        visibility: 'private',
        userId,
      }
    })

    return NextResponse.json({ success: true, certificate })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}