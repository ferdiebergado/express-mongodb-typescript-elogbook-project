/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { Request, Response, NextFunction } from 'express'
import { microToMilliSeconds } from '../utils/helpers'

// CREDITS: https://ipirozhenko.com/blog/measuring-requests-duration-nodejs-express/
const getDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

export default (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime()
  const idleMem = process.resourceUsage().maxRSS

  res.on('finish', () => {
    const { method, originalUrl, socket, headers, body } = req
    const { statusCode } = res
    const timing = getDurationInMilliseconds(start)
    const length = res.getHeader('Content-Length') || 0
    ;('')
    const { userCPUTime, systemCPUTime, maxRSS } = process.resourceUsage()
    const memDiff = maxRSS - idleMem

    console.log(
      `${new Date().toISOString()} ${method} ${originalUrl} ${statusCode} ${
        socket.remoteAddress
      } - ${length} bytes ${timing.toLocaleString()}ms\ncpu: {user: ${microToMilliSeconds(
        userCPUTime
      )} ms, sys: ${microToMilliSeconds(
        systemCPUTime
      )} ms} mem: {idle: ${idleMem} kb, after: ${maxRSS} kb, used: ${memDiff} kb}`
    )
    console.log(
      `headers: ${JSON.stringify(headers)}; body: ${JSON.stringify(body)}`
    )
  })

  next()
}
