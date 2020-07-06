import * as fs from 'fs'
import * as yaml from 'js-yaml'
import {applyInputs} from './input-processing'

export default class YamlReader {
  static load(fn: string): any {
    const yamlContent =  fs.readFileSync(fn, 'utf8')
    return yaml.safeLoad(yamlContent)
  }

  static loadWithData(fn: string, inputs: object): any {
    const yamlContent =  fs.readFileSync(fn, 'utf8')
    return yaml.safeLoad(applyInputs(yamlContent, inputs))
  }

  static parse(template: string): any {
    return yaml.safeLoad(template)
  }

  static toString(object: object): string {
    return yaml.safeDump(object)
  }
}
