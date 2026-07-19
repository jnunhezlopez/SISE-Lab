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
        this.height = 60;
        this.enabled = false;
    }

    draw(svg) {

        const NS = "http://www.w3.org/2000/svg";

        this.group = document.createElementNS(NS, "g");

        this.topLine = document.createElementNS(NS, "line");

        this.topLine.setAttribute("x1", this.x);
        this.topLine.setAttribute("y1", this.y);

        this.topLine.setAttribute("x2", this.x);
        this.topLine.setAttribute("y2", this.y + 24);

        this.topLine.setAttribute("stroke", "#222");
        this.topLine.setAttribute("stroke-width", "2");

        this.bar = document.createElementNS(NS, "line");

        this.bar.setAttribute("x1", this.x - 18);
        this.bar.setAttribute("y1", this.y + 30);

        this.bar.setAttribute("x2", this.x + 18);
        this.bar.setAttribute("y2", this.y + 30);

        this.bar.setAttribute("stroke", "#222");
        this.bar.setAttribute("stroke-width", "4");

        this.bottomLine = document.createElementNS(NS, "line");

        this.bottomLine.setAttribute("x1", this.x);
        this.bottomLine.setAttribute("y1", this.y + 36);

        this.bottomLine.setAttribute("x2", this.x);
        this.bottomLine.setAttribute("y2", this.y + 60);

        this.bottomLine.setAttribute("stroke", "#222");
        this.bottomLine.setAttribute("stroke-width", "2");        
        // Añadido texto de la transición
        this.text = document.createElementNS(NS, "text");
        this.text.setAttribute("x", this.x);
        this.text.setAttribute("y", this.y + 15);
        this.text.setAttribute("text-anchor", "middle");
        this.text.setAttribute("font-family", "Segoe UI");
        this.text.setAttribute("font-size", "14");
        this.text.textContent = this.transition.receptivity 

        this.group.appendChild(this.text);
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
    /**
     * Muestra una animación breve de disparo.
     */
    flash() {

        if (!this.bar) return;

        this.bar.setAttribute("stroke", "#FF8800");

    }
    /**
     * Finaliza la animación y recupera el color normal.
     */
    unflash() {

        this.refresh();

    }
    onClick(callback) {

        this.group.style.cursor = "pointer";

        this.group.addEventListener("click", callback);

    }
}