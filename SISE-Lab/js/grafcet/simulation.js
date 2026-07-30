const MANUAL_MODE = "manual";
const AUTOMATIC_MODE = "automatic";

class Simulation {

    constructor(diagram, engine, renderer) {

        this.diagram = diagram;
        this.engine = engine;
        this.renderer = renderer;

        this.mode = MANUAL_MODE;
        this._intervalId = null;

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

        this.stop();

        this.renderer.transitionViews.forEach(view => {

            view._simHandler = () => {

                if (this.renderer.editMode) {

                    return;

                }

                if (!this.isManual()) {

                    return;

                }

                this.fireTransition(view.transition);

            };

            view.onClick(view._simHandler);

        });

    }
    stop() {

        if (this._intervalId) {

            clearInterval(this._intervalId);
            this._intervalId = null;

        }

        this.renderer.transitionViews.forEach(view => {

            if (view._simHandler) {

                view.removeClick(view._simHandler);
                view._simHandler = null;

            }

        });

    }
    fireTransition(transition) {

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
