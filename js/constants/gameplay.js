// Gameplay tuning: speeds, timings, scoring, prices and probabilities

// --- Shield
export const SHIELD_BLINK_LIMIT = 5; // The shield starts blinking when this many steps or fewer remain
export const SHIELD_FADED_ALPHA = 0.25; // Character opacity during the faded phase of shield blinking

// --- Game loop
export const UPDATE_INTERVAL = 50; // Fixed logic step in milliseconds (20 steps per second)
export const MAX_CATCHUP_STEPS = 5; // Maximum logic steps run per frame, prevents a catch-up spiral after a long pause

// --- Player movement and speed
export const PLAYER_BASE_SPEED = 10; // Terrain scroll speed at the start of a run (px per step)
export const SPEED_PER_POINT = 0.0075; // Speed increase per point: the game accelerates the further you get
export const KICKSTART_SPEED_MULTIPLIER = 5; // Scroll and object speed multiplier while a kickstart (alkupotkaisu) is active
export const PLAYER_FOLLOW_DIVISOR = 5; // The character covers 1/N of the distance to the target x per step
export const PLAYER_FOLLOW_DIVISOR_KICKSTART = 1.2; // Same, but much snappier during a kickstart
export const MAX_TILT = Math.PI / 2; // Maximum lean angle (radians) of the character and the enemy when moving sideways
export const TILT_FULL_DISTANCE = 32; // Per-step movement (px) at which the lean reaches MAX_TILT
export const ANIMATION_STEP = 0.5; // Per-step increment of the animation clock pelaaNo (drives blinking and sine waves)
export const ROAD_RIGHT_EDGE_ALLOWANCE = 120; // Effective character width (px) when checking the right road edge

// --- Enemy (monkey) distance; s.vihuSiirtyma is the enemy offset below the player in px
export const ENEMY_CAUGHT_DISTANCE = 95; // Enemy distance set when the player is hit; just below ENEMY_CATCH_DISTANCE
export const ENEMY_CATCH_DISTANCE = 96; // The player is caught (game over) when the enemy gets closer than this
export const ENEMY_DANGER_DISTANCE = 192; // Below this distance the "life in danger" warning is shown
export const ENEMY_DISTANCE_PULL_THRESHOLD = 256; // Beyond this distance the enemy is pulled closer each step
export const ENEMY_DISTANCE_PULL = 1.5; // Amount the enemy is pulled closer per step beyond the threshold
export const ENEMY_DISTANCE_MAX = 384; // Maximum distance of the enemy
export const ENEMY_DISTANCE_RELAX_RATE = 0.375; // Distance the enemy lags behind per step
export const ENEMY_RETREAT_ODDS = 16; // On average once every N steps the enemy falls back a little
export const ENEMY_RETREAT_FRACTION = 3 / 512; // Fraction of the current distance the enemy falls back
export const ENEMY_PENALTY_BASE = 64; // Minimum distance the enemy gains when the player leaves the road
export const ENEMY_PENALTY_RANDOM = 48; // Random extra added to the off-road penalty
export const ENEMY_FOLLOW_DIVISOR = 5; // The enemy covers 1/N of the distance to its target x per step
export const ENEMY_FOLLOW_DIVISOR_KICKSTART = 1.25; // Same during a kickstart
export const ENEMY_MAX_STEP_PER_SPEED = 4; // The enemy moves at most this many times the player speed per step
export const ENEMY_REVIVE_DISTANCE = 256; // Enemy distance after a revive
export const ENEMY_START_DISTANCE = 512; // Enemy distance at the start of a run

// --- Shield and kickstart (alkupotkaisu)
export const SHIELD_RECENTER_THRESHOLD = 2; // While the shield is above this, the player is steered back to the middle of the road
export const SHIELD_AFTER_OFF_ROAD = 2; // Shield steps granted after leaving the road
export const SHIELD_DURING_KICKSTART = 4; // Shield steps while a kickstart is active
export const KICKSTART_MIN_REMAINING = 4; // A kickstart ends when this many metres or fewer are left

// --- Obstacles and jumping
export const OBSTACLE_TILES = [1, 4, 8]; // Indices of the straight-road images (tieSuoraan) that are obstacles you must jump over
export const HORIZONTAL_GAP_TILE = 4; // Index of the horizontal-road image (tieVaakaan) that contains a gap
export const TILE_CONTACT_PROGRESS = 144; // Scroll progress (px) of a tile after which it counts as reaching the character
export const JUMP_DURATION = 500; // How long (ms) a jump lasts
export const AUTO_JUMP_DURATION = 750; // Jump duration (ms) of the automatic jump in the menu background
export const ROAD_SCAN_MARGIN = 100; // The road bounds are re-read when the scroll is within this distance of the player position

// --- Terrain rows (index into s.maasto[column][row])
export const PLAYER_ROW = 1; // Row that is checked against the player
export const ENEMY_ROW = 2; // Row that the enemy follows

// --- Road generation
export const MIN_ROWS_BETWEEN_TURNS = 2; // At least this many straight rows follow every turn
export const ROAD_EDGE_TURN_CHANCE = 0.75; // At the left/right edge: chance of turning (otherwise the road goes straight)
export const ROAD_LEFT_LIMIT = 0.3; // Mid-road: a random draw below this turns the road left
export const ROAD_RIGHT_LIMIT = 0.6; // Mid-road: a draw below this (and above the left limit) turns right
export const ROAD_CROSSING_LIMIT = 0.9; // Mid-road: a draw below this (and above the right limit) makes a crossing; above it goes straight

// --- Flying objects (space biome)
export const FLYING_SPAWN_CHANCE = 0.15; // Chance per tile of spawning flying objects
export const FLYING_PATTERN_COUNT = 3; // Number of spawn patterns: big single, small group, diagonal
export const FLYING_MAX_SINGLE = 3; // Maximum number of objects on screen for the big single pattern
export const FLYING_SPAWN_Y = -384; // Starting y of flying objects (above the screen)
export const FLYING_BASE_SPEED = 10; // Speed factor of objects that do not scale with the player speed
export const FLYING_SPEED_SCALE = 10; // Divisor converting object speed values into px per step
export const FLYING_BIG_SPEED_MIN = 1.5; // Big/diagonal objects: minimum speed (a random value of up to 1 is added)
export const FLYING_BIG_ROTATION = Math.PI / 100; // Rotation speed range of the big object
export const FLYING_SMALL_COUNT = 5; // Number of objects in the small group pattern
export const FLYING_SMALL_VARIANTS = 3; // Number of different small object images
export const FLYING_SMALL_SPEED_MIN = 3; // Small objects: minimum speed
export const FLYING_SMALL_SPEED_RANGE = 2; // Small objects: random speed span added to the minimum
export const FLYING_SMALL_ROTATION = Math.PI / 50; // Rotation speed range of the small objects
export const FLYING_DIAGONAL_SPEED_FACTOR = 2; // Speed factor of the diagonal object
export const FLYING_DIAGONAL_ANGLE = Math.PI / 4; // Starting angle of the diagonal object
export const FLYING_DIAGONAL_ROTATION = Math.PI / 200; // Rotation speed of the diagonal object
export const FLYING_DIAGONAL_IMAGE = 4; // Index of the diagonal flying object image in lentavaObjekti

// --- Bonus
export const BONUS_TARGET_BASE = 10; // Metres needed to fill the bonus meter at multiplier 0
export const BONUS_TARGET_PER_LEVEL = 10; // Extra metres needed per bonus multiplier level

// --- Vibration durations (ms)
export const VIBRATE_MEDIUM = 500; // Medium vibration (ms): leaving the road
export const VIBRATE_LONG = 1000; // Long vibration (ms): death, run start and revive
export const VIBRATE_CLICK = 100; // Short vibration (ms) when tapping the menu or the screen
export const VIBRATE_TICK = 50; // Tick vibration (ms) while the score counts down

// --- Scoring and the death screen
export const MIN_COUNTED_SCORE = 9; // A run only counts (records, revive screen) when its score is above this
export const SCORE_COUNTDOWN_END = 3.75; // The score count-up animation is finished when pisteytys is at or below this
export const SCORE_COUNTDOWN_DIVISOR = 10; // The count-up removes 1/N of the remaining score each step
export const SCORING_DELAY = 3000; // Delay (ms) before the scoring animation and before the result is saved
export const MAX_RECORDS = 10; // Number of entries in the high score and distance lists
export const DARKNESS_MENU = 0.5; // Screen darkness while paused and on the result screen

// --- Bonus meter
export const BONUS_POINTS = 20; // Points per bonus level (also awarded by double-clicking a full meter)

// --- Input
export const KEYBOARD_MOVE_STEP = 36; // Pixels the target x moves per key press in keyboard mode
export const JUMP_ZONE_START = 0.8; // Fraction of the canvas height below which pointer movement makes the character jump

// --- Darkness (cave biome and pause)
export const DARKNESS_CAVE_RATE = 0.005; // Darkness increase per step in the cave biome
export const DARKNESS_FADE_RATE = 0.02; // Darkness decrease per step outside the cave
export const DARKNESS_MAX = 0.7; // Maximum darkness overlay opacity
export const DARKNESS_MENU_MIN = 0.25; // Lowest darkness level reached in the menu
export const DARKNESS_MENU_FADE = 0.001; // Darkness decrease per step in the menu

// --- Flying object record fields (indices of the arrays in s.lentavatObjektit)
export const FLY_IMAGE = 0; // Image
export const FLY_X = 1; // x position
export const FLY_Y = 2; // y position
export const FLY_SPEED_X = 3; // Horizontal speed
export const FLY_SPEED_Y = 4; // Vertical speed
export const FLY_ADAPTIVE = 5; // Speed scales with the player speed
export const FLY_ANGLE = 6; // Current rotation angle
export const FLY_ROTATION = 7; // Rotation speed
export const FLY_ADAPTIVE_ROTATION = 8; // Rotation scales with the player speed

// --- Initial values
export const INITIAL_PLAYER_SPEED = 9; // Scroll speed before the first update
export const INITIAL_MAX_BONUS = 15; // Bonus meter target before the first update recalculates it
export const INITIAL_SHIELD = 2; // Shield steps when the game loads
export const ROAD_EDGE_TOLERANCE = 50; // How far (px) the character may go past the road edge before being hurt
export const SHIELD_ON_RUN_START = 3; // Shield steps added when a run starts or the player is revived

// --- Loading
export const SLOW_LOAD_TIMEOUT = 10000; // Without any loaded file for this long (ms), a slow-load warning is shown
export const LOADING_SLOGAN_COUNT = 5; // Number of loading messages picked at random

// --- Goals (targets of the achievements)
export const GOAL_RUNNER_DISTANCE = 250; // Lenkkeilijä: metres in a single run
export const GOAL_ATHLETE_DISTANCE = 500; // Urheilija: metres in a single run
export const GOAL_ELITE_DISTANCE = 750; // Huippu-urheilija: metres in a single run
export const GOAL_ADDICT_TOTAL_DISTANCE = 20000; // Addikti: total metres run over all games
export const GOAL_IMMORTAL_REVIVES = 5; // Kuolematon: revives in a single run
export const GOAL_RICH_MONEY = 20000; // Rikas: money total reached at least once

// --- Prices
export const LEVEL_PRICE = 300; // Price of a level is LEVEL_PRICE * index - 1
export const REVIVE_BASE_PRICE = 100; // Price of the first revive; each next one doubles (minus 1)
export const KICKSTART_BASE_PRICE = 199; // Price of the first kickstart
export const KICKSTART_PRICE_STEP = 50; // Price increase per KICKSTART_STEP already owned
export const KICKSTART_STEP = 25; // Metres of head start added by one kickstart purchase
