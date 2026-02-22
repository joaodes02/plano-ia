import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const planoId = req.nextUrl.searchParams.get('state')

  if (!code || !planoId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/resultado/${planoId}?notion=erro`)
  }

  try {
    const credentials = Buffer.from(
      `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
    ).toString('base64')

    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('Notion token error:', tokenData)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/resultado/${planoId}?notion=erro`)
    }

    // Redireciona imediatamente para o resultado com o token
    // O componente NotionExport vai chamar POST /api/notion/create em background
    const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/resultado/${planoId}`)
    redirectUrl.searchParams.set('notion', 'criando')
    redirectUrl.searchParams.set('notionToken', tokenData.access_token)

    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    console.error('Erro no callback Notion:', err)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/resultado/${planoId}?notion=erro`)
  }
}
