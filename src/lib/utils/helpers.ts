/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
export const titleCase = (s: string): string => {
  const lowered = s.toLowerCase()
  return lowered.charAt(0).toUpperCase() + lowered.substr(1)
}

export const microToMilliSeconds = (micro: number): number => {
  return micro * 0.001
}
