/**
 * Representa una transición GRAFCET.
 */
class TransitionView {

    constructor(receptividad = "") {

        this.receptividad = receptividad;

        this.element = document.createElement("div");
        this.element.className = "transition";

        this.element.innerHTML = `
            <div class="transition-line top"></div>
            <div class="transition-bar"></div>
            <div class="transition-line bottom"></div>
            <div class="transition-label">${receptividad}</div>
        `;
    }

    draw(parent) {
        parent.appendChild(this.element);
    }

}