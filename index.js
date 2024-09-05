

let elementPropertiesInfo = {
    "div": [
        "BASIC",
        "VISUAL",
    ],
    "p": [
        "BASIC",
        { "label": "Visual Properties", "type": "heading" },
        { "label": "Text", "property": "innerHTML", "type": "script", "id": "defaultText" },
        { "label": "Style", "property": "style", "type": "script", "id": "defaultStyle" }
    ],

    "img": [
        "BASIC",
        { "label": "Visual Properties", "type": "heading" },
        { "label": "Source", "property": "src", "type": "text", "id": "imageSource" },
        { "label": "Alternative Text", "property": "alt", "type": "text", "id": "imageAlt" },
        { "label": "Style", "property": "style", "type": "script", "id": "imageStyle" },
    ],

    "h1": [
        "BASIC",
        "VISUAL",
    ],
    "h2": [
        "BASIC",
        "VISUAL",
    ],
    "h3": [
        "BASIC",
        "VISUAL",
    ],
    "h4": [
        "BASIC",
        "VISUAL",
    ],
    "h5": [
        "BASIC",
        "VISUAL",
    ],
    "h6": [
        "BASIC",
        "VISUAL",
    ],
    "button": [
        "BASIC",
        "VISUAL",
    ],
    "a": [
        "BASIC",
        "VISUAL",
        { "label": "Link", "property": "href", "type": "text", "id": "linkSource" },
    ],
    "script": [
        "BASIC",
        { "label": "Script Properties", "type": "heading" },
        { "label": "Source", "property": "src", "type": "text", "id": "scriptSource" },
        { "label": "Script", "property": "innerHTML", "type": "script", "id": "scriptScript" },
    ],
    "label": [
        "BASIC",
        "VISUAL",
        { "label": "For ID:", "property": "for", "type": "text", "id": "labelFor" },
    ],
    "input": [
        "BASIC",
        { "label": "Visual Properties", "type": "heading" },
        { "label": "Input Type", "property": "type", "type": "dropdown", "id": "inputType" },
        { "label": "Placeholder", "property": "placeholder", "type": "text", "id": "inputPlaceholder" }
    ],
    "textarea": [
        "BASIC",
        { "label": "Visual Properties", "type": "heading" },

        { "label": "Placeholder", "property": "innerHTML", "type": "text", "id": "inputPlaceholder" }]
};

function getPropertyDropdown(id, value) {
    const dropdownValues = {
        'inputType': `<select id="inputType">
            <option value="text" ${value === 'text' ? 'selected' : ''}>Text</option>
            <option value="password" ${value === 'password' ? 'selected' : ''}>Password</option>
            <option value="checkbox" ${value === 'checkbox' ? 'selected' : ''}>Checkbox</option>
            <option value="radio" ${value === 'radio' ? 'selected' : ''}>Radio</option>
            <option value="number" ${value === 'number' ? 'selected' : ''}>Number</option>
            <option value="date" ${value === 'date' ? 'selected' : ''}>Date</option>
            <option value="color" ${value === 'color' ? 'selected' : ''}>Color</option>
            <option value="file" ${value === 'file' ? 'selected' : ''}>File</option>
            <option value="submit" ${value === 'submit' ? 'selected' : ''}>Submit</option>
            <option value="reset" ${value === 'reset' ? 'selected' : ''}>Reset</option>
            <option value="email" ${value === 'email' ? 'selected' : ''}>Email</option>
            <option value="url" ${value === 'url' ? 'selected' : ''}>URL</option>
            <option value="tel" ${value === 'tel' ? 'selected' : ''}>Telephone</option>
            <option value="search" ${value === 'search' ? 'selected' : ''}>Search</option>
        </select>`
    };

    return dropdownValues[id] || ''; // Check if the key exists
}


function replaceKeywordsWithSet(obj, keyword, replacement) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
            const index = obj[key].indexOf(keyword);
            if (index !== -1) {
                obj[key].splice(index, 1, ...replacement);
            }
        }
    }
}

let basicProperties = [
    { "label": "Basic Properties", "type": "heading" },
    { "label": "Name", "property": "name", "type": "text", "id": "defaultName" },
    { "label": "Class", "property": "className", "type": "text", "id": "defaultClass" },
    { "label": "ID", "property": "id", "type": "text", "id": "defaultId" },
    { "label": "Comment", "property": "elementComment", "type": "text", "id": "defaultComment" },
    { "label": "On Click", "property": "onclick", "type": "script", "id": "onclickButton" },
];

let visualProperties = [
    { "label": "Visual Properties", "type": "heading" },
    { "label": "Text", "property": "innerHTML", "type": "text", "id": "defaultText" },
    { "label": "Style", "property": "style", "type": "script", "id": "defaultStyle" },
];

replaceKeywordsWithSet(elementPropertiesInfo, "BASIC", basicProperties);
replaceKeywordsWithSet(elementPropertiesInfo, "VISUAL", visualProperties);

let page = { "elements": [] };

function loadPage() {
    let preview = document.getElementById('pageload');
    if (preview) {
        preview.innerHTML = '';
        for (let i = 0; i < page.elements.length; i++) {
            let elementInfo = page.elements[i];
            let newElement = document.createElement(elementInfo.elementType);
            newElement.GENERATED = true;
            newElement.pageID = i;
            for (let property in elementInfo.properties) {
                newElement[property] = elementInfo.properties[property];
            }
            preview.appendChild(newElement);
        }
        updateStylePanel();
    }
}

function newElement(type, properties) {
    let newElement = {
        "elementType": type || 'div',
        "properties": properties || {},
    };

    page.elements.push(newElement);

    window.ElementSelected = newElement;
    updatePropertiesPanel(newElement);
    loadPage();
}

function getNextElementID() {
    return page.elements.length + 1;
}

function deleteElement(elementSelect) {
    let element = elementSelect || window.ElementSelected;
    let elements = page.elements;
    let index = elements.indexOf(element);
    let can = true;

    if (index !== -1) {
        console.log(JSON.stringify(page.elements[index]));
        if (JSON.stringify(page.elements[index]).length > 300) {
            can = confirm('Are you sure?');
        }

        if (can) {
            elements.splice(index, 1);
            let newelement = page.elements[index - 1] || page.elements[index + 1];
            window.ElementSelected = newelement;
            loadPage();
            updatePropertiesPanel(newelement);
        }
    }
}

// Add these functions to your existing script

function saveProperties() {
    let element = window.ElementSelected;
    if (!element) return;

    let properties = elementPropertiesInfo[element.elementType];

    properties.forEach(property => {
        let inputID = property.id;
        let inputElement = document.getElementById(inputID);

        if (inputElement) {
            element.properties[property.property] = inputElement.value.replace(/"/g, "'");
        }
    });

    updatePropertiesPanel();
    loadPage();
}

function saveToLocalStorage(value) {
    // Save the page object to localStorage
    let val = value || document.getElementById("fileName").value
    if (val === 'new-file') {
        let name = prompt('Name the file.')
        if (name) {
            saveToLocalStorage(name)
            loadFromLocalStorage()
        } else {
            return
        }

    }

    localStorage.setItem('goober:' + val, JSON.stringify(page));
}

function deleteFile() {
    if (confirm('Are you sure?')) {
        let val = document.getElementById("fileName").value
        localStorage.removeItem('goober:' + val)
        loadFromLocalStorage()
    }
}

function loadFromLocalStorage() {
    // Load the page object from localStorage
    const fileNameDropdown = document.getElementById("fileName");

    // Clear existing options
    fileNameDropdown.innerHTML = '<option value="">Select a File</option>';

    // Iterate through localStorage keys and add them as options
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Check if the key starts with 'goober:'
        if (key.startsWith('goober:')) {
            const fileName = key.replace('goober:', '');

            // Create an option element
            const option = document.createElement("option");
            option.value = fileName;
            option.text = fileName;

            // Append the option to the dropdown
            fileNameDropdown.appendChild(option);
        }
    }
    fileNameDropdown.innerHTML += '<option value="new-file">New File</option>';
}

function loadSelectedFile() {
    let selectedFileName = document.getElementById("fileName").value;

    if (selectedFileName) {
        const savedPage = localStorage.getItem('goober:' + selectedFileName);
        if (savedPage) {
            page = JSON.parse(savedPage);
            loadPage();
        }
    }
}

// Function to recursively generate HTML for an element and its children
function loadPageExport() {
    let preview = document.getElementById('pageload');

    if (preview) {
        preview.innerHTML = '';

        const fragment = document.createDocumentFragment();

        page.elements.forEach((elementInfo, index) => {
            let newElement = document.createElement(elementInfo.elementType);
            newElement.GENERATED = true;
            newElement.pageID = index;

            Object.entries(elementInfo.properties).forEach(([property, value]) => {
                newElement[property] = value;
            });

            fragment.appendChild(newElement);
        });

        preview.appendChild(fragment);
        updateStylePanel();
    }
}

function exportHTML() {
    let previewwindow = document.getElementById('pageload')
    loadPage()
    if (previewwindow) {
        let html = `
        <!DOCTYPE HTML>
        <html>

        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>goober2D</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
            }
        <style>
        </head>

        <body>

        <div id="pageload">
        </div>
                <script>
        let page = ${JSON.stringify(page)}
        ${loadPageExport}
        // onclick handler
document.addEventListener('click', function (event) {
    
    // Get the clicked element
    let element = event.target;
console.log(element)
    // Check if the clicked element has a property named GENERATED
        // Get the page ID and onclick function from the element
        let pageID = element.pageID;
        let onclickFunction = new Function(page.elements[element.pageID].properties.onclick)

        // Check if the onclick function is a valid function
        if (typeof onclickFunction === 'function') {
            // Call the onclick function with the clicked element as an argument
            onclickFunction.call(element);
        } else {
            console.error('Invalid onclick function:', onclickFunction);
        }
});
loadPageExport()
        </script>
        </body>
        
        </html>
        `

        let file = new Blob([html], { type: 'text/plain' })
        let url = URL.createObjectURL(file)
        let a = document.createElement('a')

        a.href = url
        a.download = 'index.html'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url);
    } else {
        alert("You must have the preview window open to export HTML.")
    }
}

function getDropdownElement() {
    let dropdown = document.getElementById('elementlist');
    if (dropdown.value === 'null') {
        return 'div';
    } else {
        return dropdown.value;
    }
}

function parseInlineCSS(cssString) {
    const inlineProperties = {};
    const propertyRegex = /([^:\s]+)\s*:\s*([^;]+);/g;

    let propertyMatch;
    while ((propertyMatch = propertyRegex.exec(cssString)) !== null) {
        const property = propertyMatch[1].trim();
        const value = propertyMatch[2].trim();
        inlineProperties[property] = value;
    }

    return inlineProperties;
}

function objectToHTML(obj, parentElement) {
    const ul = document.createElement('ul');
    parentElement.appendChild(ul);

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const li = document.createElement('li');
            li.textContent = key;

            if (typeof obj[key] === 'object') {
                objectToHTML(obj[key], li);
            } else {
                const span = document.createElement('span');
                span.textContent = `: ${obj[key]}`;
                li.appendChild(span);
            }

            ul.appendChild(li);
        }
    }
}

function addStyleProperty(value) {
    if (window.ElementSelected) {
        let keyElement = document.getElementById('cssProperties');
        if (keyElement) {
            let key = keyElement.value;
            let currentStyle = window.ElementSelected.properties.style || '';

            if (!currentStyle.includes(`${key}:`)) {
                window.ElementSelected.properties.style = `${currentStyle} ${key}: ${value};`;
                updateStylePanel();
            }
        }
    }
}

function renderPropertyInput(property, element) {
    let inputElement;

    if (property.type === 'script') {
        inputElement = `<p>${property.label}</p>
        <textarea id="${property.id}">${element.properties[property.property] || ''}</textarea>`;
    } else if (property.type === 'heading') {
        inputElement = `<hr><h3>${property.label}</h3>`;
    } else if (property.type === 'dropdown') {
        inputElement = getPropertyDropdown(property.id, element.properties[property.property] || '')
    } else {
        inputElement = `<label for="${property.id}">${property.label}</label>
                      <input type="${property.type}" id="${property.id}" value="${element.properties[property.property] || ''}">`;
    }

    return `${inputElement}<div></div>`;
}

function elementMove(spaces) {
    let element = window.ElementSelected;
    if (element) {
        let index = page.elements.indexOf(element);
        let targetIndex = index + spaces;

        // Ensure targetIndex is within valid bounds
        if (targetIndex >= 0 && targetIndex < page.elements.length) {
            // Swap elements at index and targetIndex
            [page.elements[index], page.elements[targetIndex]] = [page.elements[targetIndex], page.elements[index]];
        } else {
            console.error('Invalid target index:', targetIndex);
        }
        loadPage()
    }
}


function updateStylePanel() {
    let panel = document.getElementById('style-window')
    if (panel && window.ElementSelected) {

        let styles = parseInlineCSS(window.ElementSelected.properties.style)
        let html = objectToHTML('p', styles)

        panel.innerHTML = html
    }
}

function updatePropertiesPanel(elementSelect) {
    let element = elementSelect || window.ElementSelected || null;
    let panel = document.getElementById('propertieswindow');

    if (panel) {
        panel.innerHTML = '';

        if (element) {
            let content = `<h1>${element.properties.name || element.elementType}</h1>`;

            let thisElementPropertiesInfo = elementPropertiesInfo[element.elementType];

            thisElementPropertiesInfo.forEach(property => {
                content += renderPropertyInput(property, element);
            });

            window.ElementSelected = element;
            content += `
          <div></div>
          <hr>
          <button onclick="saveProperties()">Save</button>
          <button onclick="elementMove(-1)">Up</button>
          <button onclick="elementMove(1)">Down</button>
          <button style="background-color: rgb(215, 3, 3);" onclick="deleteElement()">Delete</button>
        `;

            panel.innerHTML = content;
            updateStylePanel()
        }
    }
}


function objectToHTML(tagName, attributes) {
    const attributeString = Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');

    return `<${tagName} ${attributeString}></${tagName}>`;
}

function addStyleProperty(value) {
    if (window.ElementSelected) {
        let keyElement = document.getElementById('cssProperties');
        if (keyElement) {
            let key = keyElement.value;
            let currentStyle = window.ElementSelected.properties.style || '';

            // Check if the style property already exists to avoid duplicates
            if (!currentStyle.includes(`${key}:`)) {
                window.ElementSelected.properties.style += `${key}: ${value};\n`;
                updateStylePanel();
            }
        }
    }
}

function changeStyleProperty(property, value) {
    if (window.ElementSelected) {
        let styles = parseInlineCSS(window.ElementSelected.properties.style);
        styles[property] = value;

        // Update the style property
        let newStyle = '';
        for (let key in styles) {
            if (styles.hasOwnProperty(key)) {
                newStyle += `${key}: ${styles[key]}; `;
            }
        }

        window.ElementSelected.properties.style = newStyle.trim();

        // Update the style panel
        updateStylePanel();
        loadPage()
        updatePropertiesPanel();
    }
}

const styleInputs = {
    'color': 'color',
    'background-color': 'color',
    'background-image': 'url',
}

function updateStylePanel() {
    let panel = document.getElementById('style-window');

    if (panel && window.ElementSelected) {
        let styles = parseInlineCSS(window.ElementSelected.properties.style);
        let html = `<h1>${window.ElementSelected.properties.name}</h1><ul>`;

        for (let key in styles) {
            if (styles.hasOwnProperty(key)) {
                html += `<li>${key}: <input type="${styleInputs[key]}" onchange="changeStyleProperty('${key}', event.target.value)" value="${styles[key]}"></input></li>`;
            }
        }

        html += '</ul>';

        panel.innerHTML = html;

        let advancedStyle = document.getElementById('defaultStyle')
        if (advancedStyle) {
            advancedStyle.innerHTML = window.ElementSelected.properties.style
        }


    }
}


//selection
document.addEventListener('click', function (event) {
    let element = event.target;

    if (element.GENERATED) {
        updatePropertiesPanel(page.elements[element.pageID]);
    }
});

// onclick handler
document.addEventListener('click', function (event) {
    // Get the clicked element
    let element = event.target;

    // Check if the clicked element has a property named GENERATED
    if (element.GENERATED) {
        // Get the page ID and onclick function from the element
        let pageID = element.pageID;
        let onclickFunction = new Function(page.elements[element.pageID].properties.onclick)

        // Check if the onclick function is a valid function
        if (typeof onclickFunction === 'function') {
            // Call the onclick function with the clicked element as an argument
            onclickFunction.call(element);
        } else {
            console.error('Invalid onclick function:', onclickFunction);
        }
    }
});


document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveProperties();
    }
});

loadPage()
//loadFromLocalStorage()
