/**
 * SVGCanvas
 * ----------
 * Crea el lienzo SVG donde se dibujará el GRAFCET.
 */

class SVGCanvas {

    constructor(containerId, width = 800, height = 800) {

        this.svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);
        this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        this.svg.style.border = "1px solid #CCCCCC";
        this.svg.style.background = "white";

        document
            .getElementById(containerId)
            .appendChild(this.svg);
        this.gridSpacing = 20;
    }
    drawGrid() {

        const NS = "http://www.w3.org/2000/svg";

        const width = this.svg.clientWidth;
        const height = this.svg.clientHeight;

        for (let x = 0; x <= width; x += this.gridSpacing) {

            const line = document.createElementNS(NS, "line");

            line.setAttribute("x1", x);
            line.setAttribute("y1", 0);
            line.setAttribute("x2", x);
            line.setAttribute("y2", height);

            line.setAttribute("stroke", "#e5e5e5");
            line.setAttribute("stroke-width", "1");

            line.setAttribute("pointer-events", "none");

            this.svg.appendChild(line);

        }

        for (let y = 0; y <= height; y += this.gridSpacing) {

            const line = document.createElementNS(NS, "line");

            line.setAttribute("x1", 0);
            line.setAttribute("y1", y);
            line.setAttribute("x2", width);
            line.setAttribute("y2", y);

            line.setAttribute("stroke", "#e5e5e5");
            line.setAttribute("stroke-width", "1");

            line.setAttribute("pointer-events", "none");

            this.svg.appendChild(line);

        }

    }
    clear() {

        this.svg.replaceChildren();

        this.drawGrid();

    }    
}