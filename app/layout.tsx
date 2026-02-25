import type { Metadata } from "next";
import "./globals.css";
import { Fraunces, DM_Sans, Space_Mono } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

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
      <body
        className={`${fraunces.variable} ${dmSans.variable} ${spaceMono.variable} antialiased bg-[#0C0B08] text-[#EDE4D3]`}
        style={{ fontFamily: 'var(--font-dm)' }}
      >
        {children}
      </body>
    </html>
  );
}
