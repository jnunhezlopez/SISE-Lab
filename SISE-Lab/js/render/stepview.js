/**
 * Step
 * ----
 * Representa una etapa GRAFCET.
 */

class StepView {

    constructor(step, x, y) {

        this.step = step;
        this.x = x;
        this.y = y;

        this.width = 120;
        this.height = 60;

    }

    draw(svg) {

        const NS = "http://www.w3.org/2000/svg";

        this.group = document.createElementNS(NS, "g");

        this.rect = document.createElementNS(NS, "rect");

        this.rect.setAttribute("x", this.x);
        this.rect.setAttribute("y", this.y);
        this.rect.setAttribute("width", this.width);
        this.rect.setAttribute("height", this.height);

        this.rect.setAttribute("rx", 4);

        this.rect.setAttribute("fill", "white");
        this.rect.setAttribute("stroke", "#222");
        this.rect.setAttribute("stroke-width", "2");

        this.mark = document.createElementNS(NS, "circle");
        this.mark.setAttribute("cx", this.x + this.width - 12);
        this.mark.setAttribute("cy", this.y + this.height -12);
        this.mark.setAttribute("r", 5);
        this.mark.setAttribute("fill", "#222222");
        this.mark.setAttribute("visibility", "hidden");

        this.text = document.createElementNS(NS, "text");

        this.text.setAttribute("x", this.x + this.width / 2);
        this.text.setAttribute("y", this.y + this.height / 2 + 6);

        this.text.setAttribute("text-anchor", "middle");

        this.text.setAttribute("font-family", "Segoe UI");

        this.text.setAttribute("font-size", "22");

        this.text.textContent = this.step.name;

        this.group.appendChild(this.rect);
        this.group.appendChild(this.mark);
        this.group.appendChild(this.text);
        
        this.refresh();

        svg.appendChild(this.group);

    }
    refresh() {

        if (!this.mark) return;

        this.mark.setAttribute(
            "visibility",
            this.step.marked ? "visible" : "hidden"
        );

    }
}