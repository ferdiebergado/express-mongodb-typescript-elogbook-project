/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
export const parseCookies = (cookies: string): Record<string, string> => {
  const arr = cookies.split(';')
  const parsed: Record<string, string> = {}
  arr.forEach((c) => {
    const [key, val] = c.trim().split('=')
    parsed[key] = val
  })
  return parsed
}
