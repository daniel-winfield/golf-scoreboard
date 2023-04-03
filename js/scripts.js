getLivData();

function addToScoreboard(scoreboardData) {
  let table = document.getElementById("sb-table-body");
  let row, cell;

  for (let i = 0; i < scoreboardData.length; i++) {
    row = table.insertRow();
    let flagImage = document.createElement("img");
    flagImage.src = scoreboardData[i].flag.href;
    flagImage.alt = scoreboardData[i].flag.alt;
    flagImage.classList.add(["flag"]);

    let flagContainer = document.createElement("div");
    flagContainer.appendChild(flagImage);
    flagContainer.classList.add("flag-container");

    cell = row.insertCell();
    cell.appendChild(flagContainer);

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].name;
    cell.classList.add("text-left");

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].score;
    cell.classList.add("text-centre");

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].r1;
    cell.classList.add("text-centre");

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].r2;
    cell.classList.add("text-centre");

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].r3;
    cell.classList.add("text-centre");
  }
}

function getEspnData() {
  var uri = "https://site.api.espn.com/apis/site/v2/sports/golf/liv/scoreboard";

  fetch(uri)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let scoreboardData = data.events[0].competitions[0].competitors.map(
        (c) => {
          return {
            name: c.athlete.shortName,
            flag: c.athlete.flag,
            score: c.score,
            r1: c.linescores[0].value,
            r2: c.linescores[1].value,
            r3: c.linescores[2].value,
          };
        }
      );

      addToScoreboard(scoreboardData);
    });
}

function getLivData() {
  var uri = "https://web-common.livgolf.com/api/leaderboard/players/11";

  fetch(uri)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let scoreboardData = data.players.map((c) => {
        return {
          name: c.name,
          flag: { href: c.team.logoUrl, alt: c.team.name },
          score: c.totalScore,
          r1: c.rounds[0],
          r2: c.rounds[1],
          r3: c.rounds[2],
        };
      });
      addToScoreboard(scoreboardData);
    });
}
