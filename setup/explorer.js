"use strict";

( function () {

	function start( dungeon ) {
		$.removeAllScreens();
		$.setDefaultPal( dungeon.colors );
		$map = $.screen( { "aspect": "600x200", "willReadFrequently": true, "isOffscreen": true } );
		$screen = $.screen( { "aspect": "640x400", "willReadFrequently": true } );
		$screen.setFont( 3 );
		run( dungeon );
	}

	function run( dungeon ) {
		$.clearKeys();
		draw( dungeon );
		$.onkey( "any", "down", function ( key ) {
			switch( key.code ) {
				case "ArrowLeft":
				case "Numpad4":
					move( dungeon, -1, 0 );
					break;
				case "ArrowUp":
				case "Numpad8":
					move( dungeon, 0, -1 );
					break;
				case "ArrowRight":
				case "Numpad6":
					move( dungeon, 1, 0 );
					break;
				case "ArrowDown":
				case "Numpad2":
					move( dungeon, 0, 1 );
					break;
			}
			
			return run( dungeon );
		} );
	}

	function move( dungeon, x, y ) {
		let room = dungeon.rooms[ dungeon.games[ dungeon.gameId ].room ];
		let stats = dungeon.games[ dungeon.gameId ].character;
		let nextPos = [ stats.pos[ 0 ] + x, stats.pos[ 1 ] + y ];
		let tile = dungeon.tiles[
			Util.GetTileIndex( room.data[ nextPos[ 1 ] ].charAt( nextPos[ 0 ] ) )
		];
		if( tile.floor === 1 ) {
			stats.pos[ 0 ] += x;
			stats.pos[ 1 ] += y;
		}
	}

	function draw( dungeon ) {
		drawRoom( dungeon );
		drawScreen( dungeon );
	}

	function drawRoom( dungeon ) {
		$map.cls();
		let room = dungeon.rooms[ dungeon.games[ dungeon.gameId ].room ];

		// Draw Tiles
		let x = 0;
		let y = 0;
		for( let col = 0; col < room.data.length; col++ ) {
			for( let row = 0; row < room.data[ col ].length; row += 1 ) {
				let tile = dungeon.tiles[ Util.GetTileIndex( room.data[ col ].charAt( row ) ) ];
				let image = getImageData( dungeon, tile.imageId );
				$map.put( image, x, y );
				x += 15;
			}
			x = 0;
			y += 15;
		}

		// Draw Objects
		for( let i = 0; i < room.objects.length; i++ ) {
			let obj = room.objects[ i ];
			let image = getImageData(
				dungeon,
				dungeon.objects[ Util.GetTileIndex( obj.id ) ].imageId
			);
			let mx = obj.x * 15;
			let my = obj.y * 15;
			$map.put( image, mx, my );
		}

		// Draw Character
		let stats = dungeon.games[ dungeon.gameId ].character;
		let image = getImageData( dungeon, stats.imageId );
		$map.put( image, stats.pos[ 0 ] * 15, stats.pos[ 1 ] * 15 );

		// Render map
		$map.render();
	}

	function drawScreen( dungeon ) {
		$screen.cls();
		$screen.drawImage( $map, 16, 13, null, null, null, null, 2, 2 );
		$.setColor( "rgba(85,85,255,1)" );
		let format = [
			" *---------------------------------------------------------------------------* ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			" |                                                                           | ",
			"**---------------------------------------------------------------------------**",
			"|                                                                             |",
			"*---------------------------------*------------------*------------------------*",
			"|                                 |                  |                        |",
			"|                                 |                  *------------------------*",
			"|                                 |                  |                        |",
			"|                                 |                  |                        |",
			"|                                 |                  |                        |",
			"|                                 |                  |                        |",
			"*---------------------------------*------------------*------------------------*",
		];
		$.printTable( [], format, "double" );
		$.setPos( 70, 23 );
		let lineTop = String.fromCharCode( 201 ) +
			String.fromCharCode( 205 ) +
			String.fromCharCode( 187 );
		let lineBottom = String.fromCharCode( 200 ) +
			String.fromCharCode( 205 ) +
			String.fromCharCode( 188 );

		// Draw directions
		$.setPos( 70, 23 );
		$.print( lineTop, true );
		$.setPos( 70, 24 );
		$.print( lineBottom, true );
		$.setPos( 73, 24 );
		$.print( lineTop, true );
		$.setPos( 73, 25 );
		$.print( lineBottom, true );
		$.setPos( 67, 24 );
		$.print( lineTop, true );
		$.setPos( 67, 25 );
		$.print( lineBottom, true );
		$.setPos( 70, 25 );
		$.print( lineTop, true );
		$.setPos( 70, 26 );
		$.print( lineBottom, true );

		let stats = dungeon.games[ dungeon.gameId ].character;

		$.setColor( "white" );
		$.setPos( 2, 21 );
		$.print( Util.Pad( stats.name, 32 ), true );

		// Left Column
		$.setPos( 2, 22 );
		$.print( "Gold".padEnd( 7, " " ) + ":", true );
		$.print( String( stats.gold ).padStart( 7, " " ), true );
		$.setPos( 2, 23 );
		if( stats.hits < 100 ) {
			$.setColor( "red" );
		}
		$.print( "Hits".padEnd( 7, " " ) + ":", true );
		$.print( String( stats.hits ).padStart( 7, " " ), true );
		$.setPos( 2, 24 );
		if( stats.keys < 10 ) {
			$.setColor( "red" );
		} else {
			$.setColor( "white" );
		}
		$.print( "Keys".padEnd( 7, " " ) + ":", true );
		$.print( String( stats.keys ).padStart( 7, " " ), true );
		$.setPos( 2, 25 );
		if( stats.weaponId === 0 ) {
			$.setColor( "red" );
		} else {
			$.setColor( "white" );
		}
		$.print( "Weapon".padEnd( 7, " " ) + ":", true );
		$.print( dungeon.weapons[ stats.weaponId ].name.padStart( 7, " " ), true );
		$.setPos( 2, 26 );
		$.setColor( "white" );
		$.print( "Exp".padEnd( 7, " " ) + ":", true );
		$.print( String( stats.exp ).padStart( 7, " " ), true );

		// Right Column
		$.setPos( 18, 22 );
		$.print( "Level".padEnd( 7, " " ) + ":", true );
		$.print( String( stats.level ).padStart( 7, " " ), true );
		$.setPos( 18, 23 );
		$.print( "Potion".padEnd( 7, " " ) + ":", true );
		$.print( String( stats.potions ).padStart( 7, " " ), true );
		$.setPos( 18, 24 );
		$.print( "Wands".padEnd( 7, " " ) + ":", true );
		$.print( String( stats.wands ).padStart( 7, " " ), true );
		$.setPos( 18, 25 );
		if( stats.armorId === 0 ) {
			$.setColor( "red" );
		} else {
			$.setColor( "white" );
		}
		$.print( "Armor".padEnd( 7, " " ) + ":", true );
		$.print( dungeon.armors[ stats.armorId ].name.padStart( 7, " " ), true );
		$.setPos( 18, 26 );
		$.setColor( "white" );
		$.print( "Nxt lvl".padEnd( 7, " " ) + ":", true );
		$.print( String( stats.next ).padStart( 7, " " ), true );

		// Enemy Column
		$.setPos( 36, 21 );
		$.print( Util.Pad( "Orc Raider", 16 ), true );
		$.setPos( 36, 22 );
		$.print( "Max Hits".padEnd( 9, " " ) + ":", true );
		$.print( "2".padStart( 6, " " ), true );
		$.setPos( 36, 23 );
		$.print( "Level".padEnd( 9, " " ) + ":", true );
		$.print( "2".padStart( 6, " " ), true );
		$.setPos( 36, 24 );
		$.print( "Number".padEnd( 9, " " ) + ":", true );
		$.print( "2".padStart( 6, " " ), true );
		$.setPos( 36, 25 );
		$.print( "Exp".padEnd( 9, " " ) + ":", true );
		$.print( "2".padStart( 6, " " ), true );

		// Room Name
		$.setPos( 55, 21 );
		$.print( Util.Pad( "Grassy Knoll", 22 ), true );
	}

	function getImageData( dungeon, imageId ) {
		if( ! dungeon.temp ) {
			dungeon.temp = {};
		}
		if( !dungeon.temp.imageCache ) {
			dungeon.temp.imageCache = {};
		}
		if( !dungeon.temp.imageCache[ imageId ] ) {
			dungeon.temp.imageCache[ imageId ] = Util.ConvertPutStringToData(
				dungeon.images[ imageId ]
			);
		}
		return dungeon.temp.imageCache[ imageId ];
	}

	let $map, $screen;

	window.Explorer = {
		"start": start
	};

} )();
