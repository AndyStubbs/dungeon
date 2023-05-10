"use strict";

( function () {

	function editDungeon( data ) {
		$.removeAllScreens();
		$.setDefaultPal( data.colors );
		$.screen( { "aspect": "640x400", "willReadFrequently": true } );
		$.setColor( "white" );
		data.temp = {};
		showMenu( data );
	}

	async function showMenu( data ) {
		$.clearEvents();
		$.cls();
		$.print( "Name: " + data.name );
		$.print( "Colors: " + data.colors.length );
		$.print( "Images: " + data.images.length );
		$.print( "Tiles: " + data.tiles.length );
		$.print( "Rooms: " + data.rooms.length );
		$.print( "Objects: " + data.objects.length );
		$.print( "Weapons: " + data.weapons.length );
		$.print( "Armors: " + data.armors.length );
		$.print( "" );
		$.print( "1. Edit Images" );
		$.print( "2. Edit Tiles" );
		$.print( "3. Edit Character" );
		$.print( "4. Edit Objects/Monsters" );
		$.print( "5. Edit Rooms" );
		$.print( "6. Edit Weapons" );
		$.print( "7. Edit Armors" );
		$.print( "8. Edit Paths/Map" );
		$.print( "9. Reset Dungeon" );
		$.print( "10. Download Dungeon" );
		$.print( "11. Done Building" );

		let choice = -1;
		while( choice < 1 || choice > 11 ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 11 ) {
				$.print( "Invalid selection" );
			}
		}

		if( choice === 1 ) {
			data.temp.selectedImage = 0;
			data.temp.selectedColor = 0;
			editImages( data, true );
		} else if( choice === 2 ) {
			data.temp.selectedImage = 0;
			data.temp.selectedTile = 0;
			editTiles( data, true );
		} else if( choice === 3 ) {
			data.temp.selectedImage = data.character.imageId;
			editCharacter( data, true );
		} else if( choice === 4 ) {
			data.temp.selectedObject = 0;
			data.temp.selectedImage = data.objects[ data.temp.selectedObject ].imageId;
			editObjects( data, true );
		} else if( choice === 5 ) {
			data.temp.selectedTile = 0;
			data.temp.selectedObject = -1;
			data.temp.setTrapStep = -1;
			data.temp.selectedRoom = 0;
			editRooms( data, true );
		} else if( choice === 6 ) {
			data.temp.selectedWeapon = 0;
			editWeapons( data );
		} else if( choice === 7 ) {
			data.temp.selectedArmor = 0;
			editArmors( data );
		} else if( choice === 8 ) {
			data.temp.selectedRoom = 0;
			editPaths( data );
		} else if( choice === 9 ) {
			resetData( data );
			showMenu( data );
		} else if( choice === 10 ) {
			let temp = data.temp;
			delete data.temp;
			Util.SaveAsJson( data, "dungeon.json" );
			data.temp = temp;
			showMenu( data );
		} else if( choice === 11 ) {
			window.Start.init();
		}
	}

	function resetData( data ) {
		data.name = "Dungeon";
		data.rooms = [];
		data.tiles =  [
			{
				"imageId":  0,
				"description": "the floor"
			}
		];
		data.colors = [
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
		data.character = {
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
		data.weapons = [
			{
				"name": "Hands",
				"damage": 1,
				"hit": 0.9
			}
		];
		data.armors = [
			{
				"name": "Skin",
				"protection": 0,
				"dodge": 1
			}
		];
		data.objects = [ createObject() ];
		data.rooms = [ createRoom() ];
		data.images =  [
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

	function editImages( data ) {
		$.cls();
		$.clearEvents();
		BuilderTools.drawImages( data, 8, 2, editImages );
		BuilderTools.drawBigImage( data, 8, 216 );
		BuilderTools.drawColors( data, 2, 200, editImages );

		$.setPosPx( 198, 216 );
		$.setColor( "white" );
		$.print( "Editing Images" );

		// Menu Button
		BuilderTools.button( "Menu", 198, 232, () => { showMenu( data ); } );

		if( data.images.length > 153 ) {
			return;
		}

		// Add New Button
		BuilderTools.button( "Add New", 265, 232, () => {
			data.images.push( [
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
			editImages( data );
		} );
	}

	function editTiles( data ) {
		$.cls();
		$.clearEvents();
		data.tiles[ data.temp.selectedTile ].imageId = data.temp.selectedImage;
		BuilderTools.drawImages( data, 8, 2, editTiles );

		let x = 2;
		let y = 200;

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Editing Tiles" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 10, () => { showMenu( data ); } );

		// Add Button
		BuilderTools.button( "Add", 70, y + 10, () => {
			data.tiles.push( {
				"imageId": 0,
				"description": ""
			} );
			editTiles( data );
		} );

		// Edit Button
		BuilderTools.button( "Edit", 138, y + 10, () => { 
			$.cls( 0, y + 48, 500, 16 );
			$.setPosPx( 0, y + 58 );
			let pos = $.getPos();
			$.setPos( pos );
			$.input( " Description: ", function ( txt ) {
				data.tiles[ data.temp.selectedTile ].description = txt;
				editTiles( data, true );
			} );
		} );

		// Special Button
		BuilderTools.button( "Special", 206, y + 10, () => {
			setSpecialTile( data );
		} );

		$.setColor( "white" );
		$.setPosPx( 0, y + 88 );
		$.print( " Tile: " + Util.GetTileId( data.temp.selectedTile ) );
		$.setPosPx( 0, y + 99 );
		$.print( " Image Id: " + data.tiles[ data.temp.selectedTile ].imageId );

		$.setPosPx( 120, y + 88 );
		if( data.tiles[ data.temp.selectedTile ].special ) {
			$.print( " Special: " +  data.tiles[ data.temp.selectedTile ].special );
		} else {
			$.print( " Special: " );
		}

		$.setPosPx( 120, y + 99 );
		if( data.tiles[ data.temp.selectedTile ].floor ) {
			$.print( " Floor: " +  data.tiles[ data.temp.selectedTile ].floor );
		} else {
			$.print( " Floor: 0" );
		}

		$.setPosPx( 300, y + 88 );
		if( data.tiles[ data.temp.selectedTile ].water ) {
			$.print( " Water: " +  data.tiles[ data.temp.selectedTile ].water );
		} else {
			$.print( " Water: 0" );
		}

		$.setPosPx( 300, y + 99 );
		if( data.tiles[ data.temp.selectedTile ].lava ) {
			$.print( " Lava: " +  data.tiles[ data.temp.selectedTile ].lava );
		} else {
			$.print( " Lava: 0" );
		}

		$.setPosPx( 420, y + 88 );
		if( data.tiles[ data.temp.selectedTile ].void ) {
			$.print( " Void: " +  data.tiles[ data.temp.selectedTile ].void );
		} else {
			$.print( " Void: 0" );
		}

		$.setPosPx( 0, y + 120 );
		let pos = $.getPos();
		$.setPos( pos );
		$.print( " Description: " + data.tiles[ data.temp.selectedTile ].description );

		BuilderTools.drawTiles( data, x, y + 30, editTiles );
	}

	async function setSpecialTile( data ) {
		$.cls();
		$.clearEvents();
		let tile = data.tiles[ data.temp.selectedTile ];
		let image = Util.ConvertPutStringToData( data.images[ tile.imageId ] );
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
		$.print( " 14. Shop Level" );
		$.print( " 15. Cancel - Go back" );

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
		editTiles( data, true );
	}

	async function editCharacter( data ) {
		$.cls();
		$.clearEvents();

		$.print( "Edit Character" );
		$.print( "1. Name: " + data.character.name );
		$.print( "2. Gold: " + data.character.gold );
		$.print( "3. Hits: " + data.character.hits );
		$.print( "4. Level: " + data.character.level );
		$.print( "5. Potion: " + data.character.potion );
		$.print( "6. Keys: " + data.character.keys );
		$.print( "7. Weapon: " + data.weapons[ data.character.weaponId ].name );
		$.print( "8. Armor: " + data.armors[ data.character.armorId ].name );
		$.print( "9. Image: " );
		$.print( "\n" );
		$.print( "10. Go back to menu" );

		let image = Util.ConvertPutStringToData( data.images[ data.character.imageId ] );
		$.put( image, 55, 78 );

		let choice = -1;
		while( choice < 1 || choice > 10 ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 10 ) {
				$.print( "Invalid selection" );
			}
		}

		if( choice === 1 ) {
			data.character.name = await $.input( "Enter name: ", null );
		} else if( choice === 2 ) {
			data.character.gold = await $.input( "Enter gold: ", null, true, true, false );
		} else if( choice === 3 ) {
			data.character.hits = await $.input( "Enter hits: ", null, true, true, false );
		} else if( choice === 4 ) {
			data.character.level = await $.input( "Enter level: ", null, true, true, false );
		} else if( choice === 5 ) {
			data.character.potion = await $.input( "Enter potion: ", null, true, true, false );
		} else if( choice === 6 ) {
			data.character.keys = await $.input( "Enter keys: ", null, true, true, false );
		} else if( choice === 7 ) {
			$.print( "\nWeapons:" );
			for( let i = 0; i < data.weapons.length; i++ ) {
				$.print(
					( i + 1 ) + ". " +
					data.weapons[ i ].name + " " +
					data.weapons[ i ].damage + " " +
					data.weapons[ i ].hit
				);
			}
			let weaponChoice = -1;
			while( weaponChoice < 1 || weaponChoice > data.weapons.length ) {
				weaponChoice = await $.input( "Enter selection: ", null, true, true, false );
				if( weaponChoice < 1 || weaponChoice > data.weapons.length ) {
					$.print( "Invalid selection" );
				}
			}
			data.character.weaponId = weaponChoice - 1;
		} else if( choice === 8 ) {
			$.print( "\nArmors:" );
			for( let i = 0; i < data.armors.length; i++ ) {
				$.print(
					( i + 1 ) + ". " +
					data.armors[ i ].name + " " +
					data.armors[ i ].protection + " " +
					data.armors[ i ].dodge
				);
			}
			let armorChoice = -1;
			while( armorChoice < 1 || armorChoice > data.armors.length ) {
				armorChoice = await $.input( "Enter selection: ", null, true, true, false );
				if( armorChoice < 1 || armorChoice > data.armors.length ) {
					$.print( "Invalid selection" );
				}
			}
			data.character.armorId = armorChoice - 1;
		} else if( choice === 9 ) {
			data.temp.selectedImage = data.character.imageId;
			$.cls();
			$.clearEvents();
			BuilderTools.drawImages( data, 2, 8, () => {
				data.character.imageId = data.temp.selectedImage;
				editCharacter( data );
			} );
			$.setPos( 2, 25 );
			$.setColor( "white" );
			$.print( "Use the mouse to select an image from up above." );
			return;
		} else if( choice === 10 ) {
			showMenu( data );
			return;
		}

		editCharacter( data );
	}

	function editObjects( data ) {
		$.cls();
		$.clearEvents();

		BuilderTools.drawImages( data, 2, 8, () => {
			data.objects[ data.temp.selectedObject ].imageId = data.temp.selectedImage;
			editObjects( data );
		} );

		let x = 2;
		let y = 200;

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Editing Objects/Monsters" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 12, () => { showMenu( data ); } );

		// Add Button
		BuilderTools.button( "Add", 70, y + 12, () => {
			data.objects.push( createObject() );
			editObjects( data );
		} );

		// Edit Button
		BuilderTools.button( "Edit", 138, y + 12, () => {
			editObject( data );
		} );

		// Draw Objects
		y += 31;
		BuilderTools.drawObjects( data, x, y, false, false, editObjects );

		$.setColor( "white" );
		$.setPosPx( 0, y + 25 );
		let pos = $.getPos();
		let obj = data.objects[ data.temp.selectedObject ];
		if( obj.dropChance === undefined ) {
			obj.dropChance = 0;
		}
		$.setPos( pos );
		$.print( " Object: " + Util.GetTileId( data.temp.selectedObject ) );
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

	async function editObject( data ) {
		$.cls();
		$.clearEvents();

		let obj = data.objects[ data.temp.selectedObject ];
		let image = Util.ConvertPutStringToData( data.images[ obj.imageId ] );
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
				data.images[ data.objects[ obj.projectile ].imageId ]
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
			editProjectile( data );
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
			editObjects( data, true );
			return;
		}

		editObject( data );
	}

	function editProjectile( data ) {
		$.clearEvents();
		$.cls();
		$.setColor( "white" );
		$.print( "Select projectile" );
		let x = 2;
		let y = 16;
		let selectedObject = data.objects[ data.temp.selectedObject ];
		if( selectedObject.projectile ) {
			let image = Util.ConvertPutStringToData(
				data.images[ data.objects[ selectedObject.projectile ].imageId ]
			);
			$.put( image, x, y );
		}

		// Draw Objects
		y += 31;
		BuilderTools.drawObjects( data, x, y, true, false, () => {
			selectedObject.projectile = data.temp.selectedObject;
			data.temp.selectedObject = data.objects.indexOf( selectedObject );
			editProjectile( data );
		} );

		// Add Button
		BuilderTools.button( "Done", 2, 100, () => {
			editObject( data );
		} );
	}

	function editRooms( data ) {
		$.cls();
		$.clearEvents();

		let x = 2;
		let y = 2;

		// Draw Tiles
		BuilderTools.drawTiles( data, x, y, () => {
			data.temp.selectedObject = -1;
			editRooms( data );
		} );

		// Draw Objects
		x = 2;
		y = 60;
		BuilderTools.drawObjects( data, x, y, false, true, () => {
			data.temp.selectedTile = -1;
			editRooms( data );
		} );

		$.setPosPx( 2, y + 20 );
		$.setColor( "white" );
		$.print( "Editing Rooms" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 31, () => { showMenu( data ); } );

		// Add Button
		BuilderTools.button( "Add", 70, y + 31, () => {
			data.rooms.push( createRoom() );
			editRooms( data );
		} );

		// Edit Button
		BuilderTools.button( "Edit Name", 138, y + 31, async () => {
			$.cls();
			$.setColor( "white" );
			$.print( " Old name: " + data.rooms[ data.temp.selectedRoom ].name );
			data.rooms[ data.temp.selectedRoom ].name = await $.input( " Enter name: ", null );
			editRooms( data );
		} );

		// Set Trap Button
		BuilderTools.button( "Set Trap", 206, y + 31, async () => {
			data.temp.setTrapStep = 0;
			setTrap( data );
		} );

		// Replace All Button
		BuilderTools.button( "Set All", 274, y + 31, async () => {
			if( data.temp.selectedTile > -1 ) {
				let room = data.rooms[ data.temp.selectedRoom ];
				let tileId = Util.GetTileId( data.temp.selectedTile );
				for( let col = 0; col < room.data.length; col++ ) {
					room.data[ col ] = tileId.padStart( room.data[ col ].length, tileId );
				}
			}
			editRooms( data );
		} );

		// Clear Objects
		BuilderTools.button( "Clear Obj", 342, y + 31, () => {
			let room = data.rooms[ data.temp.selectedRoom ];
			room.objects = [];
			editRooms( data );
		} );

		// Edit Paths
		BuilderTools.button( "Edit Paths", 410, y + 31, () => {
			editPaths( data );
		} );

		// Draw Room Selectors
		x = 2;
		y += 50;
		BuilderTools.drawRoomSelectors( data, x, y, () => {
			editRooms( data );
		} );

		$.setColor( "white" );
		$.setPosPx( 0, y + 20 );
		let pos = $.getPos();
		$.setPos( pos );
		$.print( " Room: " + Util.GetTileId( data.temp.selectedRoom ) );
		$.print( " Name: " + data.rooms[ data.temp.selectedRoom ].name );
		$.print( " Objects: " + data.rooms[ data.temp.selectedRoom ].objects.length );
		$.print( " Traps: " + data.rooms[ data.temp.selectedRoom ].traps.length );

		x = 6;
		y = $.getPosPx().y + 6;
		BuilderTools.drawRoom( data, x, y, ( pos ) => {
			if( data.temp.selectedTile !== -1 ) {
				let room = data.rooms[ data.temp.selectedRoom ];
				let line = room.data[ pos.y ];
				room.data[ pos.y ] = line.substring( 0, pos.x ) +
					Util.GetTileId( data.temp.selectedTile ) +
					line.substring( pos.x + 1 );
			} else if( data.temp.selectedObject > -1 ) {
				let room = data.rooms[ data.temp.selectedRoom ];
				if( data.temp.selectedObject < data.objects.length ) {
					room.objects.push( {
						"x": pos.x,
						"y": pos.y,
						"id": Util.GetTileId( data.temp.selectedObject )
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
			editRooms( data );
		} );
	}

	function setTrap( data ) {
		$.cls();
		$.clearEvents();
		let room =  data.rooms[ data.temp.selectedRoom ];
		let x = 2;
		let y = 2;

		if( ! data.temp.setTrapStep ) {
			data.temp.setTrapStep = 0;
		}

		let trap = room.traps[ data.temp.selectedTrap ];

		if( trap ) {
			data.temp.selectedImage = trap.imageId;
			data.temp.selectedObject = trap.object;
		}

		// Draw Images
		BuilderTools.drawImages( data, 8, 2, () => {
			if( room.traps[ data.temp.selectedTrap ] ) {
				room.traps[ data.temp.selectedTrap ].imageId = data.temp.selectedImage;
			}
			setTrap( data );
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
			editRooms( data );
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
			data.temp.selectedTrap = room.traps.length - 1;
			setTrap( data );
		} );

		// Set Pos Button
		BuilderTools.button( "Set Pos", 138, y + 5, () => {
			data.temp.setTrapStep = 0;
			data.temp.selectedTrap = room.traps.length - 1;
			setTrap( data );
		}, data.temp.setTrapStep === 0 );

		// Set Spawn Button
		BuilderTools.button( "Set Spawn", 206, y + 5, () => {
			data.temp.setTrapStep = 1;
			data.temp.selectedTrap = room.traps.length - 1;
			setTrap( data );
		}, data.temp.setTrapStep === 1 );

		// Set Direction Button
		BuilderTools.button( "Direction", 275, y + 5, () => {
			data.temp.setTrapStep = 2;
			setTrap( data );
		}, data.temp.setTrapStep === 2 );

		x = 2;
		y += 25;

		// Draw Traps
		for( let i = 0; i < room.traps.length; i++ ) {
			let image = Util.ConvertPutStringToData( data.images[ room.traps[ i ].imageId ] );
			let hitBox = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.put( image, x, y );
			if( i === data.temp.selectedTrap ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			}
			$.setColor( "gray" );
			$.rect( hitBox );

			$.onclick( function ( mouse, selectedTrap ) {
				data.temp.selectedTrap = selectedTrap;
				setTrap( data );
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
		BuilderTools.drawRoom( data, x, y, ( pos ) => {
			if( data.temp.selectedObject > -1 ) {
				let trap = room.traps[ data.temp.selectedTrap ];
				if( trap && data.temp.setTrapStep === 0 ) {
					trap.pos.x = pos.x;
					trap.pos.y = pos.y;
				}
				if( trap && data.temp.setTrapStep === 1 ) {
					trap.spawn.x = pos.x;
					trap.spawn.y = pos.y;
				}
				if( trap && data.temp.setTrapStep === 2 ) {
					trap.dir.x = pos.x;
					trap.dir.y = pos.y;
				}
				setTrap( data );
			}
			setTrap( data );
		} );
		let startX = x;
		let startY = y;

		// Draw Trap
		if( trap ) {
			let image = Util.ConvertPutStringToData( data.images[ trap.imageId ] );
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
		
		BuilderTools.drawObjects( data, x, y, false, false, () => {
			let trap = room.traps[ data.temp.selectedTrap ];
			if( trap ) {
				trap.object = data.temp.selectedObject;
			}
			setTrap( data );
		} );
	}

	function editPaths( data ) {
		let room = data.rooms[ data.temp.selectedRoom ];
		$.cls();
		$.clearEvents();
		$.setPos( 1, 2 );
		$.setColor( "white" );
		$.print( "Editing Paths - Room " + Util.GetTileId( data.temp.selectedRoom ) );
		
		let x = 2;
		let y = 28;

		BuilderTools.button( "Menu", 2, y, () => { showMenu( data ); } );

		y += 18;
		BuilderTools.drawRoomSelectors( data, x, y, () => {
			editPaths( data );
		} );

		y += 18;
		BuilderTools.drawRoom( data, x, y, ( pos ) => {} );

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
			let tempRoom = data.temp.selectedRoom;

			data.temp.selectedRoom = Util.GetTileIndex( room.paths.charAt( i ) );
			BuilderTools.drawRoomSelectors( data, x, y, () => {
				let roomId = "";
				if( data.temp.selectedRoom === -1 ) {
					roomId = " ";
				} else {
					roomId = Util.GetTileId( data.temp.selectedRoom );
				}
				room.paths = room.paths.substring( 0, i ) + roomId + room.paths.substring( i + 1 );
				data.temp.selectedRoom = data.rooms.indexOf( room );
				editPaths( data );
			}, true );
			data.temp.selectedRoom = tempRoom;
			y += 22;
		} );
	}

	function editWeapons( data ) {
		$.cls();
		$.clearEvents();

		let x = 2;
		let y = 2;

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Editing Weapons" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 12, () => {
			showMenu( data );
		} );

		// Add Button
		BuilderTools.button( "Add", 70, y + 12, () => {
			data.weapons.push( {
				"name": "Dagger",
				"damage": 2,
				"hit": 0.8,
				"cost": 5,
				"store": 1
			} );
			data.temp.selectedWeapon = data.weapons.length - 1;
			editWeapons( data );
		} );

		// Edit Button
		BuilderTools.button( "Edit", 138, y + 12, () => {
			editWeapon( data );
		} );

		// Draw Weapons
		y += 31;
		for( let i = 0; i < data.weapons.length; i++ ) {
			let hitBox4 = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.setPosPx( x + 3, y + 3 );
			$.print( Util.GetTileId( i ) );
			if( i === data.temp.selectedWeapon ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			}
			$.setColor( "gray" );
			$.rect( hitBox4 );
			$.onclick( function ( mouse, selectedWeapon ) {
				data.temp.selectedWeapon = selectedWeapon;
				editWeapons( data );
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
		$.print( " Weapon: " + Util.GetTileId( data.temp.selectedWeapon ) );
		$.print( " Name: " + data.weapons[ data.temp.selectedWeapon ].name );
		$.print( " Damage: " + data.weapons[ data.temp.selectedWeapon ].damage );
		$.print( " Hit Pct: " + data.weapons[ data.temp.selectedWeapon ].hit );
		$.print( " Cost: " + data.weapons[ data.temp.selectedWeapon ].cost );
		$.print( " Store: " + data.weapons[ data.temp.selectedWeapon ].store );
	}

	async function editWeapon( data ) {
		$.clearEvents();
		$.cls();
		$.setColor( "white" );
		$.print( " Edit Weapon: " + Util.GetTileId( data.temp.selectedWeapon ) );
		$.print( " 1. Name: " + data.weapons[ data.temp.selectedWeapon ].name );
		$.print( " 2. Damage: " + data.weapons[ data.temp.selectedWeapon ].damage );
		$.print( " 3. Hit Pct: " + data.weapons[ data.temp.selectedWeapon ].hit );
		$.print( " 4. Cost: " + data.weapons[ data.temp.selectedWeapon ].cost );
		$.print( " 5. Store: " + data.weapons[ data.temp.selectedWeapon ].store );
		$.print( " 6. Done" );

		let choice = -1;
		while( choice < 1 || choice > 6 ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 6 ) {
				$.print( "Invalid selection" );
			}
		}

		let weapon = data.weapons[ data.temp.selectedWeapon ];
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
			editWeapons( data, true );
			return;
		}

		editWeapon( data );
	}

	function editArmors( data ) {
		$.cls();
		$.clearEvents();

		let x = 2;
		let y = 2;

		$.setPosPx( 2, y );
		$.setColor( "white" );
		$.print( "Editing Armors" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 12, () => {
			showMenu( data );
		} );

		// Add Button
		BuilderTools.button( "Add", 70, y + 12, () => {
			data.armors.push( {
				"name": "Cloth",
				"protection": 1,
				"dodge": 0.9,
				"cost": 20,
				"store": 1
			} );
			data.temp.selectedArmor = data.armors.length - 1;
			editArmors( data );
		} );

		// Edit Button
		BuilderTools.button( "Edit", 138, y + 12, () => {
			editArmor( data );
		} );

		// Draw Armors
		y += 31;
		for( let i = 0; i < data.armors.length; i++ ) {
			let hitBox4 = {
				"x": x,
				"y": y,
				"width": 15,
				"height": 15
			};
			$.setPosPx( x + 3, y + 3 );
			$.print( Util.GetTileId( i ) );
			if( i === data.temp.selectedArmor ) {
				$.setColor( "white" );
				$.rect( x + 1, y + 1, 13, 13 );
			}
			$.setColor( "gray" );
			$.rect( hitBox4 );
			$.onclick( function ( mouse, selectedArmor ) {
				data.temp.selectedArmor = selectedArmor;
				editArmors( data );
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
		$.print( " Armor: " + Util.GetTileId( data.temp.selectedArmor ) );
		$.print( " Name: " + data.armors[ data.temp.selectedArmor ].name );
		$.print( " Damage: " + data.armors[ data.temp.selectedArmor ].protection );
		$.print( " Hit Pct: " + data.armors[ data.temp.selectedArmor ].dodge );
		$.print( " Cost: " + data.armors[ data.temp.selectedArmor ].cost );
		$.print( " Store: " + data.armors[ data.temp.selectedArmor ].store );
	}

	async function editArmor( data ) {
		$.cls();
		$.clearEvents();
		$.setColor( "white" );
		$.print( " Edit Armor: " + Util.GetTileId( data.temp.selectedArmor ) );
		$.print( " 1. Name: " + data.armors[ data.temp.selectedArmor ].name );
		$.print( " 2. Protection: " + data.armors[ data.temp.selectedArmor ].protection );
		$.print( " 3. Dodge Pct: " + data.armors[ data.temp.selectedArmor ].dodge );
		$.print( " 4. Cost: " + data.armors[ data.temp.selectedArmor ].cost );
		$.print( " 5. Store: " + data.armors[ data.temp.selectedArmor ].store );
		$.print( " 6. Done" );

		let choice = -1;
		while( choice < 1 || choice > 6 ) {
			choice = await $.input( "Enter selection: ", null, true, true, false );
			if( choice < 1 || choice > 6 ) {
				$.print( "Invalid selection" );
			}
		}

		let armor = data.armors[ data.temp.selectedArmor ];
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
			editArmors( data );
			return;
		}

		editArmor( data );
	}

	function editMaps( data ) {
		$.cls();
		$.clearEvents();

		let x = 2;
		let y = 2;

		$.setColor( "white" );
		$.print( "Editing Maps" );

		// Menu Button
		BuilderTools.button( "Menu", 2, y + 8, () => {
			showMenu( data );
		} );

		// Up Level
		BuilderTools.button( "Up", 70, y + 8, () => {
			data.temp.selectedMapLevel -= 1;
			if( data.temp.selectedMapLevel < 0 ) {
				data.maps.unshift( [ "" ] );
				data.temp.selectedMapLevel = 0;
			}
			editMaps( data );
		} );

		// Down Level
		BuilderTools.button( "Down", 138, y + 8, () => {
			data.temp.selectedMapLevel += 1;
			if( data.temp.selectedMapLevel >= data.maps.length ) {
				data.maps.push( [ "" ] );
			}
			editMaps( data );
		} );

		// Clear
		BuilderTools.button( "Clear", 206, y + 8, () => {
			data.maps[ data.temp.selectedMapLevel ] = [ "" ];
			editMaps( data );
		} );

		// Draw Room Selectors
		x = 2;
		y += 28;
		for( let i = -1; i < data.rooms.length; i++ ) {
			$.setPosPx( x + 2, y + 2 );
			if( i === data.temp.selectedRoom ) {
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
					data.temp.selectedRoom = selectedRoom;
					editMaps( data );
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
		let room = data.rooms[ data.temp.selectedRoom ];
		let startX = x;
		if( room ) {
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
		let map = data.maps[ data.temp.selectedMapLevel ];

		if( map.length === 0 ) {
			map = [ "." ];
			data.maps[ data.temp.selectedMapLevel ] = map;
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
				rect = {
					"x": mx * 15 + 2,
					"y": my * 15 + y + 2,
					"width": 15,
					"height": 15
				};
				let roomId = map[ my ].charAt( mx );
				if( roomId !== "." ) {
					$.setColor( "white" );
					$.rect( rect );
					$.setPosPx( rect.x + 3, rect.y + 3 );
					$.print( map[ my ].charAt( mx ) );
				} else {
					$.setColor( "grey" );
					$.rect( rect );
				}
				$.onclick( function ( mouse, pos ) {
					let line = map[ pos.y ];
					map[ pos.y ] = line.substring( 0, pos.x ) +
						Util.GetTileId( data.temp.selectedRoom ) +
						line.substring( pos.x + 1 );
					editMaps( data );
				}, false, rect, { "x": mx, "y": my } );
			}
		}

	}

	// Define Builder API
	window.Builder = {
		"editDungeon": editDungeon
	};

} )();
