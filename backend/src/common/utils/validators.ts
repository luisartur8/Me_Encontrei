// Tamanho entre 4 e 20 caracteres
// Pode conter letras (maiúsculas e minúsculas), números, pontos e underscores
// Não pode começar ou terminar com ponto (.) ou underscore (_), nem ter eles juntos
export function isValidUsername(username: string): boolean {
    const usernameRegex = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    return usernameRegex.test(username);
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_\-+%])*@[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})+$/
    return emailRegex.test(email)
}

// Ter pelo menos um desses ao mesmo tempo: letra maiúscula, minúscula, dígito numérico, caractere especial
// Minimo de 8 caracteres
export function isStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{}:;,.?])[A-Za-z\d!@#$%^&*()_\-+=\[\]{}:;,.?]{8,}$/;
    return strongPasswordRegex.test(password);
}