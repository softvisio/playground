import Httpbin from "./httpbin.js";

export default Super =>
    class extends Super {

        // protected
        async _install () {
            return new Httpbin( this.app, this.config );
        }

        async _start () {
            return this.instance.start();
        }
    };
