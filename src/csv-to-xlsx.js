/*
 Requires
 *********************************************************/
const path = require('path');

const fs = require('fs-extra');
const program = require('commander');

const convertCsvToXlsx = require('./convertCsvToXlsx');

if (module.parent) {
  module.exports = convertCsvToXlsx;
} else {
  /*
   Variables
   *********************************************************/
  const pkg = require('../package');

  /*
   Program
   *********************************************************/
  program.
      version(pkg.version, '-v, --version').
      option(
          '-i, --input-dir [dir]',
          'Input directory that has the CSV files',
          'csv').
      option(
          '-o, --output-dir [dir]',
          'Output directory for the XLSX files',
          'xlsx');

  program.on('--help', function() {
    console.log(``);
    console.log(`Created by: ${pkg.author}`);
    console.log(`Please report bugs at: ${pkg.bugs.url}`);
  });

  program.parse(process.argv);

  const csvPath = path.join(process.cwd(), program.inputDir);
  const xlsxPath = path.join(process.cwd(), program.outputDir);

  // check the csvPath
  if (!fs.existsSync(csvPath)) {
    // csv folder doesn't exist, doing it wrong
    console.error(`Invalid input directory: ${csvPath}\n`);
    process.exitCode = 1;
    program.help(); // exit immediately
  }

  // check the xlsxPath
  if (!fs.existsSync(xlsxPath)) {
    // create xlsx folder
    console.info(`Creating output directory: ${xlsxPath}`);
    fs.mkdirpSync(xlsxPath);
  }

  // read csvPath
  const csvFiles = fs.readdirSync(csvPath);

  for (let file of csvFiles) {
    // parse file
    const fileObject = path.parse(file);
    // check file extension
    if (fileObject.ext !== '.csv') {
      continue;
    }
    console.info(`Converting: ${fileObject.name}`);
    // convert
    try {
      convertCsvToXlsx(
          path.join(csvPath, file),
          path.join(xlsxPath, `${fileObject.name}.xlsx`)
      );
    } catch (e) {
      console.info(`${e.toString()}`);
    }
  }

  console.log(`Complete.`);
}
