// Esses métodos serão usados no futuro na criação e atualização de dados.
export function isValidEmail(email: string) {
    return email;
}

// Pelo menos um: letra maiúscula, minúscula, dígito numérico, caractere especial e no minimo 8 caracteres.
export function isStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{}:;,.?])[A-Za-z\d!@#$%^&*()_\-+=\[\]{}:;,.?]{8,}$/;
    return strongPasswordRegex.test(password);
}