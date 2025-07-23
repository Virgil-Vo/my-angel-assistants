// -------------------------------------------------------
// injector.js - Extracts key values from the Sales Order page
// -------------------------------------------------------
// This script is injected into the page to extract:
//   - Number, Reference, Date fields
//   - Application table data (formula, description)
//   - Lines table data (Total qty.)
//   - Copies the extracted data to the clipboard in a tab-separated format
//
// Sample copied data:
// Number\tReference\tDate
// OE2506875\tREF123\t25/05/2024
// Description from second table row 1\t
// Description from second table row 2\t
// ...
// Formula1\tDescription1-1\tTotalQty1
// Formula2\tDescription1-2\tTotalQty2
// ...
// -------------------------------------------------------

// -------------------------------------------------------
// Extract Number, Reference, Date fields
// -------------------------------------------------------
var number = '';
var reference = '';
var date = '';

var collection = document.getElementsByClassName("s-field-input");
for (let i = 0; i < collection.length; i++) {
    var label = document.querySelector('label[for="'+collection[i].id+'"]');
    if (label && label.textContent == 'Number') {
        number = collection[i].value;
    }
}

collection = document.getElementsByClassName("s-field-input s-readonly");
for (let i = 0; i < collection.length; i++) {
    var label = document.querySelector('label[for="'+collection[i].id+'"]');
    if (label) {
        if (label.textContent == 'Reference') {
            reference = collection[i].value;
        } else if (label.textContent == 'Date') {
            var dateRaw = collection[i].value;
            var parts = dateRaw.split("/");
            date = parts[1] + '/' + parts[0] + '/' + parts[2];
        }
    }
}

// -------------------------------------------------------
// Extract Application table data (formula, description)
// -------------------------------------------------------
var formula = [];
var description1 = [];
var description = [];

var sectionCollection = document.getElementsByClassName("s-slot-stack s-slot-cat-section s-page-sep-stack");
for (let i = 0; i < sectionCollection.length; i++) {
    var tableTitles = sectionCollection[i].getElementsByClassName("s-h1-titles-h1-title-text");
    if (tableTitles.length > 0 && tableTitles[0].innerHTML.includes('Applications')) {
        var tableGrids = sectionCollection[i].getElementsByClassName("s-grid-table-body");
        if (tableGrids.length > 0) {
            var rows = tableGrids[0].rows;
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
                var descriptionString = secondTableRows[j].getElementsByClassName("s-inplace-value-read");
                if (descriptionString.length > 0) {
                    description.push(descriptionString[0].innerHTML);
                }
            }
        }
    }
}

// -------------------------------------------------------
// Extract Total qty. from Lines table (by row index)
// -------------------------------------------------------
var totalQty = [];
for (let i = 0; i < sectionCollection.length; i++) {
    var tableTitles = sectionCollection[i].getElementsByClassName("s-h1-titles-h1-title-text");
    if (tableTitles.length > 0 && tableTitles[0].innerHTML.includes('Lines')) {
        var tableGrids = sectionCollection[i].getElementsByClassName("s-grid-table-body");
        if (tableGrids.length > 0) {
            var rows = tableGrids[0].rows;
            for (let j = 0; j < rows.length; j++) {
                // Total qty. is in the 6th column (index 5)
                var qtyCell = rows[j].getElementsByClassName("s-inplace-value-read")[5];
                if (qtyCell) {
                    totalQty.push(qtyCell.innerText || qtyCell.textContent);
                } else {
                    totalQty.push("");
                }
            }
        }
    }
}
console.log("Total qty. array:", totalQty);

// -------------------------------------------------------
// Build tab-separated string and copy to clipboard
// -------------------------------------------------------
var copiedValue = number + '\t' + reference + '\t' + date + '\n';
for (let i = 0; i < description.length; i++) {
    copiedValue += description[i] + '\t' + '\n';
}
for (let i = 0; i < formula.length; i++) {
    // Add formula, description1, totalQty (tab-separated)
    copiedValue += formula[i] + '\t' + description1[i] + '\t' + (totalQty[i] || '') + '\n';
}

navigator.permissions.query({name: "clipboard-write"}).then((result) => {
    if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(copiedValue);
    }
});

alert("Result copied to clipboard: " + copiedValue);
