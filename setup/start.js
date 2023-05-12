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
			g_dungeons.push( g_dungeon );
		} else {
			let data = localStorage.getItem( "dungeons" );
			if( ! data || data === "[]" ) {
				g_dungeons = [];
				Util.LoadAllJson( "../dungeon.json", function ( jsonData ) {
					g_dungeon = jsonData;
					g_dungeons.push( g_dungeon );
					saveDungeons();
				} );
			} else {
				g_dungeons = JSON.parse( data );
			}
		}
		init();
	}

	function introduction() {
		$.cls();
		$.clearKeys();
		$.setColor( 7 );
		Util.PrintBorder( $, 0, 0, $.getCols(), $.getRows() );
		$.setPos( 0, 4 );
		$.print( "DUNGEON EXPLORER", true, true );
		$.setPos( 0, 6 );
		$.print( "Originally Created by", true, true );
		$.setPos( 0, 7 );
		$.print( "John K. Murphy (1990)", true, true );
		$.setPos( 0, 9 );
		$.print( "Pi.js Port by", true, true );
		$.setPos( 0, 10 );
		$.print( "Andy Stubbs (2023)", true, true );
		Util.PrintBorder( $, 30, 13, 19, 6 );

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
			selectDungeon( () => {
				window.Builder.editDungeon( g_dungeon );
			}, true );
		} );
		$.onkey( "s", "down", () => {
			$.clearKeys();
			selectDungeon( () => {
				return selectCharacter( g_dungeon );
			} );
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
		$.setPos( 2, $.getRows() - 2 );
		$.print( "Page # 1 of 2 - Press Any Key to Continue" );
		$.setColor( 7 );
		Util.PrintBorder( $, 0, 0, $.getCols(), $.getRows() );

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
		$.setPos( 2, $.getRows() - 2 );
		$.print( "Page # 2 of 2 - Press Any Key to Continue" );

		$.setColor( 7 );
		Util.PrintBorder( $, 0, 0, $.getCols(), $.getRows() );
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
		$.setPos( 0, $.getRows() - 1 );
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

	async function selectDungeon( callback, isBuild ) {
		let maxChoice = g_dungeons.length;
		if( isBuild ) {
			maxChoice += 1;
		}
		if( maxChoice === 1 ) {
			g_dungeon = g_dungeons[ 0 ];
			return callback( g_dungeon );
		}
		$.cls();
		$.setColor( 7 );
		$.print( "Please select from the following dungeons.\n" );
		$.print( "=".padEnd( $.getCols() - 1, "=" ) );
		for( let i = 0; i < g_dungeons.length; i++ ) {
			$.print( ( i + 1 ) + ": " + g_dungeons[ i ].name );
		}
		if( isBuild ) {
			$.print( ( g_dungeons.length + 1 ) + ": Create new dungeon" );
		}
		$.print( "=".padEnd( $.getCols() - 1, "=" ) );
		let choice = -1;
		while( choice < 1 || choice > maxChoice ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > maxChoice ) {
				$.print( "Invalid selection" );
			}
		}
		if( choice === g_dungeons.length + 1 ) {
			Util.LoadAllJson( "../dungeon.json", function ( jsonData ) {
				g_dungeon = jsonData;
				g_dungeon.name = "New Dungeon";
				g_dungeons.push( g_dungeon );
				saveDungeons();
				callback( g_dungeon );
			} );
		} else {
			g_dungeon = g_dungeons[ choice - 1 ];
			callback( g_dungeon );
		}
	}

	async function selectCharacter( dungeon ) {
		if( !dungeon.games ) {
			dungeon.games = [ createNewGame( dungeon ) ];
		}
		let maxChoice = dungeon.games.length + 1;
		$.cls();
		$.setColor( 7 );
		$.print( "Please select from the following dungeons.\n" );
		$.print( "=".padEnd( $.getCols() - 1, "=" ) );
		for( let i = 0; i < dungeon.games.length; i++ ) {
			$.print( ( i + 1 ) + ": " + dungeon.games[ i ].character.name );
		}
		$.print( ( dungeon.games.length + 1 ) + ": Create new character" );
		$.print( "=".padEnd( $.getCols() - 1, "=" ) );
		let choice = -1;
		while( choice < 1 || choice > maxChoice ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > maxChoice ) {
				$.print( "Invalid selection" );
			}
		}
		if( choice === dungeon.games.length + 1 ) {
			let newGame = createNewGame( dungeon );
			dungeon.games.push( newGame );
			dungeon.gameId = dungeon.games.length - 1;
			newGame.character.name = await $.input( "Enter name: " );
		} else {
			dungeon.gameId = ( choice - 1 );
		}
		saveDungeons();
		return printStory( dungeon );
	}

	function createNewGame( dungeon ) {
		return {
			"character": createNewCharacter( dungeon ),
			"room": 0
		};
	}

	function createNewCharacter( dungeon ) {
		return {
			"name": dungeon.character.name,
			"gold": dungeon.character.gold,
			"hits": dungeon.character.hits,
			"level": dungeon.character.level,
			"potions": dungeon.character.potions,
			"wands": dungeon.character.wands,
			"keys": dungeon.character.keys,
			"weaponId": dungeon.character.weaponId,
			"armorId": dungeon.character.armorId,
			"imageId": dungeon.character.imageId,
			"exp": dungeon.character.exp,
			"next": dungeon.character.next,
			"nextIncrease": dungeon.character.nextIncrease,
			"weapons": [ 0 ],
			"armors": [ 0 ],
			"pos": [ dungeon.character.pos[ 0 ], dungeon.character.pos[ 1 ] ]
		};
	}

	function deleteDungeon() {
		let index = g_dungeons.indexOf( g_dungeon );
		g_dungeons.splice( index, 1 );
		saveDungeons();
		if( g_dungeons.length === 0 ) {
			loadDungeon();
		} else {
			g_dungeon = g_dungeons[ 0 ];
			init();
		}
	}

	function saveDungeons( dungeon ) {
		let temp;
		if( dungeon ) {
			temp = dungeon.temp;
			delete dungeon.temp;
		}
		localStorage.setItem( "dungeons", JSON.stringify( g_dungeons ) );
		if( temp ) {
			dungeon.temp = temp;
		}
	}

	function printStory( dungeon ) {
		function printPage( pageNumber ) {
			$.cls();
			$.clearKeys();
			$.setColor( 7 );
			$.setPos( 0, 2 );
			for( let line = 0; line < story[ pageNumber ].length; line += 1 ) {
				$.setPos( 0, line + 2 );
				$.print( "  " + story[ pageNumber ][ line ], true );
			}
			$.setColor( 15 );
			$.setPos( 2, $.getRows() - 2 );
			$.print(
				"Page # " + ( pageNumber + 1 ) + " of " + story.length +
				" - Press Any Key to Continue"
			);
			$.setColor( 7 );
			Util.PrintBorder( $, 0, 0, $.getCols(), $.getRows() );
			$.onkey( "any", "down", function () {
				$.clearKeys();
				if( pageNumber + 1 >= story.length ) {
					return window.Explorer.start( dungeon );
				} else {
					printPage( pageNumber + 1 );
				}
			} );
		}

		let bigLines = dungeon.story.split( "\n" );
		let allLines = [];
		let maxCols = $.getCols() - 5;
		for( let i = 0; i < bigLines.length; i++ ) {
			let wordStart = 0;
			let lineStart = 0;
			for( let j = 0; j < bigLines[ i ].length; j += 1 ) {
				if( bigLines[ i ].charAt( j ) === " " ) {
					wordStart = j;
				}
				if( j - lineStart >= maxCols ) {
					allLines.push( bigLines[ i ].substring( lineStart, wordStart ).trim() );
					lineStart = wordStart;
					j = wordStart;
				}
			}
			if( wordStart < bigLines.length ) {
				allLines.push( bigLines[ i ].substring( lineStart, wordStart ).trim() );
			}
		}

		let story = [];
		let maxRows = $.getRows() - 6;
		let pageNumber = -1;
		for( let i = 0; i < allLines.length; i += 1 ) {
			if( i % maxRows === 0 ) {
				pageNumber += 1;
				story.push( [ [] ] );
			}
			story[ pageNumber ].push( allLines[ i ] );
		}
		printPage( 0 );
	}

	let g_dungeons = [];
	let g_dungeon;

	window.Start = {
		"init": init,
		"loadDungeon": loadDungeon,
		"deleteDungeon": deleteDungeon,
		"saveDungeon": saveDungeons
	};

	loadDungeon();

} )();
