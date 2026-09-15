async function loadLeague() {
  const leagueId = 233488;
  const url = `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`;

  const res = await fetch(url, { mode: "cors" });
  const data = await res.json();
  const standings = data.standings.results;

  const table = document.getElementById("leagueTable");
  table.innerHTML = "";

  const header = `
    <tr>
      <th>Player</th>
      <th>Team</th>
      <th>Rank</th>
      <th>Last Rank</th>
      <th>Total Points</th>
      <th>GW Points</th>
    </tr>
  `;
  table.innerHTML += header;

  standings.forEach(s => {
    const row = `
      <tr>
        <td>${s.player_name}</td>
        <td>${s.entry_name}</td>
        <td>${s.rank}</td>
        <td>${s.last_rank}</td>
        <td>${s.total}</td>
        <td>${s.event_total}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}
