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
            <p class="user-meta-text">
              <i class="fa-solid fa-envelope input-icon"></i> {{ auth.user.email }}
            </p>
            <p class="user-meta-text">
              <i class="fas fa-phone-alt input-icon"></i>
              {{ auth.profile.phone || 'No phone added' }}
            </p>
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
            <p>
              You haven't booked any travel packages yet. Explore our packages and start planning
              your next adventure!
            </p>
            <v-btn color="#1B3D8A" rounded="xl" class="text-none mt-2" to="/packages"
              >Explore Packages</v-btn
            >
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
        profile: { full_name: '', phone: '' },
      },
      editForm: {
        full_name: '',
        phone: '',
      },
      bookings: [],
      wishes: [],
    }
  },
  computed: {
    initial() {
      const name = this.auth.profile.full_name || 'T'
      return name.charAt(0).toUpperCase()
    },
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
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.profile-page {
  padding: 60px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%);
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.profile-container {
  max-width: 850px;
  width: 100%;
  margin: 0 auto;
}

.main-profile-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
}

.profile-upper {
  display: flex;
  align-items: center;
  gap: 30px;
  position: relative;
}

.avatar-circle {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.4);
  border: 3px solid #ffffff;
}

.profile-details {
  flex: 1;
}

.user-fullname {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.user-meta-text {
  font-size: 14px;
  color: #475569;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.user-meta-text i {
  color: #0284c7; 
  width: 16px;
}

.edit-profile-btn {
  position: absolute;
  right: 0;
  top: 10px;
  background-color: #f1f5f9 !important;
  color: #1e293b !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #e2e8f0 !important;
  transition: all 0.2s ease;
}

.edit-profile-btn:hover {
  background-color: #0f172a !important;
  color: #ffffff !important;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2) !important;
}

.profile-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(226, 232, 240, 0),
    rgba(226, 232, 240, 1),
    rgba(226, 232, 240, 0)
  );
  margin: 32px 0;
}

.integrated-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #1d4ed8 0%, #0369a1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-title {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.stat-block-divider {
  width: 1px;
  background: #e2e8f0;
}

.content-selection-nav {
  display: flex;
  gap: 16px;
  margin-top: 35px;
  margin-bottom: 24px;
}

.nav-pill-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 26px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.nav-pill-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.nav-pill-btn.active {
  background: #ffffff;
  color: #0f172a;
  border-color: #ffffff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.empty-state-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 55px 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.empty-icon-circle {
  width: 70px;
  height: 70px;
  background: #f0fdfa;
  color: #0ea5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 20px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.empty-state-card h4 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.empty-state-card p {
  font-size: 14px;
  color: #64748b;
  max-width: 480px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.danger-zone-logout-section {
  display: flex;
  justify-content: center;
  margin-top: 45px;
}

.logout-action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(254, 242, 242, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  padding: 12px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.2s ease;
}

.logout-action-btn:hover {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
}

.modern-profile-dialog {
  border-radius: 24px !important;
  background: #ffffff !important;
}

.modern-dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.modern-dialog-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 24px;
}

.modern-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modern-input-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.modern-input-field {
  border: 1.5px solid #cbd5e1;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  width: 100%;
  transition: all 0.2s;
}

.modern-input-field:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.dialog-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 600px) {
  .profile-upper {
    flex-direction: column;
    text-align: center;
  }
  .edit-profile-btn {
    position: relative;
    margin-top: 15px;
    top: 0;
  }
}
</style>
