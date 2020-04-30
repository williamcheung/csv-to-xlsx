#!/usr/bin/env node

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
  program
    .version(pkg.version, '-v, --version')
    .option('-i, --input [file]', 'Input CSV file path')
    .option('-o, --outputFormat ["xlsb", "xlsx", etc.]', 'Output Excel file format', 'xlsb');

  program.on('--help', function () {
    console.log(``);
    console.log(`Based on original version by: ${pkg.author.name}`);
    console.log(`Original version: ${pkg.version}`);
  });

  program.parse(process.argv);

  const csvPath = path.normalize(program.input);

  // check the csvPath
  if (!fs.existsSync(csvPath) || fs.lstatSync(csvPath).isDirectory()) {
    // csv file doesn't exist or is a directory, doing it wrong
    console.error(`Invalid input file: ${csvPath}\n`);
    process.exitCode = 1;
    program.help(); // exit immediately
  }

  // parse file
  const fileObject = path.parse(csvPath);

  // delete output file if exists
  const outputFormat = program.outputFormat;
  const outputPath = path.join(path.dirname(csvPath), `${fileObject.name}.${outputFormat}`);
  if (fs.existsSync(outputPath)) {
    console.warn(`Deleting existing output file: ${outputPath}`);
    fs.unlinkSync(outputPath);
  }

  // convert
  console.info(`Converting: ${csvPath}`);
  try {
    convertCsvToXlsx(csvPath, outputPath);
    console.info(`Created: ${outputPath}`);
  } catch (e) {
    console.info(`${e.toString()}`);
  }
}
