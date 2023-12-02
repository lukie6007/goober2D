
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
        { "label": "Alternative Text", "property": "alt", "type": "text", "id": "imageSource" },
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
        { "label": "Style", "property": "style", "type": "script", "id": "inputStyle" },
        { "label": "Placeholder", "property": "placeholder", "type": "text", "id": "inputPlaceholder" }
    ],
    "textarea": [
        "BASIC",
        { "label": "Visual Properties", "type": "heading" },
        { "label": "Style", "property": "style", "type": "script", "id": "inputStyle" },
        { "label": "Placeholder", "property": "innerHTML", "type": "text", "id": "inputPlaceholder" }
    ],
};

function replaceKeywordsWithSet(obj, keyword, replacement) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
            const index = obj[key].indexOf(keyword);
            if (index !== -1) {
                // Replace the keyword with the new set of properties
                obj[key].splice(index, 1, ...replacement);
            }
        }
    }
}

let basicProperties = [
    { "label": "Basic Properties", "type": "heading" },
    { "label": "Name", "property": "name", "type": "text", "id": "divName" },
    { "label": "Class", "property": "className", "type": "text", "id": "divClass" },
    { "label": "ID", "property": "id", "type": "text", "id": "divId" }
];

let visualProperties = [
    { "label": "Visual Properties", "type": "heading" },
    { "label": "Text", "property": "innerHTML", "type": "text", "id": "defaultText" },
    { "label": "Style", "property": "style", "type": "script", "id": "defaultStyle" }
];

replaceKeywordsWithSet(elementPropertiesInfo, "BASIC", basicProperties);
replaceKeywordsWithSet(elementPropertiesInfo, "VISUAL", visualProperties);

let page = {
    "elements": []
};


function loadPage() {
    let preview = document.getElementById('pageload');

    if (preview) {
        preview.innerHTML = '';

        for (let i = 0; i < page.elements.length; i++) {
            let elementInfo = page.elements[i];
            let newElement = document.createElement(elementInfo.elementType);
            newElement.GENERATED = true;
            newElement.pageID = i;

            // Set properties
            for (let property in elementInfo.properties) {
                newElement[property] = elementInfo.properties[property];
            }

            preview.appendChild(newElement);
        }
    }
}

function newElement(type, properties) {
    let newElement = {
        "elementType": type || 'div',
        "properties": properties || {},
    };

    page.elements.push(newElement);

    window.ElementSelected = newElement
    updatePropertiesPanel(newElement)
    loadPage();
}

function getNextElementID() {
    return page.elements.length + 1;
}

function deleteElement(elementSelect) {
    let element = elementSelect || window.ElementSelected;
    let elements = page.elements;
    let index = elements.indexOf(element);

    if (index !== -1) {
        elements.splice(index, 1);
        window.ElementSelected = null;
        loadPage();
        updatePropertiesPanel(null);

    }
}

function saveProperties() {
    let element = window.ElementSelected;
    if (!element) return; // Add error handling for undefined elements

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

function getDropdownElement() {
    let dropdown = document.getElementById('elementlist')
    if (dropdown.value === 'null') {
        return 'div'
    } else {
        return dropdown.value
    }
}

function updatePropertiesPanel(elementselect) {
    let element = elementselect || window.ElementSelected || null
    let panel = document.getElementById('propertieswindow');
    if (panel) {

        panel.innerHTML = ''

        if (element) {

            panel.innerHTML = `
        <h1>${element.properties.name || element.elementType}</h1>
        `;

            let thisElementPropertiesInfo = elementPropertiesInfo[element.elementType];

            thisElementPropertiesInfo.forEach(property => {
                if (property.type === 'script') {
                    panel.innerHTML += `
            <p>${property.label}</p>
            <textarea id="${property.id}">${element.properties[property.property] || ''}</textarea>
            <div></div>
            `;
                } else {
                    if (property.type === 'heading') {
                        panel.innerHTML += `
                    <hr>
            <h3>${property.label}</h3>
            
            `;

                    } else {

                        panel.innerHTML += `
            <label for="${property.id}">${property.label}</label>
            <input type="${property.type}" id="${property.id}" value="${element.properties[property.property] || ''}">
            <div></div>
            `;

                    }

                }

            });

            window.ElementSelected = element
            panel.innerHTML += `
        <div></div>
        <hr>
        <button onclick="saveProperties()">Save</button>
        <button style="background-color: rgb(215, 3, 3);" onclick="deleteElement()">Delete</button>
        `;
        }

    }

}

document.addEventListener('click', function (event) {
    let element = event.target;

    if (element.GENERATED) {
        updatePropertiesPanel(page.elements[element.pageID]);
    }
});

document.addEventListener('keydown', function (event) {
    // Check if the pressed keys are Ctrl (or Command on Mac) and 'S'
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        // Prevent the default browser behavior
        event.preventDefault();

        // Perform your save action or show a message
        saveProperties()
    }
});

loadPage()