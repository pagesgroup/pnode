/**
 * --------------------------------------------------------------
 * Script: aspect-sim.js
 * Description:
 * This script periodically checks if the BatchData.csv file exists
 * in the /aspect/data directory. If not, it copies the BatchData-dummy.csv
 * file as a placeholder. This ensures the system has a default batch file
 * available for testing or fallback purposes.
 *
 * Dependencies:
 *   - Node.js fs module (filesystem operations)
 *   - Node.js path module (path handling)
 *   - Custom 'aim' module for configuration loading
 *
 * Usage:
 *   Run this script as part of the application to maintain a dummy
 *   BatchData.csv file presence.
 *
 * Author: Max van Kampen
 * Created: 30-05-2025
 * Updated: 30-05-2025
**/
console.log('Aspect SIMULATION');
const fs = require('fs');
(function copyBatchDataDummy() {
  const filename = './data/JobInfo/BatchData.csv';
  if (!fs.existsSync(filename)) {
    console.log('Create data/JobInfo/BatchData.csv');
    fs.copyFile ('./test/data/BatchData.csv', filename, console.log);
  }
  setTimeout(copyBatchDataDummy, 10000);
})()
