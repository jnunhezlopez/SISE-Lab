class Step extends Node {

    constructor(name, initial = false) {

        super(name);

        this.initial = initial;

        this.marked = initial;

    }

}