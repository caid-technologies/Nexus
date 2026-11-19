import OpenAI from 'openai'

// Create the provider client on demand so a build or local startup does not
// require credentials for a route that has not been called.
export function getNemotronClient() {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured')
  return new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey,
  })
}

export const MODELS = {
  nemotron: 'nvidia/nvidia-nemotron-nano-9b-v2',
  claude: 'claude-sonnet-4-5-20250929',
} as const
