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
	$.print( "1. Edit images" );
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
		editImages( data, 0, true );
	}
}

function editImages( data, selection, isFirst ) {
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
		if( selection === i ) {
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
		if( i === selection ) {
			$.setColor( "white" );
			$.rect( hitBox );
			$.setColor( "gray" );
			$.rect( hitBox.x - 1, hitBox.y - 1, hitBox.width + 2, hitBox.height + 2 );
		}
		if( isFirst ) {
			$.onclick( function ( mouse, selectedTile ) {
				editImages( data, selectedTile, false );
			}, false, hitBox, i );
		}
		x += 45;
		if( x > 624 ) {
			x = 8;
			y += 18;
		}
	}

	let image = Util.ConvertPutStringToData( data.images[ selection ] );
	let width = 11;
	let height = 11;
	for( let i = 0; i < image.length - 1; i++ ) {
		for( let j = 0; j < image[ i ].length - 1; j++ ) {
			x = j * width + 8;
			y = i * height + 216;
			let c = image[ i ][ j ];
			$.setColor( "#333333" );
			$.rect( x, y, width, height, c );
		}
	}
}
