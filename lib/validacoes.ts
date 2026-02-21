export function validarCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false

  // CPFs com todos os dígitos iguais são inválidos
  if (/^(\d)\1{10}$/.test(digits)) return false

  // Validação dos dígitos verificadores
  for (let t = 9; t < 11; t++) {
    let sum = 0
    for (let i = 0; i < t; i++) {
      sum += parseInt(digits[i]) * (t + 1 - i)
    }
    const rest = ((sum * 10) % 11) % 10
    if (parseInt(digits[t]) !== rest) return false
  }

  return true
}
