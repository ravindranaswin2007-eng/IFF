/** Pick a column count that fills every row, so no card is left stranded with empty space beside it. */
export function gridFor(n: number) {
  if (n <= 1) return 'grid grid-single'
  if (n === 2 || n === 4) return n === 4 ? 'grid grid-4' : 'grid grid-2'
  if (n % 3 === 0) return 'grid grid-3'
  if (n % 4 === 0) return 'grid grid-4'
  return 'grid grid-3'
}
