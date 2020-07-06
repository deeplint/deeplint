import * as _ from 'lodash'
import * as  Handlebars from 'handlebars'
import {InputSpec} from '../package/spec'

export function processInputs(name: string, inputs?: { [key: string]: any }, inputsSpec?: { [key: string]: InputSpec }): { [key: string]: any } {
  const res: { [key: string]: any } = {}
  if (inputsSpec) {
    Object.keys(inputsSpec).forEach(inputKey => {
      if (inputsSpec) {
        const inputSpec = inputsSpec[inputKey]
        if (inputs && _.has(inputs, inputKey)) {
          if (inputSpec.type === 'Number') {
            res[inputKey] = Number(inputs[inputKey])
          } else if (inputSpec.type === 'Boolean') {
            res[inputKey] = Boolean(inputs[inputKey])
          } else if (inputSpec.type === 'String') {
            res[inputKey] = String(inputs[inputKey])
          } else {
            res[inputKey] = inputs[inputKey]
          }
        } else if (_.has(process.env, inputKey)) {
          res[inputKey] = process.env[inputKey]
        } else if (inputSpec.default) {
          res[inputKey] = inputSpec.default
        } else {
          throw new Error(`${name} misses required input: ${inputKey}.
                     Description: ${inputSpec.description}`)
        }
      }
    })
  }
  return res
}

export function applyInputs(obj: string, data: any): string {
  const template = Handlebars.compile(obj, {noEscape: true})
  return template(data)
}
