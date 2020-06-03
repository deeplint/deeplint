const tsj = require('ts-json-schema-generator')
const fs = require('fs')

const configs = [
  {
    path: 'src/lib/policy/model.ts',
    tsconfig: 'tsconfig.json',
    type: 'Resource', // Or <type-name> if you want to generate schema for that one type only
    output: 'schema/generated/resource.schema.json',
  },
  {
    path: 'src/lib/policy/model.ts',
    tsconfig: 'tsconfig.json',
    type: 'CheckingResult', // Or <type-name> if you want to generate schema for that one type only
    output: 'schema/generated/checking-result.schema.json',

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
