const styleMenu = `
<button id="styleAdd" onclick="addStyleProperty('none')">Add Property</button> <select id="cssProperties">
    <option disabled selected value="">Select a property</option>

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

    <!-- Add more groups and options as needed -->
</select>
`

const panelHtml = {
    "preview": `<div id="pageload"></div>`,
    "properties": `
    <h3>Properties Panel</h3>
    <div id="propertieswindow"></div>
    `,

    "style-editor": `
    <h3>Style Editor</h3>
    <div id="style-window"></div>
    <div id="style-actions">${styleMenu}</div>
    
    
    `,

    "error": `<h1>Oh no!</h1> 
    <p>Something happened, this window doesn't exist!</p>`
}

function closePanel(button) {
    const panel = button.parentNode;
    panel.parentNode.removeChild(panel);
}

function createPanel(id) {
    let panel = document.createElement('div')
    panel.id = id
    panel.className = 'panel'
    panel.style.width = '100%'
    panel.innerHTML = `
            <button class="close-button" onclick="closePanel(this)">
                <img src="./assets/xbutton.png" alt="Close Panel">
                
            </button>
            ${panelHtml[id]}
    `
    return panel
}

function openPanel(type) {

    let existing = document.getElementById(type)
    let panel = null
    let main = null
    if (!(existing)) {

        if (panelHtml[type]) {

            panel = createPanel(type)

        } else {
            panel = createPanel('error')
        }

        main = document.getElementById('main')
        main.appendChild(panel)

        loadPage()
        updatePropertiesPanel()
    }
}

function defaultUI() {
    openPanel('preview')
    openPanel('properties')
}

defaultUI()