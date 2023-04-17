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
	$.cls();
	$.print( "Name: " + data.name );
	$.print( "Colors: " + data.colors.length );
	$.print( "Images: " + data.images.length );
	$.print( "Tiles: " + data.tiles.length );
	$.print( "Rooms: " + data.rooms.length );
	$.print( "" );
	$.print( "1. Edit Images" );
	$.print( "2. Edit Tiles" );
	$.print( "3. Edit Character" );
	$.print( "4. Edit Objects/Monsters" );
	$.print( "5. Edit Rooms" );
	$.print( "6. Reset Dungeon" );

	let choice = -1;
	while( choice < 1 || choice > 6 ) {
		choice = await $.input( "Enter selection: ", null, true, true, false );
		if( choice < 1 || choice > 6 ) {
			$.print( "Invalid selection" );
		}
	}

	if( choice === 1 ) {
		data.selectedImage = 0;
		data.selectedColor = 0;
		editImages( data, true );
	} else if( choice === 2 ) {
		data.selectedImage = 0;
		data.selectedTile = 0;
		editTiles( data, true );
	} else if( choice === 3 ) {
		data.selectedImage = data.character.imageId;
		editCharacter( data, true );
	} else if( choice === 4 ) {
		data.selectedObject = 0;
		data.selectedImage = data.objects[ data.selectedObject ].imageId;
		editObjects( data, true );
	} else if( choice === 5 ) {
		data.selectedTile = 0;
		data.selectedObject = -1;
		data.selectedRoom = 0;
		editRooms( data, true );
	} else if( choice === 6 ) {
		resetData( data );
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
		if( i === data.selectedColor ) {
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
	let image = Util.ConvertPutStringToData( data.images[ data.selectedImage ] );
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
					//data.images[ data.selectedImage ][ pos.i ][ pos.j ] = data.selectedColor;
					let line = data.images[ data.selectedImage ][ pos.i ];
					data.images[ data.selectedImage ][ pos.i ] = line.substring( 0, pos.j ) +
						data.selectedColor.toString( 32 ) + line.substring( pos.j + 1 );
					//editImages( data, false );
					$.setColor( data.selectedColor );
					$.rect( pos.x, pos.y, width, height, data.selectedColor );
					if( data.selectedColor === 0 ) {
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
		data.tiles[ data.selectedTile ].imageId = data.selectedImage;
	}
	drawImages( data, isFirst, editTiles );
	let x = 2;
	let y = 200;
	for( let i = 0; i < data.tiles.length; i++ ) {
		let image = Util.ConvertPutStringToData( data.images[ data.tiles[ i ].imageId ] );
		let hitBox = {
			"x": x,
			"y": y,
			"width": 15,
			"height": 15
		};
		$.put( image, x, y );
		if( i === data.selectedTile ) {
			$.setColor( "white" );
			$.rect( x + 1, y + 1, 13, 13 );
		}
		$.setColor( "gray" );
		$.rect( hitBox );
		if( isFirst ) {
			$.onclick( function ( mouse, selectedTile ) {
				data.selectedTile = selectedTile;
				data.selectedImage = data.tiles[ data.selectedTile ].imageId;
				editTiles( data, false );
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
	$.print( "Editing Tiles" );

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
		"y": y + 31,
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
				$.cls( 0, hitBox3.y + 40, 500, 30 );
				$.setPosPx( 0, hitBox3.y + 50 );
				let pos = $.getPos();
				$.setPos( pos );
				$.input( " Description: ", function ( txt ) {
					data.tiles[ data.selectedTile ].description = txt;
					editTiles( data, true );
				} );
			}, 100 );
		}, false, hitBox3 );
	}

	$.setColor( "white" );
	$.setPosPx( 0, hitBox3.y + 18 );
	$.print( " Tile: " + Util.GetTileId( data.selectedTile ) );
	$.setPosPx( 0, hitBox3.y + 29 );
	$.print( " Image Id: " + data.tiles[ data.selectedTile ].imageId );
	$.setPosPx( 0, hitBox3.y + 50 );
	let pos = $.getPos();
	$.setPos( pos );
	$.print( " Description: " + data.tiles[ data.selectedTile ].description );
}

async function editCharacter( data, isFirst ) {
	$.cls();
	if( isFirst ) {
		$.clearEvents();
	} else {
		data.character.imageId = data.selectedImage;
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
		data.selectedImage = data.character.imageId;
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
		data.objects[ data.selectedObject ].imageId = data.selectedImage;
	}
	drawImages( data, isFirst, editObjects );
	let x = 2;
	let y = 200;
	for( let i = 0; i < data.objects.length; i++ ) {
		let image = Util.ConvertPutStringToData( data.images[ data.objects[ i ].imageId ] );
		let hitBox = {
			"x": x,
			"y": y,
			"width": 15,
			"height": 15
		};
		$.put( image, x, y );
		if( i === data.selectedObject ) {
			$.setColor( "white" );
			$.rect( x + 1, y + 1, 13, 13 );
		}
		$.setColor( "gray" );
		$.rect( hitBox );
		if( isFirst ) {
			$.onclick( function ( mouse, selectedObject ) {
				data.selectedObject = selectedObject;
				data.selectedImage = data.objects[ data.selectedObject ].imageId;
				editObjects( data, false );
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
	$.print( "Editing Objects/Monsters" );

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
			data.objects.push( createObject() );
			setTimeout( function () {
				editObjects( data, true );
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

	$.setColor( "white" );
	$.setPosPx( 0, hitBox3.y + 28 );
	let pos = $.getPos();
	$.setPos( pos );
	$.print( " Object: " + Util.GetTileId( data.selectedObject ) );
	$.print( " Image Id: " + data.objects[ data.selectedObject ].imageId );
	$.print( " Name: " + data.objects[ data.selectedObject ].name );
	$.print( " Hits: " + data.objects[ data.selectedObject ].hits );
	$.print( " Level: " + data.objects[ data.selectedObject ].level );
	$.print( " Exp: " + data.objects[ data.selectedObject ].exp );
	$.print( " Is Monster: " + data.objects[ data.selectedObject ].isMonster );
}

async function editObject( data ) {
	$.cls();
	let obj = data.objects[ data.selectedObject ];

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
		if( i === data.selectedTile ) {
			$.setColor( "white" );
			$.rect( x + 1, y + 1, 13, 13 );
		}
		$.setColor( "gray" );
		$.rect( hitBox );
		if( isFirst ) {
			$.onclick( function ( mouse, selectedTile ) {
				data.selectedTile = selectedTile;
				data.selectedObject = -1;
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
		if( i === data.selectedObject ) {
			$.setColor( "white" );
			$.rect( x + 1, y + 1, 13, 13 );
		}
		$.setColor( "gray" );
		$.rect( hitBox );
		if( isFirst ) {
			$.onclick( function ( mouse, selectedObject ) {
				data.selectedObject = selectedObject;
				data.selectedTile = -1;
				editRooms( data, false );
			}, false, hitBox, i );
		}
		x += 18
		if( x > 628 ) {
			x = 2;
			y += 18;
		}
	}

	// Draw Room Selectors
	x = 2;
	y = 80;
	for( let i = 0; i < data.rooms.length; i++ ) {
		$.setPosPx( x + 2, y + 2 );
		if( i === data.selectedRoom ) {
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
				data.selectedRoom = selectedRoom;
				editRooms( data, false );
			}, false, hitBox, i );
		}
		x += 18;
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
				$.print( "Old name: " + data.rooms[ data.selectedRoom ].name );
				room.name = await $.input( "Enter name: ", null );
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
	$.setPosPx( hitBox4.x + 4, hitBox4.y + 4 );
	$.print( "Set Trap", true );
	$.rect( hitBox4 );
	if( isFirst ) {
		$.onclick( function () {
			$.setColor( "white" );
			$.setPosPx( hitBox4.x + 4, hitBox4.y + 4 );
			$.print( "Set Trap", true );
			$.rect( hitBox4 );
			$.clearEvents();
			data.setTrapStep = 0;
			setTimeout( async function () {
				editRooms( data, true );
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
				if( data.selectedTile > -1 ) {
					let room = data.rooms[ data.selectedRoom ];
					let tileId = Util.GetTileId( data.selectedTile );
					for( let col = 0; col < room.data.length; col++ ) {
						room.data[ col ] = tileId.padStart( room.data[ col ].length, tileId );
					}
				}
				editRooms( data, true );
			}, 100 );
		}, false, hitBox5 );
	}

	$.setColor( "white" );
	$.setPosPx( 0, hitBox5.y + 28 );
	let pos = $.getPos();
	$.setPos( pos );
	$.print( " Room: " + Util.GetTileId( data.selectedRoom ) );
	$.print( " Name: " + data.rooms[ data.selectedRoom ].name );
	$.print( " Objects: " + data.rooms[ data.selectedRoom ].objects.length );
	$.print( " Traps: " + data.rooms[ data.selectedRoom ].traps.length );

	x = 6;
	y = $.getPosPx().y + 6;
	let room = data.rooms[ data.selectedRoom ];
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
				$.onclick( function () {
					if( data.selectedTile !== -1 ) {
						let line = room.data[ col ];
						room.data[ col ] = line.substring( 0, row ) +
							Util.GetTileId( data.selectedTile ) +
							line.substring( row + 1 );
					}
					editRooms( data, false );
				}, false, hitBoxRoom );
			}
			x += 15;
		}
		x = 6;
		y += 15;
	}
}

