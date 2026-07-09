<template>
  <div class="detail-page">
    <div  class="detail-container">
      <button class="back-btn" @click="$router.back()">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to Packages
      </button>

      <div class="detail-layout">
        <div class="detail-left">
          <h1 class="pkg-title">{{ pkg?.title }}</h1>
          <div class="pkg-meta-row">
            <div class="pkg-location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#64748B">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                />
              </svg>
              {{ pkg?.city }}, {{ pkg?.country }}
            </div>
            <!-- <div class="pkg-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
              <span class="rat-val">{{ averageRating }}</span>
              <span class="rat-cnt">({{ commentsDataset.length }} reviews)</span>
            </div> -->
          </div>

          <!-- <div class="hero-img-wrap">
            <img :src="selectedImg" :alt="pkg?.title" class="hero-img" />
            <div class="pkg-type-tag" :class="pkg?.type === 'domestic' ? 'tag-green' : 'tag-blue'">
              {{ pkg?.type === 'domestic' ? 'Domestic' : 'International' }}
            </div>
          </div>

          <div v-if="pkg?.thumbnail_images && pkg?.thumbnail_images.length" class="thumbs-strip">
            <div
              v-for="(img, i) in pkg?.thumbnail_images"
              :key="i"
              class="thumb"
              :class="{ active: selectedImg === img }"
              @click="selectedImg = img"
            >
              <img :src="img" class="thumb-img" alt="thumbnail" />
            </div>
          </div>

          <div class="content-block">
            <h2 class="block-title">Overview</h2>
            <p class="overview-text">{{ pkg?.overview }}</p>
          </div>

          <div class="content-block">
            <h2 class="block-title">Itinerary</h2>
            <div v-if="pkg.itinerary && pkg.itinerary.length" class="itinerary-list">
              <div v-for="(day, idx) in pkg.itinerary" :key="idx" class="itin-item">
                <div class="itin-connector">
                  <div class="itin-dot" :class="idx === 0 ? 'dot-first' : ''">
                    <span class="dot-num">{{ idx + 1 }}</span>
                  </div>
                  <div v-if="idx < pkg.itinerary.length - 1" class="itin-line" />
                </div>
                <div
                  class="itin-content"
                  :class="{ 'itin-last': idx === pkg.itinerary.length - 1 }"
                >
                  <div class="itin-title">{{ day.title }}</div>
                  <div class="itin-desc">{{ day.description }}</div>
                </div>
              </div>
            </div>
          </div> -->

          <!-- Modern Reviews & Comments Section -->
          <div class="content-block rating-comment-section">
            <h2 class="review-block-title">Reviews & Comments</h2>

            <div class="comment-form">
              <h3 class="form-title">Write a Review</h3>

              <div class="rating-input-wrapper">
                <span class="rating-label">Your Rating:</span>
                <div class="stars-container">
                  <span
                    v-for="star in 5"
                    :key="star"
                    @click="newRating = star"
                    class="interactive-star"
                    :style="{ color: star <= newRating ? '#f59e0b' : '#cbd5e1' }"
                  >
                    ★
                  </span>
                </div>
                <span class="rating-number">({{ newRating }}/5)</span>
              </div>

              <textarea
                v-model="newComment"
                placeholder="Share your experience about this package..."
                rows="4"
                class="modern-textarea"
              ></textarea>

              <div class="btn-submit-wrapper">
                <button @click="submitReview" class="modern-submit-btn">Submit Review</button>
              </div>
            </div>

            <div class="comments-list">
              <h3 class="list-title">User Reviews ({{ commentsDataset.length }})</h3>

              <div v-if="commentsDataset.length === 0" class="no-reviews">
                No reviews yet. Be the first to review!
              </div>

              <div v-for="(rev, index) in commentsDataset" :key="index" class="comment-card">
                <div class="comment-card-header">
                  <div class="user-info">
                    <!-- Avatar ထဲက စာလုံးကိုလည်း နာမည်ရဲ့ ပထမဆုံးစာလုံး ဖြစ်အောင် လုပ် -->
                    <div class="user-avatar">{{ (rev.user_name || 'A')[0].toUpperCase() }}</div>
                    <!-- Rating ပေးတဲ့ UserName -->
                    <span class="user-name">{{ rev.user_name || 'Anonymous Traveller' }}</span>
                  </div>
                  <div class="display-stars">
                    <span
                      v-for="s in 5"
                      :key="s"
                      :style="{ color: s <= rev.rating ? '#f59e0b' : '#cbd5e1' }"
                      class="static-star"
                    >
                      ★
                    </span>
                  </div>
                </div>
                <p class="comment-content-text">{{ rev.comment }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-right">
          <div class="pricing-card">
            <div class="price-section">
              <!-- <span class="price-amount">{{ formatMMK(pkg.price) }}</span> -->
              <span class="price-per">/ person</span>
            </div>

            <div class="divider" />

            <div class="specs-list">
              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Duration
                </div>
                <!-- <span class="spec-val">{{ pkg.duration }}</span> -->
              </div>
              <div class="spec-row">
    <div class="spec-lbl">📅 Departure Date</div>
    <!-- <span class="spec-val" style="font-weight: 600; color: #0f172a;">
      {{ pkg.departure_date || 'Coming Soon' }}
    </span> -->
  </div>

  <div class="spec-row">
    <div class="spec-lbl">🎟️ Ticket Left</div>
    <!-- <span class="spec-val" :style="{ color: pkg.available_tickets <= 5 ? '#ef4444' : '#10b981', fontWeight: '700' }">
      {{ pkg.available_tickets > 0 ? pkg.available_tickets + ' / ' + (pkg.max_tickets || 20) + ' Left' : 'Out Of Stock' }}
    </span> -->
  </div>

              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Group Size
                </div>
                <!-- <span class="spec-val">{{ pkg.group_size }}</span> -->
              </div>

              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Hotel
                </div>
                <span class="spec-val">{{ pkg.hotelName}}</span>
              </div>

              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <path
                      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                    />
                  </svg>
                  Transport
                </div>
                <span class="spec-val">Included</span>
              </div>

              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Meals
                </div>
                <span class="spec-val">{{ pkg.meals || 'Not Included' }}</span>
              </div>
            </div>

            <div class="divider" />

            <button class="book-btn" @click="handleBooking">Book Now</button>

            <button class="wishlist-btn" @click="toggleWishlist">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                :fill="inWishlist ? '#E53E3E' : 'none'"
                :stroke="inWishlist ? '#E53E3E' : '#64748B'"
                stroke-width="2"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              {{ inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-else-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="not-found">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CBD5E1"
        stroke-width="1.5"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
      <p>Package not found.</p>
      <router-link to="/packages" class="not-found-link">Browse Packages</router-link>
    </div> -->
    
  </div>
</template>

<script>
import packageDetailService from '@/service/packageDetailService'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth'
export default {
  name: 'PackageDetailView',

  data() {
    return {
      pkg: {},
      loading: true,
      selectedImg: '',
      inWishlist: false,


      newRating: 0,
      newComment: '',
      commentsDataset: [],
      packagesDataset:[],

      

  

      // packagesDataset: [
      //   {
      //     id: 1,
      //     title: 'Hpa-An Explore',
      //     overview:
      //       'This basic itinerary is highly suitable for budget-conscious travelers and groups of friends who want to joyfully explore the main landmark caves of Hpa-An.',
      //     price: '195,000 MMK',
      //     duration: '3 Days / 2 Nights',
      //     group_size: '2 - 10 People',
      //     hotel: '',
      //     rating: '4.7',
      //     review_count: '45',
      //     type: 'domestic',
      //     level: 'budget',
      //     city: 'Hpa An',
      //     country: 'Myanmar',
      //     departure_date: '30.06.2026', // Card ထဲမှာ ပြသရန် Date
      //     max_tickets: 20, // စုစုပေါင်းဆံ့သည့် ဦးရေ
      //     available_tickets: 18, //လက်ကျန်ဦးရေ
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKM47OeGkz0jR-u1pXERcqjcANzdiJW8Qwlf-ADoF4QGplTaPI9TLIppc&s=10',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Arrive via Express bus and check-in to your cozy standard guesthouse in downtown Hpa-An.',
      //       },
      //       {
      //         title: 'Tuk-Tuk Tour',
      //         description:
      //           'Enjoy a full-day Tuk-Tuk adventure visiting Kawgun Cave, Sadan Cave, Lumbini Garden, and Kyauk Ka Lat.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Shop for traditional Karen textiles and souvenirs before boarding your return bus to Yangon.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 2,
      //     title: 'Hpa-An Mt.Zwegabin Adventure & Nature Tour',
      //     overview:
      //       'The best itinerary for nature lovers who want to personally climb Mt. Zwegabin and create lasting memories filled with adventure.',
      //     price: '390,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-8 People',
      //     hotel: '',
      //     rating: '4.8',
      //     review_count: '72',
      //     type: 'domestic',
      //     level: 'standard',
      //     city: 'Hpa An',
      //     country: 'Myanmar',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC2F6dkl--5ZgGST33-gDENeFeDjfWokz5G0caN9E_sHarjggPWSNBUe0&s=10',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Hpa-An Drive',
      //         description:
      //           'Get picked up by private minivan and enjoy watching the sunset over Kan Tharyar Lake.',
      //       },
      //       {
      //         title: 'Hiking',
      //         description:
      //           'Wake up early to climb Mount Zwegabin and enjoy a magnificent sea-of-clouds sunrise from the summit.',
      //       },
      //       {
      //         title: 'Nature Cave',
      //         description:
      //           'Cool off at the Yaedagon natural mountain pool and explore historic carvings inside Kawgun Cave.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Complete your eco-resort check-out and enjoy a smooth, scenic drive back to Yangon.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 3,
      //     title: 'Hpa-An Thanlwin Riverside Luxury Retreat',
      //     overview:
      //       'A premium itinerary for relaxing peacefully at a high-end VIP resort by the Thanlwin River, while traveling luxuriously with a private VIP car and private boats.',
      //     price: '950,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-8 People',
      //     hotel: '',
      //     rating: '5.0',
      //     review_count: '38',
      //     type: 'domestic',
      //     level: 'premium',
      //     city: 'Hpa An',
      //     country: 'Myanmar',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhKjPwzLJT5EpxUj3ligmXhDLn6WOAxCdc3aoTQSiz8MhKwdmJxb3xOIkU&s=10',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'VIP Arrival',
      //         description:
      //           'Arrive via a high-roof VIP van, check-in to your 5-star riverside resort, and receive a spa treatment.',
      //       },
      //       {
      //         title: 'River Cruise',
      //         description:
      //           'Board an exclusive private wooden boat for a scenic sunset cruise along the mighty Thanlwin River.',
      //       },
      //       {
      //         title: 'Custom Tour',
      //         description:
      //           'Take a private guided tour of Kyauk Ka Lat followed by an elite traditional VIP dinner show.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Enjoy a slow, lazy morning at the resort pool before your private VIP vehicle transfers you home.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 4,
      //     title: 'Bagan Heritage & Sunset Explore',
      //     overview:
      //       'An affordable tour exploring ancient Bagan pagodas, famous sunset viewpoints, and rich Myanmar cultural heritage.',
      //     price: '650,000 MMK',
      //     duration: '3Days / 2Nights',
      //     group_size: '2-15 People',
      //     hotel: '',
      //     rating: '4.8',
      //     review_count: '180',
      //     type: 'domestic',
      //     level: 'budget',
      //     city: 'Bagan',
      //     country: 'Myanmar',
      //     image:
      //       'https://images.unsplash.com/photo-1599403275295-57bca684efd3?q=80&w=1041&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //     thumbnail_images: [
      //       'https://media.istockphoto.com/id/472682036/photo/hot-air-balloon-flying-over-bagan-temples-at-sunrise.jpg?s=612x612&w=0&k=20&c=_l13hAh5wzFA8cA0cErnm1_jBl8aH8xoEA9AKxs4c_w=',
      //       'https://images.unsplash.com/photo-1675927308423-72dc9c525d8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJhZ2FuJTIwc3VucmlzZXxlbnwwfHwwfHx8MA%3D%3D',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival & Sunset Temple Watch',
      //         description:
      //           'Arrive at Bagan airport, check-in to hotel and head out to experience the iconic panoramic golden sunset.',
      //       },
      //       {
      //         title: 'Full Day Temple Exploration',
      //         description:
      //           'Visit Ananda Temple, Shwezigon Pagoda, and Dhammayangyi Temple with a professional local guide.',
      //       },
      //       {
      //         title: 'Local Crafts & Departure',
      //         description:
      //           'Explore traditional lacquerware workshops and enjoy a smooth departure back home.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 5,
      //     title: 'Bagan Cultural Discovery & River Experience',
      //     overview:
      //       "A suitable package for families and friends to fully experience Bagan's ancient temples, local culture, and Ayeyarwady scenic river views.",
      //     price: '950,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-12 People',
      //     hotel: '',
      //     rating: '4.9',
      //     review_count: '220',
      //     type: 'domestic',
      //     level: 'standard',
      //     city: 'Bagan',
      //     country: 'Myanmar',
      //     image:
      //       'https://images.unsplash.com/photo-1515900959941-d1cce424f5c4?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1609847860270-efa8c3ad583d?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //       'https://images.unsplash.com/photo-1528648105451-3d52d912762d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //       'https://media.istockphoto.com/id/178071920/photo/golden-palace-in-old-bagan-mandalay-burma.webp?a=1&b=1&s=612x612&w=0&k=20&c=IKvUX7hu6KH1DjR4UlImXCwrnifaXT2hvm-_xoWpJgQ=',
      //       'https://images.unsplash.com/photo-1497601089782-06319e8be3a0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Enjoy an airport pickup and check-in to a beautiful resort nestled right by the river.',
      //       },
      //       {
      //         title: 'Heritage Tour',
      //         description:
      //           'Visit the golden Shwezigon Pagoda, iconic temples, and the fascinating Archaeological Museum.',
      //       },
      //       {
      //         title: 'River Cruise',
      //         description:
      //           'Set out on a relaxing Ayeyarwady sunset boat cruise and visit a traditional riverbank village.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Shop for authentic Bagan lacquerware souvenirs before checking out for your departure.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 6,
      //     title: 'Bagan Royal Balloon & Luxury Escape',
      //     overview:
      //       'A premium package featuring a breathtaking sunrise hot-air balloon flight, luxury resort stay, and private guided tours for an unforgettable escape.',
      //     price: '1,850,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-4 People(Private)',
      //     hotel: '',
      //     rating: '5',
      //     review_count: '62',
      //     type: 'domestic',
      //     level: 'premium',
      //     city: 'Bagan',
      //     country: 'Myanmar',
      //     image:
      //       'https://media.istockphoto.com/id/614446038/photo/hot-air-balloons-in-bagan-myanmar.jpg?s=612x612&w=0&k=20&c=nlxHdhqgEUUw_5M0dRlfhzHvjQG_epUqzLyUjcJJKmw=',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1674043549356-8dff137408bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFnYW4lMjBzdW5yaXNlfGVufDB8fDB8fHww',
      //       'https://media.istockphoto.com/id/1288905205/photo/dhammayazika-pagoda-temple-and-hot-air-balloons-in-myanmar.webp?a=1&b=1&s=612x612&w=0&k=20&c=mxZh-Nu6iz90FfJlGUnpQWxRrlk4wyQnBHtQxflvLLU=',
      //       'https://d2lwt6tidfiof0.cloudfront.net/images/background/bg-myanmar.jpg',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'VIP Arrival',
      //         description:
      //           'Arrive via private transfer and check-in to a luxury 5-star resort and spa sanctuary.',
      //       },
      //       {
      //         title: 'Balloon Adventure',
      //         description:
      //           'Witness a breathtaking Bagan sunrise from a hot-air balloon followed by a private guided temple tour.',
      //       },
      //       {
      //         title: 'Luxury Experience',
      //         description:
      //           'Unwind with a premium spa treatment, take a private photography tour, and enjoy a sunset dinner.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Complete your executive check-out and take a private chauffeur transfer back to the airport.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 7,
      //     title: 'Ngwe Saung Coastal Escape',
      //     overview:
      //       'A budget-friendly coastal escape designed for travelers looking to relax peacefully in the sea breeze and experience natural beach beauty.',
      //     price: '750,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-20 People',
      //     hotel: '',
      //     rating: '4.5',
      //     review_count: '126',
      //     type: 'domestic',
      //     level: 'budget',
      //     city: 'Ngwe Saung',
      //     country: 'Myanmar',
      //     image: 'https://www.mcs-myanmartravel.com/wp-content/uploads/2015/07/ngwesaung.jpg',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival & Check-in',
      //         description:
      //           'Arrival at Ngwe Saung Beach and hotel check-in to relax after the journey.',
      //       },
      //       {
      //         title: 'Island Tour',
      //         description:
      //           'Visit Lovers Island and experience the breathtaking panoramic sunset at the beach.',
      //       },
      //       {
      //         title: 'Leisure',
      //         description:
      //           'Enjoy free leisure time and indulge in tasting fresh local seafood along the shore.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Check-out from the hotel and begin the smooth return journey back to Mandalay.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 8,
      //     title: 'Ngwe Saung Coastal Experience',
      //     overview:
      //       'A comfortable travel experience tailored to fully enjoy beach activities, local exploration, and high-quality resort relaxation.',
      //     price: '1,200,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-15 People',
      //     hotel: '',
      //     rating: '4.8',
      //     review_count: '246',
      //     type: 'domestic',
      //     level: 'standard',
      //     city: 'Ngwe Saung',
      //     country: 'Myanmar',
      //     image:
      //       'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/30/d2/d1/eskala-hotels-resorts.jpg?w=1200&h=-1&s=1',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Arrive at Ngwe Saung Beach and check-in to your selected 4-star beach resort.',
      //       },
      //       {
      //         title: 'Beach Activities',
      //         description:
      //           'Engage in exciting beach activities or enjoy premium relaxation inside the resort facilities.',
      //       },
      //       {
      //         title: 'Excursion',
      //         description:
      //           'Take a cultural and nature-filled excursion to visit the nearby Elephant Camp.',
      //       },
      //       {
      //         title: 'Relax',
      //         description:
      //           'Spend a completely free day for personal relaxation followed by a sunset BBQ dinner.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Complete resort check-out and embark on a comfortable drive back to Mandalay.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 9,
      //     title: 'Ngwe Saung Ocean Prestige',
      //     overview:
      //       'A premium seaside escape combining tranquility and ultra-luxury experiences, featuring private accommodations and VIP services.',
      //     price: '2,200,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-8 People',
      //     hotel: '',
      //     rating: '4.9',
      //     review_count: '89',
      //     type: 'domestic',
      //     level: 'premium',
      //     city: 'Ngwe Saung',
      //     country: 'Myanmar',
      //     image:
      //       'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'VIP Arrival',
      //         description:
      //           'Enjoy a private SUV transfer, receive a VIP welcome, and check-in to your private Ocean Villa.',
      //       },
      //       {
      //         title: 'Spa Relax',
      //         description:
      //           'Indulge in a premium luxury spa experience and unwind on the exclusive private beach front.',
      //       },
      //       {
      //         title: 'Cruise Experience',
      //         description:
      //           'Set sail on a private boat cruise to experience the ultimate sea views and ocean breeze.',
      //       },
      //       {
      //         title: 'Romantic Dinner',
      //         description:
      //           'Spend a premium leisure morning followed by an exclusive romantic dinner on the beach.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Complete executive check-out and take a private SUV transfer directly back home.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 10,
      //     title: 'Kalaw Nature & Trekking Experience',
      //     overview:
      //       "A suitable package for nature lovers wanting to experience Kalaw's cool climate, pine forests, mountain trekking, and local markets.",
      //     price: '420,000 MMK',
      //     duration: '3Days / 2Nigts',
      //     group_size: '2-12 People',
      //     hotel: '',
      //     rating: '4.7',
      //     review_count: '135',
      //     type: 'domestic',
      //     level: 'budget',
      //     city: 'Kalaw',
      //     country: 'Myanmar',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSRG9FCoqjY-LUvTY_RQJ2EDSYiZIuv5pdTN22nhTS-g&s=10',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Arrive in chilly Kalaw via VIP Express bus, check-in to your hotel, and explore the evening market.',
      //       },
      //       {
      //         title: 'Trekking',
      //         description:
      //           'Trek through aromatic pine forests up to a scenic viewpoint and visit a traditional ethnic village.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Sip fresh local mountain coffee, shop for local Shan snacks and tea, and head on your return journey.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 11,
      //     title: 'Kalaw & Inle Scenic Adventure',
      //     overview:
      //       'A great vacation for families and friends to visit Kalaw and Inle Lake in one trip, exploring natural beauty, tradition, and Intha lifestyle.',
      //     price: '720,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-10 People',
      //     hotel: '',
      //     rating: '4.9',
      //     review_count: '185',
      //     type: 'domestic',
      //     level: 'standard',
      //     city: 'Kalaw',
      //     country: 'Myanmar',
      //     image:
      //       'https://indochinatreks.com/wp-content/uploads/2022/12/12.-Kalaw-inle-lake-fishermen-istock.jpg',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Arrive in the beautiful hill station of Kalaw and check-in to a comfortable 4-star mountain hotel.',
      //       },
      //       {
      //         title: 'Kalaw Tour',
      //         description:
      //           'Take in mountain views, visit the historic Christ the King Church, and browse the vibrant local market.',
      //       },
      //       {
      //         title: 'Inle Lake',
      //         description:
      //           'Board a private boat to explore floating gardens, stilt villages, and the historic Phaung Daw Oo Pagoda.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Enjoy a traditional Shan breakfast before checking out for a smooth return drive.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 12,
      //     title: 'Kalaw Luxury Mountain Retreat',
      //     overview:
      //       'A VIP retreat to relax peacefully in a luxury mountain resort, enjoying private tours, premium dining, and pristine nature.',
      //     price: '1,250,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-6 People',
      //     hotel: '',
      //     rating: '5',
      //     review_count: '29',
      //     type: 'domestic',
      //     level: 'premium',
      //     city: 'Kalaw',
      //     country: 'Myanmar',
      //     image:
      //       'https://i.travelapi.com/lodging/16000000/15660000/15651600/15651577/182bbc8c_z.jpg',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'VIP Arrival',
      //         description:
      //           'Travel by a private SUV with chauffeur service and check-in to a world-class luxury mountain resort.',
      //       },
      //       {
      //         title: 'Nature Escape',
      //         description:
      //           'Embark on a private guided nature trek through serene pine hills to catch a stunning mountain sunset.',
      //       },
      //       {
      //         title: 'Wellness Day',
      //         description:
      //           'Spend an entire day focusing on wellness with signature spa treatments and relaxing resort activities.',
      //       },
      //       {
      //         title: 'Local Experience',
      //         description:
      //           'Tour an organic coffee plantation followed by an exclusive private Shan cultural dinner.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Enjoy breakfast with mountain views before a private chauffeur transfer takes you back home.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 13,
      //     title: 'Bangkok City Tour',
      //     overview:
      //       'Tailored for travelers who want to stay in a convenient shopping area in downtown Bangkok, go shopping, and explore famous temples and street food.',
      //     price: '1,650,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-12 People',
      //     hotel: '',
      //     rating: '4.6',
      //     review_count: '112',
      //     type: 'international',
      //     level: 'budget',
      //     city: 'Bangkok',
      //     country: 'Thailand',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZcLJa-cWwqzjwGQIJuINkTQ1ccor6N8ADP42u7BMhHZTdZmuumbOGCN_y&s=10',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Arrive at Bangkok airport, meet your private driver, and check-in to your hotel in Pratunam shopping district.',
      //       },
      //       {
      //         title: 'Temples & Shopping',
      //         description:
      //           'Visit the spectacular Grand Palace, Wat Arun, and enjoy an evening shopping spree at CentralWorld.',
      //       },
      //       {
      //         title: 'Street Food Explore',
      //         description:
      //           'Explore Chinatown (Yaowarat Road) for an unforgettable Michelin-starred local street food experience.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Enjoy free leisure time for last-minute shopping before heading to the airport for your flight back.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 14,
      //     title: 'Chiang Mai Cultural Heritage & Mountain Escape',
      //     overview:
      //       'Perfect itinerary for groups seeking rich cultural experiences, traditional Lanna style temples, and refreshing mountainous nature.',
      //     price: '2,550,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-10 People',
      //     hotel: '',
      //     rating: '4.8',
      //     review_count: '150',
      //     type: 'international',
      //     level: 'standard',
      //     city: 'Chiang Mai',
      //     country: 'Thailand',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsuqSWfs1NiHiKGMVxXP2vsi7f942K7nR-Pl7jYYKLuyFpTEKALyz1DdY&s=10',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Fly into Chiang Mai, receive a warm welcome, and check-in to an elegant boutique Lanna hotel.',
      //       },
      //       {
      //         title: 'Old City Tour',
      //         description:
      //           'Take a scenic trishaw ride around the Old City moat, visiting Wat Chedi Luang and Wat Phra Singh.',
      //       },
      //       {
      //         title: 'Mountain Sunset',
      //         description:
      //           'Drive up the mountain to visit Wat Phra That Doi Suthep and catch a breathtaking sunset over the city.',
      //       },
      //       {
      //         title: 'Elephant Sanctuary',
      //         description:
      //           'Spend a memorable day volunteering at an ethical elephant sanctuary, bathing and feeding them.',
      //       },
      //       {
      //         title: 'Departure',
      //         description:
      //           'Browse for unique wooden handicrafts at the local market before taking your airport transfer.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 15,
      //     title: 'Phuket Luxury Island Resort Vacation',
      //     overview:
      //       'Indulge in a premium, ultra-luxurious island escape featuring high-end beachfront pool villas, private yacht cruises, and elite dining.',
      //     price: '4,450,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-4 People',
      //     hotel: '',
      //     rating: '5.0',
      //     review_count: '85',
      //     type: 'international',
      //     level: 'premium',
      //     city: 'Phuket',
      //     country: 'Thailand',
      //     image:
      //       'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=801&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'VIP Arrival',
      //         description:
      //           'Experience VIP airport fast-track service and ride in a luxury car to your 5-star beachfront pool villa.',
      //       },
      //       {
      //         title: 'Private Yacht Cruise',
      //         description:
      //           'Board an exclusive private catamaran yacht tour to explore the stunning Phi Phi Islands and Maya Bay.',
      //       },
      //       {
      //         title: 'Resort Relaxation',
      //         description:
      //           'Unwind with a signature 3-hour luxury spa package and enjoy an intimate candlelight dinner by the sea.',
      //       },
      //       {
      //         title: 'Old Town Tour',
      //         description:
      //           'Explore the charming Sino-Portuguese architecture of Phuket Old Town with a private photographer.',
      //       },
      //       {
      //         title: 'Departure',
      //         description:
      //           'Savor a floating breakfast in your private pool before your luxury car transfers you to the airport.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 16,
      //     title: 'Tokyo City Explore',
      //     overview:
      //       'A budget-friendly urban exploration itinerary designed to efficiently visit Tokyo’s main highlights using subways.',
      //     price: '3,250,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-10 People',
      //     hotel: '',
      //     rating: '4.8',
      //     review_count: '142',
      //     type: 'international',
      //     level: 'budget',
      //     city: 'Tokyo',
      //     country: 'Japan',
      //     image:
      //       'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Arrive at Narita Airport, board the express train, and check-in to your capsule or smart city hotel.',
      //       },
      //       {
      //         title: 'Historic & Modern',
      //         description:
      //           'Visit Tokyo’s oldest Senso-ji Temple in Asakusa, followed by exploring electronics in Akihabara.',
      //       },
      //       {
      //         title: 'Iconic Crossings',
      //         description:
      //           'Walk across the world-famous Shibuya Crossing and visit the serene Meiji Shrine in Harajuku.',
      //       },
      //       {
      //         title: 'Anime Culture',
      //         description:
      //           'Spend an exciting day immersed in anime culture at Nakano Broadway and the DiverCity giant Gundam.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Pick up delicious Japanese snacks at Tokyo Station before boarding your airport express train.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 17,
      //     title: 'Tokyo & Mt. Fuji Classic Adventure',
      //     overview:
      //       'A great standard package combining Tokyo’s vibrant city life with iconic views of Mount Fuji and Hakone hot springs.',
      //     price: '4,250,000 MMK',
      //     duration: '6Days / 5Nights',
      //     group_size: '2-10 People',
      //     hotel: '',
      //     rating: '4.9',
      //     review_count: '198',
      //     type: 'international',
      //     level: 'standard',
      //     city: 'Tokyo',
      //     country: 'Japan',
      //     image:
      //       'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Land in Tokyo, transfer to a 4-star city hotel, and witness views from Tokyo Tower.',
      //       },
      //       {
      //         title: 'City Highlights',
      //         description:
      //           'Explore the historic Imperial Palace gardens and go shopping in the upscale Ginza district.',
      //       },
      //       {
      //         title: 'Mt. Fuji Excursion',
      //         description:
      //           'Take a scenic drive to Mt. Fuji 5th Station and ride the Oshino Hakkai panoramic ropeway.',
      //       },
      //       {
      //         title: 'Hakone Onsen',
      //         description:
      //           'Cruise across Lake Ashi on a pirate ship and stay overnight at a traditional Ryokan with hot springs.',
      //       },
      //       {
      //         title: 'Theme Park Day',
      //         description:
      //           'Return to Tokyo and enjoy a full day of magical fun at Tokyo Disneyland or DisneySea.',
      //       },
      //       {
      //         title: 'Departure',
      //         description:
      //           'Enjoy a morning stroll in Ueno Park before boarding your airport limousine bus home.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 18,
      //     title: 'Osaka & Kyoto Cherry Blossom Premium Tour',
      //     overview:
      //       'A high-end, luxurious cultural tour through Osaka and ancient Kyoto, featuring five-star traditional Ryokans and VIP bullet trains.',
      //     price: '6,850,000 MMK',
      //     duration: '6Days / 5Nights',
      //     group_size: '2-6 People',
      //     hotel: '',
      //     rating: '5.0',
      //     review_count: '53',
      //     type: 'international',
      //     level: 'premium',
      //     city: 'Osaka',
      //     country: 'Japan',
      //     image:
      //       'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'VIP Arrival',
      //         description:
      //           'Receive a private luxury car transfer from Kansai Airport to your 5-star hotel in Osaka.',
      //       },
      //       {
      //         title: 'Osaka Foodie Tour',
      //         description:
      //           'Visit the historic Osaka Castle, followed by an exclusive private guided gourmet street food tour in Dotonbori.',
      //       },
      //       {
      //         title: 'Bullet Train to Kyoto',
      //         description:
      //           'Ride first-class on the Shinkansen to Kyoto and check-in to an ultra-luxury traditional Ryokan.',
      //       },
      //       {
      //         title: 'Bamboo & Golden Pavilion',
      //         description:
      //           'Walk through Arashiyama Bamboo Grove early morning and visit the stunning Kinkaku-ji (Golden Pavilion).',
      //       },
      //       {
      //         title: 'Fushimi Inari VIP',
      //         description:
      //           'Experience a private evening tour of Fushimi Inari Shrine, followed by an elite traditional multi-course Kaiseki dinner.',
      //       },
      //       {
      //         title: 'Departure',
      //         description:
      //           'Participate in a private tea ceremony experience before your luxury chauffeur transfer back to the airport.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 19,
      //     title: 'Singapore City Escape',
      //     overview:
      //       'An affordable urban getaway package tailored to explore Singapore’s ultra-modern landmarks, clean streets, and multi-cultural neighborhoods.',
      //     price: '2,850,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-25 People',
      //     hotel: '',
      //     rating: '4.6',
      //     review_count: '112',
      //     type: 'international',
      //     level: 'budget',
      //     city: 'Singapore',
      //     country: 'Singapore',
      //     image:
      //       'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Arrive at Jewel Changi Airport to see the Rain Vortex, then transfer to your downtown hotel.',
      //       },
      //       {
      //         title: 'Merlion & Gardens',
      //         description:
      //           'Take photos at the iconic Merlion Park and explore the futuristic Supertree Grove at Gardens by the Bay.',
      //       },
      //       {
      //         title: 'Cultural Quarters',
      //         description:
      //           'Visit Chinatown, Little India, and Kampong Glam to experience rich multicultural heritage and local food.',
      //       },
      //       {
      //         title: 'Departure',
      //         description:
      //           'Enjoy free time for shopping on Orchard Road before your transfer back to Changi Airport.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 20,
      //     title: 'Singapore Island Adventure',
      //     overview:
      //       'A comprehensive standard package featuring full-day entry tickets to top theme parks, island resorts, and scenic cable car rides.',
      //     price: '3,850,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-20 People',
      //     hotel: '',
      //     rating: '4.8',
      //     review_count: '128',
      //     type: 'international',
      //     level: 'standard',
      //     city: 'Singapore',
      //     country: 'Singapore',
      //     image:
      //       'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=600',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Land in Singapore, check-in to a 4-star hotel, and enjoy a night safari tour at the Singapore Zoo.',
      //       },
      //       {
      //         title: 'Universal Studios',
      //         description:
      //           'Spend a thrilling, action-packed full day at Universal Studios Singapore on Sentosa Island.',
      //       },
      //       {
      //         title: 'Sentosa Island Fun',
      //         description:
      //           'Ride the Singapore Cable Car, visit S.E.A. Aquarium, and watch the spectacular Wings of Time show.',
      //       },
      //       {
      //         title: 'Science & Sky',
      //         description:
      //           'Visit the ArtScience Museum and take a ride on the Singapore Flyer for panoramic city views.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Do some duty-free shopping at Changi Airport before boarding your flight back home.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 21,
      //     title: 'Singapore Luxury Marina Prestige Escape',
      //     overview:
      //       'An ultimate elite experience staying at the world-famous Marina Bay Sands, featuring private yacht charters and Michelin-starred dining.',
      //     price: '6,500,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-6 People',
      //     hotel: '',
      //     rating: '4.9',
      //     review_count: '156',
      //     type: 'international',
      //     level: 'premium',
      //     city: 'Singapore',
      //     country: 'Singapore',
      //     image:
      //       'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'VIP Arrival',
      //         description:
      //           'Arrive via private luxury limousine and check-in to an executive suite at Marina Bay Sands.',
      //       },
      //       {
      //         title: 'Infinity Pool & SkyPark',
      //         description:
      //           'Spend a luxurious morning swimming in the world’s largest rooftop Infinity Pool with panoramic skyline views.',
      //       },
      //       {
      //         title: 'Private Yacht Charter',
      //         description:
      //           'Embark on a private luxury yacht cruise to the Southern Islands, complete with an on-board personal chef barbecue.',
      //       },
      //       {
      //         title: 'Michelin Dining',
      //         description:
      //           'Enjoy a private VIP guided tour of Flower Dome and Cloud Forest, followed by dinner at a 3-Michelin-starred restaurant.',
      //       },
      //       {
      //         title: 'Departure',
      //         description:
      //           'Indulge in a premium spa massage treatment at the Banyan Tree Spa before your private limousine transfer to the airport.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 22,
      //     title: 'Shanghai City Explore',
      //     overview:
      //       'An affordable budget tour focused on discovering Shanghai’s famous historical waterfront, ancient gardens, and towering skyscrapers.',
      //     price: '1,950,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-12 People',
      //     hotel: '',
      //     rating: '4.7',
      //     review_count: '165',
      //     type: 'international',
      //     level: 'budget',
      //     city: 'Shanghai',
      //     country: 'China',
      //     image:
      //       'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=800&q=80',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Fly into Shanghai, meet your tour guide, and check-in to your comfortable city center hotel.',
      //       },
      //       {
      //         title: 'The Bund & Yu Garden',
      //         description:
      //           'Stroll along the historic waterfront at The Bund and explore the beautiful classical architecture of Yu Garden.',
      //       },
      //       {
      //         title: 'Nanjing Road Shopping',
      //         description:
      //           'Experience the vibrant neon lights and extensive shopping opportunities along the Nanjing Road pedestrian street.',
      //       },
      //       {
      //         title: 'Departure',
      //         description:
      //           'Visit the Jade Buddha Temple before transferring to the airport for your return flight.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 23,
      //     title: 'Shanghai & Suzhou Cultural Discovery',
      //     overview:
      //       'A wonderful standard package exploring the modern marvels of Shanghai alongside the famous classical water towns and silk heritage of Suzhou.',
      //     price: '2,950,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-10 People',
      //     hotel: '',
      //     rating: '4.9',
      //     review_count: '240',
      //     type: 'international',
      //     level: 'standard',
      //     city: 'Shanghai',
      //     country: 'China',
      //     image:
      //       'https://plus.unsplash.com/premium_photo-1664299326174-f73b66496733?q=80&w=870&auto=format&fit=crop',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'Arrival',
      //         description:
      //           'Arrive in Shanghai, transfer to a 4-star hotel, and enjoy a relaxing evening Huangpu River cruise.',
      //       },
      //       {
      //         title: 'Shanghai Heights',
      //         description:
      //           'Ascend to the observation deck of the Shanghai Tower and visit the high-tech Oriental Pearl TV Tower.',
      //       },
      //       {
      //         title: 'Suzhou Water Town',
      //         description:
      //           'Travel to Suzhou to cruise through the historic canals of Zhouzhuang water town and visit the Humble Administrator’s Garden.',
      //       },
      //       {
      //         title: 'Silk & Culture',
      //         description:
      //           'Tour a traditional Suzhou silk factory and explore the historic Shantang Street in the evening.',
      //       },
      //       {
      //         title: 'Return',
      //         description:
      //           'Return to Shanghai for last-minute souvenir shopping before heading to the airport for your departure.',
      //       },
      //     ],
      //   },
      //   {
      //     id: 24,
      //     title: 'Shanghai Luxury Skyline & Disney Prestige Vacation',
      //     overview:
      //       'An ultra-luxury vacation featuring stays at premium skyline-view hotels, private VIP tours of Shanghai Disneyland, and elite dining experiences.',
      //     price: '4,850,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-4 People',
      //     hotel: '',
      //     rating: '5.0',
      //     review_count: '95',
      //     type: 'international',
      //     level: 'premium',
      //     city: 'Shanghai',
      //     country: 'China',
      //     image:
      //       'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=600',
      //     thumbnail_images: [
      //       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      //       'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
      //     ],
      //     itinerary: [
      //       {
      //         title: 'VIP Arrival',
      //         description:
      //           'Ride the high-speed Maglev train first class, followed by a private luxury car transfer to your Bund-view 5-star hotel.',
      //       },
      //       {
      //         title: 'Private Skyline Tour',
      //         description:
      //           'Enjoy an exclusive private guided tour of the French Concession and a luxury VIP dinner overlooking the glowing Bund skyline.',
      //       },
      //       {
      //         title: 'Disney VIP Experience',
      //         description:
      //           'Spend a magical day at Shanghai Disneyland with a private VIP tour guide, providing fast-pass access to all major rides.',
      //       },
      //       {
      //         title: 'Luxury Relaxation',
      //         description:
      //           'Indulge in a premium spa wellness treatment and enjoy afternoon tea at a high-end rooftop lounge.',
      //       },
      //       {
      //         title: 'Departure',
      //         description:
      //           'Complete your luxury check-out and take a private chauffeur transfer directly to the airport for your flight.',
      //       },
      //     ],
      //   },
      // ],
    }
  },

 

  // ၂။ Methods
  mounted() {
    this.loadPackageDetail()
    const pkgId = this.$route.params.id
    this.getPackageDetail()
    const allReviews = localStorage.getItem('all_packages_reviews')
    const reviewsObj = allReviews ? JSON.parse(allReviews) : {}

    if (reviewsObj[pkgId]) {
      this.commentsDataset = reviewsObj[pkgId]
    } else {
      // မရှိသေးရင် base အနေနဲ့ 5 star တစ်ခု ထည့်ထားပေးမယ်
      this.commentsDataset = []
    }
  },
  methods: {
    //database ချိတ်ရင်သုံးဖို့
    //     async submitReview() {
    //  if (this.newRating === 0) {
    //         alert("Please select a star rating.");
    //         return;
    //       }
    //       if (!this.newComment.trim()) {
    //         alert("Please enter a comment.");
    //         return;
    //       }

    //   try {
    //     // 🌟 Backend API ဆီသို့ Data လှမ်းပို့ခြင်း
    //     const response = await axios.post('https://api.yourtravelwebsite.com/reviews', {
    //       packageId: this.pkg.id, // ဘယ်ခရီးစဉ်အတွက် review လဲဆိုတာ id ပါ ပို့ရမယ်
    //       rating: this.newRating,
    //       comment: this.newComment
    //     });

    //     // API ကနေ အောင်မြင်စွာ သိမ်းဆည်းပြီးကြောင်း Response ပြန်လာမှ UI မှာ ပြပေးမယ်
    //     if (response.data.success) {
    //       this.commentsDataset.unshift(response.data.newReview);

    //       this.newComment = '';
    //       this.newRating = 0;
    //     }
    //   } catch (error) {
    //     alert("Comment ပို့လို့ မအောင်မြင်ပါဘူး။");
    //   }
    // }

    async getPackageDetail() {
     
      const packageId = this.$route.params.id 
      // console.log(packageId);
      
      
      try {
       
        const data = await packageDetailService.getPackageDetail(packageId)
        // console.log(data[0].productList[0]);

        
        this.pkg = data[0].productList[0]; 
        console.log(this.pkg);
        
      } catch (error) {
        console.error("API fetch error", error)
      }
    },
    submitReview() {
      if (this.newRating === 0) {
        alert('Please select a star rating.')
        return
      }
      if (!this.newComment.trim()) {
        alert('Please enter a comment.')
        return
      }

      const pkgId = this.$route.params.id

      // 🔑 LocalStorage ထဲကနေ login ဝင်ထားတဲ့ user info ကို လှမ်းယူတာ (သင့် system ပေါ်မူတည်ပြီး ပြောင်းလဲနိုင်ပါတယ်)
      const currentUser = JSON.parse(localStorage.getItem('current_user'))
      const currentUserName =
currentUser
? currentUser.fullName
: "Anonymous Traveller";

      // လက်ရှိ list ထဲ ထည့်တယ်
      this.commentsDataset.unshift({
        rating: this.newRating,
        comment: this.newComment,
        user_name: currentUserName,
      })

      //အားလုံးပေါင်းသိမ်းထားတဲ့ localStorage object ထဲမှာ သွားသိမ်းမယ်
      const allReviews = localStorage.getItem('all_packages_reviews')
      const reviewsObj = allReviews ? JSON.parse(allReviews) : {}
      reviewsObj[pkgId] = this.commentsDataset
      localStorage.setItem('all_packages_reviews', JSON.stringify(reviewsObj))
  
      window.dispatchEvent(new Event('reviews-updated'))

     
      const savedStats = localStorage.getItem('package_stats')
      const statsObj = savedStats ? JSON.parse(savedStats) : {}
      statsObj[pkgId] = {
        avg: this.averageRating,
        count: this.commentsDataset.length,
      }
      localStorage.setItem('package_stats', JSON.stringify(statsObj))

      this.newComment = ''
      this.newRating = 0
    },
    
    loadPackageDetail() {
      this.loading = true
      const packageId = parseInt(this.$route.params.id)
      const foundPkg = this.packagesDataset.find((p) => p.id === packageId)
      if (foundPkg) {
        this.pkg = foundPkg
        this.selectedImg = foundPkg.image
      } else {
        this.pkg = null
      }
      this.loading = false
    },
    handleBooking() {
   const authStore = useAuthStore()

  // ❌ not logged in
  if (!authStore.isLoggedIn) {
    const goLogin = confirm(
      "You need to login to book this package. Go to login page?"
    )

    if (goLogin) {
      // redirect after login ပြန်လာအောင် save
      localStorage.setItem("redirect_after_login", this.$route.fullPath)

      this.$router.push('/login')
    }

    return
  }

  // ✅ logged in → go booking
  this.$router.push(`/booking/${this.pkg.id}`)
       
//     if (!this.isLoggedIn) {

//     const confirmLogin = confirm(
//       "You need to login to book this package. Do you want to go to login page?"
//     )

//     if (confirmLogin) {
//       this.$router.push({
//   path: "/login",
//   query: {
//     redirect: this.$route.fullPath
//   }
// })
//     }

//     return
//   }

//   this.$router.push({
//     name: "Booking",
//     params: {
//       id: this.pkg.id
//     }
//   })
    // if (!this.authStore.isLoggedIn) {
    //     // Login မဝင်ရသေးလျှင်
    //     const confirmLogin = confirm("You need to login to book this package. Do you want to go to login page?");
    //     if (confirmLogin) {
    //       this.$router.push({ name: 'login' });
    //     }}else {
    //     // 4. Login ဝင်ပြီးသားဆိုလျှင် Booking Page သို့ Navigate လုပ်ခြင်း
    //     // Route Name 'Booking' ကို index.js ထဲကအတိုင်း သေချာစစ်ဆေးပါ
    //     this.$router.push({
    //       name: 'Booking', 
    //       params: { id: this.pkg.id }
    //     });
    //   }
    },
    setImage(img) {
      this.selectedImg = img
    },
    toggleWishlist() {
      this.inWishlist = !this.inWishlist
    },
    formatMMK(price) {
      return price
    },
  },

 
  watch: {
    '$route.params.id': {
      handler: 'loadPackageDetail',
      immediate: true,
    },
  },
  // Title အောက်က ကြယ်ပွင့်တွက်ချက်ရန်
  computed: {
    pkg() {
      const id = this.$route.params.id;
      return this.packagesDataset.find((p) => p.id == id);
    },
    auth() {
    return useAuthStore()
  },

  isLoggedIn() {
      return this.auth.isLoggedIn;

  },

    averageRating() {
      if (this.commentsDataset.length === 0) return 0
      const sum = this.commentsDataset.reduce((acc, rev) => acc + rev.rating, 0)
      return (sum / this.commentsDataset.length).toFixed(1)
    },
  },

  //Mounted Hook
  
}
</script>

<style scoped>
.detail-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 120px 20px 60px;
}
.detail-container {
  max-width: 1060px;
  margin: 0 auto;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  padding: 0;
  margin-bottom: 20px;
  transition: color 0.2s;
}
.back-btn:hover {
  color: #2563eb;
}
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}
@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}
.detail-left {
  display: flex;
  flex-direction: column;
}
.pkg-title {
  font-size: 26px;
  font-weight: 900;
  color: #0f172a;
  margin: 0 0 10px;
}
.pkg-meta-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
}
.pkg-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #64748b;
}
.pkg-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}
.rat-val {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.rat-cnt {
  font-size: 13px;
  color: #94a3b8;
}
.hero-img-wrap {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 12px;
}
.hero-img {
  height: 380px;
  width: 100%;
  object-fit: cover;
  border-radius: 18px;
}
.pkg-type-tag {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  z-index: 2;
}
.tag-green {
  background: #dcfce7;
  color: #15803d;
}
.tag-blue {
  background: #dbeafe;
  color: #1d4ed8;
}
.thumbs-strip {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}
/* thumb image size */
.thumb {
  width: 160px;
  height: 70px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2.5px solid transparent;
  transition: border-color 0.2s;
}
.thumb.active {
  border-color: #2563eb;
}
.thumb-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.content-block {
  margin-bottom: 32px;
}
.block-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 14px;
}
.overview-text {
  font-size: 14px;
  color: #64748b;
  line-height: 1.8;
}
.itinerary-list {
  display: flex;
  flex-direction: column;
}
.itin-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.itin-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  flex-shrink: 0;
}
.itin-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  color: white;
}
.dot-first {
  background: #16a34a;
}
.dot-num {
  font-size: 13px;
  font-weight: 800;
}
.itin-line {
  width: 2px;
  background: #cbd5e1;
  min-height: 50px;
  flex-grow: 1;
}
.itin-content {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 12px;
  flex: 1;
}
.itin-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 5px;
}
.itin-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}
.detail-right {
  position: sticky;
  top: 120px;
}
.pricing-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.price-section {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 20px;
}
.price-amount {
  font-size: 26px;
  font-weight: 900;
  color: #16a34a;
}
.price-per {
  font-size: 13px;
  color: #94a3b8;
}
.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 18px 0;
}
.specs-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spec-lbl {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #64748b;
}
.spec-val {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}
.book-btn {
  width: 100%;
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}
.book-btn:hover {
  background: #15803d;
}
.wishlist-btn {
  width: 100%;
  background: none;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 11px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 14px;
  color: #94a3b8;
}
.not-found-link {
  background: #2563eb;
  color: #fff;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  text-decoration: none;
}
/* --- Reviews & Comments Section Styles --- */
.rating-comment-section {
  margin-top: 40px;
  font-family: sans-serif;
}

.review-block-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

/* Form Card Design */
.comment-form {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
}

.form-title {
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #334155;
}

/* Star Inputs */
.rating-input-wrapper {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-label {
  font-size: 14px;
  color: #64748b;
}

.stars-container {
  display: flex;
  gap: 4px;
}

.interactive-star {
  cursor: pointer;
  font-size: 24px;
  transition: transform 0.1s ease;
}

.interactive-star:hover {
  transform: scale(1.2);
}

.rating-number {
  font-size: 14px;
  font-weight: 600;
  color: #f59e0b;
  margin-left: 4px;
}

/* Textarea & Button */
.modern-textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  outline: none;
  font-size: 14px;
  color: #334155;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  resize: vertical;
}

.modern-textarea:focus {
  border-color: #10b981;
}

.btn-submit-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.modern-submit-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.modern-submit-btn:hover {
  background: #059669;
}

.modern-submit-btn:active {
  transform: scale(0.98);
}

/* Comments List & Cards */
.list-title {
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #334155;
}

.no-reviews {
  color: #94a3b8;
  font-size: 14px;
  padding: 20px;
  text-align: center;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #e2e8f0;
}

.comment-card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.comment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #e0f2fe;
  color: #0284c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.display-stars {
  display: flex;
  gap: 2px;
}

.static-star {
  font-size: 16px;
}

.comment-content-text {
  font-size: 14px;
  color: #475569;
  margin: 0;
  padding-left: 40px;
  line-height: 1.5;
}
</style>
