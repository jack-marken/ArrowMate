
<!----------------------------------------------------------------
  HOME – four-quadrant welcome screen
----------------------------------------------------------------->
<section id="home" class="screen">
  <header class="hero hero--navy big-title"><h1>ArrowMate</h1></header>

  <main class="home-quad">
    <!-- TL: greeting + live data -->
    <div class="quad tl">
      <h2>Welcome!</h2>
      <p id="home-date"></p>
      <p id="home-time"></p>
      <p id="home-weather"></p>
    </div>

    <!-- TR: logo -->
    <div class="quad tr">
      <img src="assets/ArrowMateLogo.jpg" class="logo" alt="logo">
    </div>

    <!-- BL: reserved -->
    <div class="quad bl"></div>

    <!-- BR: quick account swap -->
    <div class="quad br">
      <button id="swap-account" class="primary swap-btn">Swap&nbsp;account</button>
    </div>
  </main>
</section>
