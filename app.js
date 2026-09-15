async function loadLeague() {
  const url = "https://rough-frost-ba2a.wilson-matt.workers.dev/";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const standings = data.standings.results;

    const table = document.getElementById("leagueTable");
    table.innerHTML = `
      <tr>
        <th>Player</th>
        <th>Team</th>
        <th>Rank</th>
        <th>Last Rank</th>
        <th>Total Points</th>
        <th>GW Points</th>
      </tr>
    `;

    standings.forEach(s => {
      table.innerHTML += `
        <tr>
          <td>${s.player_name}</td>
          <td>${s.entry_name}</td>
          <td>${s.rank}</td>
          <td>${s.last_rank}</td>
          <td>${s.total}</td>
          <td>${s.event_total}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.log("Fetch failed:", err);
  }
}
