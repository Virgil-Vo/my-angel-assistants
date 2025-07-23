/**
 * -------------------------------------------------------
 * Script: exportData.js
 * Purpose: Extracts specific data fields from a web page
 *          and copies them to the clipboard in a tab-separated format.
 * Usage:   Designed for use as a browser plugin or injected script
 *          to automate data extraction from a structured web form.
 * 
 * Main Steps:
 *   1. Extracts the 'Number' field from input elements.
 *   2. Extracts 'Reference' and 'Date' fields from readonly inputs.
 *   3. Extracts application formulas and descriptions from the 'Applications' table.
 *   4. Extracts total quantity values from the 'Lines' table.
 *   5. Formats the extracted data and copies it to the clipboard.
 * 
 * Note: 
 *   - Assumes specific class names and DOM structure.
 *   - Converts quantities from grams to kilograms before copying.
 *   - Uses a helper function to copy text to the clipboard.
 * -------------------------------------------------------
 */

(async function() {
  try {
    // Get Number
    const number = getNumber();
    // Get Reference and Date
    const { reference, date } = getReferenceAndDate();
    // Get Applications data
    const { formula, description1, appliString, legislativeString } = getApplicationsData();
    // Get Total Quantity from Lines table
    const totalQty = getTotalQty();

    console.log("------------------------------------------------");
    console.log("ref: " + reference + " | date: " + date);
    console.log("------------------------------------------------");

    // Copy data to clipboard
    var copiedValue = '';
    for (let i = 0; i < formula.length-1; i++) {
        // Convert gram to kilogram before copy
        let qty = parseFloat(totalQty[i]);
        let qtyOut = (!isNaN(qty) ? (qty * 1000).toString() : '');
        copiedValue += formula[i] + '\t' + description1[i] + '\t' + date + '\t\t' + number + '\t\t' + reference + '\t' + appliString[0] + '\t' + legislativeString[0] + '\t' + qtyOut;
        copiedValue += '\n';
    }
    copyTextToClipboard(copiedValue);
    // If all went well, notify success
    chrome.runtime.sendMessage({exportResult: 'success'});
  } catch (err) {
    // Notify failure
    chrome.runtime.sendMessage({exportResult: 'error', error: err && err.message ? err.message : String(err)});
  }

  function getNumber() {
    var collection = document.getElementsByClassName("s-field-input");
    var number = '';
    for (let i = 0; i < collection.length; i++) {
        var label = document.querySelector('label[for="'+collection[i].id+'"]');
        if (label && label.textContent === 'Number') {
            console.log('⏳ Getting `Number` value...');
            number = collection[i].value;
            console.log('✅️ Getting `Number` value Success');
            break;
        }
    }
    return number;
  }

  function getReferenceAndDate() {
    var collection = document.getElementsByClassName("s-field-input s-readonly");
    var reference = '';
    var date = '';
    for (let i = 0; i < collection.length; i++) {
        var label = document.querySelector('label[for="'+collection[i].id+'"]');
        if (label) {
            switch (label.textContent) {
                case 'Reference': 
                    console.log('⏳ Getting `Reference` value...');
                    reference = collection[i].value;
                    console.log('✅️ Getting `Reference` value Success');
                    break;
                case 'Date':
                    console.log('⏳ Getting `Date` value...');
                    var dateRaw = collection[i].value;
                    var parts = dateRaw.split("/");
                    date = parts[1] + '/' + parts[0] + '/' + parts[2];
                    console.log('✅️ Getting `Date` value Success');
                    break;
            }
        }
    }
    return { reference, date };
  }

  function getApplicationsData() {
    var collection = document.getElementsByClassName("s-slot-stack s-slot-cat-section s-page-sep-stack");
    var formula = [];
    var description1 = [];
    var appliString = [];
    var legislativeString = [];
    for (let i = 0; i < collection.length; i++) {
        var tableTitles = collection[i].getElementsByClassName("s-h1-titles-h1-title-text");
        if (tableTitles.length > 0 && tableTitles[0].innerHTML.includes('Applications')) {
            console.log('⏳ Getting data from Applications table...');
            var tableGrids = collection[i].getElementsByClassName("s-grid-table-body");
            if (tableGrids.length > 0) {
                var rows = tableGrids[0].rows;
                console.log("Applications table length: " + rows.length);
                for (let j = 0; j < rows.length; j++) {
                    var formulaString = rows[j].getElementsByClassName("s-inplace-input s-readonly");
                    if (formulaString.length > 0) {
                        formula.push(formulaString[0].value);
                    }
                    var description1String = rows[j].getElementsByClassName("s-inplace-value-read");
                    if (description1String.length > 0) {
                        description1.push(description1String[0].innerHTML);
                    }               
                } 
                var secondTableRows = tableGrids[1].rows;
                for (let j = 0; j < secondTableRows.length; j++) {
                    var appliStringRaw = secondTableRows[j].getElementsByClassName("s-grid-cell-value-edit s-inplace-value-edit s-mandatory");
                    if (appliStringRaw.length > 0) {
                        appliString.push(appliStringRaw[0].getElementsByClassName("s-inplace-input")[0].value);
                    }       
                    var legislativeStringRaw = secondTableRows[j].getElementsByClassName("s-grid-cell-value-edit s-inplace-value-edit s-number");
                    if (legislativeStringRaw.length > 0) {
                        legislativeString.push(legislativeStringRaw[0].getElementsByClassName("s-inplace-input s-inplace-input-num")[0].value);
                    }       
                }
            }
            console.log('✅️ Getting data from Applications table Success');
        }
    }
    return { formula, description1, appliString, legislativeString };
  }

  function getTotalQty() {
    var collection = document.getElementsByClassName("s-slot-stack s-slot-cat-section s-page-sep-stack");
    var totalQty = [];
    for (let i = 0; i < collection.length; i++) {
        var tableTitles = collection[i].getElementsByClassName("s-h1-titles-h1-title-text");
        if (tableTitles.length > 0 && tableTitles[0].innerHTML.includes('Lines')) {
            console.log('⏳ Getting data from Lines table...');
            var tableGrids = collection[i].getElementsByClassName("s-grid-table-body")[0];
            var gridTableRows = tableGrids.rows;
            for (let j = 0; j < gridTableRows.length; j++) {
                // Extract Total qty. value (assume 6th cell, index 5)
                var qtyCell = gridTableRows[j].getElementsByClassName("s-inplace-input s-readonly")[5];
                if (qtyCell) {
                    totalQty.push(qtyCell.value);
                } else {
                    totalQty.push("");
                }
            }
            console.log('✅️ Getting data from Lines table Success');
        }
    }
    return totalQty;
  }

  function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
    console.log('✅️ Copying data to clipboard Success');
  }
})();