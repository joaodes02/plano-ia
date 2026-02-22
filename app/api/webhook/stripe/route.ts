import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { gerarPlano } from '@/lib/gerarPlano'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const planoId = session.metadata?.planoId

    if (!planoId) return NextResponse.json({ ok: true })

    const plano = await prisma.plano.findUnique({ where: { id: planoId } })
    if (!plano || plano.status === 'gerado') return NextResponse.json({ ok: true })

    await gerarPlano(planoId)
  }

  return NextResponse.json({ ok: true })
}
