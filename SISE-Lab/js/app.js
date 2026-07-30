
const svgCanvas = new SVGCanvas("canvas");
let diagram = new Diagram();

let engine = new Engine(diagram);
let renderer = new Renderer(svgCanvas, diagram, engine);
let simulation = new Simulation(diagram, engine, renderer);
renderer.simulation = simulation;

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
    FileManager.save(diagram, renderer);
};

window.loadGrafcet = function () {
    renderer.setEditMode(true);
    document.getElementById("modeIndicator").textContent = "⚪ EDICIÓN";

    FileManager.load(result => {
        diagram = result.diagram;
        engine = new Engine(diagram);
        renderer.setDiagram(diagram, engine, result.positions);
        simulation = new Simulation(diagram, engine, renderer);
        renderer.simulation = simulation;
        renderer.render();
    });
};

document
    .getElementById("btnSave")
    .addEventListener("click", saveGrafcet);

document
    .getElementById("btnLoad")
    .addEventListener("click", loadGrafcet);
