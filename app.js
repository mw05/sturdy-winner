// ---------------------------------------------
// CHART RENDERER (GLOBAL)
// ---------------------------------------------
function renderVerticalGapChart(svgId, data, chartTitle) {
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

const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
title.setAttribute('x', width / 2);
title.setAttribute('y', 20);
title.setAttribute('text-anchor', 'middle');
title.setAttribute('font-size', '16');
title.setAttribute('font-weight', 'bold');
title.textContent = chartTitle;
svg.appendChild(title);

  
  // ----- Y AXIS -----
  const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  axis.setAttribute('x1', xPos - 100);
  axis.setAttribute('y1', paddingTop);
  axis.setAttribute('x2', xPos - 100);
  axis.setAttribute('y2', height - paddingBottom);
  axis.setAttribute('stroke', '#333');
  axis.setAttribute('stroke-width', 1);
  svg.appendChild(axis);

const steps = 8; // 8 intervals = 9 ticks
const axisLabels = [];

for (let i = 0; i <= steps; i++) {
  const val = minPoints + (i * (maxPoints - minPoints) / steps);
  axisLabels.push({
    val: Math.round(val),
    y: yScale(val)
  });
}


axisLabels.forEach(l => {
  const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  grid.setAttribute('x1', xPos - 90);
  grid.setAttribute('y1', l.y);
  grid.setAttribute('x2', xPos + 90);
  grid.setAttribute('y2', l.y);
  grid.setAttribute('stroke', '#ddd');
  grid.setAttribute('stroke-width', 1);
  svg.appendChild(grid);

  // LABEL (your original code)
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', xPos - 110);
  t.setAttribute('y', l.y + 4);
  t.setAttribute('text-anchor', 'end');
  t.setAttribute('font-size', '10');
  t.textContent = l.val;
  svg.appendChild(t);
});




  // ----- POINTS + LABELS -----
  data.forEach((d) => {
    const y = yScale(d.points);

    const isLeft = d.localIndex % 2 === 0;
    const labelOffset = isLeft ? -35 : 35;
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
    text.setAttribute('y', y+5);
    text.setAttribute('text-anchor', isLeft ? 'end' : 'start');
    text.setAttribute('font-size', '12');
    text.textContent = d.surname;
    svg.appendChild(text);

      circle.addEventListener('mouseenter', () => {
    text.style.fontWeight = 'bold';
    circle.setAttribute('fill', '#ff5722');
  });

  circle.addEventListener('mouseleave', () => {
    text.style.fontWeight = 'normal';
    circle.setAttribute('fill', '#007bff');
  });
    
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
  }))
  .sort((a, b) => b.points - a.points);

overallData.forEach((p, i) => p.localIndex = i);


    // Render chart
    renderVerticalGapChart("overall-chart", overallData, "Total Points Gap");

    

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

async function loadMonthlyChart() {
  const month = Number(document.getElementById("monthSelect").value);

  const url = `https://rough-frost-ba2a.wilson-matt.workers.dev/monthly?month=${month}`;
  const res = await fetch(url);
  const monthlyData = await res.json();

monthlyData.sort((a, b) => b.points - a.points);
monthlyData.forEach((p, i) => p.localIndex = i);
  
  renderVerticalGapChart("monthly-chart", monthlyData, "Monthly Points Gap");
}

