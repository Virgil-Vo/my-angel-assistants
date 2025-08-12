/**
 * -------------------------------------------------------
 * Script: exportData.js
 * Purpose: Extracts specific data fields from a web page
 *          and copies them to the clipboard in a tab-separated format.
 * Usage:   Designed for use as a browser plugin or injected script
 *          to automate data extraction from a structured web form.
 * 
 * Main Steps:
 * 
 * Note: 
 *   - Assumes specific class names and DOM structure.
 * -------------------------------------------------------
 */

(async function () {
    try {
        // Extract 'Family'
        const family = extractFamily();
        // Extract 'Descriptor head note' (TOP)
        const topDescriptors = extractTopDescriptors();
        // Extract 'Descriptor heart note' (MID)
        const midDescriptors = extractMidDescriptors();
        // Extract 'Descriptor base note' (BASE)
        const baseDescriptors = extractBaseDescriptors();

        console.log("------------------------------------------------");
        console.log("Family: " + family);
        console.log("TOP Descriptors: " + topDescriptors.join(', '));
        console.log("MID Descriptors: " + midDescriptors.join(', '));
        console.log("BASE Descriptors: " + baseDescriptors.join(', '));
        console.log("------------------------------------------------");

        // Copy data to clipboard
        var copiedValue = '';

        // Translate the top, mid, and base descriptors from French to English 
        // using a reference table inside the ../translator/French-English-OD-terminology.xlsx file

        const translatedTop = await translateDescriptors(topDescriptors);
        const translatedMid = await translateDescriptors(midDescriptors);
        const translatedBase = await translateDescriptors(baseDescriptors);

        // Log the translated values
        console.log("Translated TOP Descriptors: from " + topDescriptors.join(', ') + " to " + translatedTop.join(', '));
        console.log("Translated MID Descriptors: from " + midDescriptors.join(', ') + " to " + translatedMid.join(', '));
        console.log("Translated BASE Descriptors: from " + baseDescriptors.join(', ') + " to " + translatedBase.join(', '));

        copiedValue += family + '\t';
        copiedValue += translatedTop.join(', ') + '\t';
        copiedValue += translatedMid.join(', ') + '\t';
        copiedValue += translatedBase.join(', ');

        copyTextToClipboard(copiedValue);
        // If all went well, notify success
        chrome.runtime.sendMessage({ exportResult: 'success' });
    } catch (err) {
        // Notify failure
        chrome.runtime.sendMessage({ exportResult: 'error', error: err && err.message ? err.message : String(err) });
    }

    // Extract 'Family' 
    function extractFamily() {
        var family = document.querySelector("#\\36 9-521-input")
        if (family) {
            return family.value.trim();
        }
        return '';
    }

    // Extract all 'Descriptor head note' (TOP) from a table
    // Get the 4th column (index 3) which contains the TOP Description
    function extractTopDescriptors() {
        var topDescriptors = [];
        var table = document.querySelector("#layout-slot-69-549 > div > article > div.s-array-core > div.s-grid-slot > div > div.s-grid-slot-table-scroll > div.s-grid-slot-body > table");
        var rows = table.rows;

        for (let i = 0; i < rows.length; i++) {
            // Get the 4th column (index 3) which contains the TOP Description
            var row = rows[i];
            if (row.cells.length < 4) continue; // Skip rows that don't have enough
            var topDescriptor = row.cells[3].textContent.trim();
            if (topDescriptor) {
                topDescriptors.push(topDescriptor);
            }
        }

        return topDescriptors;
    }


    // Extract all 'Descriptor heart note' (MID) from a table
    // Get the 4th column (index 3) which contains the MID Description
    function extractMidDescriptors() {
        var heartDescriptors = [];
        var table = document.querySelector("#layout-slot-69-555 > div > article > div.s-array-core > div.s-grid-slot > div > div.s-grid-slot-table-scroll > div.s-grid-slot-body > table");
        var rows = table.rows;

        for (let i = 0; i < rows.length; i++) {
            // Get the 4th column (index 3) which contains the MID Description
            var row = rows[i];
            if (row.cells.length < 4) continue; // Skip rows that don't have enough
            var heartDescriptor = row.cells[3].textContent.trim();
            if (heartDescriptor) {
                heartDescriptors.push(heartDescriptor);
            }
        }

        return heartDescriptors;
    }

    // Extract all 'Descriptor base note' (BASE) from a table
    // Get the 4th column (index 3) which contains the BASE Description
    function extractBaseDescriptors() {
        var baseDescriptors = [];
        var table = document.querySelector("#layout-slot-69-561 > div > article > div.s-array-core > div.s-grid-slot > div > div.s-grid-slot-table-scroll > div.s-grid-slot-body > table");
        var rows = table.rows;

        for (let i = 0; i < rows.length; i++) {
            // Skip rows that don't have enough cells
            var row = rows[i];
            if (row.cells.length < 4) continue; // Skip rows that don't have enough

            var baseDescriptor = row.cells[3].textContent.trim();
            if (baseDescriptor) {
                baseDescriptors.push(baseDescriptor);
            }
        }

        return baseDescriptors;
    }

    async function translateDescriptors(frenchTerms) {
        try {
            // Fetch the CSV file
            const response = await fetch(chrome.runtime.getURL('translator/French-English-OD-terminology.csv'));
            const csvText = await response.text();

            // Parse CSV into a translation map
            const lines = csvText.split('\n').filter(line => line.trim());
            const translationMap = new Map();
            for (let i = 1; i < lines.length; i++) { // skip header
                const [french, english] = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                if (french && english) {
                    translationMap.set(french.toLowerCase(), english);
                }
            }

            // Translate terms and return the English equivalents with Capitalize
            return frenchTerms.map(term => {
                const englishTerm = translationMap.get(term.toLowerCase());
                return englishTerm ? englishTerm.charAt(0).toUpperCase() + englishTerm.slice(1) : term;
            });
        } catch (error) {
            console.error('Translation error:', error);
            return frenchTerms; // Return original terms if translation fails
        }
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