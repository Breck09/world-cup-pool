const groups = {
  A: ["USA", "Mexico", "Canada", "Japan"],
  B: ["Brazil", "Germany", "Nigeria", "Korea"],
  C: ["France", "Spain", "Chile", "Iran"],
  D: ["Argentina", "Italy", "Ghana", "Australia"],
  E: ["England", "Netherlands", "USA2", "Morocco"],
  F: ["Portugal", "Croatia", "Cameroon", "Qatar"],
  G: ["Belgium", "Uruguay", "Senegal", "Saudi Arabia"],
  H: ["Denmark", "Switzerland", "Poland", "Peru"],
  I: ["Colombia", "Japan2", "Ivory Coast", "Wales"],
  J: ["Serbia", "Turkey", "Panama", "Egypt"],
  K: ["Mexico2", "Canada2", "Algeria", "Ecuador"],
  L: ["USA3", "Brazil2", "Tunisia", "Greece"]
};

const groupContainer = document.getElementById("groups");
const bracketDiv = document.getElementById("bracket");

let bracket = [];

// ---------------- GROUPS ----------------
function createGroups() {
  for (let g in groups) {
    let div = document.createElement("div");
    div.className = "group";
    div.innerHTML = `<h3>Group ${g}</h3>`;

    groups[g].forEach(team => {
      let select = document.createElement("select");

      [1,2,3,4].forEach(pos => {
        let option = document.createElement("option");
        option.value = pos;
        option.text = `${team} - ${pos}`;
        select.appendChild(option);
      });

      select.onchange = saveData;
      div.appendChild(select);
    });

    groupContainer.appendChild(div);
  }
}

// ---------------- GET QUALIFIERS ----------------
function getTopTeams() {
  let topTeams = [];

  document.querySelectorAll(".group").forEach(groupDiv => {
    let selections = [];

    groupDiv.querySelectorAll("select").forEach(sel => {
      let team = sel.options[sel.selectedIndex].text.split(" - ")[0];
      let pos = parseInt(sel.value);
      selections.push({ team, pos });
    });

    selections.sort((a,b) => a.pos - b.pos);

    topTeams.push(selections[0].team);
    topTeams.push(selections[1].team);
  });

  return topTeams;
}

// ---------------- GENERATE FULL BRACKET ----------------
function generateBracket() {
  bracket = [];
  bracketDiv.innerHTML = "";

  let teams = getTopTeams();

  // Build rounds
  while (teams.length > 1) {
    let round = [];

    for (let i = 0; i < teams.length; i += 2) {
      round.push({
        team1: teams[i],
        team2: teams[i+1],
        winner: null
      });
    }

    bracket.push(round);
    teams = new Array(round.length).fill(null);
  }

  renderBracket();
  saveData();
}

// ---------------- RENDER ----------------
function renderBracket() {
  bracketDiv.innerHTML = "";

  bracket.forEach((round, rIndex) => {
    let roundDiv = document.createElement("div");
    roundDiv.className = "bracket-round";

    round.forEach((match, mIndex) => {
      let matchDiv = document.createElement("div");
      matchDiv.className = "match";

      ["team1", "team2"].forEach(teamKey => {
        let teamDiv = document.createElement("div");
        teamDiv.innerText = match[teamKey] || "-";

        if (match.winner === match[teamKey]) {
          teamDiv.classList.add("winner");
        }

        teamDiv.onclick = () => pickWinner(rIndex, mIndex, teamKey);

        matchDiv.appendChild(teamDiv);
      });

      roundDiv.appendChild(matchDiv);
    });

    bracketDiv.appendChild(roundDiv);
  });
}

// ---------------- PICK WINNER ----------------
function pickWinner(r, m, teamKey) {
  let match = bracket[r][m];
  let winner = match[teamKey];

  match.winner = winner;

  // Advance to next round
  if (bracket[r+1]) {
    let nextMatchIndex = Math.floor(m / 2);
    let nextMatch = bracket[r+1][nextMatchIndex];

    if (m % 2 === 0) {
      nextMatch.team1 = winner;
    } else {
      nextMatch.team2 = winner;
    }
  }

  renderBracket();
  saveData();
}

// ---------------- SAVE / LOAD ----------------
function saveData() {
  const data = {
    groups: [],
    bracket: bracket
  };

  document.querySelectorAll(".group select").forEach(sel => {
    data.groups.push(sel.value);
  });

  localStorage.setItem("wc2026", JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("wc2026"));
  if (!data) return;

  let selects = document.querySelectorAll(".group select");
  selects.forEach((sel, i) => {
    sel.value = data.groups[i];
  });

  if (data.bracket.length > 0) {
    bracket = data.bracket;
    renderBracket();
  }
}

// ---------------- INIT ----------------
createGroups();
setTimeout(loadData, 100);
