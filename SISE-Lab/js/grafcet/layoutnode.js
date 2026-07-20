/**
 * Nodo del árbol de Layout.
 */
class LayoutNode {

    constructor(modelNode) {

        this.modelNode = modelNode;

        this.parent = null;

        this.children = [];

    }

    addChild(child) {

        child.parent = this;

        this.children.push(child);

    }

}