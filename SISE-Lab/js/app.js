
const svgCanvas=new SVGCanvas("canvas");
let diagram = new Diagram();

const s0 = diagram.addStep("S0", true);
const s1 = diagram.addStep("S1");
s1.setAction("Motor ON");
const s2 = diagram.addStep("S2");
const s3 = diagram.addStep("S3");
const s4 = diagram.addStep("S4");
const s5 = diagram.addStep("S5");

const t1 = diagram.addTransition("Marcha");
const t2 = diagram.addTransition("Rama1");
const t3 = diagram.addTransition("Rama2");
const t4 = diagram.addTransition("Convergencia");
const t5 = diagram.addTransition("Fin");

diagram.connect(s0, t1);
diagram.connect(s1, t2);
diagram.connect(s2, t3);
diagram.connect(s3, t4);
diagram.connect(s4, t4);
diagram.connect(s5, t5);


diagram.connect(t1, s1);
diagram.connect(t1, s2);
diagram.connect(t2, s3);
diagram.connect(t3, s4);
diagram.connect(t4, s5);
diagram.connect(t5, s0);


let engine = new Engine(diagram);

let renderer = new Renderer(svgCanvas, diagram, engine);

renderer.render();
let  simulation = new Simulation(diagram, engine, renderer);
renderer.simulation = simulation;
simulation.start();

//----------------------------------------------------------
// Guardar
//----------------------------------------------------------

window.saveGrafcet = function () {

    FileManager.save(

        diagram,

        renderer

    );

};

//----------------------------------------------------------
// Abrir
//----------------------------------------------------------

window.loadGrafcet = function () {

    FileManager.load(result => {

        //--------------------------------------------------
        // Reconstruir modelo
        //--------------------------------------------------

        diagram = result.diagram;

        //--------------------------------------------------
        // Nuevo motor
        //--------------------------------------------------

        engine = new Engine(diagram);

        //--------------------------------------------------
        // Nuevo renderer
        //--------------------------------------------------

        renderer = new Renderer(

            svgCanvas,

            diagram,

            engine

        );

        renderer.render();

        //--------------------------------------------------
        // Restaurar posiciones
        //--------------------------------------------------

        renderer.stepViews.forEach(view => {

            const p = result.positions[view.step.name];

            if (p) {

                view.x = p.x;
                view.y = p.y;
                view.updateGraphics();

            }

        });

        renderer.transitionViews.forEach(view => {

            const p =
                result.positions[
                    view.transition.receptivity
                ];

            if (p) {

                view.x = p.x;
                view.y = p.y;
                view.updateGraphics();

            }

        });

        renderer.refreshConnections();

        //--------------------------------------------------
        // Reiniciar simulación
        //--------------------------------------------------

        simulation = new Simulation(

            diagram,

            engine,

            renderer

        );

        simulation.start();

    });

};
document
    .getElementById("btnSave")
    .addEventListener("click", saveGrafcet);

document
    .getElementById("btnLoad")
    .addEventListener("click", loadGrafcet);
/* console.log("Marcado inicial");

console.table(diagram.markingVector());

engine.fire(t1);

renderer.refresh();

console.log("Marcado final");

console.table(diagram.markingVector()); */

//const u = engine.buildFireVector(t1);
//const next = engine.nextMarking(u);


//console.log("Vector de marcado");
//console.table(diagram.markingVector()); 
/* const canvas=new SVGCanvas("canvas");

const s0=new Step("S0", 100, 80);
s0.draw(canvas.svg);
s0.marked = true; */
/* const canvas=document.getElementById("canvas");

const s0=new Step("S0");
const t1=new Transition("Marcha");
const s1=new Step("S1");
const t2=new Transition("Paro");

s0.draw(canvas);
t1.draw(canvas);
s1.draw(canvas);
t2.draw(canvas);
s0.activate();

document.getElementById("btnOn").onclick=()=>{
    s0.activate();
    s1.deactivate();
};
document.getElementById("btnOff").onclick=()=>{
    s0.deactivate();
    s1.activate();
}; */
/* const escenario=document.getElementById("escenario");

const s0=new Etapa("S0");

const s1=new Etapa("S1");

s0.dibujar(escenario);

s1.dibujar(escenario);

s0.activar();

setTimeout(()=>{

    s0.desactivar();

    s1.activar();

},2000); */