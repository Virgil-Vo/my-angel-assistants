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
        var productIds = ['product-id-1', 'product-id-2']; // Example product IDs
        var mainSection = document.querySelector('.s-h2-body');

        var productInputField = mainSection.querySelector('.s-field s-responsive-field-size-36');

        for (let productId of productIds) {
            // Input the product ID into the input field with class s-field-input
        }
        
    } catch (err) {
        // Notify failure
        chrome.runtime.sendMessage({ exportResult: 'error', error: err && err.message ? err.message : String(err) });
    }

    async function extractData() {
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
        // using a reference table inside the translator/French-English-OD-terminology.csv file
        const translatedTop = await translateDescriptors(topDescriptors);
        const translatedMid = await translateDescriptors(midDescriptors);
        const translatedBase = await translateDescriptors(baseDescriptors);

        // Log the translated values
        console.log("Translated TOP Descriptors: from " + topDescriptors.join(', ') + " to " + translatedTop.join(', '));
        console.log("Translated MID Descriptors: from " + midDescriptors.join(', ') + " to " + translatedMid.join(', '));
        console.log("Translated BASE Descriptors: from " + baseDescriptors.join(', ') + " to " + translatedBase.join(', '));

        const capitalize = arr => arr.map(term => 
            term.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
        );

        // Prepare the copied value in tab-separated format
        // recase all descriptors to start with a capital letter
        copiedValue += family + '\t';
        copiedValue += capitalize(translatedTop).join(', ') + '\t';
        copiedValue += capitalize(translatedMid).join(', ') + '\t';
        copiedValue += capitalize(translatedBase).join(', ');

        copyTextToClipboard(copiedValue);
        // If all went well, notify success
        chrome.runtime.sendMessage({ exportResult: 'success' });
    }

    function getDescriptionSection() {

        var descriptionSection = Array.from(document.querySelectorAll(".s-h1-titles-h1-title-text"))
            .find(el => el.textContent.trim() === "Description")
            ?.closest('.s-h1');

        if (!descriptionSection) {
            console.error("Description section not found.");
            return '';
        }

        return descriptionSection;
    }

    // Extract 'Family' 
    function extractFamily() {
        // Locate the Desciption section:
        // - the class s-h1 where the s-h1-titles-h1-title-text is Description
        var descriptionSection = getDescriptionSection();

        // Get the input field with class s-field-input s-readonly inside the description section
        if (!descriptionSection) {
            console.error("Description section not found.");
            return '';
        }

        var family = descriptionSection.querySelector(".s-field-input.s-readonly");
        if (family) {
            console.log("Family: " + family.value);
            return family.value.trim();
        }
        console.error("Family input field not found.");
        return '';
    }

    // Extract all 'Descriptor head note' (TOP) from a table
    // Get the 4th column (index 3) which contains the TOP Description
    function extractTopDescriptors() {
        // Locate the Desciption section:
        // - the class s-h1 where the s-h1-titles-h1-title-text is Description
        var descriptionSection = getDescriptionSection();

        // Get the first table with class s-grid-table-body from the description section
        var table = descriptionSection.querySelectorAll(".s-grid-table-body")[0];
        var rows = table.rows;

        var topDescriptors = [];

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
        // Locate the Desciption section:
        // - the class s-h1 where the s-h1-titles-h1-title-text is Description
        var descriptionSection = getDescriptionSection();

        // Get the first table with class s-grid-table-body from the description section
        var table = descriptionSection.querySelectorAll(".s-grid-table-body")[1];
        var rows = table.rows;

        var heartDescriptors = [];

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
        // Locate the Desciption section:
        // - the class s-h1 where the s-h1-titles-h1-title-text is Description
        var descriptionSection = getDescriptionSection();

        // Get the first table with class s-grid-table-body from the description section
        var table = descriptionSection.querySelectorAll(".s-grid-table-body")[2];
        var rows = table.rows;

        var baseDescriptors = [];

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