export const EXAMPLE_SCENARIO_JSON = `{
  "scenario": {
    "id": "episode-01-the-challenge",
    "title": "The Challenge",
    "arcId": "season-1",
    "regionId": "japan"
  },
  "locations": [
    {
      "id": "riverside-park",
      "name": "Riverside Park",
      "type": "park",
      "size": "20x15",
      "lighting": "day",
      "bgm": "park-theme",
      "layout": [
        "WWWWWWWWWWWWWWWWWWWW",
        "W..................W",
        "W..TTTT....BBBB...W",
        "W..TTTT....BBBB...W",
        "W..................W",
        "W......PP..........W",
        "W......PP..........W",
        "W..................W",
        "W...RR.....AA.....W",
        "W...RR.....AA.....W",
        "W..................W",
        "W..~~..............W",
        "W..~~..............W",
        "W..................W",
        "WWWWWWDDWWWWWWWWWWWW"
      ],
      "exits": [
        { "to": "bey-city-streets", "direction": "south", "transition": "walk" }
      ],
      "entryPoints": [
        { "id": "from-south", "tile": [10, 13], "facing": "up" }
      ]
    },
    {
      "id": "bey-city-streets",
      "name": "Bey City Streets",
      "type": "city",
      "size": "25x20",
      "lighting": "day",
      "bgm": "city-theme",
      "exits": [
        { "to": "riverside-park", "direction": "north", "transition": "walk" }
      ],
      "entryPoints": [
        { "id": "default", "tile": [12, 10], "facing": "down" },
        { "id": "from-north", "tile": [12, 1], "facing": "down" }
      ]
    }
  ],
  "characters": [
    {
      "id": "rival-carlos",
      "name": "Carlos",
      "type": "rival",
      "color": "#c0392b",
      "shape": "diamond",
      "facing": "down",
      "location": "riverside-park",
      "tile": [10, 6],
      "greeting": "Hey! You looking for a battle?",
      "battleConfig": {
        "beybladeId": "bey-carlos-storm",
        "arenaId": "arena-park",
        "difficulty": "medium",
        "canRematch": true,
        "xpReward": { "playerXP": 50, "beybladeXP": 30 },
        "awardsBadgeId": "park-champion"
      }
    },
    {
      "id": "kenny",
      "name": "Kenny",
      "type": "quest-giver",
      "color": "#3498db",
      "shape": "circle",
      "facing": "right",
      "location": "riverside-park",
      "tile": [5, 4],
      "greeting": "Hey there! I've been researching beyblades all morning."
    },
    {
      "id": "shopkeeper-mei",
      "name": "Mei",
      "type": "shopkeeper",
      "color": "#e91e63",
      "shape": "hexagon",
      "facing": "down",
      "location": "bey-city-streets",
      "tile": [15, 8],
      "greeting": "Welcome to Mei's Parts Shop! Take a look around."
    }
  ],
  "scenes": [
    {
      "id": "carlos-challenge",
      "name": "Carlos Issues a Challenge",
      "type": "cutscene",
      "location": "riverside-park",
      "triggerMode": "interact",
      "triggerTile": [10, 7],
      "triggerOnce": true,
      "actors": [
        { "npcId": "rival-carlos", "tile": [10, 5], "facing": "down" }
      ],
      "dialogue": [
        { "rival-carlos": "Hey, you! Yeah, you with the beyblade!" },
        { "rival-carlos": "I've been watching you practice. Not bad..." },
        { "rival-carlos": "But I bet you can't beat ME in a real battle!" },
        { "choice": {
          "prompt": "What do you say?",
          "options": [
            { "label": "Bring it on!", "setFlag": "accepted-carlos-challenge", "goto": "accept" },
            { "label": "Maybe later...", "goto": "decline" }
          ]
        }},
        { "label": "accept", "rival-carlos": "That's the spirit! Meet me at the arena!" },
        { "label": "decline", "rival-carlos": "Hmph. Coward. I'll be waiting when you grow a spine." }
      ],
      "completionFlags": { "met-carlos": true }
    },
    {
      "id": "kenny-intro",
      "name": "Kenny's Research Request",
      "type": "story-event",
      "location": "riverside-park",
      "triggerMode": "interact",
      "triggerTile": [5, 5],
      "triggerOnce": true,
      "dialogue": [
        { "kenny": "Oh! Perfect timing!" },
        { "kenny": "I've been collecting data on local bladers." },
        { "kenny": "Could you do me a favor and battle Carlos?" },
        { "kenny": "I need combat data for my research!" }
      ],
      "completionFlags": { "kenny-intro-done": true }
    }
  ],
  "quests": [
    {
      "id": "defeat-carlos",
      "title": "Prove Your Worth",
      "description": "Defeat Carlos in a Beyblade battle at Riverside Park to prove your skills.",
      "category": "main",
      "objectives": [
        { "type": "defeat-npc", "target": "rival-carlos", "description": "Defeat Carlos in battle" }
      ],
      "rewards": {
        "reputation": 10,
        "xp": { "playerXP": 75 },
        "badgeId": "park-champion",
        "setFlags": { "carlos-defeated": true }
      }
    },
    {
      "id": "explore-city",
      "title": "City Explorer",
      "description": "Visit the city streets and meet the locals.",
      "category": "side",
      "objectives": [
        { "type": "reach-map", "target": "bey-city-streets", "description": "Visit Bey City Streets" },
        { "type": "talk-to-npc", "target": "shopkeeper-mei", "description": "Talk to Mei at the parts shop" }
      ],
      "rewards": {
        "reputation": 5,
        "xp": { "playerXP": 25 }
      }
    }
  ],
  "badges": [
    {
      "id": "park-champion",
      "name": "Park Champion",
      "category": "street",
      "color": "#f1c40f",
      "shape": "star",
      "description": "Awarded for defeating Carlos at Riverside Park.",
      "earnCondition": { "type": "defeat-npc", "targetId": "rival-carlos" }
    }
  ],
  "items": [
    {
      "id": "attack-ring-basic",
      "name": "Basic Attack Ring",
      "category": "beyblade-part",
      "color": "#95a5a6",
      "shape": "hexagon",
      "description": "A standard attack ring for beginners.",
      "stackable": false,
      "sellPrice": 50
    },
    {
      "id": "stamina-potion",
      "name": "Stamina Potion",
      "category": "consumable",
      "color": "#2ecc71",
      "shape": "circle",
      "description": "Restores a small amount of beyblade stamina.",
      "stackable": true,
      "maxStack": 5,
      "usable": true,
      "sellPrice": 20,
      "buyPrice": 40
    }
  ]
}`;
