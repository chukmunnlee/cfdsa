import commandLineArgs from "command-line-args"

const optDef = [
  { name: 'port', type: Number, defaultValue: parseInt(process.env.PORT) || 3000 },
  { name: 'version', type: String, defaultValue: process.env.API_VERSION || 'v1' },
  { name: 'apiKey', type: String, defaultValue: process.env.API_KEY }
]

export function parseArgs () {
  return commandLineArgs(optDef)
}
