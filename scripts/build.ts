import concurrently from 'concurrently'
import fs from 'fs-extra'
import path from 'path'

(async () => {
  if (process.env.NODE_ENV === 'production') {
    console.clear()
    console.log('Compiling in production mode')
  }

  await concurrently([
    'yarn rimraf build/**/*',
    'yarn compile'
  ], {
    maxProcesses: 1,
    raw: true
  })

  console.clear()

  const projectRoot = path.resolve(process.cwd())

  await fs.remove(path.resolve(projectRoot, 'build', 'types.js'))

  await fs.copy(
    path.resolve(projectRoot, 'src', 'api', 'templates'),
    path.resolve(projectRoot, 'build', 'api', 'templates'),
    {
      recursive: true,
      overwrite: true
    }
  )

  await fs.copy(
    path.resolve(projectRoot, 'public'),
    path.resolve(projectRoot, 'build', 'public'),
    {
      recursive: true,
      overwrite: true
    }
  )
})()
