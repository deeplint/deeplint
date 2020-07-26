const tsj = require('ts-json-schema-generator')
const fs = require('fs')

const configs = [
  {
    path: 'src/lib/pack/model.ts',
    tsconfig: 'tsconfig.json',
    type: 'Resource', // Or <type-name> if you want to generate schema for that one type only
    output: 'schema/generated/resource.schema.json',
  },
  {
    path: 'src/lib/pack/model.ts',
    tsconfig: 'tsconfig.json',
    type: 'Problem', // Or <type-name> if you want to generate schema for that one type only
    output: 'schema/generated/problem.schema.json',
  },
  {
    path: 'src/lib/config.ts',
    tsconfig: 'tsconfig.json',
    type: 'DeepLintConfig', // Or <type-name> if you want to generate schema for that one type only
    output: 'schema/generated/deeplint-config.schema.json',
  },
  {
    path: 'src/lib/pack/spec.ts',
    tsconfig: 'tsconfig.json',
    type: 'PackSpec', // Or <type-name> if you want to generate schema for that one type only
    output: 'schema/generated/pack-spec.schema.json',
  },
]

configs.forEach(config => {
  const schema = tsj.createGenerator(config).createSchema(config.type)
  const schemaString = JSON.stringify(schema, null, 2)
  fs.writeFile(config.output, schemaString, err => {
    if (err) throw err
  })
}
)
