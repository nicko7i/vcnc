// Centralized configuration for chalk, which is used to add color to console.log statements.

//  This is a development file even though eslint doesn't think so.
/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk';

export const chalkError = chalk.red;
export const chalkSuccess = chalk.green;
export const chalkWarning = chalk.yellow;
export const chalkProcessing = chalk.blue;
