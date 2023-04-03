getLivData();
// getEspnData();

function addToScoreboard(scoreboardData, timestamp) {
  debugger;
  if (timestamp) {
    let timestampElement = document.getElementById("sb-timestamp");
    timestampElement.innerText = new Date(timestamp).toString();
    document.getElementById("timestamp-container").classList.add("visible");
  }

  let table = document.getElementById("sb-table-body");
  let row, cell;

  for (let i = 0; i < scoreboardData.length; i++) {
    row = table.insertRow();
    cell = row.insertCell();
    cell.colSpan = 8;
    cell.setHTML("<hr />");

    row = table.insertRow();

    cell = row.insertCell();
    if (i > 0 && scoreboardData[i].score === scoreboardData[i - 1].score) {
      cell.textContent = "-";
    } else {
      cell.textContent = scoreboardData[i].position;
    }

    cell.classList.add("position", "position-" + scoreboardData[i].position);
    cell.rowSpan = 3;

    cell = row.insertCell();
    cell.rowSpan = 3;
    cell.classList.add("vertical-spacer");

    let flagImage = document.createElement("img");
    flagImage.src = scoreboardData[i].flag.href;
    flagImage.alt = scoreboardData[i].flag.alt;
    flagImage.classList.add(["flag"]);

    let flagContainer = document.createElement("div");
    flagContainer.appendChild(flagImage);
    flagContainer.classList.add("flag-container");

    cell = row.insertCell();
    cell.appendChild(flagContainer);
    cell.rowSpan = 3;

    cell = row.insertCell();
    cell.rowSpan = 3;
    cell.classList.add("vertical-spacer");

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].name;
    cell.classList.add("text-left", "player-name");
    cell.rowSpan = 3;

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].score;
    cell.classList.add("text-centre", "score-hero");
    cell.colSpan = 3;

    row = table.insertRow();

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].r1;
    cell.classList.add("text-centre", "score-value");

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].r2;
    cell.classList.add("text-centre", "score-value");

    cell = row.insertCell();
    cell.textContent = scoreboardData[i].r3;
    cell.classList.add("text-centre", "score-value");

    row = table.insertRow();

    cell = row.insertCell();
    cell.textContent = "R1";
    cell.classList.add("text-centre", "score-title");

    cell = row.insertCell();
    cell.textContent = "R2";
    cell.classList.add("text-centre", "score-title");

    cell = row.insertCell();
    cell.textContent = "R3";
    cell.classList.add("text-centre", "score-title");
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
            position: 1,
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
          position: c.rank,
        };
      });
      addToScoreboard(scoreboardData, data.timeStamp);
    });
}
