import * as Ajv from 'ajv'

const ajv = new Ajv()

const validates = {
  Resource: ajv.compile(require('../../../schema/generated/resource.schema.json')),
  CheckingResult: ajv.compile(require('../../../schema/generated/checking-result.schema.json')),
}

export function validate(key: 'Resource' | 'CheckingResult', data: any): boolean {
  const res = validates[key](data)
  return res === true
}
