const panelHtml = {
    "preview": ` `,
    "properties": `
    <h2>Properties</h2>
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
    }
}

function defaultUI() {
    openPanel('preview')
    openPanel('properties')
}

defaultUI()