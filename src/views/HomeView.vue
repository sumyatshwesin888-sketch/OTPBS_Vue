<template>
  <div class="home-view-container">
    <header class="hero-section">
      <div class="hero-bg-media-layer" style="background-image: url('/homebg (2).png')"></div>
      <div class="hero-overlay-gradient"></div>

      <div class="hero-content">
        <h1 class="hero-title">Discover Your Next Adventure</h1>
        <p class="hero-subtitle">
          Book amazing travel packages to explore the world or<br />
          beautiful places within your country.
        </p>
      </div>

      <div class="trips-category-section">
        <div class="categories-grid">
          <router-link to="/packages" replace class="trip-main-card domestic-premium-card"
            style="display: block; text-decoration: none; color: inherit">
            <div class="floating-badge-icon">
              <svg viewBox="0 0 24 24" class="svg-icon-inner text-green-color">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-12-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>

            <div class="card-image-wrapper">
              <img src="/DomesticHome.png" alt="Domestic Destinations" class="card-cover-img" />
            </div>

            <div class="card-content">
              <h3 class="card-title text-green">Domestic Trips</h3>
              <p class="card-description">
                Explore beautiful destinations<br />within your country.
              </p>
              <div class="btn-explore btn-explore-green">
                <span>Explore Domestic Packages</span>
                <span class="arrow-icon">→</span>
              </div>
            </div>
          </router-link>

          <router-link to="/packages" replace class="trip-main-card international-premium-card"
            style="display: block; text-decoration: none; color: inherit">
            <div class="floating-badge-icon">
              <svg viewBox="0 0 24 24" class="svg-icon-inner text-blue-color">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>

            <div class="card-image-wrapper">
              <img src="/InternationalHome.png" alt="International Destinations" class="card-cover-img" />
            </div>

            <div class="card-content">
              <h3 class="card-title text-blue">International Trips</h3>
              <p class="card-description">Discover amazing places<br />around the world.</p>
              <div class="btn-explore btn-explore-blue">
                <span>Explore International Packages</span>
                <span class="arrow-icon">→</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
.home-view-container {
  width: 100vw !important;
  height: 100vh !important;
  overflow: hidden;
  position: relative;
}

.hero-section {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: white;
  text-align: center;
  overflow: hidden;
}

.hero-bg-media-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center 30%;
  z-index: 1;
  animation: slowZoomBg 16s ease-in-out infinite alternate;
}

.hero-overlay-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg,
      rgba(15, 23, 42, 0.35) 0%,
      rgba(15, 23, 42, 0.05) 40%,
      rgba(15, 23, 42, 0) 100%);
  z-index: 2;
}

/* Header Text Area */
.hero-content {
  position: relative;
  z-index: 3;
  padding-top: 105px;
  /* Navbar နှင့် အကွာအဝေး */
  width: 100%;
  max-width: 800px;
}

.hero-title {
  font-size: 37px;
  font-weight: 740;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.hero-subtitle {
  font-size: 14.5px;
  font-weight: 500;
  max-width: 560px;
  margin: 0 auto;
  opacity: 0.95;
  line-height: 1.5;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

/* Card Section Area */
.trips-category-section {
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 10;
  margin-top: auto;
  padding-bottom: 50px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  width: 100%;
}

/* Card Style / frame */
.trip-main-card {
  position: relative;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s ease;
}

.trip-main-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 35px rgba(15, 23, 42, 0.08);
}

/* card images*/
.card-image-wrapper {
  height: 150px;
  /* card image size */
  border-radius: 20px;
  overflow: hidden;
}

.card-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* cardမှာအပေါ်မှာဖြူပြီးအောက်တဖြည်း" အရောက်တောက်လာဖို့*/
.domestic-premium-card {
  background: linear-gradient(180deg, #ffffff 45%, #e9fcee 100%);
  border: 1px solid rgba(22, 163, 74, 0.12);
}

.international-premium-card {
  background: linear-gradient(180deg, #ffffff 45%, #e6edf8 100%);
  border: 1px solid rgba(37, 99, 235, 0.12);
}

/* Badge Icon ကဒ်အပေါ်က icon */
.floating-badge-icon {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  border: 4px solid white;
  z-index: 12;
  padding: 6px;
}

.svg-icon-inner {
  width: 100%;
  height: 100%;
}

.text-green-color {
  fill: #16a34a;
}

.text-blue-color {
  fill: #2563eb;
}

.card-content {
  padding: 10px 24px 18px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  position: relative;
  z-index: 2;
}

.card-title {
  font-size: 22px;
  font-weight: 800;

  margin-bottom: 1px;
}

.text-green {
  color: #16a34a;
}

.text-blue {
  color: #2563eb;
}

.card-description {
  font-size: 12.5px;
  color: #475569;
  line-height: 1.45;
  max-width: 280px;
  font-weight: 550;
  margin-bottom: 10px;
}

/* Explore Button */
.btn-explore {
  width: 100%;
  max-width: 260px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  font-size: 12.5px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
  margin-top: 5px;
  transition: background 0.2s;
}

.btn-explore-green {
  background: #16a34a;
  color: white;
}

.btn-explore-green:hover {
  background: #15803d;
}

.btn-explore-blue {
  background: #2563eb;
  color: white;
}

.btn-explore-blue:hover {
  background: #1d4ed8;
}

/* Bg image Animation */
@keyframes slowZoomBg {
  0% {
    transform: scale(1);
    /* original size */
  }

  100% {
    transform: scale(1.08);
    /* ၁၆ စက္ကန့်ပြည့်ရင် 8% ဖြည်းဖြည်းချင်း ကြီးလာဖို့*/
  }
}
</style>
