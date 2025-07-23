document.addEventListener('DOMContentLoaded', documentEvents  , false);

function documentEvents() {    
    document.getElementById('fillForm').addEventListener('click', async evt => {
        evt.preventDefault();
        var [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        //var text = document.getElementById('searchTerm').value;

        await chrome.scripting.executeScript({
            target: {tabId: tab.id, allFrames: true},
            files: ['injector.js']
        });
    });
}

window.addEventListener('load', function () {
  // alert("It's loaded!");
  console.log("page loaded");
});
