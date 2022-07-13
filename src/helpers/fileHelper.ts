import dayjs from 'dayjs'
import Promise from '@src/utils/promise'

const path = require('path')

const DEFAULT_DIR = path.resolve(process.cwd(), 'logs')
class FileHelper {
  /**
   *
   * @param {Object} param
   */
  static handleCopyFile({ fromDir, toDir }) {
    const fsExtra = require('fs-extra')
    const fs = require('fs')
    return new Promise((resolve) => {
      let fileExisted = false
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const stats = fs.statSync(fromDir)

        console.log('File exists.')
        fileExisted = true
      } catch (error) {
        fileExisted = false
      }
      if (!fileExisted) {
        resolve(false)
      }
      const ensureToDir = `${toDir}`.slice(0, `${toDir}`.lastIndexOf('/'))

      return fsExtra.ensureDir(`${ensureToDir}`).then(() => {
        return fs.copyFile(
          `${fromDir}`,
          `${toDir}`,
          fs.constants.COPYFILE_FICLONE,
          function (error) {
            // return fsExtra.copy(fromDir, toDir, function (error) {
            if (error) {
              console.error('copy file catch: ', error)
              resolve(false)
            }
            // if no error, file has been deleted successfully
            console.log('File deleted!')
            resolve(true)
          }
        )
      })
    })
    /* .catch(() => {
      return Promise.resolve(false)
    }) */
  }

  /**
   *
   * @param {string} outputFile
   */
  static readJson(outputFile) {
    const fsExtra = require('fs-extra')
    return new Promise((resolve) => {
      return fsExtra.readJson(`${outputFile}`, function (error, dataDns) {
        resolve(dataDns)
      })
    })
  }

  /**
   *
   * @param {string} outputDir
   * @param {string} outputFile
   * @param {Object} dataJson
   */
  static writeJson({ outputDir = DEFAULT_DIR, outputFile, dataJson }) {
    const fsExtra = require('fs-extra')
    const filePath = `${outputDir}/${outputFile}`

    return new Promise((resolve) => {
      return fsExtra.ensureDir(outputDir).then(() => {
        return fsExtra
          .ensureFile(filePath)
          .then(() => {
            return fsExtra
              .readJSON(filePath)
              .then((json) => {
                json.push({
                  [`${dayjs().format('YYYY_MM_DD_hh_mm_s')}`]: dataJson,
                })
                return fsExtra.writeJson(filePath, json, function (error) {
                  if (error) {
                    console.log('writeFile output.outputFile ', error)
                    resolve(false)
                  } else {
                    resolve(true)
                  }
                })
              })
              .catch((err) => {
                console.error('read file error: ', err)
                return fsExtra.writeJson(
                  filePath,
                  [{ [`${dayjs().format('YYYY_MM_DD_hh_mm_s')}`]: dataJson }],
                  function (error) {
                    if (error) {
                      console.log('writeFile output.outputFile ', error)
                      resolve(false)
                    } else {
                      resolve(true)
                    }
                  }
                )
              })
          })
          .catch(() => {
            // no file
            return fsExtra.writeJson(
              filePath,
              [{ [`${dayjs().format('YYYY_MM_DD_hh_mm_s')}`]: dataJson }],
              function (error) {
                if (error) {
                  console.log('writeFile output.outputFile ', error)
                  resolve(false)
                } else {
                  resolve(true)
                }
              }
            )
          })
      })
    })
  }
}

export default FileHelper
