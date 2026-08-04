
const svgCanvas = new SVGCanvas("canvas");
let diagram = new Diagram();

let engine = new Engine(diagram);
let renderer = new Renderer(svgCanvas, diagram, engine);
let simulation = new Simulation(diagram, engine, renderer);
renderer.simulation = simulation;

let currentFilename = null;
let currentFileHandle = null;

function updateFileIndicator() {
    const el = document.getElementById("fileIndicator");
    if (currentFilename) {
        el.textContent = "📄 " + currentFilename;
    } else {
        el.textContent = "";
    }
}

renderer.render();

document
    .getElementById("btnEdit")
    .addEventListener("click", () => {
        renderer.setEditMode(true);
        document.getElementById("modeIndicator")
            .textContent = "⚪ EDICIÓN";
    });

document
    .getElementById("btnRun")
    .addEventListener("click", () => {
        renderer.setEditMode(false);
        document.getElementById("modeIndicator")
            .textContent = "🟢 SIMULACIÓN";
    });

window.saveGrafcet = async function () {

    //------------------------------------------------------
    // Archivo abierto con permisos: sobrescribirlo directamente
    //------------------------------------------------------

    if (currentFileHandle) {

        await FileManager.save(
            diagram,
            renderer,
            currentFilename,
            currentFileHandle
        );
        updateFileIndicator();
        return;

    }

    //------------------------------------------------------
    // Sin handle: se comporta como "guardar como"
    //------------------------------------------------------

    await saveGrafcetAs();
};

window.saveGrafcetAs = async function () {

    //------------------------------------------------------
    // El selector pide nombre/ubicación y devuelve un handle
    // para sobrescribir en los siguientes guardados
    //------------------------------------------------------

    if (window.showSaveFilePicker) {

        const handle = await FileManager.save(
            diagram,
            renderer,
            currentFilename || "grafcet.json"
        );

        if (handle) {

            currentFileHandle = handle;
            currentFilename = handle.name;
            updateFileIndicator();

        }

        return;

    }

    //------------------------------------------------------
    // Navegador sin File System Access API: pedir nombre
    // y descargar una copia
    //------------------------------------------------------

    const name = prompt(
        "Nombre del archivo:",
        currentFilename || "grafcet.json"
    );
    if (!name) return;
    currentFilename = name;
    await FileManager.save(diagram, renderer, currentFilename);
    updateFileIndicator();
};

window.loadGrafcet = async function () {
    renderer.setEditMode(true);
    document.getElementById("modeIndicator").textContent = "⚪ EDICIÓN";

    FileManager.load((result, filename, fileHandle) => {
        currentFilename = filename;
        currentFileHandle = fileHandle || null;
        diagram = result.diagram;
        engine = new Engine(diagram);
        renderer.setDiagram(diagram, engine, result.positions);
        simulation = new Simulation(diagram, engine, renderer);
        renderer.simulation = simulation;
        renderer.render();
        updateFileIndicator();
    });
};

document
    .getElementById("btnSave")
    .addEventListener("click", saveGrafcet);

document
    .getElementById("btnSaveAs")
    .addEventListener("click", saveGrafcetAs);

document
    .getElementById("btnLoad")
    .addEventListener("click", loadGrafcet);
