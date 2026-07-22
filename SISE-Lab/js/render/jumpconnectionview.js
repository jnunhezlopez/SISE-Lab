/**
 * JumpConnectionView
 * ------------------
 * Representa un salto GRAFCET.
 */

class JumpConnectionView {

    constructor(svg, sourceView, targetView, targetModel) {

        this.svg = svg;

        this.sourceView = sourceView;
        this.targetView = targetView;

        this.targetModel = targetModel;

        const NS = "http://www.w3.org/2000/svg";

        this.group = document.createElementNS(NS, "g");

        this.line = document.createElementNS(NS, "line");
        this.arrow = document.createElementNS(NS, "polygon");
        this.text = document.createElementNS(NS, "text");

        this.line.setAttribute("stroke", "#222");
        this.line.setAttribute("stroke-width", "2");

        this.arrow.setAttribute("fill", "#222");

        this.text.setAttribute("font-size", "12");
        this.text.setAttribute("dominant-baseline", "middle");

        this.group.appendChild(this.line);
        this.group.appendChild(this.arrow);
        this.group.appendChild(this.text);

        this.svg.appendChild(this.group);

        this.update();

    }

    update() {

        const x1 = this.sourceView.x;
        const y1 = this.sourceView.y + this.sourceView.height;

        const x2 = x1 + 40;

        this.line.setAttribute("x1", x1);
        this.line.setAttribute("y1", y1);

        this.line.setAttribute("x2", x2);
        this.line.setAttribute("y2", y1);

        this.arrow.setAttribute(

            "points",

            `${x2},${y1}
             ${x2-8},${y1-4}
             ${x2-8},${y1+4}`

        );

        this.text.setAttribute("x", x2 + 8);
        this.text.setAttribute("y", y1);

        this.text.textContent = this.targetModel.name;

    }

}