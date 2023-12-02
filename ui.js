const panelHtml = {
    "preview": `<div id="pageload"></div>`,

    "properties": `
    <h3>Properties Panel</h3>
    <div id="propertieswindow"></div>
    `,

    "hierarchy": `<h3>Hierarchy</h3>
    <div id="hierarchywindow"></div>`,

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
    panel.style.width = '500px'
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