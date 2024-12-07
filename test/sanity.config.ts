interface Schema {
  types: unknown[]
}

const schema: Schema = {
  types: [],
}

export default {
  name: 'default',
  title: 'Lint test',

  projectId: 'l1n7t3s7',
  dataset: 'lint-me',

  plugins: [],

  schema,
}
