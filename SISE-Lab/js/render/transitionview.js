/**
 * Representa una transición GRAFCET.
 */
class TransitionView {

    constructor(transition, x, y) {

        //this.engine = engine;
        this.transition = transition;

        this.x = x;
        this.y = y;

        this.width = 8;
        this.height = 40;
        this.enabled = false;
    }

    draw(svg) {

        const NS = "http://www.w3.org/2000/svg";

        this.group = document.createElementNS(NS, "g");

        this.topLine = document.createElementNS(NS, "line");

        this.topLine.setAttribute("x1", this.x);
        this.topLine.setAttribute("y1", this.y);

        this.topLine.setAttribute("x2", this.x);
        this.topLine.setAttribute("y2", this.y + 14);

        this.topLine.setAttribute("stroke", "#222");
        this.topLine.setAttribute("stroke-width", "2");

        this.bar = document.createElementNS(NS, "line");

        this.bar.setAttribute("x1", this.x - 18);
        this.bar.setAttribute("y1", this.y + 20);

        this.bar.setAttribute("x2", this.x + 18);
        this.bar.setAttribute("y2", this.y + 20);

        this.bar.setAttribute("stroke", "#222");
        this.bar.setAttribute("stroke-width", "4");

        this.bottomLine = document.createElementNS(NS, "line");

        this.bottomLine.setAttribute("x1", this.x);
        this.bottomLine.setAttribute("y1", this.y + 26);

        this.bottomLine.setAttribute("x2", this.x);
        this.bottomLine.setAttribute("y2", this.y + 40);

        this.bottomLine.setAttribute("stroke", "#222");
        this.bottomLine.setAttribute("stroke-width", "2");        
        
        this.group.appendChild(this.topLine);
        this.group.appendChild(this.bar);
        this.group.appendChild(this.bottomLine);
        
        this.refresh();

        svg.appendChild(this.group);

    }

    refresh() {

        if (!this.bar) return;

        this.bar.setAttribute(
            "stroke",
            this.enabled ? "#008000" : "#222"
        );

    }

    onClick(callback) {

        this.group.style.cursor = "pointer";

        this.group.addEventListener("click", callback);

    }
}