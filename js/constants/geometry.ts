// Canvas, tile and sprite geometry

// --- Canvas
export const CANVAS_WIDTH = 960; // Width of the game canvas in pixels
export const CANVAS_HEIGHT = 576; // Height of the game canvas in pixels

// --- Terrain and tiles
export const TILE_SIZE = 192; // Edge length (px) of one terrain tile and of the character sprites
export const HALF_TILE = TILE_SIZE / 2; // Half a tile: used to centre sprites on their position
export const TERRAIN_COLUMNS = 5; // Number of terrain columns (lanes) across the screen
export const LAST_COLUMN = TERRAIN_COLUMNS - 1; // Index of the rightmost terrain column
export const TERRAIN_ROWS = 4; // Number of terrain rows kept in memory
export const ROAD_START_COLUMN = 2; // Column (middle lane) where the road starts

// --- Sprites
export const SHADOW_OFFSET_X = 48; // Horizontal offset of the jump shadow from the character
export const SHADOW_OFFSET_Y = HALF_TILE; // Vertical offset of the jump shadow below the character position
export const JUMP_SPRITE_GROW = 24; // How much the character sprite grows on each side while jumping
export const JUMP_SPRITE_SIZE = TILE_SIZE + 2 * JUMP_SPRITE_GROW; // Drawn size of the character sprite while jumping
export const JUMP_BUTTON_X = 64; // Left edge of the on-screen jump button
export const JUMP_BUTTON_SIZE = 64; // Width of the jump button image
export const JUMP_BUTTON_BOTTOM_OFFSET = 96; // Distance from the canvas bottom to the top of the unpressed jump button
export const JUMP_BUTTON_PRESSED_OFFSET = 64; // Distance from the canvas bottom to the top of the pressed jump button
export const JUMP_BUTTON_PRESSED_HEIGHT = 32; // Drawn height of the pressed (squashed) jump button

// --- Player and enemy
export const PLAYER_Y = 192; // y position of the player (and the scroll reference point) on the canvas
export const START_LANE_X = ROAD_START_COLUMN * TILE_SIZE; // x of the starting lane: where the player and the enemy start
