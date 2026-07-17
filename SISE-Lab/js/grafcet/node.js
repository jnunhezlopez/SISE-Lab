/**
 * Clase base para todos los nodos del GRAFCET.
 */
class Node {

    static nextId = 1;

    constructor(name = "") {

        this.id = Node.nextId++;
        this.name = name;

    }

}