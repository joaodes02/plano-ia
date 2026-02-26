import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const planos = await prisma.plano.findMany({
    where: { cpf: null },
    select: { id: true, dadosFormulario: true },
  })

  let updated = 0
  for (const plano of planos) {
    const dados = plano.dadosFormulario as Record<string, unknown>
    const cpfRaw = dados?.cpf as string | undefined
    if (cpfRaw) {
      const cpfDigits = cpfRaw.replace(/\D/g, '')
      if (cpfDigits.length === 11) {
        await prisma.plano.update({
          where: { id: plano.id },
          data: { cpf: cpfDigits },
        })
        updated++
      }
    }
  }
  console.log(`Backfilled ${updated} of ${planos.length} plans`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
