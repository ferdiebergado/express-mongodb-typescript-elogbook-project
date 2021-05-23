/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import app from './app'
import { client } from './lib/db'

const PORT = process.env.PORT || 1995
const SIGTERM = 'SIGTERM'
// const SIGINT = 'SIGINT'

const cleanUp = async (signal?: string) => {
  console.log(`${signal ? signal : 'Shutdown'} signal received: cleaning up...`)
  if (client.isConnected()) {
    client.close(() => console.log('Database connection closed.'))
  }
  server.close(() => console.log('HTTP server closed'))
}

process.on('uncaughtException', async (e) => {
  console.error('uncaught exception ', e)
  await cleanUp()
  // eslint-disable-next-line no-process-exit
  process.exit(1)
})

process.on('unhandledRejection', async (e) => {
  console.error('Unhandled Promise rejection ', e)
  await cleanUp()
  // eslint-disable-next-line no-process-exit
  process.exit(1)
})

// TODO: use debug module
process.on(SIGTERM, async () => {
  await cleanUp(SIGTERM)
})

// process.on(SIGINT, async () => {
//   await cleanUp(SIGINT)
// })

process.on('exit', async () => {
  await cleanUp()
})

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})
