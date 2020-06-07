/*
export async function init(configFile?: string): Promise<boolean> {

const configPath = path.resolve(configFile || DEFAULT_DEEPLINT_CONFIG_FILE_NAME)
if (fs.existsSync(configPath)) {
  const deepLintConfig: DeepLintConfig = YamlReader.load(configPath)
  /*
  await Object.keys(deepLintConfig.policies).map(async key => {
  })

}
throw new Error(`Can not find DeepLint config file: ${configFile}`)

}
*/
