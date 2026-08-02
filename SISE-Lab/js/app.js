
const svgCanvas = new SVGCanvas("canvas");
let diagram = new Diagram();

let engine = new Engine(diagram);
let renderer = new Renderer(svgCanvas, diagram, engine);
let simulation = new Simulation(diagram, engine, renderer);
renderer.simulation = simulation;

let currentFilename = null;

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

window.saveGrafcet = function () {
    const name = prompt(
        "Nombre del archivo:",
        currentFilename || "grafcet.json"
    );
    if (!name) return;
    currentFilename = name;
    FileManager.save(diagram, renderer, currentFilename);
    updateFileIndicator();
};

window.loadGrafcet = function () {
    renderer.setEditMode(true);
    document.getElementById("modeIndicator").textContent = "⚪ EDICIÓN";

    FileManager.load((result, filename) => {
        currentFilename = filename;
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
    .getElementById("btnLoad")
    .addEventListener("click", loadGrafcet);
