class Etapa{

    constructor(nombre){

        this.nombre=nombre;

        this.elemento=document.createElement("div");

        this.elemento.className="etapa";

        this.elemento.textContent=nombre;

    }

    activar(){

        this.elemento.classList.add("activa");

    }

    desactivar(){

        this.elemento.classList.remove("activa");

    }

    dibujar(contenedor){

        contenedor.appendChild(this.elemento);

    }

}