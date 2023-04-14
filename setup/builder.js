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
	} else if( choice === 2 ) {
		data.selectedImage = 0;
		data.selectedTile = 0;
		editTiles( data, true );
	} else if( choice === 3 ) {
		data.selectedImage = 0;
		editCharacter( data, true );
	}
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
		"x": 198,
		"y": 252,
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
		"x": 2,
		"y": y + 50,
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
		"x": 2,
		"y": y + 68,
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
				$.setPosPx( 6, hitBox3.y + 50 );
				$.input( "Description: ", function ( txt ) {
					data.tiles[ data.selectedTile ].description = txt;
					editTiles( data, true );
				} );
			}, 100 );
		}, false, hitBox3 );
	}

	$.setColor( "white" );
	$.setPosPx( 2, hitBox3.y + 18 );
	$.print( "Tile: " + Util.GetTileId( data.selectedTile ) );
	$.setPosPx( 2, hitBox3.y + 29 );
	$.print( "Image Id: " + data.tiles[ data.selectedTile ].imageId );
	$.setPosPx( 2, hitBox3.y + 40 );
	$.print( "Description: " + data.tiles[ data.selectedTile ].description );
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
	while( choice < 1 || choice > 9 ) {
		choice = await $.input( "Enter selection: ", null, true, true, false );
		if( choice < 1 || choice > 9 ) {
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
		drawImages( data, isFirst, editCharacter );
		$.setPos( 2, 23 );
		$.setColor( "white" );
		$.print( "Use the mouse to select an image from up above." );
		return;
	} else if( choice === 10 ) {
		showMenu( data );
		return;
	}

	editCharacter( data, false );
}
