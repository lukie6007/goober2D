//TODO
//add more element types
//drag and drop

let page = {};
let propertyInfo = {
    'button': [
        { 'label': 'Label', 'property': 'innerHTML', 'type': "text", "ID": 10 },
        { 'label': 'OnClick', 'property': 'onclick', 'type': "script", "ID": 20 },
        { 'label': 'Style', 'property': 'style', 'type': "script", "ID": 25 },

    ],
    'div': [
        { 'label': 'HTML', 'property': 'innerHTML', 'type': "script", "ID": 30 },
        { 'label': 'Color', 'property': 'style.color', 'type': "color", "ID": 40 },
        { 'label': 'Style', 'property': 'style', 'type': "text", "ID": 50 },
    ],
    'img': [
        { 'label': 'Source', 'property': 'src', 'type': "text", "ID": 60 },
        { 'label': 'Alternative Text', 'property': 'alt', 'type': "text", "ID": 70 },
    ],
    'script': [
        { 'label': 'Source', 'property': 'src', 'type': "text", "ID": 80 },
        { 'label': 'JavaScript', 'property': 'innerText', 'type': "script", "ID": 90 },
    ],
    'style': [
        { 'label': 'CSS', 'property': 'innerHTML', 'type': "script", "ID": 100 },
    ],
    'p': [
        { 'label': 'Text', 'property': 'innerHTML', 'type': "text", "ID": 110 },
        { 'label': 'Style', 'property': 'style', 'type': "script", "ID": 120 }
    ],
    'a': [
        { 'label': 'Text', 'property': 'innerHTML', 'type': "text", "ID": 120 },
        { 'label': 'Link', 'property': 'href', 'type': "text", "ID": 130 },
        { 'label': 'Style', 'property': 'style', 'type': "script", "ID": 140 }
    ],
};

for (let elementType in propertyInfo) {
    // Add default values for 'ID' and 'Class' to the current array
    propertyInfo[elementType].push(
        { 'label': 'Element ID', 'property': 'id', 'type': "text", "ID": 0 },
        { 'label': 'Class', 'property': 'class-name', 'type': "text", "ID": -1 },
    );
}

page.elements = [];

let pageHistory = [];
let currentPageIndex = -1;

function saveState() {
    // Clone the current page object to avoid referencing the same object in history
    const clonedPage = JSON.parse(JSON.stringify(page));
    pageHistory.push(clonedPage);
    currentPageIndex = pageHistory.length - 1;
}

function newElement(type) {
    saveState()

    console.info("New Element Added:", type);
    let newElement = {
        "element": "null",
        "properties": {
            'innerText': "New Element",
            'innerHTML': 'New Element',
            'style.color': '#000000',
            'onclick': "",
            'id': Math.round(Date.now().toString().slice(-5, -1)),
            'class-name': 'default-class',
            'style': '',
            'src': './assets/logo.png'
        }
    };

    newElement.element = type;
    window.Selected = newElement
    updateProperties(newElement)
    page.elements.push(newElement);
    loadPage();
    return page.elements[newElement]
}

function updateElement(element) {
    let main = document.getElementById("main");
    let updatedElement = main.querySelector(`[data-id="${page.elements.indexOf(element)}"]`);

    // Update the element with the new properties
    for (let prop in element.properties) {
        updatedElement[prop] = element.properties[prop];
    }
}

function deleteElement(element) {
    if (confirm(`Are you sure you want to delete ${element.properties.id}?`)) {
        page.elements.splice(page.elements.indexOf(element), 1);
        updateProperties(null)
        loadPage();
    }

}

function loadPage() {

    let main = document.getElementById("main");
    main.innerHTML = '';
    for (let i = 0; i < page.elements.length; i++) {
        let elementInfo = page.elements[i];

        // Create a new HTML element
        let newElement = document.createElement(elementInfo.element);
        newElement.generated = true;

        // Set additional properties
        // Set additional properties
        for (let prop in elementInfo.properties) {
            if (prop === 'onclick') {
                // Create a function from the script and assign it to the onclick property
                newElement.onclick = new Function(elementInfo.properties[prop]);
            } else if (prop.startsWith('style.')) {
                // Extract the style property and set it
                const styleProp = prop.substring('style.'.length);
                newElement.style[styleProp] = elementInfo.properties[prop];
            } else {
                newElement[prop] = elementInfo.properties[prop];
            }
        }


        newElement.setAttribute('data-id', i);

        // Append the new element to the container element
        switch (elementInfo.element) {
            case 'style':
                document.head.appendChild(newElement);
                break;
            case 'script':
                document.head.appendChild(newElement);
                break;
            default:
                main.appendChild(newElement);
                break;
        }

        console.info("Page Loaded:", page);
    }
    updateHierarchy()

    return [document.head, main];
}

function saveProperties() {
    saveState()
    // Check if an element is selected
    if (window.Selected) {
        let properties = propertyInfo[window.Selected.element];

        properties.forEach(property => {
            let inputID = property.ID;
            let inputElement = document.getElementById(inputID);

            // Update the element.properties object with the new values

            window.Selected.properties[property.property] = inputElement.value.replaceAll(`"`, `'`);
        });

        // Update the element on the page
        console.info("Saved Element:", window.Selected)
        loadPage()

    }
}

function updateProperties(element) {
    // default values
    let propertyPanel = document.getElementById("properties");
    propertyPanel.innerHTML = '';

    if (element) {
        // Get the default properties for the element type
        let defaultProperties = propertyInfo[element.element];

        // Create a copy of the default properties
        let properties = [...defaultProperties];

        properties.forEach(property => {
            let inputID = property.ID;
            let value = element.properties[property.property];

            // add a property
            if (property.type === 'script') {
                propertyPanel.innerHTML += `
                    <label for="${inputID}">${property.label}</label>
                    <textarea id="${inputID}" class="codeMirrorTextarea" data-property="${property.property}">${value}</textarea>
                `;
                //  loadText()

                // Listen for changes in the editor content

            } else {
                propertyPanel.innerHTML += `
                    <label for="${inputID}">${property.label}</label>
                    <input type="${property.type}" id="${inputID}" data-property="${property.property}" value="${value}">
                `;
            }
        });

        // Add the "Save" button outside of the loop
        propertyPanel.innerHTML += `
            <button onclick="saveProperties()">Save</button>
            <button style="background-color: #E42800; " onclick="deleteElement(window.Selected)">Delete Element</button>
        `;
    }
}


function exportPage() {
    window.changesMade = false
    // Convert the page object to JSON
    let pageJSON = JSON.stringify(page, null, 2);

    // Create a Blob containing the JSON content
    let blob = new Blob([pageJSON], { type: 'application/json' });

    // Create a download link
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exported_page.json';

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click event on the link to initiate the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}


function undo() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        page = JSON.parse(JSON.stringify(pageHistory[currentPageIndex]));
        loadPage();
        updateProperties(window.Selected);
        console.log('Undo: Page reverted to previous state');
    } else {
        console.log('Undo: No more undo steps available');
    }
}

function redo() {
    if (currentPageIndex <= pageHistory.length) {
        currentPageIndex++;
        page = JSON.parse(JSON.stringify(pageHistory[currentPageIndex]));
        loadPage();
        updateProperties(window.Selected);
        console.log('Undo: Page reverted to previous state');
    } else {
        console.log('Undo: No more undo steps available');
    }
}

document.addEventListener("keydown", function (event) {
    // Check if "Control + S" or "Command + S" is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // Prevent the default browser save behavior

        // Save the properties when "Control + S" is pressed
        saveProperties();
    }
});

/* document.addEventListener("keydown", function (event) {
    // Check if "Control + S" or "Command + S" is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault(); // Prevent the default browser save behavior

        // Save the properties when "Control + S" is pressed
        undo();
    }
}); */

/* document.addEventListener("keydown", function (event) {
    // Check if "Control + S" or "Command + S" is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault(); // Prevent the default browser save behavior

        // Save the properties when "Control + S" is pressed
        redo();
    }
}); */

window.onload = function () {
    window.addEventListener("beforeunload", function (e) {

        var confirmationMessage = 'It looks like you have been editing something. '
            + 'If you leave before saving, your changes will be lost.';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });
};


document.addEventListener("click", function (event) {
    let element = event.target;
    if (element.generated) {
        let object = page.elements[element.getAttribute('data-id')];
        console.info("Selected:", object);
        window.Selected = object;
        updateProperties(object);
    }
});


function exportHTML() {
    // Convert the page object to JSON
    let pageJSON = JSON.stringify(page, null, 2);

    // Wrap the JSON content in a minimal HTML document structure
    let exportedHTML = loadPage()[0].outerHTML + loadPage()[1].outerHTML

    // Create a Blob containing the HTML content
    let blob = new Blob([exportedHTML], { type: 'text/html' });

    // Create a download link
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exported_main.html';

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click event on the link to initiate the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}




// Example editElement function
function editElement(element) {
    window.Selected = element
    updateProperties(element)
}

function importPage(importedPage) {
    // Check if the imported page is a valid object
    if (importedPage && typeof importedPage === 'object') {
        // Update the current page object with the imported one
        page = importedPage;

        // Load the imported page
        loadPage();

        console.log('Page imported successfully.');
    } else {
        console.error('Invalid imported page.');
    }
}

function importPageFromFile() {
    // Get the file input element
    const importInput = document.getElementById('importInput');

    // Check if a file is selected
    if (importInput.files.length > 0) {
        // Read the selected file
        const file = importInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                // Parse the JSON content of the file
                const importedPage = JSON.parse(event.target.result);

                // Import the page
                importPage(importedPage);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        };

        // Read the file as text
        reader.readAsText(file);
    } else {
        console.error('No file selected.');
    }
}

function updateHierarchy() {
    let hierarchy = document.getElementById("elementList");
    let list = page.elements;

    // Clear existing content
    hierarchy.innerHTML = '';

    // Loop through the elements and update the hierarchy display
    list.forEach(element => {
        let elementItem = document.createElement('div');

        // Create a new paragraph to display the element ID
        let elementIdParagraph = document.createElement('p');
        elementIdParagraph.textContent = `ID: ${element.properties.id}`;

        // Create an edit button for each element
        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editElement(element));

        // Append the ID and edit button to the hierarchy display
        elementItem.appendChild(elementIdParagraph);
        elementItem.appendChild(editButton);

        // Append the element item to the hierarchy
        hierarchy.appendChild(elementItem);
    });

}



loadPage();

