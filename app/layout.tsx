import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlanoAI — Seu Plano de Carreira de 90 Dias com IA",
  description:
    "Descubra exatamente o que fazer nos próximos 90 dias para chegar no cargo e salário que você quer. Plano de carreira 100% personalizado gerado por IA.",
  keywords: "plano de carreira, IA, desenvolvimento profissional, crescimento profissional",
  openGraph: {
    title: "PlanoAI — Seu Plano de Carreira de 90 Dias com IA",
    description:
      "Plano de carreira 100% personalizado gerado por IA em menos de 2 minutos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#0f0f0f] text-[#ededed]">
        {children}
      </body>
    </html>
  );
}
