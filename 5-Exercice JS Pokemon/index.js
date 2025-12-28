#!/usr/bin/env node
const inquirer = require("inquirer");

function randInt(max) { return Math.floor(Math.random() * max); }
function nameFix(s) { return s.replace(/-/g, " "); }

async function getPokemon(name) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  return res.json();
}

async function getMove(url) {
  const res = await fetch(url);
  const data = await res.json();
  return { name: data.name, power: data.power, accuracy: data.accuracy };
}

async function pickFiveMoves(pokemonData) {
  const pool = [...pokemonData.moves].sort(() => Math.random() - 0.5);
  const chosen = [];
  for (const m of pool) {
    if (chosen.length >= 5) break;
    const mv = await getMove(m.move.url);
    if (typeof mv.power === "number" && typeof mv.accuracy === "number") {
      chosen.push(mv);
    }
  }
  return chosen
}

function miss(accuracy) {
  const r = Math.floor(Math.random() * 101);
  return accuracy < r;
}

async function main() {
  console.log("=== Mini jeu Pokémon ===\n");

  // Choix du joueur
  const { pname } = await inquirer.prompt([{
    type: "input", name: "pname",
    message: "Entre le nom de TON Pokémon (ex: pikachu, charizard, gengar) :"
  }]);

  const player = await getPokemon(pname.trim());
  const botNames = ["blastoise", "venusaur", "arcanine", "alakazam", "dragonite", "machamp", "snorlax", "garchomp"];
  const bot = await getPokemon(botNames[randInt(botNames.length)]);

  const playerMoves = await pickFiveMoves(player);
  const botMoves = await pickFiveMoves(bot);

  let php = 300;
  let bhp = 300;

  console.log(`\nPlayer : ${player.name.toUpperCase()}  HP:${php}`);
  console.log(`Bot: ${bot.name.toUpperCase()}     HP:${bhp}\n`);

  while (php > 0 && bhp > 0) {
    // Tour Player
    const { mv } = await inquirer.prompt([{
      type: "list",
      name: "mv",
      message: "Choisis ton attaque :",
      choices: playerMoves.map(m => ({
        name: `${nameFix(m.name)}  (Pow:${m.power}  Acc:${m.accuracy}%)`,
        value: m
      }))
    }]);

    if (miss(mv.accuracy)) {
      console.log(`Ton ${nameFix(mv.name)} rate.`);
    } else {
      bhp = bhp - mv.power
      console.log(`Tu infliges ${mv.power} dégâts. Bot HP: ${bhp}/${300}`);
    }
    if (bhp <= 0) break;

    // Tour bot
    const bmv = botMoves[randInt(botMoves.length)];
    if (miss(bmv.accuracy)) {
      console.log(`Le ${nameFix(bmv.name)} du bot rate.`);
    } else {
      php = Math.max(0, php - bmv.power);
      console.log(`Le bot inflige ${bmv.power} dégâts. Ton HP: ${php}/${300}`);
    }
  }

  if (php <= 0 && bhp <= 0) console.log("Match nul.");
  else if (bhp <= 0) console.log("Victoire !");
  else console.log("Défaite...");
}

main().catch(err => {
  console.error("Erreur:", err.message || err);
  process.exit(1);
});
