'use strict';

export class SectionBase {

    constructor() {
        this.type = 0;
    }

    setType( type ) { this.type = type; }
    getType() { return this.type; }

    getMesh() { return this.mesh; }

    show() { this.mesh.visible = true; }
    hide() { this.mesh.visible = false; }

    isVisible() { return this.mesh.visible; }

}