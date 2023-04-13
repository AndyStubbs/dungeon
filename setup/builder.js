Util.LoadAllJson( "../dungeon.json", function ( data ) {
	loadDungeon( data );
} );

function loadDungeon( data ) {
	$.removeAllScreens();
	$.setDefaultPal( data.colors );
	$.screen( { "aspect": "640x400", "willReadFrequently": true } );
	$.setColor( "white" );
	showMenu( data );
}

async function showMenu( data ) {
	$.print( "Name: " + data.name );
	$.print( "Colors: " + data.colors.length );
	$.print( "Images: " + data.images.length );
	$.print( "Rooms: " + data.rooms.length );
	$.print( "" );
	$.print( "1. Edit Images" );
	$.print( "2. Edit Tiles" );
	$.print( "3. Edit Character" );
	$.print( "4. Edit Monsters" );
	$.print( "5. Edit Rooms" );

	let choice = -1;
	while( choice < 1 || choice > 5 ) {
		choice = await $.input( "Enter selection: ", null, true, true, false );
		if( choice < 1 || choice > 5 ) {
			$.print( "Invalid selection" );
		}
	}

	if( choice === 1 ) {
		data.selectedImage = 0;
		data.selectedColor = 0;
		editImages( data, true );
	}
}

function editImages( data, isFirst ) {
	$.cls();
	$.setColor( "white" );
	$.print( "Editing Images" );
	let x = 8;
	let y = 12;
	if( isFirst ) {
		$.clearEvents();
	}
	for( let i = 0; i < data.images.length; i++ ) {
		let image = Util.ConvertPutStringToData( data.images[ i ] );
		$.setPosPx( x, y + 4 );
		if( data.selectedImage === i ) {
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
		if( i === data.selectedImage ) {
			$.setColor( "white" );
			$.rect( hitBox );
			$.setColor( "gray" );
			$.rect( hitBox.x - 1, hitBox.y - 1, hitBox.width + 2, hitBox.height + 2 );
		}
		if( isFirst ) {
			$.onclick( function ( mouse, selectedImage ) {
				data.selectedImage = selectedImage;
				editImages( data, false );
			}, false, hitBox, i );
		}
		x += 45;
		if( x > 624 ) {
			x = 8;
			y += 18;
		}
	}

	let image = Util.ConvertPutStringToData( data.images[ data.selectedImage ] );
	let width = 12;
	let height = 12;
	for( let i = 0; i < image.length - 1; i++ ) {
		for( let j = 0; j < image[ i ].length - 1; j++ ) {
			x = j * width + 8;
			y = i * height + 216;
			let c = image[ i ][ j ];
			if( c === 0 ) {
				$.setColor( "#333333" );
				$.line( x, y, x + width, y + height );
				$.line( x + width, y, x, y + height );
			} else {
				$.setColor( c );
				$.rect( x, y, width, height, c );
			}

			if( isFirst ) {
				let hitBox = {
					"x": x,
					"y": y,
					"width": width,
					"height": height
				};
				$.onclick( function ( mouse, pos ) {
					//data.images[ data.selectedImage ][ pos.i ][ pos.j ] = data.selectedColor;
					let line = data.images[ data.selectedImage ][ pos.i ];
					data.images[ data.selectedImage ][ pos.i ] = line.substring( 0, pos.j ) +
						data.selectedColor.toString( 32 ) + line.substring( pos.j + 1 );
					editImages( data, false );
				}, false, hitBox, { "i": i, "j": j } );
			}
		}
	}

	for( let i = 0; i < data.colors.length; i++ ) {
		x = i * width + 8;
		y = 200;
		if( i === data.selectedColor ) {
			$.setColor( "#acacac" );
		} else {
			$.setColor( data.colors[ i ] );
		}
		$.rect( x, y, width, height, data.colors[ i ] );
		if( i === data.selectedColor ) {
			$.setColor( "#535353" );
			$.rect( x + 1, y + 1, width - 2, height - 2 );
		}

		if( isFirst ) {
			let hitBox = {
				"x": x,
				"y": y,
				"width": width,
				"height": height
			};
			$.onclick( function ( mouse, selectedColor ) {
				data.selectedColor = selectedColor;
				editImages( data, false );
			}, false, hitBox, i );
		}
	}
}
