<template>
  <div class="travelgo-about-wrapper">
    <!-- Header Banner -->
    <header class="about-hero-banner">
      <div class="hero-image-overlay"></div>
      <div class="hero-text-content">
        <h1>About TravelGo</h1>
        <p>Your trusted travel partner for unforgettable journeys around the world.</p>
      </div>
    </header>

    <main class="about-main-container">
      <!-- Our Story Section -->
      <section class="our-story-section">
        <div class="story-info-side">
          <h2>Our Story</h2>
          <p>
            TravelGo was founded with a simple mission - to make travel easy, affordable, and
            unforgettable for everyone.
          </p>
          <p>
            We believe travel opens the door to new experiences, cultures, and memories that last a
            lifetime.
          </p>
          <p>
            Our team of travel experts works 24/7 to bring you the best travel packages, exclusive
            deals, and excellent service.
          </p>
          <button class="action-btn-learn" @click="scrollToValues">Learn More</button>
        </div>
        <div class="story-image-side">
          <img
            src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop"
            alt="Group of friends traveling"
            class="story-display-img"
          />
        </div>
      </section>

      <!-- Floating Stats Bar -->
      <section class="floating-stats-bar">
        <div v-for="(item, idx) in statsBlock" :key="'stat-' + idx" class="single-stat-box">
          <div class="stat-icon-circle" :style="{ backgroundColor: item.bg, color: item.color }">
            <i :class="item.icon"></i>
          </div>
          <div class="stat-lbl-count">
            <h3>{{ item.count }}</h3>
            <p>{{ item.label }}</p>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="why-choose-us-section">
        <h2>Why Choose Us?</h2>
        <div class="features-flex-grid">
          <div v-for="(feat, idx) in featuresBlock" :key="'feat-' + idx" class="feature-card-item">
            <div
              class="feature-icon-circle"
              :style="{ backgroundColor: feat.bg, color: feat.color }"
            >
              <i :class="feat.icon"></i>
            </div>
            <div class="feature-card-details">
              <h4>{{ feat.title }}</h4>
              <p>{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Core Values Section (Team အစား ဒီဇိုင်းဆန်းဆန်းလေး ပြောင်းလဲထားသောအပိုင်း) -->
      <section ref="valuesSection" class="core-values-section">
        <h2>Our Core Values</h2>
        <p class="section-subtitle">The principles that guide our journeys</p>

        <div class="values-flex-grid">
          <div v-for="(val, idx) in valuesBlock" :key="'value-' + idx" class="value-card-item">
            <div class="value-icon-box" :style="{ color: val.color }">
              <i :class="val.icon"></i>
            </div>
            <h4>{{ val.title }}</h4>
            <p>{{ val.desc }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      statsBlock: [
        {
          count: '50K+',
          label: 'Happy Travelers',
          icon: 'fas fa-users',
          bg: '#e8f0fe',
          color: '#1a73e8',
        },
        {
          count: '2K+',
          label: 'Travel Packages',
          icon: 'fas fa-box-open',
          bg: '#e6f4ea',
          color: '#137333',
        },
        { count: '3+', label: 'Countries', icon: 'fas fa-globe', bg: '#fef7e0', color: '#b06000' },
        {
          count: '24/7',
          label: 'Customer Support',
          icon: 'fas fa-headset',
          bg: '#f3e8ff',
          color: '#a855f7',
        },
      ],
      featuresBlock: [
        {
          title: 'Best Price Guarantee',
          desc: 'We offer the best prices for top destinations.',
          icon: 'fas fa-thumbs-up',
          bg: '#e8f0fe',
          color: '#1a73e8',
        },
        {
          title: 'Handpicked Packages',
          desc: 'Carefully selected packages for an amazing experience.',
          icon: 'fas fa-suitcase',
          bg: '#e6f4ea',
          color: '#137333',
        },
        {
          title: 'Trusted & Safe',
          desc: 'Your safety and satisfaction are our top priority.',
          icon: 'fas fa-shield-alt',
          bg: '#fce8e6',
          color: '#c5221f',
        },
        {
          title: '24/7 Support',
          desc: 'We are here to help you anytime, anywhere.',
          icon: 'fas fa-headset',
          bg: '#f3e8ff',
          color: '#a855f7',
        },
      ],
      // Core Values Data
      valuesBlock: [
        {
          title: 'Eco-Friendly Tourism',
          desc: 'We promote responsible travel to protect natural habitats and support local communities.',
          icon: 'fas fa-leaf',
          color: '#137333',
        },
        {
          title: 'Customer-First Mindset',
          desc: 'Your comfort and happiness are at the heart of everything we plan and design.',
          icon: 'fas fa-heart',
          color: '#c5221f',
        },
        {
          title: 'Seamless Integration',
          desc: 'Making booking, traveling, and exploring as smooth and digital as possible.',
          icon: 'fas fa-bolt',
          color: '#b06000',
        },
      ],
    }
  },
  methods: {
    scrollToValues() {
      if (this.$refs.valuesSection) {
        this.$refs.valuesSection.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
}
</script>

<style scoped>
.travelgo-about-wrapper {
  background-color: rgb(236, 249, 254);
  color: #1e293b;
  min-height: 100vh;
  padding-bottom: 60px;
}

.about-main-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}

.about-hero-banner {
  position: relative;
  background-image: url('public/about.jpg');
  background-size: cover;
  background-position: center 30%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #0f0e45;
  border-radius: 20px;
  margin: 0 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.hero-text-content {
  position: relative;
  z-index: 2;
}

.hero-text-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.hero-text-content p {
  font-size: 1.15rem;
  max-width: 550px;
  margin: 0 auto;
  opacity: 0.95;
  line-height: 1.5;
}

.our-story-section {
  display: flex;
  align-items: center;
  gap: 50px;
  margin: 60px 0;
  position: relative;
}

.story-info-side {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.story-info-side h2 {
  font-size: 2.2rem;
  color: #0f172a;
  margin: 0 0 20px 0;
  font-weight: 700;
}

.story-info-side p {
  color: #475569;
  line-height: 1.7;
  font-size: 1.05rem;
  margin: 0 0 16px 0;
}

.action-btn-learn {
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 14px rgba(26, 115, 232, 0.3);
  transition: all 0.2s ease-in-out;
  display: inline-block;
}

.action-btn-learn:hover {
  background-color: #1557b0;
  transform: translateY(-2px);
}

.story-image-side {
  flex: 0.9;
}

.story-display-img {
  width: 100%;
  height: 340px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.floating-stats-bar {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 25px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(241, 245, 249, 0.8);
  margin-bottom: 60px;
}

.single-stat-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.stat-lbl-count h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.stat-lbl-count p {
  margin: 2px 0 0 0;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.why-choose-us-section {
  text-align: center;
  margin-bottom: 60px;
}

.why-choose-us-section h2 {
  font-size: 2.2rem;
  color: #0f172a;
  margin-bottom: 45px;
  font-weight: 700;
}

.features-flex-grid {
  display: flex;
  gap: 24px;
}

.feature-card-item {
  flex: 1;
  background-color: #ffffff;
  padding: 35px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.015);
  border: 1px solid rgba(241, 245, 249, 0.6);
  transition: transform 0.25s ease;
}

.feature-card-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
}

.feature-icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  margin: 0 auto 20px auto;
}

.feature-card-details h4 {
  font-size: 1.15rem;
  color: #0f172a;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.feature-card-details p {
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* Core Values Section CSS */
.core-values-section {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 40px;
}

.core-values-section h2 {
  font-size: 2.2rem;
  color: #0f172a;
  margin-bottom: 10px;
  font-weight: 700;
}

.section-subtitle {
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 40px;
}

.values-flex-grid {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.value-card-item {
  flex: 1;
  max-width: 350px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.015);
  border: 1px solid rgba(241, 245, 249, 0.6);
  transition: all 0.3s ease;
}

.value-card-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
}

.value-icon-box {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.value-card-item h4 {
  font-size: 1.25rem;
  color: #0f172a;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.value-card-item p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* Responsive Grid Setup */
@media (max-width: 992px) {
  .our-story-section {
    flex-direction: column;
    gap: 35px;
    text-align: center;
  }
  .story-info-side {
    align-items: center;
  }
  .floating-stats-bar {
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
  }
  .single-stat-box {
    flex: 1 1 40%;
    justify-content: flex-start;
    padding-left: 15%;
  }
  .features-flex-grid,
  .values-flex-grid {
    flex-wrap: wrap;
    justify-content: center;
  }
  .feature-card-item,
  .value-card-item {
    flex: 1 1 43%;
  }
}

@media (max-width: 600px) {
  .single-stat-box {
    flex: 1 1 100%;
    padding-left: 0;
    justify-content: center;
  }
  .feature-card-item,
  .value-card-item {
    flex: 1 1 100%;
  }
  .hero-text-content h1 {
    font-size: 2.2rem;
  }
}
</style>
