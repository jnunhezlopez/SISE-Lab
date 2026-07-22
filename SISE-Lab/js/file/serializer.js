class Serializer {

    //----------------------------------------------------------
    // Exportar GRAFCET
    //----------------------------------------------------------

    static serialize(diagram, renderer) {

        const data = {

            steps: [],
            transitions: [],
            arcs: [],
            positions: {}

        };

        //------------------------------------------------------
        // Etapas
        //------------------------------------------------------

        diagram.steps.forEach(step => {

            data.steps.push({

                name: step.name,
                initial: step.initial

            });

        });

        //------------------------------------------------------
        // Transiciones
        //------------------------------------------------------

        diagram.transitions.forEach(transition => {

            data.transitions.push({

                receptivity: transition.receptivity

            });

        });

        //------------------------------------------------------
        // Arcos
        //------------------------------------------------------

        diagram.arcs.forEach(arc => {

            const source =
                arc.source instanceof Step
                    ? arc.source.name
                    : arc.source.receptivity;

            const target =
                arc.target instanceof Step
                    ? arc.target.name
                    : arc.target.receptivity;

            data.arcs.push({

                source,
                target

            });

        });

        //------------------------------------------------------
        // Posiciones de las etapas
        //------------------------------------------------------

        renderer.stepViews.forEach(view => {

            data.positions[view.step.name] = {

                x: view.x,
                y: view.y

            };

        });

        //------------------------------------------------------
        // Posiciones de las transiciones
        //------------------------------------------------------

        renderer.transitionViews.forEach(view => {

            data.positions[view.transition.receptivity] = {

                x: view.x,
                y: view.y

            };

        });

        return data;

    }

    //----------------------------------------------------------
    // Importar GRAFCET
    //----------------------------------------------------------

    static deserialize(data) {

        const diagram = new Diagram();

        const nodeMap = new Map();

        //------------------------------------------------------
        // Etapas
        //------------------------------------------------------

        data.steps.forEach(step => {

            const s = diagram.addStep(

                step.name,

                step.initial

            );

            nodeMap.set(step.name, s);

        });

        //------------------------------------------------------
        // Transiciones
        //------------------------------------------------------

        data.transitions.forEach(transition => {

            const t = diagram.addTransition(

                transition.receptivity

            );

            nodeMap.set(

                transition.receptivity,

                t

            );

        });

        //------------------------------------------------------
        // Arcos
        //------------------------------------------------------

        data.arcs.forEach(arc => {

            diagram.connect(

                nodeMap.get(arc.source),

                nodeMap.get(arc.target)

            );

        });

        return {

            diagram,

            positions: data.positions

        };

    }

}