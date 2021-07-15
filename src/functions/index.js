const _ = require('lodash')
const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')
admin.initializeApp()

const NON_FUNCTION_ENTRIES = [path.basename(__filename), 'lib', '.DS_Store']

const { FUNCTION_NAME } = process.env
const FUNC_DIR = path.resolve(__dirname)

if (FUNCTION_NAME) {
  exports[FUNCTION_NAME] = require(`${FUNC_DIR}/${FUNCTION_NAME}`)
} else {
  // files except itself
  const funcFileNames = _(fs.readdirSync(FUNC_DIR))
    .pullAll(NON_FUNCTION_ENTRIES)
    .value()

  for (const funcFileName of funcFileNames) {
    const funcName = path.parse(funcFileName).name
    exports[funcName] = require(`${FUNC_DIR}/${funcName}`)
  }
}
