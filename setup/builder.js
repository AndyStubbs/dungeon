"use strict";

( function () {

	function editDungeon( dungeon ) {
		$.removeAllScreens();
		$.setDefaultPal( dungeon.colors );
		$.screen( { "aspect": "640x400", "willReadFrequently": true } );
		$.setColor( "white" );
		dungeon.temp = {};
		showMenu( dungeon );
	}

	async function showMenu( dungeon ) {
		$.clearEvents();
		$.clearKeys();
		$.cls();
		$.setColor( "white" );
		$.print( "Main Menu\n\n" );
		$.setColor( "grey" );
		$.print( " Name: " + dungeon.name );
		$.print( " Colors: " + dungeon.colors.length );
		$.print( " Images: " + dungeon.images.length );
		$.print( " Tiles: " + dungeon.tiles.length );
		$.print( " Rooms: " + dungeon.rooms.length );
		$.print( " Objects: " + dungeon.objects.length );
		$.print( " Weapons: " + dungeon.weapons.length );
		$.print( " Armors: " + dungeon.armors.length );
		$.print( "" );
		$.print( " 1. Edit Name" );
		$.print( " 2. Edit Images" );
		$.print( " 3. Edit Tiles" );
		$.print( " 4. Edit Character" );
		$.print( " 5. Edit Objects/Monsters" );
		$.print( " 6. Edit Rooms" );
		$.print( " 7. Edit Weapons" );
		$.print( " 8. Edit Armors" );
		$.print( " 9. Edit Paths" );
		$.print( " 10. Edit Map" );
		$.print( " 11. Reset Dungeon" );
		$.print( " 12. Download Dungeon" );
		$.print( " 13. Delete Dungeon" );
		$.print( " 14. Done Building" );

		let choice = -1;
		while( choice < 1 || choice > 14 ) {
			choice = await $.input( " Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 14 ) {
				$.print( "Invalid selection" );
			}
		}

		if( choice === 1 ) {
			dungeon.name = await $.input( " Enter name: " );
			window.Start.saveDungeon( dungeon );
			return showMenu( dungeon );
		} else if( choice === 2 ) {
			dungeon.temp.selectedImage = 0;
			dungeon.temp.selectedColor = 0;
			editImages( dungeon, true );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 3 ) {
			dungeon.temp.selectedImage = 0;
			dungeon.temp.selectedTile = 0;
			editTiles( dungeon, true );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 4 ) {
			dungeon.temp.selectedImage = dungeon.character.imageId;
			editCharacter( dungeon, true );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 5 ) {
			dungeon.temp.selectedObject = 0;
			dungeon.temp.selectedImage = dungeon.objects[ dungeon.temp.selectedObject ].imageId;
			editObjects( dungeon, true );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 6 ) {
			dungeon.temp.selectedTile = 0;
			dungeon.temp.selectedObject = -1;
			dungeon.temp.setTrapStep = -1;
			dungeon.temp.selectedRoom = 0;
			editRooms( dungeon, true );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 7 ) {
			dungeon.temp.selectedWeapon = 0;
			editWeapons( dungeon );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 8 ) {
			dungeon.temp.selectedArmor = 0;
			editArmors( dungeon );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 9 ) {
			dungeon.temp.selectedRoom = 0;
			dungeon.temp.selectedMapLevel = 0;
			dungeon.temp.selectedQuad = [ 0, 0 ];
			dungeon.temp.selectedDirection = 0;
			dungeon.temp.selectedPathMapLevel = 0;
			editPaths( dungeon );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 10 ) {
			dungeon.temp.selectedMapLevel = 0;
			dungeon.temp.selectedQuad = [ 0, 0 ];
			dungeon.temp.selectedDirection = 0;
			dungeon.temp.selectedPathMapLevel = 0;
			editMaps( dungeon );
			window.Start.saveDungeon( dungeon );
		} else if( choice === 11 ) {
			resetData( dungeon );
			window.Start.saveDungeon( dungeon );
			showMenu( dungeon );
		} else if( choice === 12 ) {
			let temp = dungeon.temp;
			delete dungeon.temp;
			Util.SaveAsJson( dungeon, "dungeon.json" );
			dungeon.temp = temp;
			return showMenu( dungeon );
		} else if( choice === 13 ) {
			return window.Start.deleteDungeon();
		} else if( choice === 14 ) {
			return window.Start.init();
		}
	}

	function resetData( dungeon ) {
		dungeon.name = "New Dungeon";
		dungeon.rooms = [];
		dungeon.tiles =  [
			{
				"imageId":  0,
				"description": "the floor"
			}
		];
		dungeon.maps = [];
		dungeon.paths = [];
		dungeon.colors = [
			"rgba(0,0,0,0)",
			"rgba(85,85,85,1)",
			"rgba(170,170,170,1)",
			"rgba(0,170,0,1)",
			"rgba(0,0,0,1)",
			"rgba(170,0,0,1)",
			"rgba(255,255,85,1)",
			"rgba(170,85,0,1)",
			"rgba(85,255,85,1)",
			"rgba(0,0,170,1)",
			"rgba(85,85,255,1)",
			"rgba(255,85,85,1)",
			"rgba(255,255,255,1)",
			"rgba(85,255,255,1)",
			"rgba(170,0,170,1)",
			"rgba(0,170,170,1)",
			"rgba(255,85,255,1)"
		];
		dungeon.character = {
			"name": "ROCON",
			"gold": 200,
			"hits": 300,
			"level": 1,
			"potion": 0,
			"keys": 0,
			"weaponId": 0,
			"armorId": 0,
			"imageId": 0
		};
		dungeon.weapons = [
			{
				"name": "Hands",
				"damage": 1,
				"hit": 0.9
			}
		];
		dungeon.armors = [
			{
				"name": "Skin",
				"protection": 0,
				"dodge": 1
			}
		];
		dungeon.objects = [ createObject() ];
		dungeon.rooms = [ createRoom() ];
		dungeon.images =  [
			[
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000"
			]
		];
	}

	function createRoom() {
		return {
			"name": "Grassy Canyon",
			"objects": [],
			"traps": [],
			"data": [
				"00000000000000000000",
				"00000000000000000000",
				"00000000000000000000",
				"00000000000000000000",
				"00000000000000000000",
				"00000000000000000000",
				"00000000000000000000",
				"00000000000000000000"
			],
			"paths": "      "
		};
	}

	function createObject() {
		return {
			"name": "Orc Raider",
			"hits": 8,
			"level": 1,
			"exp": 2,
			"imageId": 0,
			"isMonster": true,
			"isRanged": true
		};
	}

	function editImages( dungeon ) {
		$.cls();
		$.clearEvents();
		BuilderTools.drawImages( dungeon, 8, 2, editImages );
		BuilderTools.drawBigImage( dungeon, 8, 216 );
		BuilderTools.drawColors( dungeon, 2, 200, editImages );

		$.setPosPx( 198, 216 );
		$.setColor( "white" );
		$.print( "Editing Images" );

		// Menu Button
		BuilderTools.button( "Menu", 198, 232, () => { showMenu( dungeon ); } );

		if( dungeon.images.length > 153 ) {
			return;
		}

		// Add New Button
		BuilderTools.button( "Add New", 265, 232, () => {
			dungeon.images.push( [
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000",
				"000000000000000"
			] );
			editImages( dungeon );
		} );
	}

	function editTiles( dungeon ) {
		$.cls();
		$.clearEvents();
		dungeon.tiles[ dungeon.temp.selectedTile ].imageId = dungeon.temp.selectedImage;
		BuilderTools.drawImages( dungeon, 8, 2, editTiles );

		let x = 2;
		let y = 200;

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Editing Tiles" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 10, () => { showMenu( dungeon ); } );

		// Add Button
		BuilderTools.button( "Add", 70, y + 10, () => {
			dungeon.tiles.push( {
				"imageId": 0,
				"description": ""
			} );
			editTiles( dungeon );
		} );

		// Edit Button
		BuilderTools.button( "Edit", 138, y + 10, () => { 
			$.cls( 0, y + 48, 500, 16 );
			$.setPosPx( 0, y + 58 );
			let pos = $.getPos();
			$.setPos( pos );
			$.input( " Description: ", function ( txt ) {
				dungeon.tiles[ dungeon.temp.selectedTile ].description = txt;
				editTiles( dungeon, true );
			} );
		} );

		// Special Button
		BuilderTools.button( "Special", 206, y + 10, () => {
			setSpecialTile( dungeon );
		} );

		$.setColor( "white" );
		$.setPosPx( 0, y + 88 );
		$.print( " Tile: " + Util.GetTileId( dungeon.temp.selectedTile ) );
		$.setPosPx( 0, y + 99 );
		$.print( " Image Id: " + dungeon.tiles[ dungeon.temp.selectedTile ].imageId );

		$.setPosPx( 120, y + 88 );
		if( dungeon.tiles[ dungeon.temp.selectedTile ].special ) {
			$.print( " Special: " +  dungeon.tiles[ dungeon.temp.selectedTile ].special );
		} else {
			$.print( " Special: " );
		}

		$.setPosPx( 120, y + 99 );
		if( dungeon.tiles[ dungeon.temp.selectedTile ].floor ) {
			$.print( " Floor: " +  dungeon.tiles[ dungeon.temp.selectedTile ].floor );
		} else {
			$.print( " Floor: 0" );
		}

		$.setPosPx( 300, y + 88 );
		if( dungeon.tiles[ dungeon.temp.selectedTile ].water ) {
			$.print( " Water: " +  dungeon.tiles[ dungeon.temp.selectedTile ].water );
		} else {
			$.print( " Water: 0" );
		}

		$.setPosPx( 300, y + 99 );
		if( dungeon.tiles[ dungeon.temp.selectedTile ].lava ) {
			$.print( " Lava: " +  dungeon.tiles[ dungeon.temp.selectedTile ].lava );
		} else {
			$.print( " Lava: 0" );
		}

		$.setPosPx( 420, y + 88 );
		if( dungeon.tiles[ dungeon.temp.selectedTile ].void ) {
			$.print( " Void: " +  dungeon.tiles[ dungeon.temp.selectedTile ].void );
		} else {
			$.print( " Void: 0" );
		}

		$.setPosPx( 0, y + 120 );
		let pos = $.getPos();
		$.setPos( pos );
		$.print( " Description: " + dungeon.tiles[ dungeon.temp.selectedTile ].description );

		BuilderTools.drawTiles( dungeon, x, y + 30, editTiles );
	}

	async function setSpecialTile( dungeon ) {
		$.cls();
		$.clearEvents();
		let tile = dungeon.tiles[ dungeon.temp.selectedTile ];
		let image = Util.ConvertPutStringToData( dungeon.images[ tile.imageId ] );
		$.put( image, 2, 2 );
		$.setPos( 0, 3 );
		if( tile.special ) {
			$.print( " " + tile.special );
			$.print( "\n" );
		}
		$.print( " Set Special Tile" );
		$.print( " 1. Stairs Up" );
		$.print( " 2. Stairs Down" );
		$.print( " 3. Wand Shop" );
		$.print( " 4. Potion Shop" );
		$.print( " 5. Key Shop" );
		$.print( " 6. Weapon Shop" );
		$.print( " 7. Armor Shop" );
		$.print( " 8. Healing Shop" );
		$.print( " 9. Floor Tile" );
		$.print( " 10. Water Tile" );
		$.print( " 11. Lava Tile" );
		$.print( " 12. Void Tile" );
		$.print( " 13. Reset - Normal Tile" );
		$.print( " 14. Cancel - Go back" );

		let choice = -1;
		while( choice < 1 || choice > 14 ) {
			choice = await $.input( " Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 14 ) {
				$.print( "Invalid selection" );
			}
		}

		if( choice === 1 ) {
			tile.special = "stairs up";
		} else if( choice === 2 ) {
			tile.special = "stairs down";
		} else if( choice === 3 ) {
			tile.special = "wand shop";
		} else if( choice === 4 ) {
			tile.special = "potion shop";
		} else if( choice === 5 ) {
			tile.special = "key shop";
		} else if( choice === 6 ) {
			tile.special = "weapon shop";
			tile.shop = await $.input( "Enter shop #: ", null, true, true, false );
		} else if( choice === 7 ) {
			tile.special = "armor shop";
			tile.shop = await $.input( "Enter shop #: ", null, true, true, false );
		} else if( choice === 8 ) {
			tile.special = "healing shop";
		} else if( choice === 9 ) {
			tile.floor = 1;
		} else if( choice === 10 ) {
			tile.water = 1;
		} else if( choice === 11 ) {
			tile.lava = 1;
		} else if( choice === 12 ) {
			tile.void = 1;
		} else if( choice === 13 ) {
			delete tile.special;
			delete tile.shop;
			delete tile.floor;
			delete tile.water;
			delete tile.lava;
			delete tile.void;
		}
		editTiles( dungeon, true );
	}

	async function editCharacter( dungeon ) {
		$.cls();
		$.clearEvents();

		$.print( "Edit Character" );
		$.print( "1. Name: " + dungeon.character.name );
		$.print( "2. Gold: " + dungeon.character.gold );
		$.print( "3. Hits: " + dungeon.character.hits );
		$.print( "4. Level: " + dungeon.character.level );
		$.print( "5. Potion: " + dungeon.character.potion );
		$.print( "6. Keys: " + dungeon.character.keys );
		$.print( "7. Weapon: " + dungeon.weapons[ dungeon.character.weaponId ].name );
		$.print( "8. Armor: " + dungeon.armors[ dungeon.character.armorId ].name );
		$.print( "9. Image: " );
		$.print( "\n" );
		$.print( "10. Go back to menu" );

		let image = Util.ConvertPutStringToData( dungeon.images[ dungeon.character.imageId ] );
		$.put( image, 55, 78 );

		let choice = -1;
		while( choice < 1 || choice > 10 ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 10 ) {
				$.print( "Invalid selection" );
			}
		}

		if( choice === 1 ) {
			dungeon.character.name = await $.input( "Enter name: ", null );
		} else if( choice === 2 ) {
			dungeon.character.gold = await $.input( "Enter gold: ", null, true, true, false );
		} else if( choice === 3 ) {
			dungeon.character.hits = await $.input( "Enter hits: ", null, true, true, false );
		} else if( choice === 4 ) {
			dungeon.character.level = await $.input( "Enter level: ", null, true, true, false );
		} else if( choice === 5 ) {
			dungeon.character.potion = await $.input( "Enter potion: ", null, true, true, false );
		} else if( choice === 6 ) {
			dungeon.character.keys = await $.input( "Enter keys: ", null, true, true, false );
		} else if( choice === 7 ) {
			$.print( "\nWeapons:" );
			for( let i = 0; i < dungeon.weapons.length; i++ ) {
				$.print(
					( i + 1 ) + ". " +
					dungeon.weapons[ i ].name + " " +
					dungeon.weapons[ i ].damage + " " +
					dungeon.weapons[ i ].hit
				);
			}
			let weaponChoice = -1;
			while( weaponChoice < 1 || weaponChoice > dungeon.weapons.length ) {
				weaponChoice = await $.input( "Enter selection: ", null, true, true, false );
				if( weaponChoice < 1 || weaponChoice > dungeon.weapons.length ) {
					$.print( "Invalid selection" );
				}
			}
			dungeon.character.weaponId = weaponChoice - 1;
		} else if( choice === 8 ) {
			$.print( "\nArmors:" );
			for( let i = 0; i < dungeon.armors.length; i++ ) {
				$.print(
					( i + 1 ) + ". " +
					dungeon.armors[ i ].name + " " +
					dungeon.armors[ i ].protection + " " +
					dungeon.armors[ i ].dodge
				);
			}
			let armorChoice = -1;
			while( armorChoice < 1 || armorChoice > dungeon.armors.length ) {
				armorChoice = await $.input( "Enter selection: ", null, true, true, false );
				if( armorChoice < 1 || armorChoice > dungeon.armors.length ) {
					$.print( "Invalid selection" );
				}
			}
			dungeon.character.armorId = armorChoice - 1;
		} else if( choice === 9 ) {
			dungeon.temp.selectedImage = dungeon.character.imageId;
			$.cls();
			$.clearEvents();
			BuilderTools.drawImages( dungeon, 2, 8, () => {
				dungeon.character.imageId = dungeon.temp.selectedImage;
				editCharacter( dungeon );
			} );
			$.setPos( 2, 25 );
			$.setColor( "white" );
			$.print( "Use the mouse to select an image from up above." );
			return;
		} else if( choice === 10 ) {
			showMenu( dungeon );
			return;
		}

		editCharacter( dungeon );
	}

	function editObjects( dungeon ) {
		$.cls();
		$.clearEvents();

		BuilderTools.drawImages( dungeon, 2, 8, () => {
			dungeon.objects[ dungeon.temp.selectedObject ].imageId = dungeon.temp.selectedImage;
			editObjects( dungeon );
		} );

		let x = 2;
		let y = 200;

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Editing Objects/Monsters" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 12, () => { showMenu( dungeon ); } );

		// Add Button
		BuilderTools.button( "Add", 70, y + 12, () => {
			dungeon.objects.push( createObject() );
			editObjects( dungeon );
		} );

		// Edit Button
		BuilderTools.button( "Edit", 138, y + 12, () => {
			editObject( dungeon );
		} );

		// Draw Objects
		y += 31;
		BuilderTools.drawObjects( dungeon, x, y, false, false, editObjects );

		$.setColor( "white" );
		$.setPosPx( 0, y + 25 );
		let pos = $.getPos();
		let obj = dungeon.objects[ dungeon.temp.selectedObject ];
		if( obj.dropChance === undefined ) {
			obj.dropChance = 0;
		}
		$.setPos( pos );
		$.print( " Object: " + Util.GetTileId( dungeon.temp.selectedObject ) );
		$.print( " Image Id: " + obj.imageId );
		$.print( " Name: " + obj.name );
		$.print( " Hits: " + obj.hits );
		$.print( " Level: " + obj.level );
		$.print( " Exp: " + obj.exp );
		$.print( " Is Monster: " + ( obj.isMonster === true ) );
		$.print( " Is Projectile: " + ( obj.isProjectile === true ) );
		$.print( " Is Flame: " + ( obj.isFlame === true ) );
		$.print( " Lose Items: " + ( obj.loseItems === true ) );
		$.print( " Wooden Ship: " + ( obj.woodenShip === true ) );
		$.print( " Flying Ship: " + ( obj.flyingShip === true ) );
		$.print( " Metal Ship: " + ( obj.metalShip === true ) );
		$.print( " Search Find Gold/Item Drop Chance: " + obj.dropChance );
		$.print( " Is Chest: " + ( obj.isChest === true ) );
		$.print( " Is Door: " + ( obj.isDoor === true ) );
		$.print( " Is Movable: " + ( obj.isMovable === true ) );
	}

	async function editObject( dungeon ) {
		$.cls();
		$.clearEvents();

		let obj = dungeon.objects[ dungeon.temp.selectedObject ];
		let image = Util.ConvertPutStringToData( dungeon.images[ obj.imageId ] );
		$.put( image, 2, 2 );
		$.print( "\n\n" );
		$.print( " 1. Name: " + obj.name );
		$.print( " 2. Hits: " + obj.hits );
		$.print( " 3. Level: " + obj.level );
		$.print( " 4. Exp: " + obj.exp );
		$.print( " 5. Is Monster: " + ( obj.isMonster === true ) );
		$.print( " 6. Is Projectile: " + ( obj.isProjectile === true ) );
		$.print( " 7. Is Flame: " + ( obj.isFlame === true ) );
		$.print( " 8. Lose Items: " + ( obj.loseItems === true ) );
		$.print( " 9. Wooden Ship: " + ( obj.woodenShip === true ) );
		$.print( " 10. Flying Ship: " + ( obj.flyingShip === true ) );
		$.print( " 11. Metal Ship: " + ( obj.metalShip === true ) );
		$.print( " 12. Projectile: " );
		$.print( " 13. Search Find Gold/Item Chance: " + obj.dropChance );
		$.print( " 14. Is Chest: " + ( obj.isChest === true ) );
		$.print( " 15. Is Door: " + ( obj.isDoor === true ) );
		$.print( " 16. Is Movable: " + ( obj.isMovable === true ) );
		if( obj.projectile ) {
			let image = Util.ConvertPutStringToData(
				dungeon.images[ dungeon.objects[ obj.projectile ].imageId ]
			);
			$.put( image, 40, 120 );
		}
		$.print( "\n" );
		$.print( " 17. Done" );
		let choice = -1;
		while( choice < 1 || choice > 17 ) {
			choice = await $.input( " Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 17 ) {
				$.print( " Invalid selection" );
			}
		}
		if( choice === 1 ) {
			obj.name = await $.input( "Enter name: ", null );
		} else if( choice === 2 ) {
			obj.hits = await $.input( "Enter hits: ", null, true, true, false );
		} else if( choice === 3 ) {
			obj.level = await $.input( "Enter level: ", null, true, true, false );
		} else if( choice === 4 ) {
			obj.exp = await $.input( "Enter exp: ", null, true, true, false );
		} else if( choice === 5 ) {
			obj.isMonster = (
				await $.input( "Is Monster (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 6 ) {
			obj.isProjectile = (
				await $.input( "Is Projectile (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 7 ) {
			obj.isFlame = (
				await $.input( "Is Flame (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 8 ) {
			obj.loseItems = (
				await $.input( "Lose Items (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 9 ) {
			obj.woodenShip = (
				await $.input( "Wooden Ship (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 10 ) {
			obj.flyingShip = (
				await $.input( "Flying Ship (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 11 ) {
			obj.metalShip = (
				await $.input( "Metal Ship (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 12 ) {
			editProjectile( dungeon );
			return;
		} else if( choice === 13 ) {
			obj.dropChance = await $.input( "Enter chance: ", null, true, false, false );
		} else if( choice === 14 ) {
			obj.isChest = (
				await $.input( "Is Chest (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 15 ) {
			obj.isDoor = (
				await $.input( "Is Door (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 16 ) {
			obj.isMovable = (
				await $.input( "Is Movable (y/n): ", null )
			).toLowerCase().charAt( 0 ) === "y";
		} else if( choice === 17 ) {
			editObjects( dungeon, true );
			return;
		}

		editObject( dungeon );
	}

	function editProjectile( dungeon ) {
		$.clearEvents();
		$.cls();
		$.setColor( "white" );
		$.print( "Select projectile" );
		let x = 2;
		let y = 16;
		let selectedObject = dungeon.objects[ dungeon.temp.selectedObject ];
		if( selectedObject.projectile ) {
			let image = Util.ConvertPutStringToData(
				dungeon.images[ dungeon.objects[ selectedObject.projectile ].imageId ]
			);
			$.put( image, x, y );
		}

		// Draw Objects
		y += 31;
		BuilderTools.drawObjects( dungeon, x, y, true, false, () => {
			selectedObject.projectile = dungeon.temp.selectedObject;
			dungeon.temp.selectedObject = dungeon.objects.indexOf( selectedObject );
			editProjectile( dungeon );
		} );

		// Add Button
		BuilderTools.button( "Done", 2, 100, () => {
			editObject( dungeon );
		} );
	}

	function editRooms( dungeon ) {
		$.cls();
		$.clearEvents();

		let x = 2;
		let y = 2;

		// Draw Tiles
		BuilderTools.drawTiles( dungeon, x, y, () => {
			dungeon.temp.selectedObject = -1;
			editRooms( dungeon );
		} );

		// Draw Objects
		x = 2;
		y = 60;
		BuilderTools.drawObjects( dungeon, x, y, false, true, () => {
			dungeon.temp.selectedTile = -1;
			editRooms( dungeon );
		} );

		$.setPosPx( 2, y + 20 );
		$.setColor( "white" );
		$.print( "Editing Rooms" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 31, () => { showMenu( dungeon ); } );

		// Add Button
		BuilderTools.button( "Add", 70, y + 31, () => {
			dungeon.rooms.push( createRoom() );
			editRooms( dungeon );
		} );

		// Edit Button
		BuilderTools.button( "Edit Name", 138, y + 31, async () => {
			$.cls();
			$.setColor( "white" );
			$.print( " Old name: " + dungeon.rooms[ dungeon.temp.selectedRoom ].name );
			dungeon.rooms[ dungeon.temp.selectedRoom ].name = await $.input( " Enter name: ", null );
			editRooms( dungeon );
		} );

		// Set Trap Button
		BuilderTools.button( "Set Trap", 206, y + 31, async () => {
			dungeon.temp.setTrapStep = 0;
			setTrap( dungeon );
		} );

		// Replace All Button
		BuilderTools.button( "Set All", 274, y + 31, async () => {
			if( dungeon.temp.selectedTile > -1 ) {
				let room = dungeon.rooms[ dungeon.temp.selectedRoom ];
				let tileId = Util.GetTileId( dungeon.temp.selectedTile );
				for( let col = 0; col < room.data.length; col++ ) {
					room.data[ col ] = tileId.padStart( room.data[ col ].length, tileId );
				}
			}
			editRooms( dungeon );
		} );

		// Clear Objects
		BuilderTools.button( "Clear Obj", 342, y + 31, () => {
			let room = dungeon.rooms[ dungeon.temp.selectedRoom ];
			room.objects = [];
			editRooms( dungeon );
		} );

		// Edit Paths
		BuilderTools.button( "Edit Paths", 410, y + 31, () => {
			editPaths( dungeon );
		} );

		// Draw Room Selectors
		x = 2;
		y += 50;
		BuilderTools.drawRoomSelectors( dungeon, x, y, () => {
			editRooms( dungeon );
		} );

		$.setColor( "white" );
		$.setPosPx( 0, y + 20 );
		let pos = $.getPos();
		$.setPos( pos );
		$.print( " Room: " + Util.GetTileId( dungeon.temp.selectedRoom ) );
		$.print( " Name: " + dungeon.rooms[ dungeon.temp.selectedRoom ].name );
		$.print( " Objects: " + dungeon.rooms[ dungeon.temp.selectedRoom ].objects.length );
		$.print( " Traps: " + dungeon.rooms[ dungeon.temp.selectedRoom ].traps.length );

		x = 6;
		y = $.getPosPx().y + 6;
		BuilderTools.drawRoom( dungeon, x, y, ( pos ) => {
			if( dungeon.temp.selectedTile !== -1 ) {
				let room = dungeon.rooms[ dungeon.temp.selectedRoom ];
				let line = room.data[ pos.y ];
				room.data[ pos.y ] = line.substring( 0, pos.x ) +
					Util.GetTileId( dungeon.temp.selectedTile ) +
					line.substring( pos.x + 1 );
			} else if( dungeon.temp.selectedObject > -1 ) {
				let room = dungeon.rooms[ dungeon.temp.selectedRoom ];
				if( dungeon.temp.selectedObject < dungeon.objects.length ) {
					room.objects.push( {
						"x": pos.x,
						"y": pos.y,
						"id": Util.GetTileId( dungeon.temp.selectedObject )
					} );
				} else {
					for( let i = 0; i < room.objects.length; i++ ) {
						if(
							room.objects[ i ].x === pos.x && room.objects[ i ].y === pos.y
						) {
							room.objects.splice( i, 1 );
							break;
						}
					}
				}
			}
			editRooms( dungeon );
		} );
	}

	function setTrap( dungeon ) {
		$.cls();
		$.clearEvents();
		let room =  dungeon.rooms[ dungeon.temp.selectedRoom ];
		let x = 2;
		let y = 2;

		if( ! dungeon.temp.setTrapStep ) {
			dungeon.temp.setTrapStep = 0;
		}

		let trap = room.traps[ dungeon.temp.selectedTrap ];

		if( trap ) {
			dungeon.temp.selectedImage = trap.imageId;
			dungeon.temp.selectedObject = trap.object;
		}

		// Draw Images
		BuilderTools.drawImages( dungeon, 8, 2, () => {
			if( room.traps[ dungeon.temp.selectedTrap ] ) {
				room.traps[ dungeon.temp.selectedTrap ].imageId = dungeon.temp.selectedImage;
			}
			setTrap( dungeon );
		} );
		y = 180;

		// Print the Title
		y += 25;
		$.setPosPx( 0, y );
		$.setPos( $.getPos() );
		$.setColor( "white" );
		$.print( "Editing traps" );

		// Back Button
		BuilderTools.button( "Back", 2, y + 5, () => {
			editRooms( dungeon );
		} );

		// Add Button
		BuilderTools.button( "Add", 70, y + 5, () => {
			room.traps.push( {
				"imageId": 0,
				"pos": { "x": 0, "y": 0 },
				"spawn": { "x": 0, "y": 0 },
				"dir": { "x": 0, "y": 0 },
				"object": 0
			} );
			dungeon.temp.selectedTrap = room.traps.length - 1;
			setTrap( dungeon );
		} );

		// Set Pos Button
		BuilderTools.button( "Set Pos", 138, y + 5, () => {
			dungeon.temp.setTrapStep = 0;
			dungeon.temp.selectedTrap = room.traps.length - 1;
			setTrap( dungeon );
		}, dungeon.temp.setTrapStep === 0 );

		// Set Spawn Button
		BuilderTools.button( "Set Spawn", 206, y + 5, () => {
			dungeon.temp.setTrapStep = 1;
			dungeon.temp.selectedTrap = room.traps.length - 1;
			setTrap( dungeon );
		}, dungeon.temp.setTrapStep === 1 );

		// Set Direction Button
		BuilderTools.button( "Direction", 275, y + 5, () => {
			dungeon.temp.setTrapStep = 2;
			setTrap( dungeon );
		}, dungeon.temp.setTrapStep === 2 );

		x = 2;
		y += 25;

		// Draw Traps
		for( let i = 0; i < room.traps.length; i++ ) {
			let image = Util.ConvertPutStringToData( dungeon.images[ room.traps[ i ].imageId ] );
			let hitBox = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.put( image, x, y );
			if( i === dungeon.temp.selectedTrap ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			}
			$.setColor( "gray" );
			$.rect( hitBox );

			$.onclick( function ( mouse, selectedTrap ) {
				dungeon.temp.selectedTrap = selectedTrap;
				setTrap( dungeon );
			}, false, hitBox, i );

			x += 18
			if( x > 628 ) {
				x = 2;
				y += 18;
			}
		}

		x = 6;
		y += 18;

		// Draw the map
		BuilderTools.drawRoom( dungeon, x, y, ( pos ) => {
			if( dungeon.temp.selectedObject > -1 ) {
				let trap = room.traps[ dungeon.temp.selectedTrap ];
				if( trap && dungeon.temp.setTrapStep === 0 ) {
					trap.pos.x = pos.x;
					trap.pos.y = pos.y;
				}
				if( trap && dungeon.temp.setTrapStep === 1 ) {
					trap.spawn.x = pos.x;
					trap.spawn.y = pos.y;
				}
				if( trap && dungeon.temp.setTrapStep === 2 ) {
					trap.dir.x = pos.x;
					trap.dir.y = pos.y;
				}
				setTrap( dungeon );
			}
			setTrap( dungeon );
		} );
		let startX = x;
		let startY = y;

		// Draw Trap
		if( trap ) {
			let image = Util.ConvertPutStringToData( dungeon.images[ trap.imageId ] );
			$.put( image, ( trap.pos.x * 15 ) + startX, ( trap.pos.y * 15 ) + startY );

			// Draw Spawn Point
			$.setColor( "black" );
			$.rect( ( trap.spawn.x * 15 ) + startX + 3, ( trap.spawn.y * 15 ) + startY + 2, 10, 10, "black" );
			$.setColor( "white" );
			$.setPosPx( ( trap.spawn.x * 15 ) + startX + 5, ( trap.spawn.y * 15 ) + startY + 4 );
			$.print( "S", true );

			// Draw Direction Point
			$.setColor( "black" );
			$.rect( ( trap.dir.x * 15 ) + startX + 3, ( trap.dir.y * 15 ) + startY + 2, 10, 10, "black" );
			$.setColor( "white" );
			$.setPosPx( ( trap.dir.x * 15 ) + startX + 5, ( trap.dir.y * 15 ) + startY + 4 );
			$.print( "D", true );
		}

		// Draw Objects
		x = 320;
		$.setColor( "white" );
		$.setPosPx( x, y - 12 );
		$.print( "Select Object/Projectile", true );
		
		BuilderTools.drawObjects( dungeon, x, y, false, false, () => {
			let trap = room.traps[ dungeon.temp.selectedTrap ];
			if( trap ) {
				trap.object = dungeon.temp.selectedObject;
			}
			setTrap( dungeon );
		} );
	}

	function editPaths( dungeon ) {
		$.cls();
		$.clearEvents();
		$.clearKeys();
		$.setPos( 1, 1 );
		$.setColor( "white" );
		$.print( "Editing Paths - Room " + Util.GetTileId( dungeon.temp.selectedRoom ) );

		let x = 2;
		let y = 18;

		// Get the map data
		let map = dungeon.maps[ dungeon.temp.selectedMapLevel ];

		BuilderTools.button( "Menu", x, y, () => { showMenu( dungeon ); } );
		BuilderTools.button( "Edit Map", x + 70, y, () => { editMaps( dungeon ); } );

		BuilderTools.button( "West/Left", x + 140, y, () => {
			dungeon.temp.selectedDirection = 0;
			editPaths( dungeon );
		}, dungeon.temp.selectedDirection === 0 );
		BuilderTools.button( "North/Up", x + 210, y, () => {
			dungeon.temp.selectedDirection = 1;
			editPaths( dungeon );
		}, dungeon.temp.selectedDirection === 1 );
		BuilderTools.button( "East/Right", x + 280, y, () => {
			dungeon.temp.selectedDirection = 2;
			editPaths( dungeon );
		}, dungeon.temp.selectedDirection === 2 );
		BuilderTools.button( "South/Down", x + 350, y, () => {
			dungeon.temp.selectedDirection = 3;
			editPaths( dungeon );
		}, dungeon.temp.selectedDirection === 3 );
		BuilderTools.button( "Stairs/Up", x + 420, y, () => {
			dungeon.temp.selectedDirection = 4;
			editPaths( dungeon );
		}, dungeon.temp.selectedDirection === 4 );
		BuilderTools.button( "Stairs/Down", x + 490, y, () => {
			dungeon.temp.selectedDirection = 5;
			editPaths( dungeon );
		}, dungeon.temp.selectedDirection === 5 );
		BuilderTools.button( "Clear", x + 560, y, () => {
			dungeon.paths = [];
			editPaths( dungeon );
		}, dungeon.temp.selectedDirection === 5 );

		y += 24;

		// Draw Map 1
		$.setColor( "white" );
		$.setPosPx( x, y );
		$.print( "Select Map Location", true );
		BuilderTools.button( "Up", x + 130, y, () => {
			if( dungeon.maps[ dungeon.temp.selectedMapLevel - 1 ] ) {
				dungeon.temp.selectedMapLevel -= 1;
			}
			editPaths( dungeon );
		} );
		BuilderTools.button( "Down", x + 200, y, () => {
			if( dungeon.maps[ dungeon.temp.selectedMapLevel + 1 ] ) {
				dungeon.temp.selectedMapLevel += 1;
			}
			editPaths( dungeon );
		} );
		$.setColor( "white" );
		$.setPosPx( x, y + 12 );
		$.print( "Level: " + dungeon.temp.selectedMapLevel, true );

		y += 22;
		for( let my = 0; my < map.length; my++ ) {
			for( let mx = 0; mx < map[ my ].length; mx++ ) {
				let rect = {
					"x": mx * 15 + 2,
					"y": my * 15 + y + 2,
					"width": 15,
					"height": 15
				};
				if(
					mx === dungeon.temp.selectedQuad[ 0 ] &&
					my === dungeon.temp.selectedQuad[ 1 ]
				) {
					$.setColor( "white" );
				} else {
					$.setColor( "grey" );
				}
				let roomId = map[ my ].charAt( mx );
				if( roomId !== "." ) {
					$.rect( rect );
					$.setPosPx( rect.x + 3, rect.y + 3 );
					$.print( map[ my ].charAt( mx ) );
				} else {
					$.rect( rect );
				}
				$.onclick( function ( mouse, pos ) {
					dungeon.temp.selectedQuad[ 0 ] = pos.x;
					dungeon.temp.selectedQuad[ 1 ] = pos.y;
					editPaths( dungeon );
				}, false, rect, { "x": mx, "y": my } );
			}
		}

		y -= 22;
		x += 300;
		// Draw Map 2
		// dungeon.temp.selectedDirection = 0;
		// dungeon.temp.selectedPathMapLevel = 0;
		/*
		 {
		"level": 0,
		"x": 1,
		"y": 3,
		"dir": 5,
		"dest": {
		  "level": 0,
		  "x": 1,
		  "y": 4
		}
	  },
		*/

		// Find all the paths for the selected area
		let selectedPath = null;
		for( let i = 0; i < dungeon.paths.length; i++ ) {
			let path = dungeon.paths[ i ];
			if(
				path.level === dungeon.temp.selectedMapLevel &&
				path.x === dungeon.temp.selectedQuad[ 0 ] &&
				path.y === dungeon.temp.selectedQuad[ 1 ] &&
				path.dir === dungeon.temp.selectedDirection
			) {
				selectedPath = path;
			}
		}

		// Get map 2
		let map2 = dungeon.maps[ dungeon.temp.selectedPathMapLevel ];
		$.setColor( "white" );
		$.setPosPx( x, y );
		$.print( "Select Path Destination", true );
		BuilderTools.button( "Up", x + 140, y, () => {
			if( dungeon.maps[ dungeon.temp.selectedPathMapLevel - 1 ] ) {
				dungeon.temp.selectedPathMapLevel -= 1;
			}
			editPaths( dungeon );
		} );
		BuilderTools.button( "Down", x + 210, y, () => {
			if( dungeon.maps[ dungeon.temp.selectedPathMapLevel + 1 ] ) {
				dungeon.temp.selectedPathMapLevel += 1;
			}
			editPaths( dungeon );
		} );
		$.setColor( "white" );
		$.setPosPx( x, y + 12 );
		if( selectedPath ) {
			$.print(
				"Level: " + dungeon.temp.selectedPathMapLevel + " - " + selectedPath.dest.level,
				true
			);
		} else {
			$.print( "Level: " + dungeon.temp.selectedPathMapLevel, true );
		}

		y += 22;
		for( let my = 0; my < map2.length; my++ ) {
			for( let mx = 0; mx < map2[ my ].length; mx++ ) {
				let rect = {
					"x": mx * 15 + x + 2,
					"y": my * 15 + y + 2,
					"width": 15,
					"height": 15
				};
				if(
					selectedPath &&
					mx === selectedPath.dest.x &&
					my === selectedPath.dest.y &&
					dungeon.temp.selectedPathMapLevel === selectedPath.dest.level
				) {
					$.setColor( "white" );
				} else {
					$.setColor( "grey" );
				}
				let roomId = map2[ my ].charAt( mx );
				if( roomId !== "." ) {
					$.rect( rect );
					$.setPosPx( rect.x + 3, rect.y + 3 );
					$.print( map2[ my ].charAt( mx ) );
				} else {
					$.rect( rect );
				}
				$.onclick( function ( mouse, pos ) {
					if( selectedPath ) {
						selectedPath.dest.x = mx;
						selectedPath.dest.y = my;
						selectedPath.dest.level = dungeon.temp.selectedPathMapLevel
					} else {
						dungeon.paths.push( {
							"level": dungeon.temp.selectedMapLevel,
							"x": dungeon.temp.selectedQuad[ 0 ],
							"y": dungeon.temp.selectedQuad[ 1 ],
							"dir": dungeon.temp.selectedDirection,
							"dest": {
							  "level": dungeon.temp.selectedPathMapLevel,
							  "x": mx,
							  "y": my
							}
						} );
					}
					editPaths( dungeon );
				}, false, rect, { "x": mx, "y": my } );
			}
		}
	}

	function editPaths2( dungeon ) {
		let room = dungeon.rooms[ dungeon.temp.selectedRoom ];
		$.cls();
		$.clearEvents();
		$.setPos( 1, 2 );
		$.setColor( "white" );
		$.print( "Editing Paths - Room " + Util.GetTileId( dungeon.temp.selectedRoom ) );
		
		let x = 2;
		let y = 28;

		BuilderTools.button( "Menu", 2, y, () => { showMenu( dungeon ); } );

		y += 18;
		BuilderTools.drawRoomSelectors( dungeon, x, y, () => {
			editPaths( dungeon );
		} );

		y += 18;
		BuilderTools.drawRoom( dungeon, x, y, ( pos ) => {} );

		y += 132;
		[
			"Select North/Up Room",
			"Select East/Right Room",
			"Select South/Down Room",
			"Select West/Left Room",
			"Select Stairs/Up Room",
			"Select Stairs/Down Room"
		].forEach( ( msg, i ) => {
			$.setPosPx( x, y );
			$.setColor( "white" );
			$.print( msg );
			y += 10;
			let tempRoom = dungeon.temp.selectedRoom;

			dungeon.temp.selectedRoom = Util.GetTileIndex( room.paths.charAt( i ) );
			BuilderTools.drawRoomSelectors( dungeon, x, y, () => {
				let roomId = "";
				if( dungeon.temp.selectedRoom === -1 ) {
					roomId = " ";
				} else {
					roomId = Util.GetTileId( dungeon.temp.selectedRoom );
				}
				room.paths = room.paths.substring( 0, i ) + roomId + room.paths.substring( i + 1 );
				dungeon.temp.selectedRoom = dungeon.rooms.indexOf( room );
				editPaths( dungeon );
			}, true );
			dungeon.temp.selectedRoom = tempRoom;
			y += 22;
		} );
	}

	function editWeapons( dungeon ) {
		$.cls();
		$.clearEvents();

		let x = 2;
		let y = 2;

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Editing Weapons" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 12, () => {
			showMenu( dungeon );
		} );

		// Add Button
		BuilderTools.button( "Add", 70, y + 12, () => {
			dungeon.weapons.push( {
				"name": "Dagger",
				"damage": 2,
				"hit": 0.8,
				"cost": 5,
				"store": 1
			} );
			dungeon.temp.selectedWeapon = dungeon.weapons.length - 1;
			editWeapons( dungeon );
		} );

		// Edit Button
		BuilderTools.button( "Edit", 138, y + 12, () => {
			editWeapon( dungeon );
		} );

		// Draw Weapons
		y += 31;
		for( let i = 0; i < dungeon.weapons.length; i++ ) {
			let hitBox4 = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.setPosPx( x + 3, y + 3 );
			$.print( Util.GetTileId( i ) );
			if( i === dungeon.temp.selectedWeapon ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			}
			$.setColor( "gray" );
			$.rect( hitBox4 );
			$.onclick( function ( mouse, selectedWeapon ) {
				dungeon.temp.selectedWeapon = selectedWeapon;
				editWeapons( dungeon );
			}, false, hitBox4, i );

			x += 18
			if( x > 628 ) {
				x = 2;
				y += 18;
			}
		}

		$.setColor( "white" );
		$.setPosPx( 0, y + 25 );
		let pos = $.getPos();
		$.setPos( pos );
		$.print( " Weapon: " + Util.GetTileId( dungeon.temp.selectedWeapon ) );
		$.print( " Name: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].name );
		$.print( " Damage: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].damage );
		$.print( " Hit Pct: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].hit );
		$.print( " Cost: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].cost );
		$.print( " Store: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].store );
	}

	async function editWeapon( dungeon ) {
		$.clearEvents();
		$.cls();
		$.setColor( "white" );
		$.print( " Edit Weapon: " + Util.GetTileId( dungeon.temp.selectedWeapon ) );
		$.print( " 1. Name: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].name );
		$.print( " 2. Damage: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].damage );
		$.print( " 3. Hit Pct: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].hit );
		$.print( " 4. Cost: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].cost );
		$.print( " 5. Store: " + dungeon.weapons[ dungeon.temp.selectedWeapon ].store );
		$.print( " 6. Done" );

		let choice = -1;
		while( choice < 1 || choice > 6 ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 6 ) {
				$.print( "Invalid selection" );
			}
		}

		let weapon = dungeon.weapons[ dungeon.temp.selectedWeapon ];
		if( choice === 1 ) {
			weapon.name = await $.input( "Enter name: ", null );
		} else if( choice === 2 ) {
			weapon.damage = await $.input( "Enter damage: ", null, true, true, false );
		} else if( choice === 3 ) {
			weapon.hit = await $.input( "Enter hit pct(0-1): ", null, true, false, false );
			if( weapon.hit > 1 ) {
				weapon.hit = 1;
			}
		} else if( choice === 4 ) {
			weapon.cost = await $.input( "Enter cost: ", null, true, true, false );
		} else if( choice === 5 ) {
			weapon.store = await $.input( "Enter store: ", null, true, true, false );
		} else if( choice === 6 ) {
			editWeapons( dungeon, true );
			return;
		}

		editWeapon( dungeon );
	}

	function editArmors( dungeon ) {
		$.cls();
		$.clearEvents();

		let x = 2;
		let y = 2;

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Editing Armors" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 12, () => {
			showMenu( dungeon );
		} );

		// Add Button
		BuilderTools.button( "Add", 70, y + 12, () => {
			dungeon.armors.push( {
				"name": "Cloth",
				"protection": 1,
				"dodge": 0.9,
				"cost": 20,
				"store": 1
			} );
			dungeon.temp.selectedArmor = dungeon.armors.length - 1;
			editArmors( dungeon );
		} );

		// Edit Button
		BuilderTools.button( "Edit", 138, y + 12, () => {
			editArmor( dungeon );
		} );

		// Draw Armors
		y += 31;
		for( let i = 0; i < dungeon.armors.length; i++ ) {
			let hitBox4 = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.setPosPx( x + 3, y + 3 );
			$.print( Util.GetTileId( i ) );
			if( i === dungeon.temp.selectedArmor ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			}
			$.setColor( "gray" );
			$.rect( hitBox4 );
			$.onclick( function ( mouse, selectedArmor ) {
				dungeon.temp.selectedArmor = selectedArmor;
				editArmors( dungeon );
			}, false, hitBox4, i );

			x += 18
			if( x > 628 ) {
				x = 2;
				y += 18;
			}
		}

		$.setColor( "white" );
		$.setPosPx( 0, y + 25 );
		let pos = $.getPos();
		$.setPos( pos );
		$.print( " Armor: " + Util.GetTileId( dungeon.temp.selectedArmor ) );
		$.print( " Name: " + dungeon.armors[ dungeon.temp.selectedArmor ].name );
		$.print( " Damage: " + dungeon.armors[ dungeon.temp.selectedArmor ].protection );
		$.print( " Hit Pct: " + dungeon.armors[ dungeon.temp.selectedArmor ].dodge );
		$.print( " Cost: " + dungeon.armors[ dungeon.temp.selectedArmor ].cost );
		$.print( " Store: " + dungeon.armors[ dungeon.temp.selectedArmor ].store );
	}

	async function editArmor( dungeon ) {
		$.cls();
		$.clearEvents();
		$.setColor( "white" );
		$.print( " Edit Armor: " + Util.GetTileId( dungeon.temp.selectedArmor ) );
		$.print( " 1. Name: " + dungeon.armors[ dungeon.temp.selectedArmor ].name );
		$.print( " 2. Protection: " + dungeon.armors[ dungeon.temp.selectedArmor ].protection );
		$.print( " 3. Dodge Pct: " + dungeon.armors[ dungeon.temp.selectedArmor ].dodge );
		$.print( " 4. Cost: " + dungeon.armors[ dungeon.temp.selectedArmor ].cost );
		$.print( " 5. Store: " + dungeon.armors[ dungeon.temp.selectedArmor ].store );
		$.print( " 6. Done" );

		let choice = -1;
		while( choice < 1 || choice > 6 ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 6 ) {
				$.print( "Invalid selection" );
			}
		}

		let armor = dungeon.armors[ dungeon.temp.selectedArmor ];
		if( choice === 1 ) {
			armor.name = await $.input( "Enter name: ", null );
		} else if( choice === 2 ) {
			armor.protection = await $.input( "Enter protection: ", null, true, true, false );
		} else if( choice === 3 ) {
			armor.dodge = await $.input( "Enter dodge pct(0-1): ", null, true, false, false );
			if( armor.dodge > 1 ) {
				armor.dodge = 1;
			}
		} else if( choice === 4 ) {
			armor.cost = await $.input( "Enter cost: ", null, true, true, false );
		} else if( choice === 5 ) {
			armor.store = await $.input( "Enter store: ", null, true, true, false );
		} else if( choice === 6 ) {
			editArmors( dungeon );
			return;
		}

		editArmor( dungeon );
	}

	function editMaps( dungeon ) {
		$.cls();
		$.clearEvents();

		let x = 2;
		let y = 2;

		$.setColor( "white" );
		$.print( "Editing Maps" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 8, () => {
			showMenu( dungeon );
		} );

		// Edit Paths
		BuilderTools.button( "Edit Paths", 72, y + 8, () => {
			editPaths( dungeon );
		} );

		// Up Level
		BuilderTools.button( "Up", 140, y + 8, () => {
			dungeon.temp.selectedMapLevel -= 1;
			if( dungeon.temp.selectedMapLevel < 0 ) {
				dungeon.maps.unshift( [ "" ] );
				dungeon.temp.selectedMapLevel = 0;
			}
			editMaps( dungeon );
		} );

		// Down Level
		BuilderTools.button( "Down", 210, y + 8, () => {
			dungeon.temp.selectedMapLevel += 1;
			if( dungeon.temp.selectedMapLevel >= dungeon.maps.length ) {
				dungeon.maps.push( [ "" ] );
			}
			editMaps( dungeon );
		} );

		// Clear
		BuilderTools.button( "Clear", 280, y + 8, () => {
			dungeon.maps[ dungeon.temp.selectedMapLevel ] = [ "" ];
			editMaps( dungeon );
		} );

		// Draw Room Selectors
		x = 2;
		y += 28;
		for( let i = -1; i < dungeon.rooms.length; i++ ) {
			$.setPosPx( x + 2, y + 2 );
			if( i === dungeon.temp.selectedRoom ) {
				$.setColor( "white" );
			} else {
				$.setColor( "gray" );
			}
			if( i === -1 ) {
				$.print( ".", true );
			} else {
				$.print( Util.GetTileId( i ), true );
			}
			let hitBox = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.rect( hitBox );
				$.onclick( function ( mouse, selectedRoom ) {
					dungeon.temp.selectedRoom = selectedRoom;
					editMaps( dungeon );
				}, false, hitBox, i );
			x += 18;
			if( x > 628 ) {
				x = 2;
				y += 18;
			}
		}

		x = 6;
		y += 18;

		// Draw Selected Room
		let room = dungeon.rooms[ dungeon.temp.selectedRoom ];
		let startX = x;
		if( room ) {
			for( let col = 0; col < room.data.length; col++ ) {
				for( let row = 0; row < room.data[ col ].length; row += 1 ) {
					let tile = dungeon.tiles[ Util.GetTileIndex( room.data[ col ].charAt( row ) ) ];
					let image = Util.ConvertPutStringToData( dungeon.images[ tile.imageId ] );
					$.put( image, x, y );
					let hitBoxRoom = {
						"x": x,
						"y": y,
						"width": 15,
						"height": 15
					};
					$.onclick( function () {
						
					}, false, hitBoxRoom );
					x += 15;
				}
				x = startX;
				y += 15;
			}
		}

		x = 2;
		y += 2;

		// Get the map data
		let map = dungeon.maps[ dungeon.temp.selectedMapLevel ];

		if( map.length === 0 ) {
			map = [ "." ];
			dungeon.maps[ dungeon.temp.selectedMapLevel ] = map;
		} else {
			// Is top empty
			let emptyRow = false;
			for( let mx = 0; mx < map[ 0 ].length; mx++ ) {
				if( map[ 0 ].charAt( mx ) !== "." ) {
					emptyRow = true;
				}
			}
			if( emptyRow ) {
				map.unshift( ".".padStart( map[ 0 ].length, "." ) );
			}

			// Is bottom empty
			emptyRow = false;
			for( let mx = 0; mx < map[ map.length - 1 ].length; mx++ ) {
				if( map[ map.length - 1 ].charAt( mx ) !== "." ) {
					emptyRow = true;
				}
			}
			if( emptyRow ) {
				map.push( ".".padStart( map[ 0 ].length, "." ) );
			}
		
			// Is left empty
			let emptyCol = false;
			for( let my = 0; my < map.length; my++ ) {
				if( map[ my ].charAt( 0 ) !== "." ) {
					emptyCol = true;
				}
			}
			if( emptyCol ) {
				for( let my = 0; my < map.length; my++ ) {
					map[ my ] = "." + map[ my ];
				}
			}

			// Is left empty
			emptyCol = false;
			for( let my = 0; my < map.length; my++ ) {
				if( map[ my ].charAt( map[ my ].length - 1 ) !== "." ) {
					emptyCol = true;
				}
			}
			if( emptyCol ) {
				for( let my = 0; my < map.length; my++ ) {
					map[ my ] = map[ my ] + ".";
				}
			}

			// Make sure all the same length
			let yMax = 0;
			for( let my = 0; my < map.length; my++ ) {
				if( map[ my ].length > yMax ) {
					yMax = map[ my ].length;
				}
			}
			for( let my = 0; my < map.length; my++ ) {
				if( map[ my ].length < yMax ) {
					map[ my ] = map[ my ].padEnd( yMax, "." );
				}
			}
		}

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Click on the square(s) below to place a room.", true );
		y += 8;

		// Draw Map
		for( let my = 0; my < map.length; my++ ) {
			for( let mx = 0; mx < map[ my ].length; mx++ ) {
				let rect = {
					"x": mx * 15 + 2,
					"y": my * 15 + y + 2,
					"width": 15,
					"height": 15
				};
				if(
					mx === dungeon.temp.selectedQuad[ 0 ] &&
					my === dungeon.temp.selectedQuad[ 1 ]
				) {
					$.setColor( "white" );
				} else {
					$.setColor( "grey" );
				}
				let roomId = map[ my ].charAt( mx );
				if( roomId !== "." ) {
					$.rect( rect );
					$.setPosPx( rect.x + 3, rect.y + 3 );
					$.print( map[ my ].charAt( mx ) );
				} else {
					$.rect( rect );
				}
				$.onclick( function ( mouse, pos ) {
					let line = map[ pos.y ];
					map[ pos.y ] = line.substring( 0, pos.x ) +
						Util.GetTileId( dungeon.temp.selectedRoom ) +
						line.substring( pos.x + 1 );
					dungeon.temp.selectedQuad[ 0 ] = pos.x;
					dungeon.temp.selectedQuad[ 1 ] = pos.y;
					editMaps( dungeon );
				}, false, rect, { "x": mx, "y": my } );
			}
		}
	}

	// Define Builder API
	window.Builder = {
		"editDungeon": editDungeon
	};

} )();
