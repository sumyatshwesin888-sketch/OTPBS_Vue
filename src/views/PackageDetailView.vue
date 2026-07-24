<template>
  <div class="detail-page">
    <div v-if="!loading && productDto" class="detail-container">
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
          <h1 class="pkg-title">{{ productDto.title }}</h1>
          <div class="pkg-meta-row">
            <div class="pkg-location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#64748B">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                />
              </svg>
              {{ productDto.location }}
            </div>
            <div class="pkg-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
              <span class="rat-val">{{ productDto.ratingCount }}</span>
              <span class="rat-cnt">({{ commentsDataset.length }} reviews)</span>
            </div>
          </div>

          <div class="hero-img-wrap">

            <!--show the selected photo from the package -->
            <img
              :src="selectedImg ? 'http://localhost:8088/api/v1/productphoto/' + selectedImg : ''"
              :alt="productDto.title"
              class="hero-img"
            />

            <div
              class="pkg-type-tag"
              :class="
                productDto.locationType && productDto.locationType.toLowerCase() === 'domestic'
                  ? 'tag-green'
                  : 'tag-blue'
              "
            >
              {{
                productDto.locationType && productDto.locationType.toLowerCase() === 'domestic'
                  ? 'Domestic'
                  : 'International'
              }}
            </div>
          </div>

          <div
            v-if="
              productDto.photoOne ||
              productDto.photoTwo ||
              productDto.photoThree ||
              productDto.photoFour
            "
            class="thumbs-strip"
          >
            <div
              v-for="(img, i) in [
                productDto.photoOne,
                productDto.photoTwo,
                productDto.photoThree,
                productDto.photoFour,
              ].filter((e) => e)"
              :key="i"
              class="thumb"
              :class="{ active: selectedImg === img }"
              @click="selectedImg = img"
            >
              <img
                :src="'http://localhost:8088/api/v1/productphoto/' + img"
                class="thumb-img"
                alt="thumbnail"
              />
            </div>
          </div>

          <div class="content-block">
            <h2 class="block-title">Overview</h2>
            <p class="overview-text">{{ productDto.detail }}</p>
          </div>

          <div class="content-block">
            <h2 class="block-title">Itinerary</h2>

            <div v-if="itineraryList && itineraryList.length" class="itinerary-list">
              <div v-for="(item, idx) in itineraryList" :key="idx" class="itin-item">
                <div class="itin-connector">
                  <div class="itin-dot" :class="idx === 0 ? 'dot-first' : ''">
                    <span class="dot-num">{{ item.dayNo }}</span>
                  </div>

                  <div v-if="idx < itineraryList.length - 1" class="itin-line" />
                </div>

                <div
                  class="itin-content"
                  :class="{ 'itin-last': idx === itineraryList.length - 1 }"
                >
                  <!--  loop ပတ်ထားတဲ့ item ထဲက title နဲ့ detail ကို ထုတ် -->
                  <div class="itin-title">{{ item.title }}</div>
                  <div class="itin-desc">{{ item.detail }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ratings  & Reviews Section -->
          <div class="content-block rating-comment-section">
            <h2 class="review-block-title">Ratings & Reviews</h2>

            <!--  Review Form -->
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
              <!-- to show rating list-->
              <h3 class="list-title">
                User Reviews ({{ ratingCommentList ? ratingCommentList.length : 0 }})
              </h3>

              <!-- to show if no rating -->
              <div v-if="!ratingCommentList || ratingCommentList.length === 0" class="no-reviews">
                No reviews yet. Be the first to review!
              </div>

              <!-- show rating/comment history with loop -->
              <div v-for="(rev, index) in ratingCommentList" :key="index" class="comment-card">
                <div class="comment-card-header">
                  <div class="user-info">
                    <!-- Show first letter of Name -->
                    <div class="user-avatar">
                      {{ (rev.userAccountDto?.profileName || 'A')[0].toUpperCase() }}
                    </div>

                    <!-- Show User Name -->
                    <span class="user-name">{{
                      rev.userAccountDto?.profileName || 'Anonymous Traveller'
                    }}</span>
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

                  <div class="review-date" style="color: #64748b; font-size: 0.875rem">
                    {{ rev.date }}
                  </div>
                </div>

                <!--Show Comment -->
                <p class="comment-content-text">{{ rev.comment }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-right">
          <div class="pricing-card">
            <div class="price-section">
              <span class="price-amount">{{ productDto.amount }}/person</span>
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
                <span class="spec-val">{{ productDto.day }} day /{{ productDto.night }} night</span>
              </div>
              <div class="spec-row">
                <div class="spec-lbl">📅 Departure Date</div>
                <span class="spec-val" style="font-weight: 600; color: #0f172a">
                  {{ formatDate(productDto.travelDate) }}
                </span>
              </div>

              <div class="spec-row">
                <div class="spec-lbl">🎟️ Ticket Left</div>
                <span
                  class="spec-val"
                  :style="{
                    //  if ticket <=5 warning sign
                    color: productDto.leftTicket <= 5 ? '#ef4444' : '#10b981',
                    fontWeight: '700',
                  }"
                >
                  {{
                    // Show left ticket and total ticket
                    productDto.leftTicket > 0
                      ? productDto.leftTicket + ' / ' + productDto.ticket + ' Left'
                      : 'Out Of Stock'
                  }}
                </span>
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
                <span class="spec-val">{{ productDto.groupSize }}</span>
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
                <span class="spec-val">{{ productDto.hotelName }}</span>
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
                <span class="spec-val">{{ productDto.transport }}</span>
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
                <span class="spec-val">{{ productDto.meals }}</span>
              </div>
            </div>

            <div class="divider" />

            <button class="book-btn" @click="clickBookNow">Book Now</button>
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

    <div v-else-if="loading" class="loading-state">
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import packageDetailService from '@/service/packageDetailService'

import { useAuthStore } from '../store/auth'
export default {
  name: 'PackageDetailView',

  data() {
    return {
      loading: true,
      selectedImg: '',
      inWishlist: false,

      newRating: 0,
      newComment: '',
      itineraryList: [],
      ratingCommentList: [],
      ratingsDataset: [],
      commentsDataset: [],
      packagesDataset: [],
      productDto: {},
      productId: 0,
      loginUser: {},
    }
  },

  mounted() {
    this.loginUser = JSON.parse(localStorage.getItem('loginUser')) || {}
    const pkgId = Number(this.$route.params.id) // 💡 Number ပြောင်းသိမ်းပါမည်
    this.productId = pkgId
    this.getPackageDetail()
    this.checkWishlistStatus()
    
    const allReviews = localStorage.getItem('all_packages_reviews')
    const reviewsObj = allReviews ? JSON.parse(allReviews) : {}

    if (reviewsObj[pkgId]) {
      this.commentsDataset = reviewsObj[pkgId]
    } else {
      this.commentsDataset = []
    }
  },
  methods: {
    async getPackageDetail() {
      const packageId = this.$route.params.id
      if (!packageId || packageId === 'null' || packageId === 'undefined') {
        console.warn("Package ID is null or undefined, skipping API call.");
        this.loading = false;
        return;
      }
      this.loading = true
      try {
        const data = await packageDetailService.getPackageDetail(packageId)

        this.itineraryList = data.itineraryList
        this.ratingCommentList = data.ratingCommentList
        this.productDto = data.productDto

        if (this.productDto && this.productDto.photo) {
          this.selectedImg = this.productDto.photo
        }

        this.commentsDataset = await packageDetailService.getComments()
        this.ratingsDataset = await packageDetailService.getRatings()
      } catch (error) {
        console.error('API fetch error', error)
      } finally {
        this.loading = false
      }
    },
    checkWishlistStatus() {
      const userId = this.loginUser?.userAccountId || 'guest';
      const wishlistKey = `wishlist_${userId}`;
      const currentWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
     
      this.inWishlist = currentWishlist.some(item => item.productId == this.productId);
    },

    toggleWishlist() {
      if (!this.loginUser || !this.loginUser.userAccountId) {
        alert('Please login to add to wishlist!');
        this.$router.push('/login');
        return;
      }

      const userId = this.loginUser.userAccountId;
      const wishlistKey = `wishlist_${userId}`;
      let currentWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

      // ရှိမရှိကို id သေချာတိုက်စစ်ခြင်း
      const exists = currentWishlist.some(item => item.productId == this.productId);

      if (exists) {
        currentWishlist = currentWishlist.filter(item => item.productId != this.productId);
        this.inWishlist = false;
        alert('Removed from Wishlist!');
      } else {
        const wishlistProduct = {
          productId: Number(this.productId),
          title: this.productDto.title,
          amount: this.productDto.amount,
          photo: this.productDto.photo || this.selectedImg,
          location: this.productDto.location,
          day: this.productDto.day,
          night: this.productDto.night
        };
        currentWishlist.push(wishlistProduct);
        this.inWishlist = true;
        alert('Added to Wishlist!');
      }

      localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist));
    },
    async submitReview() {

      if (this.newRating === 0) {
        alert('Please select a star rating.')
        return
      }
      if (!this.newComment.trim()) {
        alert('Please enter a comment.')
        return
      }

      const loginUserData = JSON.parse(localStorage.getItem('loginUser'))
      let loggedInCustomerId = loginUserData ? loginUserData.userAccountId : null

      if (!loggedInCustomerId) {
        loggedInCustomerId = 6 
      }

      console.log(this.newRating)

      let obj = { userAccountDto: {} }
      obj.productId = this.productId
      obj.userAccountDto.userAccountId = loggedInCustomerId
      obj.rating = this.newRating

      obj.message = this.newComment

      console.log(obj);
      

      try {
        console.log("Review Object => ", obj)
        await axios.post('http://localhost:8088/api/v1/package/ratingcomment', obj)
        // alert('Review Success')
        this.newComment = ''
        this.newRating = 0
        this.getPackageDetail()
      } catch (error) {
        console.error('--- DB Save Error Details ---')
        if (error.response) {
          alert('DB Save error Reason: ' + (error.response.data.message || 'Internal Error'))
        } else {
          alert('API fetch Error: ' + error.message)
        }
      }
    },
    clickBookNow() {
      this.$router.push(`/booking/${this.productId}`)
    },
    handleBooking() {},
    setImage(img) {
      this.selectedImg = img
    },
    formatMMK(price) {
      return price
    },
    formatDate(timestamp) {
      if (!timestamp) return 'N/A'
      const date = new Date(Number(timestamp))
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = String(date.getFullYear()).slice(-4)
      return `${day}-${month}-${year}`
    },
  },
  watch: {
    '$route.params.id': {
      handler: 'getPackageDetail',
      immediate: true,
    },
  },
  computed: {
    auth() {
      return useAuthStore()
    },
    isLoggedIn() {
      return this.auth.isLoggedIn
    },
    combinedReviews() {
      if (!this.commentsDataset || !this.ratingsDataset) {
        return []
      }
      const currentPackageId = this.$route.params.id
      const packageComments = this.commentsDataset.filter((c) => c.productId == currentPackageId)

      return packageComments.map((comment) => {
        const commentUserId = comment.customerId || comment.userAccountDto?.userAccountId
        const commentDate = comment.date

        const matchRating = this.ratingsDataset.find((r) => {
          const ratingUserId = r.customerId || r.userAccountDto?.userAccountId
          if (r.productId != currentPackageId) return false
          if (commentDate && r.date === commentDate) return true
          if (commentUserId && ratingUserId && commentUserId == ratingUserId) return true
          return false
        })

        return {
          user_name: matchRating?.userAccountDto?.profileName || 'Anonymous Traveller',
          rating: matchRating ? Number(matchRating.rating) : 0,
          comment: comment.message || comment.comment,
          date: comment.date,
        }
      })
    },
    averageRating() {
      if (this.combinedReviews.length === 0) return 0
      const sum = this.combinedReviews.reduce((acc, rev) => acc + rev.rating, 0)
      return (sum / this.combinedReviews.length).toFixed(1)
    },
  },
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
