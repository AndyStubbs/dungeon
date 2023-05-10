"use strict";

( function () {
	var m_delayTimeouts;

	// Define FOS API
	window.Util = {
		"Delay": Delay,
		"LoadAllImages": LoadAllImages,
		"LoadAllJson": LoadAllJson,
		"LoadAllText": LoadAllText,
		"SaveAsJson": SaveAsJson,
		"ConvertImagesToPutString32": ConvertImagesToPutString32,
		"ConvertPutStringToData": ConvertPutStringToData,
		"GetImageData": GetImageData,
		"GetTileId": GetTileId,
		"GetTileIndex": GetTileIndex,
		"Pad": Pad
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

	function LoadAllText( files, callback ) {
		if( typeof files === "string" ) {
			files = [ files ];
		}
		const results = [];
		let count = 0;

		files.forEach( function( filepath, index ) {
			const xhr = new XMLHttpRequest();
			xhr.open( "GET", filepath, true );
			xhr.onreadystatechange = function() {
				if( xhr.readyState === 4 && xhr.status === 200 ) {
					results[ index ] = xhr.responseText;
					count++;
					if( count === files.length ) {
						callback( results.length === 1 ? results[ 0 ] : results );
					}
				}
			};
			xhr.send(null);
		} );
	}

	function SaveAsJson( obj, filename ) {
		const text = JSON.stringify( obj, null, 2 );
		const blob = new Blob( [ text ], { type: 'text/JSON' } );
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

	function GetTileId( index ) {
		let values = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+.";
		return values.charAt( index );
	}

	function GetTileIndex( id ) {
		let values = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
		return values.indexOf( id );
	}

	function Pad( str, size ) {
		const strLength = str.length;
		const spacesNeeded = size - strLength;
		if( spacesNeeded <= 0 ) {
			return str.substring( 0, size );
		}

		const leftSpaces = Math.floor( spacesNeeded / 2 );
		const rightSpaces = spacesNeeded - leftSpaces;
		const paddedString = " ".repeat( leftSpaces ) + str + " ".repeat( rightSpaces );

		return paddedString;
	}

	function handleJSONFileDrop( event ) {
		event.preventDefault();
		
		const file = event.dataTransfer.files[0];
		
		if ( !file ) {
			return;
		}
		
		const reader = new FileReader();
		
		reader.onload = async function() {
			const data = JSON.parse( reader.result );
			$.clearEvents();
			$.cancelInput();
			$.cls();
			let answer = await $.input( "Do you wish to load the dungeon \"" + data.name + "\" (y/n)? " );
			if( answer.charAt( 0 ).toLowerCase() === "y" ) {
				loadDungeon( data );
			}
		};
		
		reader.readAsText( file );
	}

	// Add event listeners to the document for drag and drop
	document.addEventListener( "dragenter", function( event ) {
		event.preventDefault();
	} );

	document.addEventListener( "dragover", function( event ) {
		event.preventDefault();
	} );

	document.addEventListener( "drop", handleJSONFileDrop );

} )();
