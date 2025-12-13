export function isOdd(value: number) {
   return Math.abs(value % 2) == 1
}

export function capitalizeFirstLetter(string: string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}