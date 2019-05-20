export const randomNumber = (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1)) + min

export const signedModulo = (dividend, divisor) => ((dividend % divisor) + divisor) % divisor
