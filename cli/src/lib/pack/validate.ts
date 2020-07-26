import * as Ajv from 'ajv'

const ajv = new Ajv()

const validates = {
  Resource: ajv.compile(require('../../../schema/generated/resource.schema.json')),
  Problem: ajv.compile(require('../../../schema/generated/problem.schema.json')),
  DeepLintConfig: ajv.compile(require('../../../schema/generated/deeplint-config.schema.json')),
  PackSpec: ajv.compile(require('../../../schema/generated/pack-spec.schema.json')),
}

export function validate(key: 'Resource' | 'Problem' | 'DeepLintConfig' | 'PackSpec', data: any): boolean {
  const res = validates[key](data)
  return res === true
}
