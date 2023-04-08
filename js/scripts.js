const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let value = params.tournament;
updateScoreboard(value);
setInterval(updateScoreboard, 2 * 60 * 1000, value);

function updateScoreboard(value) {
  console.log("Refresh started: " + value);
  switch (value == null ? null : value.toLowerCase()) {
    case "liv":
      getLivData();
      // getEspnData();

      document.body.classList.add("liv-theme");
      break;
    case "masters":
      getMastersData();
      document.body.classList.add("masters-theme");
      break;
    default:
      break;
  }
}

function addToScoreboard(scoreboardData, timestamp, pageTitle, cutoffNumber) {
  if (pageTitle) {
    let titleElement = document.getElementById("sb-name");
    titleElement.innerText = pageTitle;
  }

  if (timestamp) {
    let timestampElement = document.getElementById("sb-timestamp");
    timestampElement.innerText = new Date(timestamp).toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "long",
    });
    document.getElementById("timestamp-container").classList.add("visible");
  }

  let table = document.getElementById("sb-table-body");

  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  let row, cell, cutoffIndex;

  if (cutoffNumber) {
    cutoffIndex = calculateCutoffLine(scoreboardData, cutoffNumber);
  }

  for (let i = 0; i < scoreboardData.length; i++) {
    let numOfCols = 9;

    if (cutoffIndex && i == cutoffIndex) {
      row = table.insertRow();
      cell = row.insertCell();
      cell.colSpan = numOfCols;
      let hrElement = document.createElement("hr");
      hrElement.classList.add("cutoff-line");
      cell.appendChild(hrElement);

      row = table.insertRow();
      cell = row.insertCell();
      cell.colSpan = numOfCols;
      cell.classList.add("cutoff-text");
      let spanElement = document.createElement("span");
      spanElement.innerText = "Cutoff";
      cell.appendChild(spanElement);
    }

    row = table.insertRow();
    cell = row.insertCell();
    cell.colSpan = numOfCols;
    let hrElement = document.createElement("hr");
    if (cutoffIndex && i == cutoffIndex) {
      hrElement.classList.add("cutoff-line");
    }
    cell.appendChild(hrElement);

    row = table.insertRow();

    cell = row.insertCell();
    if (i > 0 && scoreboardData[i].score === scoreboardData[i - 1].score) {
      cell.textContent = "-";
    } else {
      cell.textContent = i + 1;
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

    let numOfRounds = 4;
    cell = row.insertCell();
    cell.textContent = scoreboardData[i].score;
    cell.classList.add("text-centre", "score-hero");
    cell.colSpan = numOfRounds;

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

    if (scoreboardData[i].r4) {
      cell = row.insertCell();
      cell.textContent = scoreboardData[i].r4;
      cell.classList.add("text-centre", "score-value");
    }

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

    if (scoreboardData[i].r4) {
      cell = row.insertCell();
      cell.textContent = "R4";
      cell.classList.add("text-centre", "score-title");
    }
  }
  console.log("Refresh finished");
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

function getMastersData() {
  var uri = "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard";

  fetch(uri)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let scoreboardData = data.events[0].competitions[0].competitors.map(
        (c, index) => {
          return {
            name: c.athlete.shortName,
            flag: c.athlete.flag,
            score: c.score,
            r1: c.linescores[0]
              ? constructRoundScore(
                  c.linescores[0].value,
                  c.linescores[0].linescores != null
                    ? c.linescores[0].linescores.length
                    : null
                )
              : "~",
            r2: c.linescores[1]
              ? constructRoundScore(
                  c.linescores[1].value,
                  c.linescores[1].linescores != null
                    ? c.linescores[1].linescores.length
                    : null
                )
              : "~",
            r3: c.linescores[2]
              ? constructRoundScore(
                  c.linescores[2].value,
                  c.linescores[2].linescores != null
                    ? c.linescores[2].linescores.length
                    : null
                )
              : "~",
            r4:
              c.linescores[3] && c.linescores[3].length
                ? constructRoundScore(
                    c.linescores[3].value,
                    c.linescores[3].linescores != null
                      ? c.linescores[3].linescores.length
                      : null
                  )
                : "~",
            position: index + 1,
          };
        }
      );

      // Fix position of tied places
      scoreboardData.forEach((d, index) => {
        if (index === 0) {
          return;
        }

        if (d.score === scoreboardData[index - 1].score) {
          d.position = scoreboardData[index - 1].position;
        }
      });

      addToScoreboard(scoreboardData, Date.now(), data.events[0].name, 50);
    });
}

function constructRoundScore(roundTotal, holesComplete) {
  if (holesComplete && holesComplete < 18) {
    return `${roundTotal} (${holesComplete})`;
  }
  return roundTotal;
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
      addToScoreboard(scoreboardData, data.timeStamp, "Liv Golf League", null);
    });
}

function calculateCutoffLine(scoreboardData, cutoffNumber) {
  // return scoreboardData.findLastIndex((data) => data.position == cutoffNumber);
  for (let i = 0; i < scoreboardData.length; i++) {
    if (scoreboardData[i].position > cutoffNumber) {
      return i;
    }
  }
}
