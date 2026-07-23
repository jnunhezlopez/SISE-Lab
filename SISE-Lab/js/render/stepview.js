/**
 * StepView
 * --------
 * Representa gráficamente una etapa GRAFCET.
 */

class StepView {

    static GRID_SIZE = 20;

    constructor(step, x, y) {

        this.step = step;

        this.x = x;
        this.y = y;

        this.width = 45;
        this.height = 45;

        this.dragging = false;
        // Función de aviso cuando cambia de posición
        this.onMove = null;
        this.hasMoved = false;
        this.startMouseX = 0;
        this.startMouseY = 0;
        
    }

    draw(svg) {

        const NS = "http://www.w3.org/2000/svg";

        this.group = document.createElementNS(NS, "g");

        this.rect = document.createElementNS(NS, "rect");

        this.rect.setAttribute("width", this.width);
        this.rect.setAttribute("height", this.height);
        this.rect.setAttribute("rx", 4);

        this.rect.setAttribute("fill", "white");
        this.rect.setAttribute("stroke", "#222");
        this.rect.setAttribute("stroke-width", "2");

        this.rect.style.cursor = "grab";

        this.mark = document.createElementNS(NS, "circle");
        this.mark.setAttribute("r", 5);
        this.mark.setAttribute("fill", "#222222");

        this.text = document.createElementNS(NS, "text");
        this.text.setAttribute("text-anchor", "middle");
        this.text.setAttribute("font-family", "Segoe UI");
        this.text.setAttribute("font-size", "22");
        this.text.textContent = this.step.name;
        this.text.style.cursor = "grab";

        this.actionLine = document.createElementNS(NS, "line");
        this.actionLine.setAttribute("stroke", "#222");
        this.actionLine.setAttribute("stroke-width", "2");

        this.actionRect = document.createElementNS(NS, "rect");
        this.actionRect.setAttribute("fill", "white");
        this.actionRect.setAttribute("stroke", "#222");
        this.actionRect.setAttribute("stroke-width", "2");

        this.actionText = document.createElementNS(NS, "text");
        this.actionText.setAttribute("font-family", "Segoe UI");
        this.actionText.setAttribute("font-size", "18");
        this.actionText.setAttribute("dominant-baseline", "middle");

        this.group.appendChild(this.rect);
        this.group.appendChild(this.mark);
        this.group.appendChild(this.text);
        this.group.appendChild(this.actionLine);
        this.group.appendChild(this.actionRect);
        this.group.appendChild(this.actionText);

        this.updateGraphics();

        this.installDrag(svg);

        this.refresh();

        svg.appendChild(this.group);

    }

    installDrag(svg) {

        this.group.addEventListener("mousedown", event => {

            this.dragging = true;
            this.hasMoved = false;
            this.startMouseX = event.offsetX;
            this.startMouseY = event.offsetY;

            this.offsetX = event.offsetX - this.x;
            this.offsetY = event.offsetY - this.y;

            this.rect.style.cursor = "grabbing";
            this.text.style.cursor = "grabbing";

        });

        svg.addEventListener("mousemove", event => {

            if (!this.dragging) {

                return;

            }

            this.x = event.offsetX - this.offsetX;
            this.y = event.offsetY - this.offsetY;

            const dx = event.offsetX - this.startMouseX;
            const dy = event.offsetY - this.startMouseY;

            if (

                Math.abs(dx) > 3 ||

                Math.abs(dy) > 3

            ) {

                this.hasMoved = true;

            }
            if (!this.hasMoved) {

                return;

            }
            this.updateGraphics();

            if (this.onMove) {

                this.onMove(this);

            }

        });

        window.addEventListener("mouseup", () => {

            if (!this.dragging) {

                return;

            }

            this.dragging = false;
            if (!this.hasMoved) {

                this.rect.style.cursor = "grab";
                this.text.style.cursor = "grab";

                return;

            }
            // Ajustar el CENTRO de la etapa a la cuadrícula

            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            const snappedCenterX =
                Math.round(centerX / StepView.GRID_SIZE)
                * StepView.GRID_SIZE;

            const snappedCenterY =
                Math.round(centerY / StepView.GRID_SIZE)
                * StepView.GRID_SIZE;

            this.x = snappedCenterX - this.width / 2;
            this.y = snappedCenterY - this.height / 2;

            this.updateGraphics();
            if (this.onMove) {

                this.onMove(this);

            }
            this.rect.style.cursor = "grab";
            this.text.style.cursor = "grab";

        });

    }

    updateGraphics() {
/*         console.log(
            this.step.name,
            this.x,
            this.y
        ); */
        this.rect.setAttribute("x", this.x);
        this.rect.setAttribute("y", this.y);

        this.mark.setAttribute(
            "cx",
            this.x + this.width - 12
        );

        this.mark.setAttribute(
            "cy",
            this.y + this.height - 12
        );

        this.text.setAttribute(
            "x",
            this.x + this.width / 2
        );

        this.text.setAttribute(
            "y",
            this.y + this.height / 2 + 6
        );
        if (this.step.action === "") {

            this.actionLine.setAttribute("visibility", "hidden");
            this.actionRect.setAttribute("visibility", "hidden");
            this.actionText.setAttribute("visibility", "hidden");

        }
        else {

            this.actionLine.setAttribute("visibility", "visible");
            this.actionRect.setAttribute("visibility", "visible");
            this.actionText.setAttribute("visibility", "visible");

            const x = this.x + this.width;
            const y = this.y + this.height / 2;

            this.actionLine.setAttribute("x1", x);
            this.actionLine.setAttribute("y1", y);
            this.actionLine.setAttribute("x2", x + 12);
            this.actionLine.setAttribute("y2", y);

            this.actionText.setAttribute("x", x + 20);
            this.actionText.setAttribute("y", this.y + this.height / 2);
            this.actionText.textContent = this.step.action;

            const width = 12 * this.step.action.length + 20;
            this.actionRect.setAttribute("x", x + 12);
            this.actionRect.setAttribute("y", this.y);
            this.actionRect.setAttribute(
                "width",
                width
            );
            this.actionRect.setAttribute("height", this.height);

        }
    }

    refresh() {

        if (!this.mark) {

            return;

        }

        this.mark.setAttribute(

            "visibility",

            this.step.marked ? "visible" : "hidden"

        );

    }

}