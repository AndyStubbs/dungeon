Util.LoadAllJson( "../dungeon.json", function ( data ) {
	loadDungeon( data );
} );

function loadDungeon( data ) {
	$.removeAllScreens();
	$.setDefaultPal( data.colors );
	$.screen( { "aspect": "640x400", "willReadFrequently": true } );
	$.setColor( "white" );
	data.temp = {};
	showMenu( data );
}

async function showMenu( data ) {
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
	$.print( "8. Edit Maps" );
	$.print( "9. Reset Dungeon" );
	$.print( "10. Download Dungeon" );

	let choice = -1;
	while( choice < 1 || choice > 10 ) {
		choice = await $.input( "Enter selection: ", null, true, true, false );
		if( choice < 1 || choice > 10 ) {
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
		data.temp.selectedMapLevel = 0;
		editMaps( data );
	} else if( choice === 9 ) {
		resetData( data );
		showMenu( data );
	} else if( choice === 10 ) {
		let temp = data.temp;
		delete data.temp;
		Util.SaveAsJson( data, "dungeon.json" );
		data.temp = temp;
		showMenu( data );
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
		]
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

function editImages( data, isFirst ) {
	$.cls();
	if( isFirst ) {
		$.clearEvents();
	}
	drawImages( data, isFirst, editImages );
	drawBigImage( data, isFirst );

	// Draw Colors
	let width = 12;
	let height = 12;
	for( let i = 0; i < data.colors.length; i++ ) {
		x = i * width + 8;
		y = 200;
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

		if( isFirst ) {
			let hitBox = {
				"x": x,
				"y": y,
				"width": width,
				"height": height
			};
			$.onclick( function ( mouse, selectedColor ) {
				data.temp.selectedColor = selectedColor;
				editImages( data, false );
			}, false, hitBox, i );
		}
	}

	$.setPosPx( 198, 216 );
	$.setColor( "white" );
	$.print( "Editing Images" );

	// Menu Button
	hitBox = {
		"x": 198,
		"y": 232,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
	$.print( "Menu", true );
	$.rect( hitBox );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
			$.print( "Menu", true );
			$.rect( hitBox );
			$.clearEvents();
			setTimeout( function () {
				showMenu( data );
			}, 100 );
		}, false, hitBox );
	}

	if( data.images.length > 153 ) {
		return;
	}

	// Add New Button
	let hitBox2 = {
		"x": 265,
		"y": 232,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox2.x + 6, hitBox2.y + 4 );
	$.print( "Add Image", true );
	$.rect( hitBox2 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox2.x + 6, hitBox2.y + 4 );
			$.print( "Add Image", true );
			$.rect( hitBox2 );
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
			$.clearEvents();
			setTimeout( function () {
				editImages( data, true );
			}, 100 );
		}, false, hitBox2 );
	}
}

function drawImages( data, isFirst, callback ) {
	let x = 8;
	let y = 2;
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
		if( isFirst ) {
			$.onclick( function ( mouse, selectedImage ) {
				data.temp.selectedImage = selectedImage;
				callback( data, false );
			}, false, hitBox, i );
		}
		x += 45;
		if( x > 624 ) {
			x = 8;
			y += 18;
		}
	}
}

function drawBigImage( data, isFirst ) {
	let image = Util.ConvertPutStringToData( data.images[ data.temp.selectedImage ] );
	let width = 12;
	let height = 12;
	for( let i = 0; i < image.length - 1; i++ ) {
		for( let j = 0; j < image[ i ].length - 1; j++ ) {
			let x = j * width + 8;
			let y = i * height + 216;
			let c = image[ i ][ j ];
			if( c === 0 ) {
				$.setColor( "#333333" );
				$.line( x, y, x + width - 1, y + height - 1 );
				$.line( x + width - 1, y, x, y + height - 1 );
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
					//data.images[ data.temp.selectedImage ][ pos.i ][ pos.j ] = data.temp.selectedColor;
					let line = data.images[ data.temp.selectedImage ][ pos.i ];
					data.images[ data.temp.selectedImage ][ pos.i ] = line.substring( 0, pos.j ) +
						data.temp.selectedColor.toString( 32 ) + line.substring( pos.j + 1 );
					//editImages( data, false );
					$.setColor( data.temp.selectedColor );
					$.rect( pos.x, pos.y, width, height, data.temp.selectedColor );
					if( data.temp.selectedColor === 0 ) {
						$.setColor( "#333333" );
						$.line( pos.x, pos.y, pos.x + width - 1, pos.y + height - 1 );
						$.line( pos.x + width - 1, pos.y, pos.x, pos.y + height - 1 );
					}
				}, false, hitBox, { "i": i, "j": j, "x": x, "y": y } );
			}
		}
	}
}

function editTiles( data, isFirst ) {
	$.cls();
	if( isFirst ) {
		$.clearEvents();
	} else {
		data.tiles[ data.temp.selectedTile ].imageId = data.temp.selectedImage;
	}
	drawImages( data, isFirst, editTiles );
	let x = 2;
	let y = 200;

	$.setPosPx( 2, y );
	$.setColor( "white" );
	$.print( "Editing Tiles" );

	// Menu Button
	hitBox = {
		"x": 2,
		"y": y + 8,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
	$.print( "Menu", true );
	$.rect( hitBox );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
			$.print( "Menu", true );
			$.rect( hitBox );
			$.clearEvents();
			setTimeout( function () {
				showMenu( data );
			}, 100 );
		}, false, hitBox );
	}

	// Add Button
	let hitBox2 = {
		"x": 70,
		"y": y + 8,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
	$.print( "Add", true );
	$.rect( hitBox2 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
			$.print( "Add", true );
			$.rect( hitBox2 );
			$.clearEvents();
			data.tiles.push( {
				"imageId": 0,
				"description": ""
			} );
			setTimeout( function () {
				editTiles( data, true );
			}, 100 );
		}, false, hitBox2 );
	}

	// Edit Button
	let hitBox3 = {
		"x": 138,
		"y": y + 8,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox3.x + 22, hitBox3.y + 4 );
	$.print( "Edit", true );
	$.rect( hitBox3 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox3.x + 22, hitBox3.y + 4 );
			$.print( "Edit", true );
			$.rect( hitBox3 );
			$.clearEvents();
			setTimeout( function () {
				//showMenu( data );
				$.cls( 0, hitBox3.y + 40, 500, 15 );
				$.setPosPx( 0, hitBox3.y + 50 );
				let pos = $.getPos();
				$.setPos( pos );
				$.input( " Description: ", function ( txt ) {
					data.tiles[ data.temp.selectedTile ].description = txt;
					editTiles( data, true );
				} );
			}, 100 );
		}, false, hitBox3 );
	}

	// Special Button
	let hitBox4 = {
		"x": 206,
		"y": y + 8,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox4.x + 13, hitBox4.y + 4 );
	$.print( "Special", true );
	$.rect( hitBox4 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox4.x + 13, hitBox4.y + 4 );
			$.print( "Special", true );
			$.rect( hitBox4 );
			$.clearEvents();
			setTimeout( function () {
				setSpecialTile( data );
			}, 100 );
		}, false, hitBox4 );
	}

	y += 70;

	$.setColor( "white" );
	$.setPosPx( 0, hitBox3.y + 18 );
	$.print( " Tile: " + Util.GetTileId( data.temp.selectedTile ) );
	$.setPosPx( 0, hitBox3.y + 29 );
	$.print( " Image Id: " + data.tiles[ data.temp.selectedTile ].imageId );
	$.setPosPx( 0, hitBox3.y + 50 );
	let pos = $.getPos();
	$.setPos( pos );
	$.print( " Description: " + data.tiles[ data.temp.selectedTile ].description );

	// Draw Tiles
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
		if( isFirst ) {
			$.onclick( function ( mouse, selectedTile ) {
				data.temp.selectedTile = selectedTile;
				data.temp.selectedImage = data.tiles[ data.temp.selectedTile ].imageId;
				editTiles( data, false );
			}, false, hitBox, i );
		}
		x += 18
		if( x > 628 ) {
			x = 2;
			y += 18;
		}
	}
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
	$.print( " 9. Reset - Normal Tile" );
	$.print( " 10. Cancel - Go back" );

	let choice = -1;
	while( choice < 1 || choice > 10 ) {
		choice = await $.input( "Enter selection: ", null, true, true, false );
		if( choice < 1 || choice > 10 ) {
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
		delete tile.special;
		delete tile.shop;
	}
	editTiles( data, true );
}

async function editCharacter( data, isFirst ) {
	$.cls();
	if( isFirst ) {
		$.clearEvents();
	} else {
		data.character.imageId = data.temp.selectedImage;
	}

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
		drawImages( data, true, editCharacter );
		$.setPos( 2, 25 );
		$.setColor( "white" );
		$.print( "Use the mouse to select an image from up above." );
		return;
	} else if( choice === 10 ) {
		showMenu( data );
		return;
	}

	editCharacter( data, false );
}

function editObjects( data, isFirst ) {
	$.cls();
	if( isFirst ) {
		$.clearEvents();
	} else {
		data.objects[ data.temp.selectedObject ].imageId = data.temp.selectedImage;
	}
	drawImages( data, isFirst, editObjects );

	let x = 2;
	let y = 200;

	$.setPosPx( 2, y );
	$.setColor( "white" );
	$.print( "Editing Objects/Monsters" );

	// Menu Button
	hitBox = {
		"x": 2,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
	$.print( "Menu", true );
	$.rect( hitBox );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
			$.print( "Menu", true );
			$.rect( hitBox );
			$.clearEvents();
			setTimeout( function () {
				showMenu( data );
			}, 100 );
		}, false, hitBox );
	}

	// Add Button
	let hitBox2 = {
		"x": 70,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
	$.print( "Add", true );
	$.rect( hitBox2 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
			$.print( "Add", true );
			$.rect( hitBox2 );
			$.clearEvents();
			data.objects.push( createObject() );
			setTimeout( function () {
				editObjects( data, true );
			}, 100 );
		}, false, hitBox2 );
	}

	// Edit Button
	let hitBox3 = {
		"x": 138,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox3.x + 22, hitBox3.y + 4 );
	$.print( "Edit", true );
	$.rect( hitBox3 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox3.x + 22, hitBox3.y + 4 );
			$.print( "Edit", true );
			$.rect( hitBox3 );
			$.clearEvents();
			setTimeout( function () { editObject( data ); }, 100 );
		}, false, hitBox3 );
	}

	// Draw Objects
	y += 31;
	for( let i = 0; i < data.objects.length; i++ ) {
		let image = Util.ConvertPutStringToData( data.images[ data.objects[ i ].imageId ] );
		let hitBox = {
			"x": x,
			"y": y,
			"width": 15,
			"height": 15
		};
		$.put( image, x, y );
		if( i === data.temp.selectedObject ) {
			$.setColor( "white" );
			$.rect( x + 1, y + 1, 13, 13 );
		}
		$.setColor( "gray" );
		$.rect( hitBox );
		if( isFirst ) {
			$.onclick( function ( mouse, selectedObject ) {
				data.temp.selectedObject = selectedObject;
				data.temp.selectedImage = data.objects[ data.temp.selectedObject ].imageId;
				editObjects( data, false );
			}, false, hitBox, i );
		}
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
	$.print( " Object: " + Util.GetTileId( data.temp.selectedObject ) );
	$.print( " Image Id: " + data.objects[ data.temp.selectedObject ].imageId );
	$.print( " Name: " + data.objects[ data.temp.selectedObject ].name );
	$.print( " Hits: " + data.objects[ data.temp.selectedObject ].hits );
	$.print( " Level: " + data.objects[ data.temp.selectedObject ].level );
	$.print( " Exp: " + data.objects[ data.temp.selectedObject ].exp );
	$.print( " Is Monster: " + data.objects[ data.temp.selectedObject ].isMonster );
}

async function editObject( data ) {
	$.cls();
	let obj = data.objects[ data.temp.selectedObject ];

	let image = Util.ConvertPutStringToData( data.images[ obj.imageId ] );
	$.put( image, 2, 2 );
	$.print( "\n\n" );
	$.print( " 1. Name: " + obj.name );
	$.print( " 2. Hits: " + obj.hits );
	$.print( " 3. Level: " + obj.level );
	$.print( " 4. Exp: " + obj.exp );
	$.print( " 5. Is Monster: " + obj.isMonster );
	$.print( " 6. Done" );
	let choice = -1;
	while( choice < 1 || choice > 6 ) {
		choice = await $.input( "Enter selection: ", null, true, true, false );
		if( choice < 1 || choice > 6 ) {
			$.print( "Invalid selection" );
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
			await $.input( "Is Monster (y/n): ", null)
		).toLowerCase().charAt( 0 ) === "y";
	} else if( choice === 6 ) {
		editObjects( data, true );
		return;
	}

	editObject( data );
}

function editRooms( data, isFirst ) {
	$.cls();
	let x = 2;
	let y = 2;

	// Draw Tiles
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
		if( isFirst ) {
			$.onclick( function ( mouse, selectedTile ) {
				data.temp.selectedTile = selectedTile;
				data.temp.selectedObject = -1;
				editRooms( data, false );
			}, false, hitBox, i );
		}
		x += 18
		if( x > 628 ) {
			x = 2;
			y += 18;
		}
	}

	// Draw Objects
	x = 2;
	y = 60;
	for( let i = 0; i < data.objects.length; i++ ) {
		let image = Util.ConvertPutStringToData( data.images[ data.objects[ i ].imageId ] );
		let hitBox = {
			"x": x,
			"y": y,
			"width": 15,
			"height": 15
		};
		$.put( image, x, y );
		if( i === data.temp.selectedObject ) {
			$.setColor( "white" );
			$.rect( x + 1, y + 1, 13, 13 );
		}
		$.setColor( "gray" );
		$.rect( hitBox );
		if( isFirst ) {
			$.onclick( function ( mouse, selectedObject ) {
				data.temp.selectedObject = selectedObject;
				data.temp.selectedTile = -1;
				editRooms( data, false );
			}, false, hitBox, i );
		}
		x += 18
		if( x > 628 ) {
			x = 2;
			y += 18;
		}
	}

	$.setPosPx( 2, y + 20 );
	$.setColor( "white" );
	$.print( "Editing Rooms" );

	// Menu Button
	hitBox = {
		"x": 2,
		"y": y + 31,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
	$.print( "Menu", true );
	$.rect( hitBox );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
			$.print( "Menu", true );
			$.rect( hitBox );
			$.clearEvents();
			setTimeout( function () {
				showMenu( data );
			}, 100 );
		}, false, hitBox );
	}

	// Add Button
	let hitBox2 = {
		"x": 70,
		"y": y + 31,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
	$.print( "Add", true );
	$.rect( hitBox2 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
			$.print( "Add", true );
			$.rect( hitBox2 );
			$.clearEvents();
			data.rooms.push( createRoom() );
			setTimeout( function () {
				editRooms( data, true );
			}, 100 );
		}, false, hitBox2 );
	}

	// Edit Button
	let hitBox3 = {
		"x": 138,
		"y": y + 31,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox3.x + 4, hitBox3.y + 4 );
	$.print( "Edit Name", true );
	$.rect( hitBox3 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox3.x + 4, hitBox3.y + 4 );
			$.print( "Edit Name", true );
			$.rect( hitBox3 );
			$.clearEvents();
			setTimeout( async function () {
				$.cls();
				$.setColor( "white" );
				$.print( "Old name: " + data.rooms[ data.temp.selectedRoom ].name );
				data.rooms[ data.temp.selectedRoom ].name = await $.input( "Enter name: ", null );
				editRooms( data, true );
			}, 100 );
		}, false, hitBox3 );
	}

	// Set Trap Button
	let hitBox4 = {
		"x": 206,
		"y": y + 31,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox4.x + 8, hitBox4.y + 4 );
	$.print( "Set Trap", true );
	$.rect( hitBox4 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox4.x + 8, hitBox4.y + 4 );
			$.print( "Set Trap", true );
			$.rect( hitBox4 );
			$.clearEvents();
			data.temp.setTrapStep = 0;
			setTimeout( async function () {
				setTrap( data, true );
			}, 100 );
		}, false, hitBox4 );
	}

	// Replace All Button
	let hitBox5 = {
		"x": 274,
		"y": y + 31,
		"width": 72,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox5.x + 4, hitBox5.y + 4 );
	$.print( "Replace All", true );
	$.rect( hitBox5 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox5.x + 4, hitBox5.y + 4 );
			$.print( "Replace All", true );
			$.rect( hitBox5 );
			$.clearEvents();
			setTimeout( function () {
				if( data.temp.selectedTile > -1 ) {
					let room = data.rooms[ data.temp.selectedRoom ];
					let tileId = Util.GetTileId( data.temp.selectedTile );
					for( let col = 0; col < room.data.length; col++ ) {
						room.data[ col ] = tileId.padStart( room.data[ col ].length, tileId );
					}
				}
				editRooms( data, true );
			}, 100 );
		}, false, hitBox5 );
	}

	// Clear Objects
	let hitBox6 = {
		"x": 352,
		"y": y + 31,
		"width": 72,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox6.x + 4, hitBox6.y + 4 );
	$.print( "Clear Objs", true );
	$.rect( hitBox6 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox6.x + 4, hitBox6.y + 4 );
			$.print( "Clear Objs", true );
			$.rect( hitBox6 );
			$.clearEvents();
			setTimeout( function () {
				let room = data.rooms[ data.temp.selectedRoom ];
				room.objects = [];
				editRooms( data, true );
			}, 100 );
		}, false, hitBox6 );
	}

	// Draw Room Selectors
	x = 2;
	y += 50;
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
		if( isFirst ) {
			$.onclick( function ( mouse, selectedRoom ) {
				data.temp.selectedRoom = selectedRoom;
				editRooms( data, false );
			}, false, hitBox, i );
		}
		x += 18;
		if( x > 628 ) {
			x = 2;
			y += 18;
		}
	}

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
	let room = data.rooms[ data.temp.selectedRoom ];
	let startX = x;
	let startY = y;
	for( let col = 0; col < room.data.length; col++ ) {
		for( let row = 0; row < room.data[ col ].length; row += 1 ) {
			let tile = data.tiles[ Util.GetTileIndex( room.data[ col ].charAt( row ) ) ];
			let image = Util.ConvertPutStringToData( data.images[ tile.imageId ] );
			$.put( image, x, y );
			if( isFirst ) {
				let hitBoxRoom = {
					"x": x,
					"y": y,
					"width": 15,
					"height": 15
				};
				$.onclick( function ( mouse, pos ) {
					if( data.temp.selectedTile !== -1 ) {
						let line = room.data[ col ];
						room.data[ col ] = line.substring( 0, row ) +
							Util.GetTileId( data.temp.selectedTile ) +
							line.substring( row + 1 );
					} else if( data.temp.selectedObject > -1 ) {
						let room = data.rooms[ data.temp.selectedRoom ];
						room.objects.push( {
							"x": pos.x,
							"y": pos.y,
							"id": Util.GetTileId( data.temp.selectedObject )
						} );
					}
					editRooms( data, false );
				}, false, hitBoxRoom, { "x": row, "y": col } );
			}
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
			room.traps[ data.temp.selectedTrap ].imageId = selectedImage;
			setTrap( data, false );
		}, false, hitBox, i );
		x += 45;
		if( x > 624 ) {
			x = 8;
			y += 18;
		}
	}

	// Print the Title
	y += 25;
	$.setPosPx( 0, y );
	$.setPos( $.getPos() );
	$.setColor( "white" );
	$.print( "Editing traps" );

	// Back Button
	let hitBox = {
		"x": 2,
		"y": y + 5,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
	$.print( "Back", true );
	$.rect( hitBox );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
		$.print( "Back", true );
		$.rect( hitBox );
		$.clearEvents();
		setTimeout( function () {
			editRooms( data, true );
		}, 100 );
	}, false, hitBox );

	// Add Button
	let hitBox2 = {
		"x": 70,
		"y": y + 5,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
	$.print( "Add", true );
	$.rect( hitBox2 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
		$.print( "Add", true );
		$.rect( hitBox2 );
		$.clearEvents();
		setTimeout( function () {
			room.traps.push( {
				"imageId": 0,
				"pos": { "x": 0, "y": 0 },
				"spawn": { "x": 0, "y": 0 },
				"dir": { "x": 0, "y": 0 },
				"object": 0
			} );
			data.temp.selectedTrap = room.traps.length - 1;
			setTrap( data );
		}, 100 );
	}, false, hitBox2 );

	// Set Pos Button
	let hitBox3 = {
		"x": 138,
		"y": y + 5,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	if( data.temp.setTrapStep === 0 ) {
		$.setColor( "#33aa33" );
	}
	$.setPosPx( hitBox3.x + 10, hitBox3.y + 4 );
	$.print( "Set Pos", true );
	$.rect( hitBox3 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox3.x + 10, hitBox3.y + 4 );
		$.print( "Set Pos", true );
		$.rect( hitBox3 );
		$.clearEvents();
		setTimeout( function () {
			data.temp.setTrapStep = 0;
			data.temp.selectedTrap = room.traps.length - 1;
			setTrap( data );
		}, 100 );
	}, false, hitBox3 );

	// Set Spawn Button
	let hitBox4 = {
		"x": 206,
		"y": y + 5,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	if( data.temp.setTrapStep === 1 ) {
		$.setColor( "#33aa33" );
	}
	$.setPosPx( hitBox4.x + 6, hitBox4.y + 4 );
	$.print( "Set Spawn", true );
	$.rect( hitBox4 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox4.x + 6, hitBox4.y + 4 );
		$.print( "Set Spawn", true );
		$.rect( hitBox4 );
		$.clearEvents();
		setTimeout( function () {
			data.temp.setTrapStep = 1;
			data.temp.selectedTrap = room.traps.length - 1;
			setTrap( data );
		}, 100 );
	}, false, hitBox4 );

	// Set Direction Button
	let hitBox5 = {
		"x": 275,
		"y": y + 5,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	if( data.temp.setTrapStep === 2 ) {
		$.setColor( "#33aa33" );
	}
	$.setPosPx( hitBox5.x + 6, hitBox5.y + 4 );
	$.print( "Direction", true );
	$.rect( hitBox5 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox5.x + 6, hitBox5.y + 4 );
		$.print( "Direction", true );
		$.rect( hitBox5 );
		$.clearEvents();
		setTimeout( function () {
			data.temp.setTrapStep = 2;
			setTrap( data );
		}, 100 );
	}, false, hitBox5 );

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
			$.onclick( function () {
				let trap = room.traps[ data.temp.selectedTrap ];
				if( trap && data.temp.setTrapStep === 0 ) {
					trap.pos.x = row;
					trap.pos.y = col;
				}
				if( trap && data.temp.setTrapStep === 1 ) {
					trap.spawn.x = row;
					trap.spawn.y = col;
				}
				if( trap && data.temp.setTrapStep === 2 ) {
					trap.dir.x = row;
					trap.dir.y = col;
				}
				setTrap( data );
			}, false, hitBoxRoom, { "col": col, "row": row } );

			x += 15;
		}
		x = startX;
		y += 15;
	}

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
	startX = 320;
	x = startX;
	y = startY;

	$.setColor( "white" );
	$.setPosPx( x, y - 12 );
	$.print( "Select Object/Projectile", true );
	for( let i = 0; i < data.objects.length; i++ ) {
		let image = Util.ConvertPutStringToData( data.images[ data.objects[ i ].imageId ] );
		let hitBox = {
			"x": x,
			"y": y,
			"width": 15,
			"height": 15
		};
		$.put( image, x, y );
		if( i === data.temp.selectedObject ) {
			$.setColor( "white" );
			$.rect( x + 1, y + 1, 13, 13 );
		}
		$.setColor( "gray" );
		$.rect( hitBox );
		$.onclick( function ( mouse, selectedObject ) {
			if( room )
			data.temp.selectedObject = selectedObject;
			let trap = room.traps[ data.temp.selectedTrap ];
			if( trap ) {
				trap.object = data.temp.selectedObject;
			}
			setTrap( data );
		}, false, hitBox, i );
		x += 18
		if( x > 628 ) {
			x = startX;
			y += 18;
		}
	}
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
	let hitBox = {
		"x": 2,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
	$.print( "Menu", true );
	$.rect( hitBox );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
		$.print( "Menu", true );
		$.rect( hitBox );
		$.clearEvents();
		setTimeout( function () {
			showMenu( data );
		}, 100 );
	}, false, hitBox );


	// Add Button
	let hitBox2 = {
		"x": 70,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
	$.print( "Add", true );
	$.rect( hitBox2 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
		$.print( "Add", true );
		$.rect( hitBox2 );
		$.clearEvents();
		data.weapons.push( {
			"name": "Dagger",
			"damage": 2,
			"hit": 0.8,
			"cost": 5,
			"store": 1
		} );
		data.temp.selectedWeapon = data.weapons.length - 1;
		setTimeout( function () {
			editWeapons( data );
		}, 100 );
	}, false, hitBox2 );

	// Edit Button
	let hitBox3 = {
		"x": 138,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox3.x + 22, hitBox3.y + 4 );
	$.print( "Edit", true );
	$.rect( hitBox3 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox3.x + 22, hitBox3.y + 4 );
		$.print( "Edit", true );
		$.rect( hitBox3 );
		$.clearEvents();
		setTimeout( function () { editWeapon( data ); }, 100 );
	}, false, hitBox3 );


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
	let hitBox = {
		"x": 2,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
	$.print( "Menu", true );
	$.rect( hitBox );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox.x + 22, hitBox.y + 4 );
		$.print( "Menu", true );
		$.rect( hitBox );
		$.clearEvents();
		setTimeout( function () {
			showMenu( data );
		}, 100 );
	}, false, hitBox );


	// Add Button
	let hitBox2 = {
		"x": 70,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
	$.print( "Add", true );
	$.rect( hitBox2 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox2.x + 22, hitBox2.y + 4 );
		$.print( "Add", true );
		$.rect( hitBox2 );
		$.clearEvents();
		data.armors.push( {
			"name": "Cloth",
			"protection": 1,
			"dodge": 0.9,
			"cost": 20,
			"store": 1
		} );
		data.temp.selectedWeapon = data.weapons.length - 1;
		setTimeout( function () {
			editArmors( data );
		}, 100 );
	}, false, hitBox2 );

	// Edit Button
	let hitBox3 = {
		"x": 138,
		"y": y + 12,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox3.x + 22, hitBox3.y + 4 );
	$.print( "Edit", true );
	$.rect( hitBox3 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox3.x + 22, hitBox3.y + 4 );
		$.print( "Edit", true );
		$.rect( hitBox3 );
		$.clearEvents();
		setTimeout( function () { editArmor( data ); }, 100 );
	}, false, hitBox3 );


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
	let hitBox = {
		"x": 2,
		"y": y + 8,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox.x + 19, hitBox.y + 4 );
	$.print( "Menu", true );
	$.rect( hitBox );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox.x + 19, hitBox.y + 4 );
		$.print( "Menu", true );
		$.rect( hitBox );
		$.clearEvents();
		setTimeout( function () {
			showMenu( data );
		}, 100 );
	}, false, hitBox );


	// Up Level
	let hitBox2 = {
		"x": 70,
		"y": y + 8,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox2.x + 30, hitBox2.y + 4 );
	$.print( "Up", true );
	$.rect( hitBox2 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox2.x + 30, hitBox2.y + 4 );
		$.print( "Up", true );
		$.rect( hitBox2 );
		$.clearEvents();
		data.temp.selectedMapLevel -= 1;
		if( data.temp.selectedMapLevel < 0 ) {
			data.maps.unshift( [ "" ] );
			data.temp.selectedMapLevel = 0;
		}
		setTimeout( function () {
			editMaps( data );
		}, 100 );
	}, false, hitBox2 );

	// Down Level
	let hitBox3 = {
		"x": 138,
		"y": y + 8,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox3.x + 18, hitBox3.y + 4 );
	$.print( "Down", true );
	$.rect( hitBox3 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox3.x + 18, hitBox3.y + 4 );
		$.print( "Down", true );
		$.rect( hitBox3 );
		$.clearEvents();
		data.temp.selectedMapLevel += 1;
		if( data.temp.selectedMapLevel >= data.maps.length ) {
			data.maps.push( [ "" ] );
		}
		setTimeout( async function () {
			editMaps( data );
		}, 100 );
	}, false, hitBox3 );

	// Clear
	let hitBox4 = {
		"x": 206,
		"y": y + 8,
		"width": 64,
		"height": 16
	};
	$.setColor( "#838383" );
	$.setPosPx( hitBox4.x + 20, hitBox4.y + 4 );
	$.print( "Clear", true );
	$.rect( hitBox4 );
	$.onclick( function () {
		$.setColor( "white" );
		$.setPosPx( hitBox4.x + 20, hitBox4.y + 4 );
		$.print( "Clear", true );
		$.rect( hitBox4 );
		$.clearEvents();
		data.maps[ data.temp.selectedMapLevel ] = [ "" ];
		setTimeout( async function () {
			editMaps( data );
		}, 100 );
	}, false, hitBox4 );

	// Draw Room Selectors
	x = 2;
	y += 28;
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
				if( data.temp.selectedTile !== -1 ) {
					let line = room.data[ col ];
					room.data[ col ] = line.substring( 0, row ) +
						Util.GetTileId( data.temp.selectedTile ) +
						line.substring( row + 1 );
				}
				editRooms( data, false );
			}, false, hitBoxRoom );
			x += 15;
		}
		x = startX;
		y += 15;
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
