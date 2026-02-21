-- CreateTable
CREATE TABLE "Plano" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "billingId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "dadosFormulario" JSONB NOT NULL,
    "planoGerado" JSONB,
    "cargoAtual" TEXT,
    "cargoObjetivo" TEXT,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plano_billingId_key" ON "Plano"("billingId");
