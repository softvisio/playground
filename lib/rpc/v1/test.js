export default Super => {
    return class extends Super {
        async [ "API_bench" ] ( ctx ) {
            return result( 200 );
        }

        async [ "API_test" ] ( ctx, ...args ) {
            console.log( "Test api call", ...args );

            return result( 200, new Date() );
        }

        async [ "API_upload" ] ( ctx, { message, options } = {} ) {
            console.log( "--- upload, name: ", message.headers, options );

            return result( 200, [ options, new Date() ] );
        }
    };
};
