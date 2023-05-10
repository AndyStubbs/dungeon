"use strict";

( function () {

	function start( data ) {
		data.game = {
			"room": 0
		};
		$.removeAllScreens();
		$.setDefaultPal( data.colors );
		$map = $.screen( { "aspect": "600x200", "willReadFrequently": true, "isOffscreen": true } );
		$screen = $.screen( { "aspect": "640x400", "willReadFrequently": true } );
		draw( data );
	}

	function draw( data ) {
		drawRoom( data );
		drawScreen( data );
	}

	function drawRoom( data ) {
		$map.cls();
		let room = data.rooms[ data.game.room ];
		let x = 0;
		let y = 0;
		for( let col = 0; col < room.data.length; col++ ) {
			for( let row = 0; row < room.data[ col ].length; row += 1 ) {
				let tile = data.tiles[ Util.GetTileIndex( room.data[ col ].charAt( row ) ) ];
				let image = Util.ConvertPutStringToData( data.images[ tile.imageId ] );
				$map.put( image, x, y );
				x += 15;
			}
			x = 0;
			y += 15;
		}

		for( let i = 0; i < room.objects.length; i++ ) {
			let obj = room.objects[ i ];
			let image = Util.ConvertPutStringToData(
				data.images[ data.objects[ Util.GetTileIndex( obj.id ) ].imageId ]
			);
			let mx = obj.x * 15;
			let my = obj.y * 15;
			$map.put( image, mx, my );
		}
		$map.render();
	}

	function drawScreen( data ) {
		$screen.cls();
		$screen.drawImage( $map, 15, 15, null, null, null, null, 2, 2 );
		$screen.print( "Temp" );
	}

	let $map, $screen;

	window.Explorer = {
		"start": start
	};

} )();
