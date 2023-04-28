"use strict";

( function () {
	// Add event listeners to the document for drag and drop
	document.addEventListener( "dragenter", function( event ) {
		event.preventDefault();
	} );

	document.addEventListener( "dragover", function( event ) {
		event.preventDefault();
	} );

	document.addEventListener( "drop", handleJSONFileDrop );

	// Define FOS API
	window.BuilderTools = {
		"drawImages": drawImages,
		"drawBigImage": drawBigImage,
		"drawColors": drawColors,
		"button": button,
		"drawTiles": drawTiles,
		"drawObjects": drawObjects,
		"drawRoomSelectors": drawRoomSelectors,
		"drawRoom": drawRoom
	};

	function drawImages( data, x, y, callback ) {
		for( let i = 0; i < data.images.length; i++ ) {
			let image = Util.ConvertPutStringToData( data.images[ i ] );
			$.setPosPx( x, y + 4 );
			if( data.temp.selectedImage === i ) {
				$.setColor( "white" );
			} else {
				$.setColor( "gray" );
			}
			$.print( i.toString().padStart( 3, " " ) + ":", true );
			let hitBox = {
				"x": x + 25,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.put( image, hitBox.x, hitBox.y );
			if( i === data.temp.selectedImage ) {
				$.setColor( "white" );
				$.rect( hitBox );
				$.setColor( "gray" );
				$.rect( hitBox.x - 1, hitBox.y - 1, hitBox.width + 2, hitBox.height + 2 );
			}
			$.onclick( function ( mouse, selectedImage ) {
				data.temp.selectedImage = selectedImage;
				callback( data, false );
			}, false, hitBox, i );
			x += 45;
			if( x > 624 ) {
				x = 8;
				y += 18;
			}
		}
	}
	
	function drawBigImage( data, startX, startY ) {
		let image = Util.ConvertPutStringToData( data.images[ data.temp.selectedImage ] );
		let width = 12;
		let height = 12;
		for( let i = 0; i < image.length - 1; i++ ) {
			for( let j = 0; j < image[ i ].length - 1; j++ ) {
				let x = j * width + startX;
				let y = i * height + startY;
				let c = image[ i ][ j ];
				if( c === 0 ) {
					$.setColor( "#333333" );
					$.line( x, y, x + width - 1, y + height - 1 );
					$.line( x + width - 1, y, x, y + height - 1 );
				} else {
					$.setColor( c );
					$.rect( x, y, width, height, c );
				}
			}
		}

		let mouseDown = false;
		let hitBox = {
			"x": startX,
			"y": startY,
			"width": image[ 0 ].length * width,
			"height": image.length * width
		};
		let setColor = function( mouse ) {
			let pos = {
				"i": Math.floor( ( mouse.y - startY ) / height ),
				"j": Math.floor( ( mouse.x - startX ) / width ),
			};
			pos.x = pos.j * width + startX;
			pos.y = pos.i * height + startY;
			let line = data.images[ data.temp.selectedImage ][ pos.i ];
			data.images[ data.temp.selectedImage ][ pos.i ] = line.substring( 0, pos.j ) +
				data.temp.selectedColor.toString( 32 ) + line.substring( pos.j + 1 );
			$.setColor( data.temp.selectedColor );
			$.rect( pos.x, pos.y, width, height, data.temp.selectedColor );
			if( data.temp.selectedColor === 0 ) {
				$.setColor( "#333333" );
				$.line( pos.x, pos.y, pos.x + width - 1, pos.y + height - 1 );
				$.line( pos.x + width - 1, pos.y, pos.x, pos.y + height - 1 );
			}
		};

		$.onmouse( "down", function ( mouse ) {
			mouseDown = true;
			setColor( mouse );
		}, false, hitBox );
		$.onmouse( "move", function ( mouse ) {
			if( mouseDown ) {
				setColor( mouse );
			}
		}, false, hitBox );
		$.onmouse( "up", function () {
			mouseDown = false;
		} );
	}

	function drawColors( data, x, y, callback ) {
		let width = 12;
		let height = 12;
		for( let i = 0; i < data.colors.length; i++ ) {
			x = i * width + 8;
			if( i === data.temp.selectedColor ) {
				$.setColor( "#acacac" );
			} else {
				$.setColor( data.colors[ i ] );
			}
			$.rect( x, y, width, height, data.colors[ i ] );
			if( i === 0 ) {
				$.setColor( "#333333" );
				$.line( x, y, x + width - 1, y + height - 1 );
				$.line( x + width - 1, y, x, y + height - 1 );
			}
			if( i === data.temp.selectedColor ) {
				$.setColor( "#535353" );
				$.rect( x + 1, y + 1, width - 2, height - 2 );
			}
			let hitBox = {
				"x": x,
				"y": y,
				"width": width,
				"height": height
			};
			$.onclick( function ( mouse, selectedColor ) {
				data.temp.selectedColor = selectedColor;
				callback( data );
			}, false, hitBox, i );
		}
	}

	function button( title, x, y, callback ) {
		let hitBox = {
			"x": x,
			"y": y,
			"width": 64,
			"height": 16
		};
		title = Util.Pad( title, 9 );
		$.setColor( "#838383" );
		$.setPosPx( hitBox.x + 6, hitBox.y + 4 );
		$.print( title, true );
		$.rect( hitBox );
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox.x + 6, hitBox.y + 4 );
			$.print( title, true );
			$.rect( hitBox );
			setTimeout( function () {
				callback();
			}, 100 );
		}, false, hitBox );
	}

	function drawTiles( data, x, y, callback ) {
		for( let i = 0; i < data.tiles.length; i++ ) {
			let image = Util.ConvertPutStringToData( data.images[ data.tiles[ i ].imageId ] );
			let hitBox = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.put( image, x, y );
			if( i === data.temp.selectedTile ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			}
			$.setColor( "gray" );
			$.rect( hitBox );
			$.onclick( function ( mouse, selectedTile ) {
				data.temp.selectedTile = selectedTile;
				data.temp.selectedImage = data.tiles[ data.temp.selectedTile ].imageId;
				callback( data );
			}, false, hitBox, i );
			x += 18
			if( x > 628 ) {
				x = 2;
				y += 18;
			}
		}
	}

	function drawObjects( data, x, y, isProjectile, callback ) {
		for( let i = 0; i < data.objects.length; i++ ) {
			if( isProjectile ) {
				if( !data.objects[ i ].isProjectile ) {
					continue;
				}
			}
			let image = Util.ConvertPutStringToData( data.images[ data.objects[ i ].imageId ] );
			let hitBox = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.put( image, x, y );
			if( isProjectile && i === data.objects[ data.temp.selectedObject ].projectile ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			} else if( i === data.temp.selectedObject ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			}
			$.setColor( "gray" );
			$.rect( hitBox );
			$.onclick( function ( mouse, selectedObject ) {
				data.temp.selectedObject = selectedObject;
				data.temp.selectedImage = data.objects[ data.temp.selectedObject ].imageId;
				callback( data );
			}, false, hitBox, i );
			x += 18
			if( x > 628 ) {
				x = 2;
				y += 18;
			}
		}
	}

	function drawRoomSelectors( data, x, y, callback ) {
		for( let i = 0; i < data.rooms.length; i++ ) {
			$.setPosPx( x + 2, y + 2 );
			if( i === data.temp.selectedRoom ) {
				$.setColor( "white" );
			} else {
				$.setColor( "gray" );
			}
			$.print( Util.GetTileId( i ), true );
			let hitBox = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.rect( hitBox );
			$.onclick( function ( mouse, selectedRoom ) {
				data.temp.selectedRoom = selectedRoom;
				callback( data, false );
			}, false, hitBox, i );
			x += 18;
			if( x > 628 ) {
				x = 2;
				y += 18;
			}
		}
	}

	function drawRoom( data, x, y, callback ) {
		let room = data.rooms[ data.temp.selectedRoom ];
		let startX = x;
		let startY = y;
		for( let col = 0; col < room.data.length; col++ ) {
			for( let row = 0; row < room.data[ col ].length; row += 1 ) {
				let tile = data.tiles[ Util.GetTileIndex( room.data[ col ].charAt( row ) ) ];
				let image = Util.ConvertPutStringToData( data.images[ tile.imageId ] );
				$.put( image, x, y );
				let hitBoxRoom = {
					"x": x,
					"y": y,
					"width": 15,
					"height": 15
				};
				$.onclick( function ( mouse, pos ) {
					callback( pos );
				}, false, hitBoxRoom, { "x": row, "y": col } );
				x += 15;
			}
			x = startX;
			y += 15;
		}

		for( let i = 0; i < room.objects.length; i++ ) {
			let obj = room.objects[ i ];
			let image = Util.ConvertPutStringToData(
				data.images[ data.objects[ Util.GetTileIndex( obj.id ) ].imageId ]
			);
			let mx = obj.x * 15 + startX;
			let my = obj.y * 15 + startY;
			$.put( image, mx, my );
		}
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

} )();
