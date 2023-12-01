const elementPropertiesInfo = {
    "div": [
        { "label": "Text", "property": "innerHTML", "type": "text", "id": "divlabel" },
        { "label": "ID", "property": "id", "type": "text", "id": "divId" }
    ]
}

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
    loadPage();
}

function getNextElementID() {
    return page.elements.length + 1;
}

function saveProperties(pageID) {
    let element = page.elements
    let properties = elementPropertiesInfo[element.elementType];

    properties.forEach(property => {
        let inputID = property.id;
        let inputElement = document.getElementById(inputID);

        if (inputElement) {
            element.properties[property.property] = inputElement.value.replace(/"/g, "'");
        }
    });

    loadPage(); // Reload the page after saving properties
}

function updatePropertiesPanel(element) {
    let panel = document.getElementById('propertieswindow');

    if (panel) {
        panel.innerHTML = `
        <h1>${element.properties.name || element.elementType}</h1>
        <h3>ID: ${element.properties.id}</h3>
        `;

        let thisElementPropertiesInfo = elementPropertiesInfo[element.elementType];

        thisElementPropertiesInfo.forEach(property => {
            panel.innerHTML += `
            <label for="${property.id}">${property.label}</label>
            <input type="${property.type}" id="${property.id}" value="${element.properties[property.property] || ''}">
            <div></div>
            `;
        });

        panel.innerHTML += `
        <div></div>
        <button onclick="saveProperties()">Save</button>
        `;
    }
}

document.addEventListener('click', function (event) {
    let element = event.target;

    if (element.GENERATED) {
        updatePropertiesPanel(page.elements[element.pageID]);
    }
});

