// RACES
const RACES = ["Humain"];

// XP TABLE exponentielle
const XP_TABLE = [0];
const BASE_XP = 100;
const XP_COEF = 1.15;
for (let lvl = 1; lvl <= 76; lvl++) {
  XP_TABLE[lvl] = Math.floor(BASE_XP * Math.pow(XP_COEF, lvl - 1));
}

// CLASSES ET STATS
const CLASS_DATA = {
  Fighter: { baseStats: {STR:10, DEX:5, CON:10, INT:1, WIT:1, CHA:1}, growth:{STR:2, DEX:1, CON:2, INT:0, WIT:0, CHA:0} },
  Warrior: { baseStats: {STR:20, DEX:7, CON:15, INT:1, WIT:1, CHA:1}, growth:{STR:3, DEX:1, CON:3, INT:0, WIT:0, CHA:0} },
  Warlord: { baseStats: {STR:35, DEX:10, CON:25, INT:1, WIT:1, CHA:1}, growth:{STR:4, DEX:1, CON:4, INT:0, WIT:0, CHA:0} },
  Dreadnought: { baseStats: {STR:50, DEX:12, CON:35, INT:1, WIT:1, CHA:1}, growth:{STR:5, DEX:1, CON:5, INT:0, WIT:0, CHA:0} },
  Rogue: { baseStats: {STR:8, DEX:15, CON:8, INT:1, WIT:1, CHA:1}, growth:{STR:1, DEX:3, CON:1, INT:0, WIT:0, CHA:0} },
  Hawkeye: { baseStats: {STR:12, DEX:30, CON:10, INT:1, WIT:1, CHA:1}, growth:{STR:1, DEX:4, CON:1, INT:0, WIT:0, CHA:0} },
  Sagittarius: { baseStats: {STR:15, DEX:50, CON:15, INT:1, WIT:1, CHA:1}, growth:{STR:1, DEX:5, CON:1, INT:0, WIT:0, CHA:0} }
};

// CLASS PATHS : arbres de classes Humain
const CLASS_PATHS = {
  Humain: {
    Fighter: { evolvesTo: { 20:["Warrior","Rogue"] } },
    Warrior: { evolvesTo: { 40:["Warlord"] } },
    Warlord: { evolvesTo: { 76:["Dreadnought"] } },
    Dreadnought: { evolvesTo: {} },
    Rogue: { evolvesTo: { 40:["Hawkeye"] } },
    Hawkeye: { evolvesTo: { 76:["Sagittarius"] } },
    Sagittarius: { evolvesTo: {} }
  }
};

// Classes de départ pour menu
const START_CLASSES = {
  Humain: ["Fighter"]
};

/* Exemple pour ajouter une nouvelle race :
RACES.push("Elfe");
CLASS_DATA["ElvenFighter"] = { baseStats: {...}, growth:{...} };
CLASS_DATA["ElvenMage"] = { baseStats: {...}, growth:{...} };
CLASS_PATHS["Elfe"] = {
    ElvenFighter: { evolvesTo: { 20:["ElvenWarrior"] } },
    ElvenWarrior: { evolvesTo: { 40:["ElvenChampion"] } },
    ElvenChampion: { evolvesTo: {} },
    ElvenMage: { evolvesTo: { 20:["ElvenWizard"] } },
    ElvenWizard: { evolvesTo: { 40:["ElvenArchmage"] } },
    ElvenArchmage: { evolvesTo: {} }
};
START_CLASSES["Elfe"] = ["ElvenFighter","ElvenMage"];
*/
