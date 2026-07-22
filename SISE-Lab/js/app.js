
const svgCanvas=new SVGCanvas("canvas");
const diagram = new Diagram();

const s0 = diagram.addStep("S0", true);
const s1 = diagram.addStep("S1");
const s2 = diagram.addStep("S2");


const t1 = diagram.addTransition("Marcha");
const t2 = diagram.addTransition("Fin");
const t3 = diagram.addTransition("Paro");

diagram.connect(s0, t1);
diagram.connect(s0, t3);

diagram.connect(t1, s1);
diagram.connect(t3, s2);

diagram.connect(s1, t2);

diagram.connect(t2, s0);


//diagram.connect(t2, s3);


const engine = new Engine(diagram);

const renderer = new Renderer(svgCanvas, diagram, engine);

renderer.render();
const simulation = new Simulation(diagram, engine, renderer);
simulation.start();
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