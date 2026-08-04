export default Super => {
    return class extends ( Super || class {} ) {
        async onBackgoundMessage ( message ) {
            return super.onBackgoundMessage( message );
        }

        async onClick ( event ) {
            return super.onClick( event );
        }
    };
};
