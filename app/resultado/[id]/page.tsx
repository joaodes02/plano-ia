import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResultadoClient from "./ResultadoClient";
import type { Plano } from "@/types";

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await prisma.plano.findUnique({ where: { id } });

  if (!data || data.status !== "gerado") {
    notFound();
  }

  return <ResultadoClient plano={data as unknown as Plano} />;
}
