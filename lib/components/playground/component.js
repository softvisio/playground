import Playground from "./playground.js";

export default Super =>
    class extends Super {

        // protected
        async _install () {
            return new Playground( this.app, this.config );
        }

        async _init () {
            return this.instance.init();
        }

        async _start () {
            return this.instance.start();
        }
    };
