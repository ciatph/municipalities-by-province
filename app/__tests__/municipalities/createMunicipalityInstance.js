require('dotenv')

const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ color: ColorLog.COLORS.TEXT.YELLOW, isBold: true })

/**
 * Builds objects containing all provinces AND municipality names for the PAGASA seasonal config and 10-Day Excel file to use for comparison checks and logs viewing purposes only.
 * @param {Class} excelFile - `ExcelFile` or `ExcelFactory` instance
 * @returns {Object} Object containing Arrays and Sets of province and municipality names
 *    - `hasMissingInExcel` {Bool} - Flag if province(s) exist in the PAGASA seasonal config but not in the 10-day Excel
 *    - `hasMissingInConfig` {Bool} - Flag if municipalities exist in 10-day Excel but not in the municipalities list built from the PAGASA seasonal config
 *    - `excel` {Object} - Contains full province/municipality names and data from the 10-day Excel file
 *    - `excel.provinces` {String[]} - all provinces from the 10-day Excel file
 *    - `excel.municipalities` {Object} - Object with province names as keys and values are String[] array of municipalities under the province
 *    - `excel.countMunicipalities` {Number} - Total number of all municipalities read from the 10-day Excel file
 *    - `config` {Object} - Contains province/municipality names and data from the PAGASA seasonal config file
 *    - `config.provinces` {String[]} - all provinces from the PAGASA seasonal config file
 *    - `config.municipalities` {Object} - Object with the config's province names as keys and values are String[] array of municipalities under the province
 *    - `config.countMunicipalities` {Number} - Total number of all municipalities read from the PAGASA config file
 */
const createMunicipalityInstance = (excelFile) => {
  try {
    // Unique provinces/municipalities from the 10-day Excel file
    const excel = {}

    excel.provinces = excelFile.datalist
      .map(item => item.province)
      .filter((x, i, a) => a.indexOf(x) === i)

    excel.municipalities = excelFile
      .listMunicipalities({ provinces: excel.provinces })

    excel.countMunicipalities = Object.values(
      excel.municipalities
    ).reduce(
      (sum, item) => sum + item.length, 0
    )

    // Unique provinces/municipalities from the config file (PAGASA Seasonal)
    const config = {}
    config.provinces = new Set(excelFile.listRegions('provinces').flat())
    config.municipalities = excelFile.listMunicipalities({ provinces: [...config.provinces] })
    config.countMunicipalities = Object.values(config.municipalities).reduce((sum, item) => sum + item.length, 0)

    // Municipalities exist in 10-day Excel but not in the municipalities list built from the PAGASA seasonal config
    const hasMissingInConfig = (excel.countMunicipalities - config.countMunicipalities) > 0
    // Province(s) exist in the PAGASA seasonal config but not in the 10-day Excel
    const hasMissingInExcel = (config.provinces.size - excel.provinces.length) > 0

    logger.log(
      `[INFO]: Parsed municipalities from config: ${config.countMunicipalities}\n` +
      `loaded municipalities from Excel file: ${excel.countMunicipalities}\n`, {
        color: ColorLog.COLORS.TEXT.CYAN
      })

    return {
      excel,
      config,
      hasMissingInExcel,
      hasMissingInConfig
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = createMunicipalityInstance
