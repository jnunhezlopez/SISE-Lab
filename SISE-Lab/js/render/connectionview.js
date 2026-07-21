/**
 * ConnectionView
 * --------------
 * Representa gráficamente un arco del GRAFCET.
 */

class ConnectionView {

    constructor(svg, x1, y1, x2, y2) {

        this.svg = svg;

        const NS = "http://www.w3.org/2000/svg";

        this.line = document.createElementNS(NS, "line");

        this.line.setAttribute("stroke", "#222");
        this.line.setAttribute("stroke-width", "2");

        this.svg.appendChild(this.line);

        this.update(x1, y1, x2, y2);

    }

    update(x1, y1, x2, y2) {

        this.line.setAttribute("x1", x1);
        this.line.setAttribute("y1", y1);

        this.line.setAttribute("x2", x2);
        this.line.setAttribute("y2", y2);

    }

}