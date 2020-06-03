const tsj = require('ts-json-schema-generator')
const fs = require('fs')

const config = {
  path: 'src/lib/policy/model.ts',
  tsconfig: 'tsconfig.json',
  type: 'Resource', // Or <type-name> if you want to generate schema for that one type only
}

let output_path = 'schema/generated/resource.json'

let schema = tsj.createGenerator(config).createSchema(config.type)
let schemaString = JSON.stringify(schema, null, 2)
fs.writeFile(output_path, schemaString, err => {
  if (err) throw err
})

const configCheckingResult = {
  path: 'src/lib/policy/model.ts',
  tsconfig: 'tsconfig.json',
  type: 'CheckingResult', // Or <type-name> if you want to generate schema for that one type only
}
output_path = 'schema/generated/checking-result.json'

schema = tsj.createGenerator(configCheckingResult).createSchema(configCheckingResult.type)
schemaString = JSON.stringify(schema, null, 2)

fs.writeFile(output_path, schemaString, err => {
  if (err) throw err
})
