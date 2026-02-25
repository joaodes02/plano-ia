"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormularioData } from "@/types";
import { validarCPF } from "@/lib/validacoes";
import { SharedNav } from "@/components/SharedNav";

const AREAS = [
  "Tecnologia", "Marketing", "Vendas", "Finanças", "RH",
  "Jurídico", "Saúde", "Educação", "Outro",
];

const SALARIOS = [
  "Até R$3k", "R$3k-5k", "R$5k-8k", "R$8k-12k", "R$12k-20k", "Acima de R$20k",
];

const TEMPOS_EXP = [
  "Menos de 1 ano", "1-3 anos", "3-5 anos", "5-10 anos", "Mais de 10 anos",
];

const PRAZOS = ["3 meses", "6 meses", "1 ano", "2 anos"];

const TEMPOS_DISPONIVEL = ["1-2h", "3-5h", "5-10h", "Mais de 10h"];

const PREFERENCIAS = [
  "Vídeos", "Livros", "Cursos online", "Prática/Projetos", "Mentoria", "Podcasts",
];

const STEPS = ["Situação Atual", "Objetivo", "Habilidades", "Contexto"];

const emptyForm: FormularioData = {
  cargo_atual: "", area: "", salario_atual: "", tempo_experiencia: "",
  cargo_objetivo: "", salario_objetivo: "", prazo: "", motivacao: "",
  habilidades: "", gaps: "", entrevistas: "", tempo_disponivel: "",
  nome: "", email: "", cpf: "", telefone: "", preferencias_aprendizado: [], contexto: "",
};

function loadFromSession(): FormularioData {
  if (typeof window === "undefined") return emptyForm;
  try {
    const saved = localStorage.getItem("planoai_form");
    return saved ? { ...emptyForm, ...JSON.parse(saved) } : emptyForm;
  } catch {
    return emptyForm;
  }
}

function saveToSession(data: FormularioData) {
  try {
    localStorage.setItem("planoai_form", JSON.stringify(data));
  } catch {}
}

/* ─── Form components ─────────────────────────────────────────── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Field({ label, ...props }: InputProps) {
  return (
    <div>
      <label
        className="block mb-2 text-[10px] tracking-[0.15em] uppercase text-[#C8923A]/60"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-[#1D1B14] bg-[#0F0E0B] px-4 py-3 text-[#EDE4D3] placeholder-[#2E2B24] focus:border-[#C8923A] focus:outline-none transition duration-200"
        style={{ fontFamily: 'var(--font-dm)' }}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

function SelectField({ label, options, ...props }: SelectProps) {
  return (
    <div>
      <label
        className="block mb-2 text-[10px] tracking-[0.15em] uppercase text-[#C8923A]/60"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </label>
      <select
        {...props}
        className="w-full border border-[#1D1B14] bg-[#0F0E0B] px-4 py-3 text-[#EDE4D3] focus:border-[#C8923A] focus:outline-none transition duration-200 appearance-none"
        style={{ fontFamily: 'var(--font-dm)' }}
      >
        <option value="" style={{ color: '#2E2B24' }}>Selecione...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

function TextareaField({ label, ...props }: TextareaProps) {
  return (
    <div>
      <label
        className="block mb-2 text-[10px] tracking-[0.15em] uppercase text-[#C8923A]/60"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </label>
      <textarea
        {...props}
        className="w-full border border-[#1D1B14] bg-[#0F0E0B] px-4 py-3 text-[#EDE4D3] placeholder-[#2E2B24] focus:border-[#C8923A] focus:outline-none transition duration-200 resize-none"
        style={{ fontFamily: 'var(--font-dm)' }}
        rows={4}
      />
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function FormularioPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormularioData>(loadFromSession);
  const [errors, setErrors] = useState<Partial<Record<keyof FormularioData, string>>>({});

  function update(field: keyof FormularioData, value: string | string[]) {
    const next = { ...form, [field]: value };
    setForm(next);
    saveToSession(next);
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function togglePreferencia(pref: string) {
    const current = form.preferencias_aprendizado;
    const next = current.includes(pref)
      ? current.filter((p) => p !== pref)
      : [...current, pref];
    update("preferencias_aprendizado", next);
  }

  function validateStep(): boolean {
    const errs: Partial<Record<keyof FormularioData, string>> = {};

    if (step === 0) {
      if (!form.cargo_atual.trim()) errs.cargo_atual = "Obrigatório";
      if (!form.area) errs.area = "Obrigatório";
      if (!form.salario_atual) errs.salario_atual = "Obrigatório";
      if (!form.tempo_experiencia) errs.tempo_experiencia = "Obrigatório";
    }
    if (step === 1) {
      if (!form.cargo_objetivo.trim()) errs.cargo_objetivo = "Obrigatório";
      if (!form.salario_objetivo) errs.salario_objetivo = "Obrigatório";
      if (!form.prazo) errs.prazo = "Obrigatório";
      if (!form.motivacao.trim()) errs.motivacao = "Obrigatório";
    }
    if (step === 2) {
      if (!form.habilidades.trim()) errs.habilidades = "Obrigatório";
      if (!form.gaps.trim()) errs.gaps = "Obrigatório";
      if (!form.tempo_disponivel) errs.tempo_disponivel = "Obrigatório";
    }
    if (step === 3) {
      if (!form.nome.trim()) errs.nome = "Obrigatório";
      if (!form.email.trim()) errs.email = "Obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email inválido";
      if (!form.cpf.trim()) errs.cpf = "Obrigatório";
      else if (!validarCPF(form.cpf)) errs.cpf = "CPF inválido";
      if (!form.telefone.trim()) errs.telefone = "Obrigatório";
      else if (form.telefone.replace(/\D/g, "").length < 10) errs.telefone = "Telefone inválido";
      if (form.preferencias_aprendizado.length === 0) errs.preferencias_aprendizado = "Selecione ao menos uma opção" as never;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/checkout");
    }
  }

  function back() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const progress = ((step + 1) / 4) * 100;

  return (
    <main className="min-h-screen bg-[#0C0B08]">
      <div className="grain-fix" aria-hidden />
      <SharedNav />

      <div className="mx-auto max-w-2xl px-5 pt-28 pb-16">

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-3.5 h-px bg-[#1D1B14] -z-0" />
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center z-10">
                <div
                  className={`h-7 w-7 flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                    i < step
                      ? "bg-[#C8923A] border-[#C8923A] text-[#0C0B08]"
                      : i === step
                      ? "bg-[#0C0B08] border-[#C8923A] text-[#C8923A]"
                      : "bg-[#0C0B08] border-[#1D1B14] text-[#2E2B24]"
                  }`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {i < step ? "✓" : String(i + 1).padStart(2, "0")}
                </div>
                <span
                  className={`mt-2 text-[9px] tracking-[0.12em] uppercase hidden sm:block ${
                    i === step ? "text-[#C8923A]/60" : "text-[#2E2B24]"
                  }`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px w-full bg-[#1D1B14]">
            <div
              className="h-px bg-[#C8923A] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p
            className="mt-3 text-[10px] text-center text-[#2E2B24] tracking-[0.12em] uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Etapa {step + 1} de 4 — {STEPS[step]}
          </p>
        </div>

        {/* Card */}
        <div className="border border-[#1D1B14] bg-[#0F0E0B] p-6 sm:p-8">

          {/* Etapa 1 */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                  <div className="h-px w-8 bg-[#C8923A]/50" />
                  <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">Etapa 01</span>
                </div>
                <h2
                  className="text-2xl font-bold text-[#EDE4D3] leading-tight"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  Sua situação atual
                </h2>
                <p className="mt-1 text-sm text-[#3E3A30]">Conta um pouco sobre onde você está hoje</p>
              </div>
              <div className="space-y-5">
                <div>
                  <Field
                    label="Qual é seu cargo atual?"
                    placeholder="ex: Analista de Marketing Pleno"
                    value={form.cargo_atual}
                    onChange={(e) => update("cargo_atual", e.target.value)}
                  />
                  {errors.cargo_atual && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.cargo_atual}</p>}
                </div>
                <div>
                  <SelectField
                    label="Em qual área você atua?"
                    options={AREAS}
                    value={form.area}
                    onChange={(e) => update("area", e.target.value)}
                  />
                  {errors.area && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.area}</p>}
                </div>
                <div>
                  <SelectField
                    label="Qual seu salário atual?"
                    options={SALARIOS}
                    value={form.salario_atual}
                    onChange={(e) => update("salario_atual", e.target.value)}
                  />
                  {errors.salario_atual && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.salario_atual}</p>}
                </div>
                <div>
                  <SelectField
                    label="Há quanto tempo está nessa área?"
                    options={TEMPOS_EXP}
                    value={form.tempo_experiencia}
                    onChange={(e) => update("tempo_experiencia", e.target.value)}
                  />
                  {errors.tempo_experiencia && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.tempo_experiencia}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 2 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                  <div className="h-px w-8 bg-[#C8923A]/50" />
                  <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">Etapa 02</span>
                </div>
                <h2
                  className="text-2xl font-bold text-[#EDE4D3] leading-tight"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  Seu objetivo
                </h2>
                <p className="mt-1 text-sm text-[#3E3A30]">Para onde você quer ir?</p>
              </div>
              <div className="space-y-5">
                <div>
                  <Field
                    label="Qual cargo/posição você quer atingir?"
                    placeholder="ex: Gerente de Marketing"
                    value={form.cargo_objetivo}
                    onChange={(e) => update("cargo_objetivo", e.target.value)}
                  />
                  {errors.cargo_objetivo && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.cargo_objetivo}</p>}
                </div>
                <div>
                  <SelectField
                    label="Qual salário você quer alcançar?"
                    options={SALARIOS}
                    value={form.salario_objetivo}
                    onChange={(e) => update("salario_objetivo", e.target.value)}
                  />
                  {errors.salario_objetivo && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.salario_objetivo}</p>}
                </div>
                <div>
                  <SelectField
                    label="Em quanto tempo quer alcançar isso?"
                    options={PRAZOS}
                    value={form.prazo}
                    onChange={(e) => update("prazo", e.target.value)}
                  />
                  {errors.prazo && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.prazo}</p>}
                </div>
                <div>
                  <TextareaField
                    label="Por que você quer essa mudança?"
                    placeholder="Compartilhe sua motivação, o que te move..."
                    maxLength={300}
                    value={form.motivacao}
                    onChange={(e) => update("motivacao", e.target.value)}
                  />
                  <p className="mt-1 text-right text-[10px] text-[#2E2B24]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {form.motivacao.length}/300
                  </p>
                  {errors.motivacao && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.motivacao}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 3 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                  <div className="h-px w-8 bg-[#C8923A]/50" />
                  <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">Etapa 03</span>
                </div>
                <h2
                  className="text-2xl font-bold text-[#EDE4D3] leading-tight"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  Habilidades e gaps
                </h2>
                <p className="mt-1 text-sm text-[#3E3A30]">Seja honesto — isso torna o plano muito mais preciso</p>
              </div>
              <div className="space-y-5">
                <div>
                  <TextareaField
                    label="Liste suas principais habilidades técnicas"
                    placeholder="ex: Google Ads, SEO, análise de dados, Excel..."
                    value={form.habilidades}
                    onChange={(e) => update("habilidades", e.target.value)}
                  />
                  {errors.habilidades && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.habilidades}</p>}
                </div>
                <div>
                  <TextareaField
                    label="O que você acredita que te falta para chegar lá?"
                    placeholder="ex: Liderança de times, inglês, experiência com budget..."
                    value={form.gaps}
                    onChange={(e) => update("gaps", e.target.value)}
                  />
                  {errors.gaps && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.gaps}</p>}
                </div>
                <div>
                  <TextareaField
                    label="Você já fez entrevistas para esse cargo? (opcional)"
                    placeholder="Se sim, o que aconteceu? Qual foi o feedback?"
                    value={form.entrevistas}
                    onChange={(e) => update("entrevistas", e.target.value)}
                  />
                </div>
                <div>
                  <SelectField
                    label="Quanto tempo por semana pode dedicar ao desenvolvimento profissional?"
                    options={TEMPOS_DISPONIVEL}
                    value={form.tempo_disponivel}
                    onChange={(e) => update("tempo_disponivel", e.target.value)}
                  />
                  {errors.tempo_disponivel && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.tempo_disponivel}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 4 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                  <div className="h-px w-8 bg-[#C8923A]/50" />
                  <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">Etapa 04</span>
                </div>
                <h2
                  className="text-2xl font-bold text-[#EDE4D3] leading-tight"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  Contexto pessoal
                </h2>
                <p className="mt-1 text-sm text-[#3E3A30]">Para personalizar ainda mais o seu plano</p>
              </div>
              <div className="space-y-5">
                <div>
                  <Field
                    label="Seu nome"
                    placeholder="Como prefere ser chamado(a)?"
                    value={form.nome}
                    onChange={(e) => update("nome", e.target.value)}
                  />
                  {errors.nome && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.nome}</p>}
                </div>
                <div>
                  <Field
                    label="Seu email"
                    type="email"
                    placeholder="Para enviarmos o plano depois"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.email}</p>}
                </div>
                <div>
                  <Field
                    label="Seu CPF"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                      const masked = v
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                      update("cpf", masked);
                    }}
                    maxLength={14}
                  />
                  {errors.cpf && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.cpf}</p>}
                </div>
                <div>
                  <Field
                    label="Seu telefone"
                    placeholder="(11) 99999-9999"
                    value={form.telefone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                      const masked = v
                        .replace(/(\d{2})(\d)/, "($1) $2")
                        .replace(/(\d{5})(\d)/, "$1-$2");
                      update("telefone", masked);
                    }}
                    maxLength={15}
                  />
                  {errors.telefone && <p className="mt-1 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>{errors.telefone}</p>}
                </div>
                <div>
                  <label
                    className="block mb-3 text-[10px] tracking-[0.15em] uppercase text-[#C8923A]/60"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Você prefere aprender por{" "}
                    <span className="text-[#2E2B24] normal-case tracking-normal">(selecione todos que se aplicam)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {PREFERENCIAS.map((pref) => {
                      const selected = form.preferencias_aprendizado.includes(pref);
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => togglePreferencia(pref)}
                          className={`border px-3 py-2.5 text-sm font-medium transition-all text-left ${
                            selected
                              ? "border-[#C8923A] bg-[#C8923A]/10 text-[#C8923A]"
                              : "border-[#1D1B14] bg-[#0F0E0B] text-[#3E3A30] hover:border-[#C8923A]/30 hover:text-[#EDE4D3]"
                          }`}
                          style={{ fontFamily: 'var(--font-dm)' }}
                        >
                          {selected && <span className="mr-1.5 text-[#C8923A]">→</span>}{pref}
                        </button>
                      );
                    })}
                  </div>
                  {(errors as Record<string, string>).preferencias_aprendizado && (
                    <p className="mt-2 text-xs text-red-400/80" style={{ fontFamily: 'var(--font-mono)' }}>
                      {(errors as Record<string, string>).preferencias_aprendizado}
                    </p>
                  )}
                </div>
                <div>
                  <TextareaField
                    label="Alguma restrição ou contexto importante? (opcional)"
                    placeholder="ex: Estou grávida e voltarei do afastamento em 3 meses, trabalho em empresa pequena sem plano de carreira definido..."
                    value={form.contexto}
                    onChange={(e) => update("contexto", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-[#1D1B14] pt-6">
            {step > 0 ? (
              <button
                onClick={back}
                className="border border-[#1D1B14] px-6 py-3 text-sm text-[#3E3A30] transition hover:border-[#C8923A]/30 hover:text-[#EDE4D3]"
                style={{ fontFamily: 'var(--font-dm)' }}
              >
                ← Voltar
              </button>
            ) : (
              <a
                href="/"
                className="border border-[#1D1B14] px-6 py-3 text-sm text-[#3E3A30] transition hover:border-[#C8923A]/30 hover:text-[#EDE4D3]"
                style={{ fontFamily: 'var(--font-dm)' }}
              >
                ← Início
              </a>
            )}

            <button
              onClick={next}
              className="shine flex-1 bg-[#C8923A] px-6 py-3 text-sm font-bold text-[#0C0B08] transition hover:bg-[#D9A44B] sm:flex-none sm:px-10"
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              {step < 3 ? "Próximo →" : "Continuar para pagamento →"}
            </button>
          </div>
        </div>

        <p
          className="mt-6 text-center text-[10px] text-[#2E2B24] tracking-[0.1em]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          SEUS DADOS SÃO USADOS APENAS PARA GERAR SEU PLANO PERSONALIZADO
        </p>
      </div>
    </main>
  );
}
