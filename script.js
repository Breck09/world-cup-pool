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

      div.appendChild(select);
    });

    groupContainer.appendChild(div);
  }
}

function getTopTeams() {
  let topTeams = [];

  document.querySelectorAll(".group").forEach(groupDiv => {
    let selections = [];

    groupDiv.querySelectorAll("select").forEach(sel => {
      let text = sel.options[sel.selectedIndex].text;
      let team = text.split(" - ")[0];
      let pos = parseInt(sel.value);

      selections.push({ team, pos });
    });

    selections.sort((a,b) => a.pos - b.pos);

    topTeams.push(selections[0].team);
    topTeams.push(selections[1].team);
  });

  return topTeams;
}

function generateBracket() {
  const bracketDiv = document.getElementById("bracket");
  bracketDiv.innerHTML = "";

  const teams = getTopTeams();

  for (let i = 0; i < teams.length; i += 2) {
    let match = document.createElement("div");
    match.className = "match";

    match.innerHTML = `
      <div onclick="pickWinner(this)">${teams[i]}</div>
      <div onclick="pickWinner(this)">${teams[i+1]}</div>
    `;

    bracketDiv.appendChild(match);
  }
}

function pickWinner(el) {
  const parent = el.parentElement;
  [...parent.children].forEach(c => c.classList.remove("winner"));
  el.classList.add("winner");
}

createGroups();
