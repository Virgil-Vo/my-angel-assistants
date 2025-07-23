/// -------------------------------------------------------
/// Adding number field
/// -------------------------------------------------------
/*
console.log('Finding `Number` field...');
var collection = document.getElementsByClassName("s-field-input");

for (let i = 0; i < collection.length; i++) {
    var label = document.querySelector('label[for=\"'+collection[i].id+'\"]');
    // console.log(collection[i].id + " : "+ label.textContent);

    if (label && label.textContent == 'Number') {
        console.log('`Number` field found, adding value...');
        collection[i].value = number;
        
        const enterEvent = new KeyboardEvent('keydown', {
            bubbles: true, cancelable: true, keyCode: 13
        });
        document.body.dispatchEvent(enterEvent);
        console.log('Added Value to `Number` field');
    }
}
*/


/// -------------------------------------------------------
/// Getting Number
/// -------------------------------------------------------
var collection = document.getElementsByClassName("s-field-input");

var number = '';

for (let i = 0; i < collection.length; i++) {
    var label = document.querySelector('label[for=\"'+collection[i].id+'\"]');
    // console.log(collection[i].id + " : "+ label.textContent);
    if (label) {
        switch (label.textContent) {
            case 'Number': 
                console.log('Getting `Number` value...');
                number = collection[i].value;
                break;
        }
    }
}

/// -------------------------------------------------------
/// Getting Reference, Date value
/// -------------------------------------------------------
var collection = document.getElementsByClassName("s-field-input s-readonly");

var reference = '';
var date = '';

for (let i = 0; i < collection.length; i++) {
    var label = document.querySelector('label[for=\"'+collection[i].id+'\"]');
    // console.log(collection[i].id + " : "+ label.textContent);
    if (label) {
        switch (label.textContent) {
            case 'Reference': 
                console.log('Getting `Reference` value...');
                reference = collection[i].value;
                break;
            case 'Date':
                console.log('Getting `Date` value...');
                var dateRaw = collection[i].value;
                var parts = dateRaw.split("/");
                date = parts[1] + '/' + parts[0] + '/' + parts[2];
                break;
        }
    }
}

console.log("------------------------------------------------");
console.log("ref: " + reference + " | date: " + date);
console.log("------------------------------------------------");

/// -------------------------------------------------------
/// Getting Application formula from Apllication table
/// -------------------------------------------------------
var collection = document.getElementsByClassName("s-slot-stack s-slot-cat-section s-page-sep-stack");

var formula = [];
var description1 = [];
var description = [];

for (let i = 0; i < collection.length; i++) {
    var tableTitles = collection[i].getElementsByClassName("s-h1-titles-h1-title-text");
    //console.log(tableTitles[0]);

    if (tableTitles.length > 0 && tableTitles[0].innerHTML.includes('Applications')) {
        console.log('Getting data from Applications table...');

        // console.log("found Application table");

        var tableGrids = collection[i].getElementsByClassName("s-grid-table-body");
        

        if (tableGrids.length > 0) {
            var rows = tableGrids[0].rows;
            console.log("Applications table length: " + rows.length);

            for (let j = 0; j < rows.length; j++) {
                // var columns = rows[j].getElementsByClassName("s-grid-cell-edit s-inplace s-readonly");
                // console.log("found columns");

                var formulaString = rows[j].getElementsByClassName("s-inplace-input s-readonly");
                if (formulaString.length > 0) {
                    // console.log("found formula column: " + formulaString[0].value);
                    formula.push(formulaString[0].value);
                }

                var description1String = rows[j].getElementsByClassName("s-inplace-value-read");
                if (description1String.length > 0) {
                    // console.log("found description1 column: " + description1String[0].innerHTML);
                    description1.push(description1String[0].innerHTML);
                }               
            } 

            var secondTableRows = tableGrids[1].rows;
            for (let j = 0; j < secondTableRows.length; j++) {
                // var columns = rows[j].getElementsByClassName("s-grid-cell-edit s-inplace s-readonly");
                // console.log("found columns");

                var descriptionString = secondTableRows[j].getElementsByClassName("s-inplace-value-read");
                if (descriptionString.length > 0) {
                    // console.log("found description column: " + descriptionString[0].value);
                    description.push(descriptionString[0].innerHTML);
                }       
            }
        }
    }


/// -------------------------------------------------------
/// Getting Total Quantity from Lines table
/// -------------------------------------------------------
var collection = document.getElementsByClassName("s-slot-stack s-slot-cat-section s-page-sep-stack");

var formula = [];
var description1 = [];
var description = [];

for (let i = 0; i < collection.length; i++) {
    var tableTitles = collection[i].getElementsByClassName("s-h1-titles-h1-title-text");
    //console.log(tableTitles[0]);

    if (tableTitles.length > 0 && tableTitles[0].innerHTML.includes('Lines')) {
        console.log('Getting data from Lines table...');

        // console.log("found Application table");

        var tableGrids = collection[i].getElementsByClassName("s-grid-table-body");
        

        if (tableGrids.length > 0) {
            var rows = tableGrids[0].rows;
            console.log("Lines table length: " + rows.length);

            for (let j = 0; j < rows.length; j++) {
                // var columns = rows[j].getElementsByClassName("s-grid-cell-edit s-inplace s-readonly");
                // console.log("found columns");

                var formulaString = rows[j].getElementsByClassName("s-inplace-input s-readonly");
                if (formulaString.length > 0) {
                    // console.log("found formula column: " + formulaString[0].value);
                    formula.push(formulaString[0].value);
                }

                var description1String = rows[j].getElementsByClassName("s-inplace-value-read");
                if (description1String.length > 0) {
                    // console.log("found description1 column: " + description1String[0].innerHTML);
                    description1.push(description1String[0].innerHTML);
                }               
            } 

            var secondTableRows = tableGrids[1].rows;
            for (let j = 0; j < secondTableRows.length; j++) {
                // var columns = rows[j].getElementsByClassName("s-grid-cell-edit s-inplace s-readonly");
                // console.log("found columns");

                var descriptionString = secondTableRows[j].getElementsByClassName("s-inplace-value-read");
                if (descriptionString.length > 0) {
                    // console.log("found description column: " + descriptionString[0].value);
                    description.push(descriptionString[0].innerHTML);
                }       
            }
        }
    }
}

console.log("------------------------------------------------");
console.log("formula: " + formula + " | description1: " + description1);
console.log("description: " + description);
console.log("------------------------------------------------");

/// -------------------------------------------------------
/// Copy data to clipboard
/// -------------------------------------------------------
var copiedValue = number + '\t' + reference + '\t' + date;
copiedValue += '\n';

for (let i = 0; i < description.length; i++) {
    copiedValue += description[i] + '\t';
    copiedValue += '\n';
}

for (let i = 0; i < formula.length; i++) {
    copiedValue += formula[i] + '\t' + description1[i];
    copiedValue += '\n';
}

navigator.permissions.query({name: "clipboard-write"}).then((result) => {
    if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(copiedValue);
    }
});

// Alert the copied text
alert("Result copied to clipboard: " + copiedValue);
