// ==========================================
// CANDY CRUSH GAME CONFIGURATION
// ==========================================
// This file centralizes all game settings for easy adjustment

// Same prefix Next uses. Inlined for the browser via next.config.ts.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const gameConfig = {
  basePath,
  // ==========================================
  // API CONFIGURATION
  // ==========================================

  campaignID: "gamehub",
  campaignName: "candy-crush-cny",

  // ==========================================
  // BOARD CONFIGURATION
  // ==========================================
  board: {
    width: 8,
    height: 9,
  },

  // ==========================================
  // TIME CONFIGURATION
  // ==========================================
  time: {
    limit: 60, // seconds
    bonusPerMatch: 1, // seconds added per match

    // Time bar color thresholds (percentage)
    barThresholds: {
      blue: 50, // Blue bar shows when > 50%
      yellow: 20, // Yellow bar shows when 20% - 50%
      red: 20, // Red bar shows when < 20% (also triggers flashing)
    },
  },

  // ==========================================
  // SCORING CONFIGURATION
  // ==========================================
  scoring: {
    // Base scoring: Each matched item = pointsPerItem points
    // Bonus scoring: For matches > 3 items, each extra item = bonusPointsPerExtraMatch points
    // Examples:
    //   - 3-match: 3 × 1 + 0 bonus = 3 points
    //   - 4-match: 4 × 1 + (4-3) × 2 = 6 points
    //   - 5-match: 5 × 1 + (5-3) × 2 = 9 points
    //   - 6-match: 6 × 1 + (6-3) × 2 = 12 points
    pointsPerItem: 1,
    bonusPointsPerExtraMatch: 2,

    // Game point rewards
    gamePointBaseMinimumScore: 20,
    gamePointBase: 25,
    gamePointHighest: 50,
  },

  // ==========================================
  // COMBO CONFIGURATION
  // ==========================================
  combo: {
    // Combo scoring: Consecutive chain matches get multiplier bonuses
    // Formula: (basePoints + bonusPoints) × comboMultiplier
    // Examples with 4-match (4 × 1 + 1 × 2 = 6 base points):
    //   - 1st match: 6 × 1 = 6 points (no combo)
    //   - 2nd consecutive match (combo x2): 6 × 2 = 12 points
    //   - 3rd consecutive match (combo x3): 6 × 3 = 18 points
    //   - 4th consecutive match (combo x4): 6 × 4 = 24 points
    //   - 5th+ consecutive match (super combo): 6 × 5 = 30 points
    multipliers: {
      x2: 2,
      x3: 3,
      x4: 4,
      superCombo: 5, // 5x or higher combos
    },
  },

  // ==========================================
  // SOUND CONFIGURATION
  // ==========================================
  sounds: {
    // Background music: Cheerful Christmas Time by Tarush Singhal, CC0 1.0. Instrumental.
    background: {
      path: `${basePath}/sounds/background.m4a?v=cheerful`,
      volume: 0.5,
    },

    // Soft music-box and sleigh chimes. Original tones, separate from the background track.
    effects: {
      gameOver: {
        path: `${basePath}/sounds/gameover.wav?v=warm`,
        volume: 0.8,
      },
      pause: {
        path: `${basePath}/sounds/pause.wav?v=warm`,
        volume: 0.75,
      },
      match: {
        path: `${basePath}/sounds/eliminate.wav?v=warm`,
        volume: 0.75,
      },
      swap: {
        path: `${basePath}/sounds/swap.wav?v=warm`,
        volume: 0.6,
      },
      spawn: {
        path: `${basePath}/sounds/spawn.wav?v=warm`,
        volume: 0.55,
      },
    },

    combo: {
      x2: {
        path: `${basePath}/sounds/combo-x2.wav?v=warm`,
        volume: 0.75,
      },
      x3: {
        path: `${basePath}/sounds/combo-x3.wav?v=warm`,
        volume: 0.8,
      },
      x4: {
        path: `${basePath}/sounds/combo-x4.wav?v=warm`,
        volume: 0.85,
      },
      super: {
        path: `${basePath}/sounds/combo-super.wav?v=warm`,
        volume: 0.85,
      },
    },
  },

  // ==========================================
  // VISUAL ASSETS CONFIGURATION
  // ==========================================
  assets: {
    // Game item variants
    items: [
      `${basePath}/images/items-deer.png`,
      `${basePath}/images/items-angel.png`,
      `${basePath}/images/items-pug.png?v=sit`,
      `${basePath}/images/items-lantern.png`,
      `${basePath}/images/items-tree.png`,
      `${basePath}/images/items-snowman.png`,
    ],

    // Combo popup images
    comboPopups: {
      x2: `${basePath}/images/game-combo-x2.png`,
      x3: `${basePath}/images/game-combo-x3.png`,
      x4: `${basePath}/images/game-combo-x4.png`,
      x5: `${basePath}/images/game-combo-super.png`, // for 5x and higher
    },

    // UI images
    ui: {
      // Game screen
      gameBackground: `${basePath}/images/game-background.png?v=xmas`,
      gameBoard: `${basePath}/images/gameboard.png`,
      timeBarBackground: `${basePath}/images/time-bar-bg.png?v=xmas`,
      timeBarBlue: `${basePath}/images/time-bar-blue.png`,
      timeBarYellow: `${basePath}/images/time-bar-yellow.png`,
      timeBarRed: `${basePath}/images/time-bar-red.png`,

      // Buttons
      audioOnButton: `${basePath}/images/audio-on-button.png`,
      audioOffButton: `${basePath}/images/audio-off-button.png`,
      playNowButton: `${basePath}/images/play-now-button.png?v=green`,
      nextButton: `${basePath}/images/next-button.png?v=lantern`,
      menuButton: `${basePath}/images/menu-button.png`,
      resumeGameButton: `${basePath}/images/resume-game-button.png?v=lights`,
      restartGameButton: `${basePath}/images/restart-game-button.png?v=lights`,
      backToMenuButton: `${basePath}/images/back-to-menu-button.png?v=lights`,
      okButton: `${basePath}/images/ok-button.png?v=green`,

      // Dialog titles
      gamePausedTitle: `${basePath}/images/game-paused-title.png?v=xmas`,
      instructionsTitle: `${basePath}/images/instructions-title.png?v=xmas`,

      // Game elements
      itemHighlightBorder: `${basePath}/images/item-highlight-border.png`,
      itemHighlightStar: `${basePath}/images/item-highlight-star.png`,
      instructionsAnimation: `${basePath}/images/instructions-animation.gif`,
      instructionsTimeBar: `${basePath}/images/instructions-time-bar.png?v=art`,
      instructionsGiftNumSample: `${basePath}/images/instructions-gift-num-sample.png?v=art`,
      
      checkInDialogCheckInBox: {
        day1:  `${basePath}/images/check-in-box-day-1.png?v=art`,
        day2:  `${basePath}/images/check-in-box-day-2.png?v=art`,
        day3:  `${basePath}/images/check-in-box-day-3.png?v=art`,
      },

      checkInDialogCheckInTopBanner: {
        day1:  `${basePath}/images/check-in-box-day-1-top-banner.png?v=xmas`,
        day2:  `${basePath}/images/check-in-box-day-2-top-banner.png?v=xmas`,
        day3:  `${basePath}/images/check-in-box-day-3-top-banner.png?v=xmas`,
      },

      giftBoxIcon: `${basePath}/images/xmas-giftbox.png`,

      gameBottomGiftNumBar: `${basePath}/images/game-gift-box-bar.png?v=art`,

      endDialogGiftBoxBg: `${basePath}/images/end-dialog-gift-box-bg.png?v=frame`,
    },
  },
};
