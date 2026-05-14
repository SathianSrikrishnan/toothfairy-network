import { existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const requiredBuildEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'ELEVENLABS_API_KEY',
]

const optionalRuntimeEnv = [
  'FAL_KEY',
  'RESEND_API_KEY',
  'TFN_MINT_SECRET_KEY',
  'TFN_MERKLE_TREE',
  'NEXT_PUBLIC_SOLANA_RPC',
  'NEXT_PUBLIC_TFN_ENABLE_AI_ENHANCE',
]

function runGit(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  } catch {
    return ''
  }
}

function loadEnvFile(path) {
  if (!existsSync(path)) return {}

  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .reduce((env, rawLine) => {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) return env
      const equals = line.indexOf('=')
      if (equals === -1) return env
      const key = line.slice(0, equals).trim()
      const value = line.slice(equals + 1).trim().replace(/^['"]|['"]$/g, '')
      if (key) env[key] = value
      return env
    }, {})
}

function valueIsSet(name, envFiles) {
  return Boolean(process.env[name] || envFiles.local[name] || envFiles.example[name])
}

function line(label, value) {
  console.log(`${label}: ${value || 'missing'}`)
}

const envFiles = {
  local: loadEnvFile('.env.local'),
  example: loadEnvFile('.env.example'),
}

const branch = runGit(['branch', '--show-current'])
const remote = runGit(['remote', 'get-url', 'origin'])
const head = runGit(['log', '--oneline', '-n', '1'])
const status = runGit(['status', '--porcelain'])
const unmerged = status
  .split(/\r?\n/)
  .filter((entry) => /^(UU|AA|DD|DU|UD|AU|UA)/.test(entry))
const vercelProject = existsSync('.vercel/project.json')
  ? JSON.parse(readFileSync('.vercel/project.json', 'utf8'))
  : null

console.log('Tooth Fairy Network preview readiness')
console.log('')
line('branch', branch)
line('remote', remote)
line('head', head)
line('working tree', status ? 'has local changes' : 'clean')
line('unresolved conflicts', unmerged.length ? `${unmerged.length}` : 'none')
line('vercel link', vercelProject ? `${vercelProject.projectName} (${vercelProject.projectId})` : 'not linked locally')

console.log('')
console.log('Build-time environment')
for (const name of requiredBuildEnv) {
  line(name, valueIsSet(name, envFiles) ? 'set or templated' : 'missing')
}

console.log('')
console.log('Optional runtime environment')
for (const name of optionalRuntimeEnv) {
  line(name, valueIsSet(name, envFiles) ? 'set or templated' : 'missing')
}

console.log('')
if (unmerged.length > 0) {
  console.log('Result: blocked by unresolved git conflicts.')
  process.exitCode = 1
} else if (!branch) {
  console.log('Result: blocked because no git branch was detected.')
  process.exitCode = 1
} else {
  console.log('Result: branch is locally inspectable. Push it, then create a Vercel preview from the branch.')
}
