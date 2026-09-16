// ---------------------------------------------
// CHART RENDERER (GLOBAL)
// ---------------------------------------------
function renderVerticalGapChart(svgId, data) {
  const svg = document.getElementById(svgId);
  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');

  const paddingTop = 40;
  const paddingBottom = 40;
  const xPos = width / 2;

  const maxPoints = Math.max(...data.map(d => d.points));
  const minPoints = Math.min(...data.map(d => d.points));

  function yScale(points) {
    if (maxPoints === minPoints) return height / 2;
    const t = (points - minPoints) / (maxPoints - minPoints);
    return height - paddingBottom - t * (height - paddingTop - paddingBottom);
  }

  // Clear previous chart
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // ----- Y AXIS -----
  const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  axis.setAttribute('x1', xPos - 100);
  axis.setAttribute('y1', paddingTop);
  axis.setAttribute('x2', xPos - 100);
  axis.setAttribute('y2', height - paddingBottom);
  axis.setAttribute('stroke', '#333');
  axis.setAttribute('stroke-width', 1);
  svg.appendChild(axis);

  const axisLabels = [
    { val: maxPoints, y: yScale(maxPoints) },
    { val: Math.round((maxPoints + minPoints) / 2), y: yScale((maxPoints + minPoints) / 2) },
    { val: minPoints, y: yScale(minPoints) }
  ];

  axisLabels.forEach(l => {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', xPos - 110);
    t.setAttribute('y', l.y + 4);
    t.setAttribute('text-anchor', 'end');
    t.setAttribute('font-size', '10');
    t.textContent = l.val;
    svg.appendChild(t);
  });

  // ----- POINTS + LABELS -----
  data.forEach((d, i) => {
    const y = yScale(d.points);

    const isLeft = i % 2 === 0;
    const labelOffset = isLeft ? -40 : 40;
    const lineOffset = isLeft ? -20 : 20;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', xPos);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 5);
    circle.setAttribute('fill', '#007bff');
    svg.appendChild(circle);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', xPos + lineOffset);
    line.setAttribute('y1', y);
    line.setAttribute('x2', xPos);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', '#555');
    line.setAttribute('stroke-width', 1);
    svg.appendChild(line);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', xPos + labelOffset);
    text.setAttribute('y', y - 5);
    text.setAttribute('text-anchor', isLeft ? 'end' : 'start');
    text.setAttribute('font-size', '12');
    text.textContent = d.surname;
    svg.appendChild(text);
  });
}

// ---------------------------------------------
// 2. Your loadLeague() function
// ---------------------------------------------
async function loadLeague() {
  const url = "https://rough-frost-ba2a.wilson-matt.workers.dev/";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const standings = data.standings.results;

    // Build chart data
    const overallData = standings.map(s => ({
      surname: s.player_name.split(" ").slice(-1)[0],
      points: s.total
    }));

    // Render chart
    renderVerticalGapChart("overall-chart", overallData);

    // Your existing table code...
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

