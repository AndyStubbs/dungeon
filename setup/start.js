"use strict";

( function () {

	function init() {
		$.removeAllScreens();
		$.setDefaultPal( [
			"#000000","#0000AA","#00AA00","#00AAAA","#AA0000",
			"#AA00AA", "#AA5500","#AAAAAA","#555555","#5555FF","#55FF55","#55FFFF",
			"#FF5555","#FF55FF","#FFFF55","#FFFFFF" 
		] );
		$.screen( { "aspect": "640x400", "willReadFrequently": true } );
		$.setFont( 3 );
		introduction();
	}

	function loadDungeon( dungeonData ) {
		if( dungeonData ) {
			g_dungeon = dungeonData;
		} else {
			Util.LoadAllJson( "../dungeon.json", function ( data ) {
				g_dungeon = data;
			} );
		}
	}

	function introduction() {
		$.cls();
		$.clearKeys();
		$.setColor( 7 );
		printBorder( 0, 0, $.getCols(), $.getRows() );
		$.setPos( 0, 4 );
		$.print( "DUNGEON EXPLORER", true, true );
		$.setPos( 0, 6 );
		$.print( "Originally Created by", true, true );
		$.setPos( 0, 7 );
		$.print( "John K. Murphy (1990)", true, true );
		$.setPos( 0, 9 );
		$.print( "Pi.js Port by", true, true );
		$.setPos( 0, 10 );
		$.print( "Andy's Code Vault (2023)", true, true );
		printBorder( 30, 13, 19, 6 );

		// Instructions
		$.setPos( 32, 14 );
		$.setColor( 15 );
		$.print( "I", true );
		$.setColor( 7 );
		$.print( "]nstructions", true );

		// Start Play
		$.setPos( 32, 15 );
		$.setColor( 15 );
		$.print( "S", true );
		$.setColor( 7 );
		$.print( "]tart Play", true );

		// Build Dungeon
		$.setPos( 32, 16 );
		$.setColor( 15 );
		$.print( "B", true );
		$.setColor( 7 );
		$.print( "]uild Dungeon", true );

		// Explorer Docs
		$.setPos( 32, 17 );
		$.setColor( 15 );
		$.print( "E", true );
		$.setColor( 7 );
		$.print( "]xplorer.txt", true );

		// Press Letter
		$.setPos( 3, 25 );
		$.setColor( 15 );
		$.print( "Press the Letter of Desired Option", true, true );

		$.onkey( "i", "down", printInstructions );
		$.onkey( "b", "down", () => {
			$.clearKeys();
			window.Builder.editDungeon( g_dungeon );
		} );
		$.onkey( "s", "down", () => {
			$.clearKeys();
			window.Explorer.start( g_dungeon );
		} );
		$.onkey( "e", "down", () => {
			$.clearKeys();
			Util.LoadAllText( "explorer.txt", function ( msg ) {
				printExtendedInstructions( 0, msg.replaceAll( "\r", "" ), 1 );
			} );
		} );
	}

	function printInstructions() {
		$.cls();
		$.clearKeys();
		$.setColor( 7 );
		$.setPos( 2, 2 );

		// First Paragraph
		$.print( "  In Dungeon Explorer, all characters start the same. You have a certain" );
		$.print( "  number of hit points (Hits) that represent your life energy. When these" );
		$.print( "  reach zero, your life energy. When these reach zero, your character is" );
		$.print( "  dead and you must restart him where he was last saved.\n" );

		// Second Paragraph
		$.print( "    All equipment purchases and healing are done at the Shops. There are six" );
		$.print( "  shops which are grouped together and can be found in a variety of places." );
		$.print( "  Each shop is represented by a picture of the item it sells. To buy or trade" );
		$.print( "  items at a shop, stand on the picture and press 'B' for buy or 'T' ");
		$.print( "  for trade-in.\n" );

		// Third Paragraph
		$.print( "    The shops are: Weapons, Armor, Keys, Wands, Potions and Healing.\n" );

		// Fourth Paragraph
		$.print( "    Use the arrow keys to move your character around.\n" );

		// Fifth Paragraph
		$.print( "    To execute a command, you merely press a single key. Some commands need " );
		$.print( "  you to supply the direction of the action (like Jump).\n" );

		// Sixth Paragraph
		$.print( "    For convenience, certain commonly used instructions (Kill monster, Get " );
		$.print( "  Chest, Open Door, Push Block) are arranged to work with a single key. To" );
		$.print( "  work with a  single key. To attack a monster, just walk into him. The same" );
		$.print( "  applys to getting a chest, pushing a block or opening a door.\n" );

		$.setColor( 15 );
		$.print( "  Page # 1 of 2 - Press Any Key to Continue" );
		$.setColor( 7 );
		printBorder( 0, 0, $.getCols(), $.getRows() );

		$.onkey( "any", "down", printInstructions2, true );
	}

	function printInstructions2() {
		$.cls();
		$.setColor( 7 );
		$.setPos( 2, 2 );
		$.print( "  Finally, note that at any point in the game, you can see the list of the " );
		$.print( "  game, you can see the list of the commands by hitting the H (Help) key.\n" );

		// Second Paragraph
		$.print( "    You can create your own dungeon by pressing 'B' key from this menu. The "  );
		$.print( "  Builder Tools lets you design your own images, dungeons, monsters, weapons "  );
		$.print( "  and more. You can even save your dungeons as a JSON file for your own  " );
		$.print( "  storage. To load a dungeon just drag and drop the JSON file onto this " );
		$.print( "  website\n" );

		$.setColor( 15 );
		$.print( "  Page # 2 of 2 - Press Any Key to Continue", true, true );

		$.setColor( 7 );
		printBorder( 0, 0, $.getCols(), $.getRows() );
		$.onkey( "any", "down", function ( key ) {
			$.clearKeys();
			introduction();
		} );
	}

	function printExtendedInstructions( start, msg, page ) {
		$.cls();
		$.setColor( 7 );
		let msgs = msg.split( "\n" );
		let i = start;
		for( i = start; i < msgs.length && ( i - start ) < $.getRows() - 3; i += 1 ) {
			$.print( msgs[ i ] );
		}
		$.setColor( 15 );
		$.print( "\n" );
		$.print( "Page # " + page + " of 10 - Press any key to continue" );
		$.onkey( "any", "down", function () {
			$.clearKeys();
			if( i >= msgs.length ) {
				introduction();
			} else {
				printExtendedInstructions( i, msg, page + 1 );
			}
		} );
	}

	function printBorder( row, col, width, height ) {
		$.setPos( row, col );
		let topLine = String.fromCharCode( 201 ).padEnd( width - 2, String.fromCharCode( 205 ) ) +
			String.fromCharCode( 187 );
		$.print( topLine, true );
		for( let i = 0; i < height - 2; i++ ) {
			$.setPos( row, col + i + 1 );
			$.print(
				String.fromCharCode( 186 ).padEnd( width - 2 , " " ) + String.fromCharCode( 186 ),
				true
			);
		}
		let bottomLine = String.fromCharCode( 200 ).padEnd( width - 2, String.fromCharCode( 205 ) ) +
			String.fromCharCode( 188 );
		$.setPos( row, col + height - 1 );
		$.print( bottomLine, true );
	}

	let g_dungeon;

	loadDungeon();

	window.Start = {
		"init": init,
		"loadDungeon": loadDungeon
	};

	init();
} )();
