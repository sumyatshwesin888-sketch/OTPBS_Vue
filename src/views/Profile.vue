<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="main-profile-card">
        <div class="profile-upper">
          <div class="avatar-wrapper">
            <div class="avatar-circle">{{ initial }}</div>
          </div>
          <div class="profile-details">
            <h1 class="user-fullname">{{ auth.profile?.full_name || 'Traveler' }}</h1>
            <p class="user-meta-text">📧 {{ auth.user?.email }}</p>
            <p class="user-meta-text">📱 {{ auth.profile?.phone || 'No phone added' }}</p>
          </div>
          <v-btn
            color="#1B3D8A"
            variant="tonal"
            rounded="xl"
            class="edit-profile-btn text-none"
            @click="showEdit = true"
          >
            <v-icon size="16" class="mr-1">mdi-pencil-outline</v-icon> Edit Profile
          </v-btn>
        </div>

        <div class="profile-divider"></div>

        <div class="integrated-stats">
          <div class="stat-block">
            <span class="stat-number">{{ bookings.length }}</span>
            <span class="stat-title">Total Bookings</span>
          </div>
          <div class="stat-block-divider"></div>
          <div class="stat-block">
            <span class="stat-number">{{ wishlistItems.length }}</span>
            <span class="stat-title">Saved Wishlist</span>
          </div>
          <div class="stat-block-divider"></div>
          <div class="stat-block">
            <span class="stat-number">{{ auth.profile?.phone ? '100%' : '50%' }}</span>
            <span class="stat-title">Profile Status</span>
          </div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-top-bar">
          <h2 class="content-section-title">My Bookings</h2>
          <v-btn
            to="/packages"
            color="#2563EB"
            variant="flat"
            rounded="xl"
            size="small"
            class="text-none px-4"
          >
            Book New Trip
          </v-btn>
        </div>

        <div v-if="loadingBookings" class="d-flex justify-center py-8">
          <v-progress-circular indeterminate color="#1B3D8A" size="32" />
        </div>

        <div v-else-if="bookings.length === 0" class="clean-empty-state">
          <div class="empty-icon-circle">
            <v-icon size="28" color="#64748B">mdi-wallet-travel</v-icon>
          </div>
          <p class="empty-text">No bookings found. Time to plan a new journey!</p>
          <v-btn
            to="/packages"
            color="#1B3D8A"
            variant="outlined"
            rounded="xl"
            class="text-none mt-2"
            size="small"
            >Browse Packages</v-btn
          >
        </div>

        <div v-else class="bookings-modern-grid">
          <div v-for="b in bookings" :key="b.id" class="booking-card-modern">
            <v-img :src="b.packages?.hero_image" cover class="booking-card-img" />
            <div class="booking-card-body">
              <div class="flex-justified mb-1">
                <span class="booking-card-name">{{ b.packages?.name }}</span>
                <span class="booking-card-price">{{ formatMMK(b.total_amount) }}</span>
              </div>
              <div class="booking-card-meta mb-3">
                ⏳ {{ b.packages?.duration_days }}D / {{ b.packages?.duration_nights }}N
                &nbsp;|&nbsp; 👥 {{ b.num_travelers }} People
              </div>
              <div class="profile-divider mb-3"></div>
              <div class="flex-justified items-center">
                <span class="booking-card-date">📅 {{ b.travel_date }}</span>
                <v-chip
                  size="x-small"
                  :color="statusColor(b.status)"
                  class="text-uppercase font-weight-bold px-3"
                  label
                >
                  {{ b.status }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2 class="content-section-title mb-4">My Wishlist</h2>

        <div v-if="loadingWishlist" class="d-flex justify-center py-8">
          <v-progress-circular indeterminate color="#1B3D8A" size="32" />
        </div>

        <div v-else-if="wishlistItems.length === 0" class="clean-empty-state">
          <div class="empty-icon-circle">
            <v-icon size="28" color="#64748B">mdi-heart-broken-outline</v-icon>
          </div>
          <p class="empty-text">Your wishlist is currently empty.</p>
        </div>

        <div v-else class="wishlist-modern-grid">
          <div v-for="w in wishlistItems" :key="w.id" class="wishlist-item-card">
            <div class="wishlist-img-container">
              <v-img :src="w.packages?.hero_image" cover class="wishlist-img" />
              <button class="wishlist-heart-btn" @click="removeWishlist(w.id)">
                <v-icon size="16" color="#DC2626">mdi-heart</v-icon>
              </button>
            </div>
            <div class="wishlist-card-content">
              <div class="wishlist-item-title">{{ w.packages?.name }}</div>
              <div class="wishlist-item-days">
                {{ w.packages?.duration_days }}D / {{ w.packages?.duration_nights }}N
              </div>
              <div class="wishlist-item-price">
                {{ formatMMK(w.packages?.price_per_person) }} <span class="per-person">/ pax</span>
              </div>
              <v-btn
                block
                size="small"
                variant="flat"
                color="#F1F5F9"
                rounded="lg"
                class="text-none mt-3 text-body-2 text-slate-700"
                :to="`/package/${w.package_id}`"
              >
                View Details
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="logout-action-row">
        <button class="modern-signout-btn" @click="handleLogout">
          <v-icon size="16" class="mr-2">mdi-power</v-icon> Sign Out Account
        </button>
      </div>
    </div>

    <v-dialog v-model="showEdit" max-width="420" transition="dialog-bottom-transition">
      <div class="modern-dialog-box">
        <h3 class="modern-dialog-title">Update Profile</h3>
        <p class="modern-dialog-subtitle">Change your public profile details below.</p>

        <div class="modern-input-group mb-4">
          <label class="modern-input-label">Full Name</label>
          <input
            v-model="editForm.full_name"
            class="modern-input-field"
            placeholder="Your full name"
          />
        </div>

        <div class="modern-input-group mb-4">
          <label class="modern-input-label">Phone Number</label>
          <input v-model="editForm.phone" class="modern-input-field" placeholder="09 123 456 789" />
        </div>

        <div v-if="editMsg" class="modern-success-alert mb-4">✨ {{ editMsg }}</div>

        <div class="modern-dialog-buttons">
          <button class="modern-btn-cancel" @click="showEdit = false">Cancel</button>
          <button class="modern-btn-save" :disabled="saving" @click="saveProfile">
            {{ saving ? 'Saving Changes...' : 'Save Updates' }}
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth'

export default {
  name: 'ProfilePage',
  data() {
    return {
      loadingBookings: true,
      loadingWishlist: true,
      bookings: [],
      wishlistItems: [],
      showEdit: false,
      saving: false,
      editMsg: '',
      editForm: {
        full_name: '',
        phone: '',
      },
    }
  },
  computed: {
    auth() {
      return useAuthStore()
    },
    initial() {
      const n = this.auth.profile?.full_name || this.auth.user?.email || ''
      return n.charAt(0).toUpperCase()
    },
  },
  mounted() {
    this.editForm.full_name = this.auth.profile?.full_name || ''
    this.editForm.phone = this.auth.profile?.phone || ''
    this.loadBookings()
    this.loadWishlist()
  },
  methods: {
    formatMMK(price) {
      return Number(price)?.toLocaleString() + ' MMK'
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
    statusColor(status) {
      return { confirmed: '#27AE60', pending: '#F59E0B', cancelled: '#DC2626' }[status] || '#888'
    },
    async loadBookings() {
      this.loadingBookings = true
      const { data } = await supabase
        .from('bookings')
        .select('*, packages(id, name, hero_image, duration_days, duration_nights)')
        .eq('user_id', this.auth.user.id)
        .order('created_at', { ascending: false })
      this.bookings = data || []
      this.loadingBookings = false
    },
    async loadWishlist() {
      this.loadingWishlist = true
      const { data } = await supabase
        .from('wishlist')
        .select(
          '*, packages(id, name, hero_image, duration_days, duration_nights, price_per_person)',
        )
        .eq('user_id', this.auth.user.id)
        .order('created_at', { ascending: false })
      this.wishlistItems = data || []
      this.loadingWishlist = false
    },
    async removeWishlist(id) {
      await supabase.from('wishlist').delete().eq('id', id)
      this.wishlistItems = this.wishlistItems.filter((w) => w.id !== id)
    },
    async saveProfile() {
      this.saving = true
      this.editMsg = ''
      await this.auth.updateProfile(this.editForm)
      this.editMsg = 'Profile updated!'
      this.saving = false
      setTimeout(() => {
        this.showEdit = false
        this.editMsg = ''
      }, 1200)
    },
    async handleLogout() {
      await this.auth.signOut()
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
/* Utilities & Base */
.profile-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 40px 16px;
  font-family: 'Inter', sans-serif;
}
.profile-container {
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.profile-divider {
  height: 1px;
  background: #f1f5f9;
  width: 100%;
}
.flex-justified {
  display: flex;
  justify-content: space-between;
}
.items-center {
  align-items: center;
}

/* 1. Main Combined Profile Card */
.main-profile-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  padding: 28px;
}
.profile-upper {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 24px;
}
.avatar-wrapper {
  position: relative;
}
.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1b3d8a, #2563eb);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 800;
  shadow: 0 4px 10px rgba(27, 61, 138, 0.2);
}
.profile-details {
  flex: 1;
  min-width: 0;
}
.user-fullname {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px;
}
.user-meta-text {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.edit-profile-btn {
  font-weight: 600 !important;
  font-size: 13px !important;
}

/* Integrated Stats inside Main Card */
.integrated-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 20px;
}
.stat-block {
  text-align: center;
  flex: 1;
}
.stat-number {
  font-size: 24px;
  font-weight: 800;
  color: #1b3d8a;
  block-size: auto;
  display: block;
}
.stat-title {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  margin-top: 2px;
}
.stat-block-divider {
  width: 1px;
  height: 32px;
  background: #e2e8f0;
}

/* 2. Content Sections Base */
.content-section {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.section-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.content-section-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Modern Bookings Grid */
.bookings-modern-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 640px) {
  .bookings-modern-grid {
    grid-template-columns: 1fr;
  }
}

.booking-card-modern {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.booking-card-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}
.booking-card-img {
  height: 140px;
  width: 100%;
}
.booking-card-body {
  padding: 14px;
}
.booking-card-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}
.booking-card-price {
  font-size: 14px;
  font-weight: 700;
  color: #16a34a;
}
.booking-card-meta {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}
.booking-card-date {
  font-size: 12px;
  color: #64748b;
}

/* Modern Wishlist Grid */
.wishlist-modern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
.wishlist-item-card {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}
.wishlist-img-container {
  position: relative;
  height: 120px;
}
.wishlist-img {
  height: 100%;
  width: 100%;
}
.wishlist-heart-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ffffff;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.wishlist-card-content {
  padding: 12px;
}
.wishlist-item-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}
.wishlist-item-days {
  font-size: 11px;
  color: #94a3b8;
  margin: 2px 0 4px;
}
.wishlist-item-price {
  font-size: 13px;
  font-weight: 700;
  color: #16a34a;
}
.per-person {
  font-size: 10px;
  color: #64748b;
  font-weight: 400;
}

/* Clean Empty States */
.clean-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 0;
  text-align: center;
}
.empty-icon-circle {
  background: #f1f5f9;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.empty-text {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  max-width: 260px;
  margin-bottom: 4px;
}

/* Logout Row */
.logout-action-row {
  text-align: center;
  padding: 12px 0;
}
.modern-signout-btn {
  display: inline-flex;
  align-items: center;
  background: #fff;
  color: #ef4444;
  border: 1px solid #fee2e2;
  border-radius: 12px;
  padding: 10px 24px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
.modern-signout-btn:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

/* Modern Dialog Box */
.modern-dialog-box {
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
}
.modern-dialog-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 2px;
}
.modern-dialog-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 20px;
}
.modern-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.modern-input-label {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}
.modern-input-field {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 11px 14px;
  font-size: 14px;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: all 0.2s;
}
.modern-input-field:focus {
  border-color: #1b3d8a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(27, 61, 138, 0.08);
}
.modern-success-alert {
  background: #f0fdf4;
  color: #16a34a;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
}
.modern-dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
.modern-btn-cancel {
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.modern-btn-save {
  background: #1b3d8a;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.modern-btn-save:disabled {
  opacity: 0.5;
}

.text-none {
  text-transform: none !important;
  letter-spacing: 0;
}
</style>
