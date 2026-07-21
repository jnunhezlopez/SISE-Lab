/**
 * Representa una transición GRAFCET.
 */
class TransitionView {

    static GRID_SIZE = 70;

    constructor(transition, x, y) {

        this.transition = transition;
        this.hasMoved = false;
        this.x = x;
        this.y = y;

        this.width = 36;
        this.height = 60;

        this.enabled = false;

        this.dragging = false;
        this.hasMoved = false;
        // Función de aviso cuando cambia de posición
        this.onMove = null;        
    }

    draw(svg) {

        const NS = "http://www.w3.org/2000/svg";

        this.group = document.createElementNS(NS, "g");

        this.topLine = document.createElementNS(NS, "line");

        this.topLine.setAttribute("stroke", "#222");
        this.topLine.setAttribute("stroke-width", "2");

        this.bar = document.createElementNS(NS, "line");

        this.bar.setAttribute("stroke", "#222");
        this.bar.setAttribute("stroke-width", "4");

        this.bar.style.cursor = "grab";

        this.bottomLine = document.createElementNS(NS, "line");

        this.bottomLine.setAttribute("stroke", "#222");
        this.bottomLine.setAttribute("stroke-width", "2");

        this.text = document.createElementNS(NS, "text");

        this.text.setAttribute("text-anchor", "middle");
        this.text.setAttribute("font-family", "Segoe UI");
        this.text.setAttribute("font-size", "14");

        this.text.textContent = this.transition.receptivity;

        this.text.style.cursor = "grab";

        this.group.appendChild(this.text);
        this.group.appendChild(this.topLine);
        this.group.appendChild(this.bar);
        this.group.appendChild(this.bottomLine);

        this.updateGraphics();

        this.installDrag(svg);

        this.refresh();

        svg.appendChild(this.group);

    }

    installDrag(svg) {

        this.group.addEventListener("mousedown", event => {

            this.dragging = true;
            this.hasMoved = false;
            this.offsetX = event.offsetX - this.x;
            this.offsetY = event.offsetY - this.y;

            this.bar.style.cursor = "grabbing";
            this.text.style.cursor = "grabbing";

        });

        svg.addEventListener("mousemove", event => {

            if (!this.dragging) {

                return;

            }

            this.x = event.offsetX - this.offsetX;
            this.y = event.offsetY - this.offsetY;

            this.hasMoved = true;
            this.updateGraphics();
            if (this.onMove) {

                this.onMove();

            }
        });

        window.addEventListener("mouseup", () => {

            if (!this.dragging) {

                return;

            }

            this.dragging = false;

            const centerX = this.x;
            const centerY = this.y + this.height / 2;

            const snappedCenterX =
                Math.round(centerX / TransitionView.GRID_SIZE)
                * TransitionView.GRID_SIZE;

            const snappedCenterY =
                Math.round(centerY / TransitionView.GRID_SIZE)
                * TransitionView.GRID_SIZE;

            this.x = snappedCenterX;
            this.y = snappedCenterY - this.height / 2;

            this.updateGraphics();

            if (this.onMove) {

                this.onMove();

            }
            this.bar.style.cursor = "grab";
            this.text.style.cursor = "grab";

        });

    }

    updateGraphics() {

        this.topLine.setAttribute("x1", this.x);
        this.topLine.setAttribute("y1", this.y);

        this.topLine.setAttribute("x2", this.x);
        this.topLine.setAttribute("y2", this.y + 24);

        this.bar.setAttribute("x1", this.x - 18);
        this.bar.setAttribute("y1", this.y + 30);

        this.bar.setAttribute("x2", this.x + 18);
        this.bar.setAttribute("y2", this.y + 30);

        this.bottomLine.setAttribute("x1", this.x);
        this.bottomLine.setAttribute("y1", this.y + 36);

        this.bottomLine.setAttribute("x2", this.x);
        this.bottomLine.setAttribute("y2", this.y + 60);

        this.text.setAttribute("x", this.x);
        this.text.setAttribute("y", this.y + 15);

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

        this.group.addEventListener("click", event => {

            if (this.hasMoved) {

                this.hasMoved = false;

                event.stopPropagation();

                return;

            }

            callback(event);

        });

    }

}