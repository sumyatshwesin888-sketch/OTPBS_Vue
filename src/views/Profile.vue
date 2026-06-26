<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="main-profile-card">
        <div class="profile-upper">
          <div class="avatar-wrapper">
            <div class="avatar-circle">{{ initial }}</div>
          </div>
          <div class="profile-details">
            <h1 class="user-fullname">{{ auth.profile.full_name || 'Traveler' }}</h1>
            <p class="user-meta-text"><i class="fa-solid fa-envelope input-icon"></i> {{ auth.user.email }}</p>
            <p class="user-meta-text"><i class="fas fa-phone-alt input-icon"></i> {{ auth.profile.phone || 'No phone added' }}</p>
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
            <span class="stat-number">{{ wishes.length }}</span>
            <span class="stat-title">Wishlist</span>
          </div>
        </div>
      </div>

      <div class="content-selection-nav">
        <button 
          :class="['nav-pill-btn', { active: activeTab === 'bookings' }]"
          @click="activeTab = 'bookings'"
        >
          <i class="fa-solid fa-suitcase-rolling"></i> My Bookings
        </button>
        <button 
          :class="['nav-pill-btn', { active: activeTab === 'wishlist' }]"
          @click="activeTab = 'wishlist'"
        >
          <i class="fa-solid fa-heart"></i> My Wishlist
        </button>
      </div>

      <div class="profile-dynamic-content-area">
        <div v-if="activeTab === 'bookings'" class="tab-pane-content">
          <div v-if="bookings.length === 0" class="empty-state-card">
            <div class="empty-icon-circle"><i class="fa-solid fa-suitcase-rolling"></i></div>
            <h4>No Bookings Found</h4>
            <p>You haven't booked any travel packages yet. Explore our packages and start planning your next adventure!</p>
            <v-btn color="#1B3D8A" rounded="xl" class="text-none mt-2" to="/packages">Explore Packages</v-btn>
          </div>
        </div>

        <div v-if="activeTab === 'wishlist'" class="tab-pane-content">
          <div v-if="wishes.length === 0" class="empty-state-card">
            <div class="empty-icon-circle"><i class="fa-solid fa-heart"></i></div>
            <h4>Your Wishlist is Empty</h4>
            <p>Save tour packages you're interested in to keep track of them easily.</p>
          </div>
        </div>
      </div>

      <div class="danger-zone-logout-section">
        <button class="logout-action-btn" @click="handleLogout">
          <i class="fa-solid fa-right-from-bracket"></i> Log Out
        </button>
      </div>

      <v-dialog v-model="showEdit" max-width="450px" backdrop="static">
        <v-card class="modern-profile-dialog">
          <v-card-text class="pa-6">
            <div class="dialog-header-wrapper">
              <h3 class="modern-dialog-title">Edit Profile Information</h3>
              <p class="modern-dialog-subtitle">Update your personal details below.</p>
            </div>

            <form @submit.prevent="handleUpdateProfile" class="modern-dialog-form">
              <div class="modern-input-group">
                <label class="modern-input-label">Full Name</label>
                <input
                  type="text"
                  v-model="editForm.full_name"
                  placeholder="Enter your full name"
                  class="modern-input-field"
                  required
                />
              </div>

              <div class="modern-input-group mt-4">
                <label class="modern-input-label">Phone Number</label>
                <input
                  type="text"
                  v-model="editForm.phone"
                  placeholder="Enter your phone number"
                  class="modern-input-field"
                  required
                />
              </div>

              <div class="dialog-actions-row mt-6">
                <v-btn
                  variant="text"
                  color="#64748B"
                  class="text-none action-cancel-btn"
                  rounded="xl"
                  @click="showEdit = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  type="submit"
                  color="#1B3D8A"
                  variant="flat"
                  class="text-none action-save-btn"
                  rounded="xl"
                >
                  Save Changes
                </v-btn>
              </div>
            </form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      showEdit: false,
      activeTab: 'bookings',
      auth: {
        user: { email: '' },
        profile: { full_name: '', phone: '' }
      },
      editForm: {
        full_name: '',
        phone: ''
      },
      bookings: [],
      wishes: []
    }
  },
  computed: {
    initial() {
      const name = this.auth.profile.full_name || 'T';
      return name.charAt(0).toUpperCase();
    }
  },
  created() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      const savedUser = localStorage.getItem('user_account')
      const isLoggedIn = localStorage.getItem('is_logged_in')
      
      if (savedUser && isLoggedIn === 'true') {
        const user = JSON.parse(savedUser)
        
        this.auth.user.email = user.email || ''
        this.auth.profile.full_name = user.full_name || ''
        this.auth.profile.phone = user.phone || ''
        
        this.editForm.full_name = user.full_name || ''
        this.editForm.phone = user.phone || ''
      } else {
        alert('Please Create an Account or Log In first.')
        this.$router.push('/signup')
      }
    },
    handleUpdateProfile() {
      const savedUser = localStorage.getItem('user_account')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        user.full_name = this.editForm.full_name
        user.phone = this.editForm.phone
        
        localStorage.setItem('user_account', JSON.stringify(user))
        
        this.auth.profile.full_name = this.editForm.full_name
        this.auth.profile.phone = this.editForm.phone
        
        alert('Profile Updated Successfully!')
        this.showEdit = false
      }
    },
    handleLogout() {
      localStorage.removeItem('is_logged_in')
      alert('Logged Out Successfully!')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 40px 20px;
  background: #f8fafc;
  min-height: 100vh;
}
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}
.main-profile-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 32px;
}
.profile-upper {
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
}
.avatar-circle {
  width: 80px;
  height: 80px;
  background: #1b3d8a;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
}
.profile-details {
  flex: 1;
}
.user-fullname {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}
.user-meta-text {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}
.edit-profile-btn {
  position: absolute;
  right: 0;
  top: 0;
}
.profile-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 24px 0;
}
.integrated-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}
.stat-block {
  flex: 1;
}
.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: #1b3d8a;
}
.stat-title {
  font-size: 13px;
  color: #64748b;
}
.stat-block-divider {
  width: 1px;
  background: #e2e8f0;
}

.content-selection-nav {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  margin-bottom: 20px;
}
.nav-pill-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 40px;
  background: #fff;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-pill-btn.active {
  background: #1b3d8a;
  color: #fff;
  border-color: #1b3d8a;
}

.profile-dynamic-content-area {
  margin-bottom: 32px;
}
.empty-state-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 48px 32px;
  text-align: center;
}
.empty-icon-circle {
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 16px;
}
.empty-state-card h4 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}
.empty-state-card p {
  font-size: 14px;
  color: #64748b;
  max-width: 450px;
  margin: 0 auto 16px;
}

.danger-zone-logout-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.logout-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #f1f5f9;
  color: #ef4444;
  padding: 12px 24px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);
  transition: all 0.2s;
}
.logout-action-btn:hover {
  background: #fef2f2;
}

.modern-profile-dialog {
  border-radius: 20px !important;
}
.modern-dialog-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
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
  width: 100%;
}
.dialog-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>