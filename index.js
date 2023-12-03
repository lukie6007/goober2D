const cssDropdown = `
  <select id="cssProperties" onchange="applyProperty()">
    <option selected disabled value="">Select a property</option>

    <optgroup label="Text Properties">
      <option value="color">Color</option>
      <option value="font-size">Font Size</option>
      <option value="font-family">Font Family</option>
      <option value="text-align">Text Align</option>
      <option value="text-decoration">Text Decoration</option>
      <option value="line-height">Line Height</option>
    </optgroup>

    <optgroup label="Box Model Properties">
      <option value="margin">Margin</option>
      <option value="padding">Padding</option>
      <option value="border">Border</option>
      <option value="width">Width</option>
      <option value="height">Height</option>
      <option value="display">Display</option>
      <option value="position">Position</option>
      <option value="top">Top</option>
      <option value="right">Right</option>
      <option value="bottom">Bottom</option>
      <option value="left">Left</option>
      <option value="float">Float</option>
      <option value="clear">Clear</option>
    </optgroup>

    <optgroup label="Background Properties">
      <option value="background-color">Background Color</option>
      <option value="background-image">Background Image</option>
      <option value="background-size">Background Size</option>
      <option value="background-position">Background Position</option>
    </optgroup>

    <optgroup label="Flexbox Properties">
      <option value="flex">Flex</option>
      <option value="flex-direction">Flex Direction</option>
      <option value="justify-content">Justify Content</option>
      <option value="align-items">Align Items</option>
    </optgroup>
  </select>`;

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
        { "label": "Style", "property": "style", "type": "script", "id": "inputStyle" },
        { "label": "Placeholder", "property": "placeholder", "type": "text", "id": "inputPlaceholder" }
    ],
    "textarea": [
        "BASIC",
        { "label": "Visual Properties", "type": "heading" },
        { "label": "Style", "property": "style", "type": "script", "id": "inputStyle" },
        { "label": "Placeholder", "property": "innerHTML", "type": "text", "id": "inputPlaceholder" }]
};

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
    { "label": "Name", "property": "name", "type": "text", "id": "divName" },
    { "label": "Class", "property": "className", "type": "text", "id": "divClass" },
    { "label": "ID", "property": "id", "type": "text", "id": "divId" }
];

let visualProperties = [
    { "label": "Visual Properties", "type": "heading" },
    { "label": "Text", "property": "innerHTML", "type": "text", "id": "defaultText" },
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

    if (index !== -1) {
        elements.splice(index, 1);
        window.ElementSelected = null;
        loadPage();
        updatePropertiesPanel(null);
    }
}

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
        inputElement = `<textarea id="${property.id}">${element.properties[property.property] || ''}</textarea>`;
    } else if (property.type === 'heading') {
        inputElement = `<hr><h3>${property.label}</h3>`;
    } else {
        inputElement = `<label for="${property.id}">${property.label}</label>
                      <input type="${property.type}" id="${property.id}" value="${element.properties[property.property] || ''}">`;
    }

    return `${inputElement}<div></div>`;
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
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveProperties();
    }
});

loadPage();
