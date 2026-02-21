"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormularioData } from "@/types";

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
    const saved = sessionStorage.getItem("planoai_form");
    return saved ? { ...emptyForm, ...JSON.parse(saved) } : emptyForm;
  } catch {
    return emptyForm;
  }
}

function saveToSession(data: FormularioData) {
  try {
    sessionStorage.setItem("planoai_form", JSON.stringify(data));
  } catch {}
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Field({ label, ...props }: InputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-[#c0c0c0]">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-white placeholder-[#555] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
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
      <label className="block mb-2 text-sm font-medium text-[#c0c0c0]">{label}</label>
      <select
        {...props}
        className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition appearance-none"
      >
        <option value="">Selecione...</option>
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
      <label className="block mb-2 text-sm font-medium text-[#c0c0c0]">{label}</label>
      <textarea
        {...props}
        className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-white placeholder-[#555] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none"
        rows={4}
      />
    </div>
  );
}

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
      else if (form.cpf.replace(/\D/g, "").length !== 11) errs.cpf = "CPF inválido";
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
    <main className="min-h-screen bg-[#0f0f0f] py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <a href="/" className="text-xl font-bold text-white">
            Plano<span className="text-indigo-400">AI</span>
          </a>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step
                      ? "bg-indigo-600 text-white"
                      : i === step
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-600/30"
                      : "bg-[#2a2a2a] text-[#555]"
                  }`}
                >
                  {i < step ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`mt-1 text-xs hidden sm:block ${i === step ? "text-indigo-400" : "text-[#555]"}`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#2a2a2a]">
            <div
              className="h-1.5 rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-center text-[#737373]">
            Etapa {step + 1} de 4 — {STEPS[step]}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 sm:p-8">

          {/* Etapa 1 */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Sua situação atual</h2>
                <p className="text-[#a0a0a0] text-sm">Conta um pouco sobre onde você está hoje</p>
              </div>
              <div className="space-y-5">
                <div>
                  <Field
                    label="Qual é seu cargo atual?"
                    placeholder="ex: Analista de Marketing Pleno"
                    value={form.cargo_atual}
                    onChange={(e) => update("cargo_atual", e.target.value)}
                  />
                  {errors.cargo_atual && <p className="mt-1 text-xs text-red-400">{errors.cargo_atual}</p>}
                </div>
                <div>
                  <SelectField
                    label="Em qual área você atua?"
                    options={AREAS}
                    value={form.area}
                    onChange={(e) => update("area", e.target.value)}
                  />
                  {errors.area && <p className="mt-1 text-xs text-red-400">{errors.area}</p>}
                </div>
                <div>
                  <SelectField
                    label="Qual seu salário atual?"
                    options={SALARIOS}
                    value={form.salario_atual}
                    onChange={(e) => update("salario_atual", e.target.value)}
                  />
                  {errors.salario_atual && <p className="mt-1 text-xs text-red-400">{errors.salario_atual}</p>}
                </div>
                <div>
                  <SelectField
                    label="Há quanto tempo está nessa área?"
                    options={TEMPOS_EXP}
                    value={form.tempo_experiencia}
                    onChange={(e) => update("tempo_experiencia", e.target.value)}
                  />
                  {errors.tempo_experiencia && <p className="mt-1 text-xs text-red-400">{errors.tempo_experiencia}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 2 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Seu objetivo</h2>
                <p className="text-[#a0a0a0] text-sm">Para onde você quer ir?</p>
              </div>
              <div className="space-y-5">
                <div>
                  <Field
                    label="Qual cargo/posição você quer atingir?"
                    placeholder="ex: Gerente de Marketing"
                    value={form.cargo_objetivo}
                    onChange={(e) => update("cargo_objetivo", e.target.value)}
                  />
                  {errors.cargo_objetivo && <p className="mt-1 text-xs text-red-400">{errors.cargo_objetivo}</p>}
                </div>
                <div>
                  <SelectField
                    label="Qual salário você quer alcançar?"
                    options={SALARIOS}
                    value={form.salario_objetivo}
                    onChange={(e) => update("salario_objetivo", e.target.value)}
                  />
                  {errors.salario_objetivo && <p className="mt-1 text-xs text-red-400">{errors.salario_objetivo}</p>}
                </div>
                <div>
                  <SelectField
                    label="Em quanto tempo quer alcançar isso?"
                    options={PRAZOS}
                    value={form.prazo}
                    onChange={(e) => update("prazo", e.target.value)}
                  />
                  {errors.prazo && <p className="mt-1 text-xs text-red-400">{errors.prazo}</p>}
                </div>
                <div>
                  <TextareaField
                    label="Por que você quer essa mudança?"
                    placeholder="Compartilhe sua motivação, o que te move..."
                    maxLength={300}
                    value={form.motivacao}
                    onChange={(e) => update("motivacao", e.target.value)}
                  />
                  <p className="mt-1 text-right text-xs text-[#555]">{form.motivacao.length}/300</p>
                  {errors.motivacao && <p className="mt-1 text-xs text-red-400">{errors.motivacao}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 3 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Habilidades e gaps</h2>
                <p className="text-[#a0a0a0] text-sm">Seja honesto — isso torna o plano muito mais preciso</p>
              </div>
              <div className="space-y-5">
                <div>
                  <TextareaField
                    label="Liste suas principais habilidades técnicas"
                    placeholder="ex: Google Ads, SEO, análise de dados, Excel..."
                    value={form.habilidades}
                    onChange={(e) => update("habilidades", e.target.value)}
                  />
                  {errors.habilidades && <p className="mt-1 text-xs text-red-400">{errors.habilidades}</p>}
                </div>
                <div>
                  <TextareaField
                    label="O que você acredita que te falta para chegar lá?"
                    placeholder="ex: Liderança de times, inglês, experiência com budget..."
                    value={form.gaps}
                    onChange={(e) => update("gaps", e.target.value)}
                  />
                  {errors.gaps && <p className="mt-1 text-xs text-red-400">{errors.gaps}</p>}
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
                  {errors.tempo_disponivel && <p className="mt-1 text-xs text-red-400">{errors.tempo_disponivel}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 4 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Contexto pessoal</h2>
                <p className="text-[#a0a0a0] text-sm">Para personalizar ainda mais o seu plano</p>
              </div>
              <div className="space-y-5">
                <div>
                  <Field
                    label="Seu nome"
                    placeholder="Como prefere ser chamado(a)?"
                    value={form.nome}
                    onChange={(e) => update("nome", e.target.value)}
                  />
                  {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome}</p>}
                </div>
                <div>
                  <Field
                    label="Seu email"
                    type="email"
                    placeholder="Para enviarmos o plano depois"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <Field
                    label="Seu CPF"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => {
                      // Máscara de CPF
                      const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                      const masked = v
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                      update("cpf", masked);
                    }}
                    maxLength={14}
                  />
                  {errors.cpf && <p className="mt-1 text-xs text-red-400">{errors.cpf}</p>}
                </div>
                <div>
                  <Field
                    label="Seu telefone"
                    placeholder="(11) 99999-9999"
                    value={form.telefone}
                    onChange={(e) => {
                      // Máscara de telefone
                      const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                      const masked = v
                        .replace(/(\d{2})(\d)/, "($1) $2")
                        .replace(/(\d{5})(\d)/, "$1-$2");
                      update("telefone", masked);
                    }}
                    maxLength={15}
                  />
                  {errors.telefone && <p className="mt-1 text-xs text-red-400">{errors.telefone}</p>}
                </div>
                <div>
                  <label className="block mb-3 text-sm font-medium text-[#c0c0c0]">
                    Você prefere aprender por: <span className="text-[#737373]">(selecione todos que se aplicam)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {PREFERENCIAS.map((pref) => {
                      const selected = form.preferencias_aprendizado.includes(pref);
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => togglePreferencia(pref)}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all text-left ${
                            selected
                              ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                              : "border-[#2a2a2a] bg-[#1a1a1a] text-[#a0a0a0] hover:border-[#3a3a3a]"
                          }`}
                        >
                          {selected && "✓ "}{pref}
                        </button>
                      );
                    })}
                  </div>
                  {(errors as Record<string, string>).preferencias_aprendizado && (
                    <p className="mt-2 text-xs text-red-400">{(errors as Record<string, string>).preferencias_aprendizado}</p>
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
          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button
                onClick={back}
                className="rounded-xl border border-[#2a2a2a] px-6 py-3 text-sm font-medium text-[#a0a0a0] transition hover:border-[#3a3a3a] hover:text-white"
              >
                ← Voltar
              </button>
            ) : (
              <a href="/" className="rounded-xl border border-[#2a2a2a] px-6 py-3 text-sm font-medium text-[#a0a0a0] transition hover:border-[#3a3a3a] hover:text-white">
                ← Início
              </a>
            )}

            <button
              onClick={next}
              className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 sm:flex-none sm:px-10"
            >
              {step < 3 ? "Próximo →" : "Continuar para pagamento →"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#555]">
          Seus dados são usados apenas para gerar seu plano personalizado
        </p>
      </div>
    </main>
  );
}
