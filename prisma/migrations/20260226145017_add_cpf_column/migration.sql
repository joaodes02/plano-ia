-- AlterTable
ALTER TABLE "Plano" ADD COLUMN     "cpf" TEXT;

-- CreateIndex
CREATE INDEX "Plano_cpf_idx" ON "Plano"("cpf");
