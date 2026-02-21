import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface PlanoGeradoBasic {
  resumo_executivo?: string
  mensagem_motivacional?: string
}

export async function enviarPlanoEmail(
  email: string,
  nome: string,
  planoGerado: Record<string, unknown>,
  cargoAtual: string | null,
  cargoObjetivo: string | null,
  planoId: string,
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY não configurada, email não enviado')
    return
  }

  const pg = planoGerado as unknown as PlanoGeradoBasic
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://planoai.com.br'
  const linkPlano = `${baseUrl}/resultado/${planoId}`
  const primeiroNome = nome.trim().split(' ')[0]

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;">

    <div style="background:#4f46e5;padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">Plano<span style="color:#c7d2fe;">AI</span></h1>
      <p style="color:#c7d2fe;margin:8px 0 0;font-size:14px;">Seu plano de carreira está pronto!</p>
    </div>

    <div style="padding:32px;">
      <h2 style="color:#1a1a1a;margin:0 0 16px;">Olá, ${primeiroNome}!</h2>

      <p style="color:#4a4a4a;line-height:1.6;margin:0 0 16px;">
        Seu plano de carreira personalizado foi gerado com sucesso.
      </p>

      <div style="background:#f0f0ff;border-left:4px solid #4f46e5;padding:16px;border-radius:0 8px 8px 0;margin:0 0 24px;">
        <p style="color:#4a4a4a;margin:0;font-size:14px;">
          <strong>${cargoAtual || 'Cargo atual'}</strong> → <strong style="color:#4f46e5;">${cargoObjetivo || 'Cargo objetivo'}</strong>
        </p>
      </div>

      <h3 style="color:#1a1a1a;margin:0 0 12px;font-size:16px;">Resumo Executivo</h3>
      <p style="color:#4a4a4a;line-height:1.6;margin:0 0 24px;font-size:14px;">
        ${(pg.resumo_executivo || '').substring(0, 500)}${(pg.resumo_executivo || '').length > 500 ? '...' : ''}
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="${linkPlano}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;">
          Ver meu plano completo
        </a>
      </div>

      <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0;">
        Este email foi enviado automaticamente pelo PlanoAI.
      </p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'PlanoAI <onboarding@resend.dev>',
    to: email,
    subject: `${primeiroNome}, seu Plano de Carreira está pronto!`,
    html,
  })

  console.log('Email enviado com sucesso para:', email)
}
