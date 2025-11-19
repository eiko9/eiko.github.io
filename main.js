let player = {
  name: "",
  race: "Humain",
  currentClass: "Fighter",
  level: 1,
  xp: 0,
  stats: {},
  karma: 0,
  inventory: [],
  inventoryWeight: 0
};

// Sauvegarde / chargement
function savePlayer() { localStorage.setItem("playerData", JSON.stringify(player)); }
function loadPlayer() { const saved = localStorage.getItem("playerData"); if(saved) player = JSON.parse(saved); }

// Affichage stats
function displayStats() {
  const ul = document.getElementById("statsList");
  ul.innerHTML = "";
  for(let s in player.stats) {
    const li = document.createElement("li");
    li.textContent = `${s}: ${player.stats[s]}`;
    ul.appendChild(li);
  }
}

// Affichage classe
function displayClass() {
  const classDisplay = document.getElementById("classDisplay");
  const classSelect = document.getElementById("classSelect");
  if(classDisplay) classDisplay.textContent = player.currentClass || "—";
  if(classSelect) classSelect.value = player.currentClass;
}

// Remplir menu déroulant classes
function populateClassSelect() {
  const classSelect = document.getElementById("classSelect");
  classSelect.innerHTML = "";

  const startClasses = START_CLASSES[player.race] || [];
  const classesToShow = [...startClasses];
  if(!classesToShow.includes(player.currentClass)) classesToShow.push(player.currentClass);

  classesToShow.forEach(cls => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    classSelect.appendChild(opt);
  });

  classSelect.value = player.currentClass;
  displayClass();
}

// Ajouter XP
function addXP(amount) {
  player.xp += amount;

  let leveled = false;
  while(player.level < 76 && player.xp >= XP_TABLE[player.level+1]) {
    player.level++;
    leveled = true;
  }

  checkClassEvolution();

  if(leveled) updateStats();
  updateXPBar();
  savePlayer();
}

// Calcul stats
function updateStats() {
  const cls = CLASS_DATA[player.currentClass];
  if(!cls) return;
  const stats = {};
  for(let s in cls.baseStats) stats[s] = cls.baseStats[s] + cls.growth[s]*(player.level-1);
  player.stats = stats;
  displayStats();
}

// Barre XP
function updateXPBar() {
  const xpNext = XP_TABLE[player.level+1]||XP_TABLE[76];
  const xpCurr = XP_TABLE[player.level];
  const percent = ((player.xp - xpCurr)/(xpNext - xpCurr))*100;
  const xpBar = document.getElementById("xpBar");
  xpBar.style.width = percent + "%";
  document.getElementById("xpText").textContent = `${player.xp} / ${xpNext} XP – Niveau ${player.level}`;
  document.getElementById("levelDisplay").textContent = player.level;
}

// Vérifier évolution
function checkClassEvolution() {
  const raceClasses = CLASS_PATHS[player.race];
  if(!raceClasses) return;

  let evolved = true;
  while(evolved) {
    evolved = false;
    const path = raceClasses[player.currentClass]?.evolvesTo;
    if(!path) break;

    const sortedLevels = Object.keys(path).map(Number).sort((a,b)=>a-b);

    for(const lvl of sortedLevels){
      if(player.level >= lvl){
        let next = path[lvl];
        if(typeof next === "object" && !Array.isArray(next)) next = next[player.currentClass] || [];

        if(next.length > 0 && !next.includes(player.currentClass)){
          const evoMsg = document.getElementById("evoMessage");
          if(evoMsg) evoMsg.textContent = `🎉 Vous pouvez évoluer ! Niveaux disponibles : ${next.join(", ")}`;

          let choix = prompt(`🎉 Vous pouvez évoluer ! Choisissez votre prochaine classe : ${next.join(", ")}`);
          if(choix && next.includes(choix)){
            player.currentClass = choix;
            updateStats();
            displayClass();
            savePlayer();
            evolved = true;

            // Mettre à jour menu avec nouvelle classe
            populateClassSelect();

            if(evoMsg) evoMsg.textContent = "";
            break;
          }
        }
      }
    }
  }
}

// Reset
function resetPlayer() {
  if(!confirm("Êtes-vous sûr de vouloir réinitialiser le personnage ?")) return;
  player = {
    name: "",
    race: "Humain",
    currentClass: "Fighter",
    level: 1,
    xp: 0,
    stats: {},
    karma: 0,
    inventory: [],
    inventoryWeight: 0
  };
  document.getElementById("name").value = "";
  document.getElementById("karma").value = 0;
  populateClassSelect();
  updateStats();
  updateXPBar();
  savePlayer();
}

// EXPORT / IMPORT
function exportCharacter() {
  const dataStr = JSON.stringify(player, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = player.name ? `${player.name}.json` : "perso.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importCharacter(event) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if(!data.currentClass || !data.level || !data.xp) {
        alert("Fichier invalide !");
        return;
      }
      player = data;
      populateClassSelect();
      updateStats();
      updateXPBar();
      displayClass();
      savePlayer();
      alert("Personnage chargé avec succès !");
    } catch(err) {
      alert("Fichier invalide !");
    }
  };
  reader.readAsText(file);
}

// INIT
document.addEventListener("DOMContentLoaded",()=>{
  loadPlayer();

  // Races
  const raceSelect = document.getElementById("raceSelect");
  RACES.forEach(r=>{ const o=document.createElement("option"); o.value=r; o.textContent=r; raceSelect.appendChild(o); });
  raceSelect.value = player.race;
  raceSelect.addEventListener("change",e=>{ player.race=e.target.value; populateClassSelect(); savePlayer(); });

  // Classes
  populateClassSelect();
  document.getElementById("classSelect").addEventListener("change", e=>{ player.currentClass=e.target.value; updateStats(); displayClass(); savePlayer(); });

  // XP
  document.getElementById("addXPBtn").addEventListener("click",()=>{ 
    const val = parseInt(document.getElementById("xpInput").value); 
    if(!isNaN(val) && val>0){ addXP(val); document.getElementById("xpInput").value=""; } 
  });

  // Karma
  const karmaInput = document.getElementById("karma");
  karmaInput.value = player.karma;
  karmaInput.addEventListener("change", e=>{ player.karma=parseInt(e.target.value)||0; savePlayer(); });

  // Reset
  document.getElementById("resetBtn").addEventListener("click", resetPlayer);

  // Export / Import
  document.getElementById("exportBtn").addEventListener("click", exportCharacter);
  document.getElementById("importInput").addEventListener("change", importCharacter);

  updateStats(); updateXPBar(); displayClass();
});
