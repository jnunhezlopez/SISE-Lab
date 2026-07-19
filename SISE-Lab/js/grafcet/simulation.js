/**
 * Coordina el funcionamiento del simulador.
 */
class Simulation {

    constructor(engine, renderer) {

        this.engine = engine;
        this.renderer = renderer;

    }

    start() {

        this.renderer.transitionViews.forEach(view => {

            view.onClick(() => {

                console.log(
                    `Disparo ${view.transition.receptivity}`
                );

                if (this.engine.fire(view.transition)) {

                    this.renderer.refresh();

                }

            });

        });

    }

}