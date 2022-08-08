## municipalities-by-province

Extract the `municipalities` of a given `province` from an excel file and write them to a JSON file.

### Requirements

The following dependencies are used for this project. Feel free to use other dependency versions as needed.

1. Windows 10 OS
2. nvm for Windows v1.1.9
3. NodeJS, installed using nvm
   - node v16.14.2
   - npm v8.5.0
4. Excel file
   - At minimum, the excel file should have a **column** that contains municipality and province names following the pattern `"municipalityName (provinceName)"`
   - Checkout the excel file format on the `/data/day1.xlsx` sample file for more information
5. (Optional) Download URL for a remote excel file.
   - See the `EXCEL_FILE_URL` variable on the [Installation](#installation) section.

## Installation

1. Clone this repository.<br>
`git clone https://github.com/ciatph/municipalities-by-province.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Use the default values for `SHEETJS_COLUMN` and `EXCEL_FILE_URL`.

   | Variable Name  | Description                                                                                                                                                                                                                                                    |
   | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | EXCEL_FILE_URL | (Optional) Remote excel file's download URL.<br>If provided, the excel file will be downloaded and saved on the specified `pathToFile` local filesystem location during the `ExcelFile` class initialization.<br>Read on [Usage](#usage) for more information. |
   | SHEETJS_COLUMN | Column name read by [sheetjs](https://sheetjs.com/) in an excel file.<br>This column contains the municipality and province names following the string pattern<br>`"municipalityName (provinceName)"`<br>Default value is `__EMPTY`                            |

## Usage

### Load and Parse a Local Excel File

```
const path = require('path')
const { ExcelFile } = require('./classes/excel')

// Reads an existing excel file on /data/day1.xlsx
file = new ExcelFile({
   pathToFile: path.resolve(__dirname, '..', 'data', 'day1.xlsx')
})

try {
   file.init()
} catch (err) {
   console.log(`[ERROR]: ${err.message}`)
}

// JSON data of the parsed excel file will be accessible on
// file.datalist
```

### Download and Parse a Remote Excel File

```
require('dotenv').config()
const path = require('path')
const { ExcelFile } = require('./classes/excel')

const main = async () => {
  // Excel file will be downloaded to /data/day1.xlsx
  file = new ExcelFile({
    pathToFile: path.resolve(__dirname, '..', 'data', 'day1.xlsx'),
    url: process.env.EXCEL_FILE_URL
  })

  try {
    await file.init()
  } catch (err) {
    console.log(err.message)
  }

  // JSON data of the parsed excel file will be accessible on
  // file.datalist
}

main()
```

## Available Scripts

### `npm start` / `npm run list:region`

- Load and parse the local excel file in `/data/day1.xlsx`.
- Displays a list of available PH **region** names.
- Lists all municipalities under the province of a specified region via commandline input.
- Asks for an option to write results to a JSON file.

### `npm run list:province`

- Load and parse the local excel file in `/data/day1.xlsx`.
- Lists all municipalities under specified province(s) via commandline input.
- Asks for an option to write results to a JSON file.

### `npm run example`

- Downloads and parses a remote excel file.
- Demonstrates sample usage with `await`

### `npm run lint`

Lint JavaScript source codes.

### `npm run lint:fix`

Fix JavaScript lint errors.

Run the main program.

@ciatph<br>
20220807