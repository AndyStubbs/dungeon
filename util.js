"use strict";

( function () {
	var m_delayTimeouts;

	// Define FOS API
	window.Util = {
		"Delay": Delay,
		"LoadAllImages": LoadAllImages,
		"LoadAllJson": LoadAllJson,
		"SaveAsText": SaveAsText,
		"ConvertImagesToPutString32": ConvertImagesToPutString32,
		"ConvertPutStringToData": ConvertPutStringToData,
		"GetImageData": GetImageData
	};

	m_delayTimeouts = {};

	function Delay( cmd, name, amount ) {
		clearTimeout( m_delayTimeouts[ name ] );
		m_delayTimeouts[ name ] = setTimeout( cmd, amount );
	}

	function LoadAllImages( files, callback ) {
		if( typeof files === "string" ) {
			files = [ files ];
		}
		const results = [];
		let count = 0;

		files.forEach( function( filepath, index ) {
			const img = new Image();
			img.onload = function() {
				results[ index ] = img;
				count++;
				if( count === files.length ) {
					callback( results.length === 1 ? results[ 0 ] : results );
				}
			};
			img.onerror = function() {
				console.error( `Error loading image: ${filepath}` );
				count++;
				if( count === files.length ) {
					callback( results.length === 1 ? results[ 0 ] : results );
				}
			};
			img.src = filepath;
		} );
	}

	function LoadAllJson( files, callback ) {
		if( typeof files === "string" ) {
			files = [ files ];
		}
		const results = [];
		let count = 0;

		files.forEach( function( filepath, index ) {
			const xhr = new XMLHttpRequest();
			xhr.overrideMimeType( "application/json" );
			xhr.open( "GET", filepath, true );
			xhr.onreadystatechange = function() {
				if( xhr.readyState === 4 && xhr.status === 200 ) {
					results[ index ] = JSON.parse( xhr.responseText );
					count++;
					if( count === files.length ) {
						callback( results.length === 1 ? results[ 0 ] : results );
					}
				}
			};
			xhr.send(null);
		} );
	}

	function SaveAsText( obj, filename ) {
		const text = JSON.stringify( obj, null, 2 );
		const blob = new Blob( [ text ], { type: 'text/plain' } );
		const link = document.createElement( 'a' );
		link.download = filename;
		link.href = URL.createObjectURL( blob );
		link.click();
	}

	function ConvertImagesToPutString32( startIndex, endIndex, startX, startY, width, height ) {
		let data = [];
		let x = startX;
		let y = startY;
		let maxc = 0;
		let cs = {};
		
		for( let i = startIndex; i < endIndex; i++ ) {
			let data2 = $.get( x, y, x + width - 1, y + height - 1, null, true );
			let line = "";
			for( let j = 0; j < data2.length; j++ ) {
				for( let k = 0; k < data2[ j ].length; k++ ) {
					let c = data2[ j ][ k ];
					line += c.toString( 32 );
					if( c > maxc ) {
						maxc = c;
					}
					cs[ c ] = true;
				}
			}
			data.push( line );
			x += width;
			if( x > 590 ) {
				y += height;
				x = width;
			}
		}
		return data;
	}

	function ConvertPutStringToData( putStringData ) {
		let imageData = [];
		for( let i = 0; i < putStringData.length; i++ ) {
			imageData.push( [] );
			for( let j = 0; j < putStringData[ i ].length; j++ ) {
				let color = parseInt( putStringData[ i ].charAt( j ), 32 );
				imageData[ i ].push( color );
			}
		}
		return imageData;
	}

	function GetImageData( startIndex, endIndex, startX, startY, width, height ) {
		let data = [];
		let x = startX;
		let y = startY;
		let maxc = 0;
		let cs = {};

		for( let i = startIndex; i < endIndex; i++ ) {
			let data2 = $.get( x, y, x + width - 1, y + height - 1, null, true );
			data.push( [] );
			for( let j = 0; j < data2.length; j++ ) {
				let line = "";
				for( let k = 0; k < data2[ j ].length; k++ ) {
					let c = data2[ j ][ k ];
					line += c.toString( 32 );
				}
				data[ i - startIndex ].push( line );
			}
			x += width;
			if( x > 590 ) {
				y += height;
				x = width;
			}
		}

		return data;
	}

} )();
