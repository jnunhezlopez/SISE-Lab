/**
 * ConnectionView
 * --------------
 * Representa gráficamente un arco del GRAFCET.
 */

class ConnectionView {

    constructor(svg, x1, y1, x2, y2) {

        this.svg = svg;

        const NS = "http://www.w3.org/2000/svg";

        this.line1 = document.createElementNS(NS, "line");
        this.line2 = document.createElementNS(NS, "line");
        this.line3 = document.createElementNS(NS, "line");

        [this.line1, this.line2, this.line3].forEach(line => {

            line.setAttribute("stroke", "#222");
            line.setAttribute("stroke-width", "2");

            this.svg.appendChild(line);

        });

        this.update(x1, y1, x2, y2);

    }

    update(x1, y1, x2, y2) {

        // Punto donde gira el conector
        const ym = (y1 + y2) / 2;

        // Tramo vertical superior

        this.line1.setAttribute("x1", x1);
        this.line1.setAttribute("y1", y1);

        this.line1.setAttribute("x2", x1);
        this.line1.setAttribute("y2", ym);

        // Tramo horizontal

        this.line2.setAttribute("x1", x1);
        this.line2.setAttribute("y1", ym);

        this.line2.setAttribute("x2", x2);
        this.line2.setAttribute("y2", ym);

        // Tramo vertical inferior

        this.line3.setAttribute("x1", x2);
        this.line3.setAttribute("y1", ym);

        this.line3.setAttribute("x2", x2);
        this.line3.setAttribute("y2", y2);

    }

}