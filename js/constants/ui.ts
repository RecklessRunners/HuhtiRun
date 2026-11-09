// Shared UI layout: bands, margins, font sizes, alpha levels and click zones

// --- Typography scale (font sizes in px for kirjoita)
export const FONT_MICRO = 10; // Version label
export const FONT_DOT = 11; // Page indicator dots
export const FONT_CAPTION = 12; // Captions and small labels
export const FONT_BODY = 16; // Body text (the default size)
export const FONT_LABEL = 18; // Button labels
export const FONT_LIST = 20; // List entries, e.g. credits
export const FONT_SUBTITLE = 24; // Sub headings and menu choices
export const FONT_HEADING = 32; // Headings and big numbers
export const FONT_TITLE = 48; // Screen titles
export const FONT_DISPLAY = 64; // Game title
export const FONT_SCORE = 96; // Score count-up on the death screen
export const DEFAULT_FONT_SIZE = FONT_BODY; // Font size (px) used by kirjoita() when none is given
export const FONT_PRICE = 14; // Price label on the buy button

// --- In-game HUD
export const HUD_SLOTS = 5; // The canvas width is divided into this many slots for HUD placement
export const HUD_SCORE_SLOT = 2; // Slot (of HUD_SLOTS) where the score is shown
export const HUD_DISTANCE_SLOT = 3; // Slot where the distance is shown
export const HUD_VALUE_Y = 48; // y of the HUD numbers
export const HUD_LABEL_Y = 72; // y of the HUD labels
export const BONUS_BAR_X = 32; // Left edge of the bonus meter
export const BONUS_BAR_Y = 96; // Top edge of the bonus meter
export const BONUS_BAR_WIDTH = 16; // Width of the bonus meter
export const BONUS_BAR_HEIGHT = 384; // Height of the bonus meter
export const BONUS_BAR_BOTTOM = BONUS_BAR_Y + BONUS_BAR_HEIGHT; // Bottom edge of the bonus meter
export const BONUS_LABEL_X = 64; // x of the "+points" label next to the bonus meter
export const BONUS_LABEL_Y = 160; // y of the "+points" label
export const HEART_BASE_SIZE = 64; // Base font size of the pulsing heart in the danger warning
export const HEART_PULSE_SIZE = 8; // Size variation of the pulsing heart
export const HEART_PULSE_SPEED = 2; // Speed of the heart pulse relative to the animation clock
export const WARNING_TEXT_OFFSET = 32; // Distance of the danger warning text below the canvas centre

// --- Pause menu
export const PAUSE_TITLE_Y = 192; // y of the "paused" title
export const PAUSE_RESUME_Y = 256; // y of the "resume" choice
export const PAUSE_ROW_HEIGHT = 48; // Distance between the pause menu choices
export const PAUSE_ROW_HALF_HEIGHT = 24; // Half the height of a pause menu choice (click zone)
export const PAUSE_MENU_MARGIN = 384; // Horizontal margin of the pause menu click zone
export const PAUSE_BUTTON_WIDTH = 48; // Width of the pause button click zone in the top right corner
export const PAUSE_BUTTON_HEIGHT = 64; // Height of the pause button click zone

// --- Menu panel (s.veriSiirtymaNyt is the panel y offset; canvas.height when hidden)
export const PANEL_EDGE = 96; // The top edge of the panel is this far above its y offset
export const PANEL_HIGHLIGHT = PANEL_EDGE - 1; // y offset of the light highlight line just below the panel edge
export const PANEL_ALPHA = 0.7; // Opacity of the panel background overlay
export const TITLE_OFFSET = 464; // Distance of the HuhtiRun title above the panel offset
export const TM_OFFSET = 496; // Distance of the TM mark above the panel offset
export const TM_X_FRACTION = 0.675; // x of the TM mark as a fraction of the canvas width
export const MENU_LABEL_OFFSET = 64; // Distance of the bottom menu labels above the panel offset
export const BUTTON_LIFT = 16; // The play button centre is this far above the label row
export const MENU_BUTTON_LABEL_OFFSET = 20; // Distance of the text on the play button above the panel offset
export const MENU_SLOTS = 6; // The bottom menu is divided into this many horizontal slots
export const MENU_SLOT_GOALS = 1; // Slot of the goals link
export const MENU_SLOT_STATS = 2; // Slot of the stats link
export const MENU_SLOT_PLAY = 3; // Slot of the play / buy button
export const MENU_SLOT_SETTINGS = 4; // Slot of the settings link
export const MENU_SLOT_CREDITS = 5; // Slot of the credits link
export const MENU_ZONE_HALF_WIDTH = 80; // Half the width of a bottom menu click zone
export const MENU_ZONE_TOP = 448; // Clicks below this y hit the bottom bar (menu links or the back / start links)

// --- Play button
export const BUTTON_RADIUS = 32; // Radius of the round play button
export const BUTTON_SHADOW_RADIUS = 36; // Radius of the soft shadow around the play button
export const BUTTON_REACH = 96; // Pointer distance within which the play button grows
export const BUTTON_GROWTH = 0.375; // Maximum extra scale of the play button
export const BUTTON_GLOW_GROWTH = 8; // How much the highlight radius grows with the pointer
export const BUTTON_SPIN_DIVISOR = 5; // The loading ring rotates at 1/N of the animation clock
export const PRICE_LABEL_OFFSET = 22; // Price label offset below the label row, relative to the panel offset
export const PRICE_LABEL_X = 16; // Price label x offset from the canvas centre
export const PLAY_ICON_HALF = 16; // Half the size of the play triangle icon
export const MENU_LABEL_ALPHA = 0.75; // Opacity of the bottom menu labels and the play button

// --- Level arrows and dots
export const ARROW_MARGIN = 64; // Distance of the level arrows from the canvas sides
export const ARROW_Y = 256; // y of the level arrows
export const ARROW_ZONE_TOP = 146; // Top of the level arrow click band
export const ARROW_ZONE_BOTTOM = 288; // Bottom of the level arrow click band
export const ARROW_ZONE_WIDTH = 128; // Width of the level arrow click zones at each side
export const DOT_ROW_Y = 160; // y of the page dots (one per level)
export const DOT_SPACING = 16; // Distance between page dots
export const DOT_CENTER_ADJUST = 5.5; // Adjustment centring the dot glyphs

// --- Result / revive screen
export const RESULT_TITLE_Y = 64; // y of the "death" title
export const RESULT_CAPTION_Y = 192; // y of the caption above the result number
export const RESULT_SCORE_Y = 304; // y of the big score number
export const REVIVE_BUTTON_Y = 512; // y of the revive button label and ring
export const REVIVE_COUNT_Y = 536; // y of the revives-left text
export const REVIVE_PANEL_OFFSET = 128; // The panel slides this far up when the player revives
export const RAY_COUNT = 6; // Number of light rays behind the money total
export const RAY_SPACING = 60; // Angle between light rays (degrees)
export const RAY_HALF_WIDTH = 15; // Half the angular width of a light ray (degrees)
export const RAY_SPEED_DIVISOR = 2.5; // The rays rotate at 1/N of the animation clock

// --- Money total (top left)
export const MONEY_ICON_POS = 24; // Position of the coin icon
export const MONEY_ICON_SIZE = 24; // Size of the coin icon
export const MONEY_TEXT_X = 64; // x of the money amount
export const MONEY_TEXT_Y = 42; // y of the money amount

// --- Credits
export const CREDITS_SCROLL_START = 192; // Initial scroll offset of the credits list

// --- Sub page layout (shared by level select, goals, stats, credits and settings)
export const PAGE_MARGIN = 64; // Left margin of sub pages; the right margin is the same
export const PAGE_TITLE_Y = 128; // y of the page title when the panel is fully open
export const PAGE_SUBTITLE_Y = 152; // y of the page subtitle when the panel is fully open
export const FOOTER_Y = 512; // y of the bottom links (back / start)
export const BACK_ZONE_LEFT = 48; // Left edge of the back link click zone
export const BACK_ZONE_RIGHT = 256; // Right edge of the back link click zone
export const START_ZONE_LEFT = 512; // Left edge of the start link click zone

// --- Level select and shop
export const SHOP_SLOTS = 4; // The shop is divided into this many horizontal slots; items use slots 1-3
export const SHOP_ITEM_Y = 192; // y of the shop item names when the panel is fully open
export const SHOP_PRICE_OFFSET = 18; // Distance of the price below the item name
export const SHOP_DESC_Y1 = 396; // y of the first description line
export const SHOP_DESC_Y2 = 420; // y of the second description line
export const SHOP_STATUS_Y = 444; // y of the status line
export const SHOP_SLIDE_REVIVE = 9; // Slide-in divisor of the revive item (a larger number slides in sooner)
export const SHOP_SLIDE_BONUS = 6; // Slide-in divisor of the bonus item
export const SHOP_SLIDE_KICKSTART = 3; // Slide-in divisor of the kickstart item
export const SHOP_ITEM_HALF_WIDTH = 96; // Half the width of a shop item click zone
export const MEDKIT_OFFSET_X = 64; // Horizontal offset centring the medkit image
export const MEDKIT_OFFSET_Y = 48; // Vertical offset of the medkit image below the item name
export const SHOP_ZONE_TOP = 192; // Clicks below this y (and above the footer) hit the shop items
export const SHOP_SLOT_REVIVE = 1; // Shop slot of the revive item
export const SHOP_SLOT_BONUS = 2; // Shop slot of the bonus item
export const SHOP_SLOT_KICKSTART = 3; // Shop slot of the kickstart item

// --- Settings page
export const SETTINGS_VALUE_X = 512; // x of the setting values
export const SETTINGS_VALUE_ZONE_X = 480; // Clicks right of this x change a setting
export const SETTINGS_ROW_VIBRATION = 192; // y of the vibration row
export const SETTINGS_ROW_SOUND = 224; // y of the sound row
export const SETTINGS_ROW_CONTROLS = 256; // y of the controls row
export const SETTINGS_ROW_HALF_HEIGHT = 16; // Half the height of a settings row click zone

// --- Statistics page
export const STATS_DIGITS = 8; // Number of digits (zero padded) in the stats numbers
export const STATS_LABEL_DISTANCE_Y = 176; // y of the "total distance" label
export const STATS_VALUE_DISTANCE_Y = 208; // y of the total distance
export const STATS_LABEL_GAMES_Y = 256; // y of the "games played" label
export const STATS_VALUE_GAMES_Y = 288; // y of the games played
export const STATS_LABEL_AVERAGE_Y = 336; // y of the "average distance" label
export const STATS_VALUE_AVERAGE_Y = 368; // y of the average distance
export const STATS_UNIT_X = 256; // x of the "m" unit after a distance
export const RECORDS_LEFT_X = 384; // x of the records columns
export const RECORDS_TEXT_X = 424; // x of the record values
export const RECORDS_ROW_HEIGHT = 32; // Distance between record rows
export const RECORDS_SCORES_HEADER_Y = 176; // y of the high score header
export const RECORDS_SCORES_Y = 208; // y of the first high score
export const RECORDS_DISTANCES_HEADER_Y = 304; // y of the longest distances header
export const RECORDS_DISTANCES_Y = 336; // y of the first longest distance
export const PODIUM_PLACES = 3; // Number of ranked places shown in each record list
export const MEDAL_RADIUS = 12; // Radius of the rank medal
export const MEDAL_X = 390; // x of the medal; its shadow is one pixel right
export const MEDAL_Y_OFFSET = 10; // The medal is drawn this far above the row y; its shadow one pixel lower
export const RANK_TEXT_OFFSET = 6; // The rank number is drawn this far above the row y

// --- Goals page
export const GOAL_TEXT_X = 320; // x of the goal name, description and check mark
export const GOAL_NAME_Y = 216; // y of the goal name
export const GOAL_DESC_Y = 248; // y of the goal description
export const GOAL_CHECK_Y = 312; // y of the check box
export const GOAL_STATUS_X = 372; // x of the status text next to the check box
export const GOAL_STATUS_Y = 296; // y of the first status line
export const GOAL_STATUS_Y2 = 316; // y of the second status line
export const GOAL_RING_X = 192; // x of the progress ring centre
export const GOAL_RING_Y = 256; // y of the progress ring centre
export const GOAL_RING_RADIUS = 64; // Radius of the progress ring
export const GOAL_RING_RANGE = 384; // Panel offset range over which the ring fills as the page opens
export const GOAL_GLOW_RADIUS = 256; // Final radius of the glow behind the ring
export const GOAL_GLOW_RANGE = 512; // Panel offset range over which the glow grows as the page opens
export const RING_LINE_WIDTH = 2; // Line width of the progress ring
export const RING_START_ANGLE = 4.71238898; // Start angle of the progress ring (about 3 pi / 2: the top of the circle)
export const RING_TEXT_OFFSET = 8; // Percent number offset below the ring centre
export const RING_UNIT_OFFSET = 48; // Percent sign offset below the ring centre
export const MEDAL_IMAGE_X = 128; // x of the goal medal image
export const MEDAL_IMAGE_Y = 192; // y of the goal medal image
export const MEDAL_IMAGE_SIZE = 128; // Size of the goal medal image (the sparkle area)
export const RIBBON_X = 64; // x of the medal ribbon
export const RIBBON_Y = -104; // y of the medal ribbon (partly above the canvas)
export const SPARKLE_THRESHOLD = 0.75; // A sparkle appears when a random number exceeds this (25% of the steps)
export const SPARKLE_SIZE_MIN = 8; // Minimum sparkle size
export const SPARKLE_SIZE_RANGE = 8; // Random extra sparkle size
export const NAV_ZONES = 3; // The goals page is divided into this many click zones (previous / middle / next)
export const GOAL_DOT_ROW_Y = 416; // y of the goal page dots

// --- Credits page
export const CREDITS_IMAGE_X = 512 + 64; // x of the character picture
export const CREDITS_IMAGE_Y = 192 - 64; // y of the character picture
export const CREDITS_IMAGE_SIZE = 288; // Size of the character picture
export const CREDITS_SCROLL_SPEED = 1.25; // Scroll speed of the credits per step
export const CREDITS_LIST_TOP = 192; // y where the credits list starts
export const CREDITS_LINE_HEIGHT = 24; // Height of one credits line
export const CREDITS_NAME_X = 256; // x of the names
export const CREDITS_FADE_IN_Y = 256; // Lines above this y fade in from the top
export const CREDITS_FADE_OUT_Y = 416; // Lines below this y fade out
export const CREDITS_FADE_LENGTH = 16; // Distance over which lines fade
export const CREDITS_END_OFFSET = 3; // Lines counted off the end of the list before it restarts
export const CREDITS_END_Y = 128; // The list restarts when its last line is above this y
export const CREDITS_RESTART_SCROLL = 512; // Scroll offset the credits restart from
export const FOOTER_LINE_HEIGHT = 24; // Distance between footer text lines
export const VERSION_SHORT_LENGTH = 20; // Number of version characters shown by default
export const VERSION_FULL_LENGTH = 40; // Number of version characters shown after clicking the version area
export const VERSION_ZONE_HEIGHT = 128; // Height of the click area that reveals the full version

// --- In-game HUD extras
export const PAUSE_ICON_MARGIN = 12; // Distance of the pause icon from the canvas edge
export const PAUSE_ICON_TOP = 12; // Distance of the pause icon from the top
export const PAUSE_BAR_WIDTH = 12; // Width of one pause bar
export const PAUSE_BAR_HEIGHT = 24; // Height of the pause bars
export const PAUSE_BAR_SPACING = 18; // Gap between the two pause bars
export const VERSION_LABEL_LENGTH = 5; // Characters of the version shown in the corner label
export const VERSION_LABEL_MARGIN = 8; // Distance of the version label from the canvas corner
export const VERSION_LABEL_ALPHA = 0.5; // Opacity of the version label
