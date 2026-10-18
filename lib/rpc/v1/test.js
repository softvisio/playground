const filename = "/encrypted/test.txt";

export default Super => {
    return class extends Super {
        async [ "API_bench" ] ( ctx ) {
            return result( 200 );
        }

        async [ "API_test" ] ( ctx, ...args ) {
            console.log( "Test api call", ...args );

            return result( 200, new Date() );
        }

        async [ "API_upload" ] ( ctx, { file, options } = {} ) {
            console.log( "--- upload:", file.headers, options );

            return result( 200, [ options, new Date() ] );
        }

        async [ "API_download" ] ( ctx ) {
            return result( 200, {
                "url": this.app.storage.getFileUrl( filename ),
            } );
        }

        async [ "API_download-api" ] ( ctx, path ) {
            return result( 200, await this.app.storage.downloadFile( path || filename ) );
        }
    };
};
