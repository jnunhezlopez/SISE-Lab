/**
 * ConnectionView
 * --------------
 * Dibuja un conector ortogonal entre una etapa y una transición.
 */

class ConnectionView {

    constructor(svg, sourceView, targetView, sourceModel, targetModel) {

        this.svg = svg;

        this.sourceView = sourceView;
        this.targetView = targetView;

        this.sourceModel = sourceModel;
        this.targetModel = targetModel;

        const NS = "http://www.w3.org/2000/svg";

        this.path = document.createElementNS(NS, "path");

        this.path.setAttribute("fill", "none");
        this.path.setAttribute("stroke", "#222");
        this.path.setAttribute("stroke-width", "2");
        this.path.setAttribute("stroke-linejoin", "round");

        this.svg.appendChild(this.path);

        this.update();

    }

    //----------------------------------------------------------
    // Redibuja el conector
    //----------------------------------------------------------

    update() {

        const start = this.startPoint();
        const end = this.endPoint();

        const ym = (start.y + end.y) / 2;

        const d = [

            `M ${start.x} ${start.y}`,

            `L ${start.x} ${ym}`,

            `L ${end.x} ${ym}`,

            `L ${end.x} ${end.y}`

        ].join(" ");

        this.path.setAttribute("d", d);

    }

    //----------------------------------------------------------
    // Punto inicial
    //----------------------------------------------------------

    startPoint() {

        if (this.sourceModel instanceof Step) {

            return {

                x:
                    this.sourceView.x +
                    this.sourceView.width / 2,

                y:
                    this.sourceView.y +
                    this.sourceView.height

            };

        }

        return {

            x: this.sourceView.x,

            y:
                this.sourceView.y +
                this.sourceView.height

        };

    }

    //----------------------------------------------------------
    // Punto final
    //----------------------------------------------------------

    endPoint() {

        if (this.targetModel instanceof Step) {

            return {

                x:
                    this.targetView.x +
                    this.targetView.width / 2,

                y:
                    this.targetView.y

            };

        }

        return {

            x: this.targetView.x,

            y: this.targetView.y

        };

    }

}