// Identifiers: screens, biomes, control modes, stat slots and tutorial tasks

// --- Screens (value of s.tila)
export const SCREEN_MENU = 0; // Main menu (also the death/scoring screen)
export const SCREEN_LEVELS = 1; // Level select and shop
export const SCREEN_GOALS = 2; // Goals
export const SCREEN_STATS = 3; // Statistics and records
export const SCREEN_CREDITS = 4; // About / credits
export const SCREEN_SETTINGS = 5; // Settings

// --- Biomes (value of s.biomi, index into biomiTyypit)
export const BIOME_DESERT = 0; // Aavikko
export const BIOME_MEADOW = 1; // Niitty
export const BIOME_SEA = 2; // Meri
export const BIOME_CAVE = 3; // Luola: the screen gets darker
export const BIOME_FOREST = 4; // Metsä: a signpost appears after a crossing
export const BIOME_SPACE = 5; // Avaruus: flying objects

// --- Control modes (value of asetukset.ohjausTapa, index into ohjausTavat)
export const CONTROL_MOUSE = 0; // Mouse / touch screen
export const CONTROL_KEYBOARD = 1; // Keyboard arrow keys

// --- Slots of s.tavoiteData (raw data behind the goals)
export const GOAL_DATA_MAX_MONEY = 0; // Highest money total ever reached
export const GOAL_DATA_MAX_REVIVES = 2; // Most revives used in a single game
export const GOAL_DATA_GAMES_PLAYED = 3; // Total number of games played
export const GOAL_DATA_SIZE = 8; // Number of slots in tavoiteData

// --- Tutorial tasks (index into tutoriaali / tutoriaaliData)
export const TUTORIAL_JUMP = 0; // Jump over a trap
export const TUTORIAL_BUY_LEVEL = 1; // Buy a level
