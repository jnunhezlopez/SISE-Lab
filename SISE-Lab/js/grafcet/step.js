class Step extends Node {

    constructor(name, initial = false) {

        super(name);

        this.initial = initial;
        this.action = "";
        this.marked = initial;

    }
    setAction(action) {

        this.action = action;

    }
}