const MANUAL_MODE = "manual";
const AUTOMATIC_MODE = "automatic";
/**
 * Coordina el funcionamiento del simulador.
 */
class Simulation {

    constructor(diagram, engine, renderer) {

        this.diagram = diagram;
        this.engine = engine;
        this.renderer = renderer;

        this.mode = MANUAL_MODE; 
    }
    setMode(mode) {

        this.mode = mode;

    }
    isManual() {

        return this.mode === MANUAL_MODE;

    }
    isAutomatic() {

        return this.mode === AUTOMATIC_MODE;    
    }
    start() {

        this.renderer.transitionViews.forEach(view => {

        view.onClick(() => {

            if (this.renderer.editMode) {

                return;

            }

            if (!this.isManual()) {

                return;

            }

            this.fireTransition(view.transition);

        });

        });
        setInterval(() => {

            this.cycle();

        }, 100);
    }
    fireTransition(transition) {

/*         console.log(
            `Disparo ${transition.receptivity}`
        ); */

        if (this.engine.fire(transition)) {

            this.renderer.refresh();

        }

    }
    cycle() {

        if (!this.isAutomatic()) {
            return;
        }

    }
}