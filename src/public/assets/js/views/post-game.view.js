/*
<div class="stats-container">
    <div
      class="stats-row-50"
    >
      <div class="stat-value" id="total-games-played">0</div>
      <div class="stat-label">Games Played</div>
    </div>
    <div
      class="stats-row-50"
    >
      <div class="stat-value" id="total-games-played">0.00%</div>
      <div class="stat-label">Win Rate</div>
    </div>
    <div class="stats-row-1">
      <div class="stat-value" id="wins">0</div>
      <div class="stat-label">Wins</div>
    </div>
    <div class="stats-row-1">
      <div class="stat-value" id="misses">0</div>
      <div class="stat-label">Misses</div>
    </div>
    <div class="stats-row-1">
      <div class="stat-value" id="forfeited">0</div>
      <div class="stat-label">Forfeited</div>
    </div>
    <div class="stats-row">
      <div class="stat-label-fw">
        Attempt Win Distribution
      </div>
    </div>
    <% for (var i = 1; i < 7; i++) { %>
    <div class="stats-row-1">
      <div class="stat-value" id="attempt-wins-<%- i %>">0.00%</div>
      <div class="stat-label">
        <%- i %><sup><%- suffixes[i - 1] ? suffixes[i - 1] : "th" %></sup>
      </div>
    </div>
    <% } %>
  </div>
  */