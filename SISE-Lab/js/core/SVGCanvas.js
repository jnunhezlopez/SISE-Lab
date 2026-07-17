/**
 * SVGCanvas
 * ----------
 * Crea el lienzo SVG donde se dibujará el GRAFCET.
 */

class SVGCanvas {

    constructor(containerId, width = 800, height = 600) {

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

    }

}