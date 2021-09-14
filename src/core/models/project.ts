type Step = {
  commands?: string[]
  useSpec?: string // Path to the spec file
}

type Job = {
  steps: Step[]
}

type Workflow = {
  jobs: Job[]
  env?: string
}

type Project = {
  version: string
  workflows?: Record<string, Workflow>,

}

export default Project
