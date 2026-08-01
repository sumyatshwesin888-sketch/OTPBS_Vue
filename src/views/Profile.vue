<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="main-profile-card">
        <div class="profile-upper">
          <div class="avatar-wrapper">
            <div class="avatar-circle">{{ initial }}</div>
          </div>
          <div class="profile-details">
            <h1 class="user-fullname">{{ loginUser.profileName || 'Traveler' }}</h1>
            <p class="user-meta-text">
              <i class="fa-solid fa-envelope input-icon"></i> {{ loginUser.email }}
            </p>
            <p class="user-meta-text">
              <i class="fas fa-phone-alt input-icon"></i>
              {{ loginUser.phone || 'No phone added' }}
            </p>
          </div>
          <v-btn
            color="#1B3D8A"
            variant="tonal"
            rounded="xl"
            class="edit-profile-btn text-none"
            @click="openEditModal"
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

      <!-- Content Area -->
      <div class="profile-dynamic-content-area">
        <div v-if="activeTab === 'bookings'" class="tab-pane-content">
          <!-- ၁။ Empty State -->
          <div v-if="bookings.length === 0" class="empty-state-card">
            <div class="empty-icon-circle"><i class="fa-solid fa-suitcase-rolling"></i></div>
            <h4>No Bookings Found</h4>
            <p>
              You haven't booked any travel packages yet. Explore our packages and start planning
              your next adventure!
            </p>
            <v-btn color="#1B3D8A" rounded="xl" class="text-none mt-2" to="/packages">
              Explore Packages
            </v-btn>
          </div>

          <!-- ၂။ List View Design -->
          <div v-else class="booking-list-container mt-4">
            <div
              v-for="(item, index) in bookings"
              :key="item.saleId || index"
              class="booking-list-item"
            >
              <!-- Left: Image -->
              <div class="booking-img-box">
                <img
                  :src="
                    item.product && item.product.photo
                      ? 'http://localhost:8088/api/v1/productphoto/' + item.product.photo
                      : 'https://via.placeholder.com/150'
                  "
                  alt="package thumbnail"
                  class="booking-thumb"
                />
              </div>

              <!-- Middle: Details -->
              <div class="booking-info">
                <h4 class="booking-package-title">
                  {{ item.product ? item.product.title : 'Booking #' + (item.saleId || item.id) }}
                </h4>
              </div>
              <div>
                <p class="booking-date-text">
                  {{ item.date ? item.date.split('T')[0] : 'N/A' }}
                </p>
              </div>
              

              <!-- Right: Status Badge -->
              <div class="booking-status-box">
                <span :class="['status-badge', (item.status || 'approved').toLowerCase()]">
                  {{ item.status || 'Approved' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'wishlist'" class="tab-pane-content">
          <div v-if="wishes.length === 0" class="empty-state-card">
            <div class="empty-icon-circle"><i class="fa-solid fa-heart"></i></div>
            <h4>Your Wishlist is Empty</h4>
            <p>Save tour packages you're interested in to keep track of them easily.</p>
          </div>
          <div v-else class="wishlist-grid mt-4">
            <div
              v-for="(item, index) in wishes"
              :key="item.productId || index"
              class="wishlist-item-card"
            >
              <img
                :src="'http://localhost:8088/api/v1/productphoto/' + item.photo"
                class="wish-card-img"
                alt="package photo"
              />
              <div class="wish-card-body">
                <h5 class="wish-title">{{ item.title }}</h5>
                <p class="wish-meta">
                  📍 {{ item.location }} | 📅 {{ item.day }} Day / {{ item.night }} Night
                </p>
                <div class="wish-footer">
                  <span class="wish-price">{{ item.amount }} / person</span>
                  <div class="wish-actions">
                    <v-btn
                      color="#1B3D8A"
                      size="small"
                      rounded="xl"
                      class="text-white"
                      :to="'/packagedetail/' + (item.productId || item.id)"
                      >View Detail</v-btn
                    >
                    <button class="wish-delete-btn" @click="removeFromWishlist(item, index)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="danger-zone-logout-section">
          <button class="logout-action-btn" @click="handleLogout">
            <i class="fa-solid fa-right-from-bracket"></i> Log Out
          </button>
        </div>

        <!-- Edit Account Dialog -->
        <v-dialog v-model="showEdit" max-width="480px" scrollable>
          <v-card class="modern-profile-dialog pa-4">
            <!-- Header -->
            <v-card-item class="pb-2">
              <h3 class="modern-dialog-title">Edit Account</h3>
              <p class="modern-dialog-subtitle">Update your account information below.</p>
            </v-card-item>

            <!-- Toggle Tabs -->
            <div class="dialog-tab-nav mx-4 mt-2">
              <button
                :class="['dialog-tab-btn', { active: dialogTab === 'profile' }]"
                @click="dialogTab = 'profile'"
              >
                <i class="fa-solid fa-user mr-1"></i> Profile Information
              </button>
              <button
                :class="['dialog-tab-btn', { active: dialogTab === 'password' }]"
                @click="dialogTab = 'password'"
              >
                <i class="fa-solid fa-lock mr-1"></i> Change Password
              </button>
            </div>

            <!-- Form Content -->
            <v-card-text class="py-4">
              <!-- Profile Info Tab Form -->
              <form
                v-if="dialogTab === 'profile'"
                @submit.prevent="handleUpdateProfile"
                id="editProfileForm"
                class="modern-dialog-form"
              >
                <div class="modern-input-group">
                  <label class="modern-input-label">Full Name</label>
                  <input
                    type="text"
                    v-model="editForm.fullName"
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
              </form>

              <!-- Change Password Tab Form -->
              <form
  v-if="dialogTab === 'password'"
  @submit.prevent="handleChangePassword"
  id="changePasswordForm"
  class="modern-dialog-form"
>
  <!-- Current Password -->
  <div class="modern-input-group">
    <label class="modern-input-label">Current Password</label>
    <div class="password-input-wrapper">
      <input
        :type="showCurrentPassword ? 'text' : 'password'"
        v-model="passwordForm.currentPassword"
        placeholder="Enter your current password"
        class="modern-input-field"
        required
      />
      <span
        class="toggle-password"
        @click="showCurrentPassword = !showCurrentPassword"
      >
        <!-- Eye Open -->
        <svg
          v-if="!showCurrentPassword"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <!-- Eye Off (Slash) -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </span>
    </div>
  </div>

  <!-- New Password -->
  <div class="modern-input-group mt-4">
    <label class="modern-input-label">New Password</label>
    <div class="password-input-wrapper">
      <input
        :type="showNewPassword ? 'text' : 'password'"
        v-model="passwordForm.newPassword"
        placeholder="Enter your new password"
        class="modern-input-field"
        required
      />
      <span class="toggle-password" @click="showNewPassword = !showNewPassword">
        <svg
          v-if="!showNewPassword"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </span>
    </div>
  </div>

  <!-- Confirm New Password -->
  <div class="modern-input-group mt-4">
    <label class="modern-input-label">Confirm New Password</label>
    <div class="password-input-wrapper">
      <input
        :type="showConfirmPassword ? 'text' : 'password'"
        v-model="passwordForm.confirmPassword"
        placeholder="Confirm your new password"
        class="modern-input-field"
        required
      />
      <span
        class="toggle-password"
        @click="showConfirmPassword = !showConfirmPassword"
      >
        <svg
          v-if="!showConfirmPassword"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </span>
    </div>
  </div>
</form>
            </v-card-text>

            <!-- Actions Footer -->
            <v-card-actions class="pt-2 px-6 pb-2">
              <v-spacer></v-spacer>
              <button
                type="button"
                class="dialog-cancel-btn text-none font-weight-bold mr-3"
                @click="showEdit = false"
              >
                Cancel
              </button>

              <v-btn
                v-if="dialogTab === 'profile'"
                type="submit"
                form="editProfileForm"
                color="#1B3D8A"
                variant="flat"
                class="text-none font-weight-bold px-6 text-white dialog-submit-btn"
                rounded="xl"
              >
                Save Changes
              </v-btn>

              <v-btn
                v-if="dialogTab === 'password'"
                type="submit"
                form="changePasswordForm"
                color="#1B3D8A"
                variant="flat"
                class="text-none font-weight-bold px-6 text-white dialog-submit-btn"
                rounded="xl"
              >
                Update Password
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import UserAccountService from '@/service/UserAccountService'
import SaleService from '@/service/SaleService'

export default {
  name: 'UserProfile',
  data() {
    return {
      authStore: {},
      showEdit: false,
      activeTab: 'bookings',
      dialogTab: 'profile',

      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,

      editForm: {
        fullName: '',
        phone: '',
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      bookings: [], //ဒီထဲကို Backend က ရလာတဲ့ Data ရောက်လာမယ်
      wishes: [],
      loginUser: {},
      bookingList: [],
      bookingCount: 0,
    }
  },
  mounted() {
    this.loginUser = JSON.parse(localStorage.getItem('loginUser')) || {}
    this.loadUserData()
    this.loadWishlist()
    this.loadUserBookings() // Page စတက်တာနဲ့ Booking ဆွဲထုတ်မယ့် function ကို ခေါ်ပေး
  },
  computed: {
    initial() {
      const name = this.loginUser?.fullName || this.loginUser?.profileName || 'T'
      return name.charAt(0).toUpperCase()
    },
  },
  methods: {
    async loadUserBookings() {
      if (this.loginUser && this.loginUser.userAccountId) {
        try {
          // Service က request.data ကို တိုက်ရိုက် return ပြန်ပေးထားပြီးသားဖြစ်တယ်
          const data = await SaleService.getSaleByUserId(this.loginUser.userAccountId)

          console.log('Fetched Bookings >>>', data)

          this.bookings = data || []
          this.bookingList = this.bookings
        } catch (error) {
          console.error('Error fetching user bookings:', error)
        }
      }
    },

    handleLogout() {
      localStorage.removeItem('loginUser')
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    openEditModal() {
      this.dialogTab = 'profile'
      this.showEdit = true
      this.loadUserData()
    },
    loadUserData() {
      const savedUser = JSON.parse(localStorage.getItem('loginUser'))
      if (savedUser) {
        this.editForm.fullName = savedUser.fullName || savedUser.profileName || ''
        this.editForm.phone = savedUser.phone || ''
      }
    },
    loadWishlist() {
      if (this.loginUser && this.loginUser.userAccountId) {
        const userId = this.loginUser.userAccountId
        const wishlistKey = `wishlist_${userId}`
        this.wishes = JSON.parse(localStorage.getItem(wishlistKey)) || []
      }
    },
    removeFromWishlist(item, index) {
      const userId = this.loginUser.userAccountId
      const wishlistKey = `wishlist_${userId}`

      // ၁။ ID ရှိရင် ID နဲ့ တိုက်ဖျက်မယ်၊ မရှိရင် Array Index နဲ့ ဖျက်မယ်
      const targetId = item.productId || item.id

      if (targetId) {
        this.wishes = this.wishes.filter((w) => Number(w.productId || w.id) !== Number(targetId))
      } else {
        // ID မပါခဲ့ရင် နှိပ်လိုက်တဲ့ Card ရဲ့ Index အတိုင်း Array ထဲကနေ ကွက်တိဖျက်မယ်
        this.wishes.splice(index, 1)
      }

      //  LocalStorage ထဲမှာ Update ပြန်သိမ်းမယ်
      localStorage.setItem(wishlistKey, JSON.stringify(this.wishes))

      alert('Removed from Wishlist!')
    },

    async handleUpdateProfile() {
      const savedUser = JSON.parse(localStorage.getItem('loginUser'))

      if (!savedUser) {
        alert('User session not found. Please log in again.')
        return
      }

      // Backend Error မတက် ဖို့လက်ရှိ User ရဲ့ Data အဟောင်းတွေကိုပါ Payload မှာ တွဲထည့်ထား
      const updateData = {
        ...savedUser, // email, userType, password စတာတွေအကုန်လုံး ပါသွားအောင် ဖြန့်ထည့်ခြင်း
        userAccountId: savedUser.userAccountId,
        profileName: this.editForm.fullName,
        fullName: this.editForm.fullName,
        phone: this.editForm.phone,
      }

      try {
        await UserAccountService.updateUserAccount(updateData)

        // Local Storage နှင့် UI state ကို အောင်မြင်စွာ update လုပ်
        savedUser.fullName = this.editForm.fullName
        savedUser.profileName = this.editForm.fullName
        savedUser.phone = this.editForm.phone

        localStorage.setItem('loginUser', JSON.stringify(savedUser))
        this.loginUser = savedUser

        alert('Profile Updated Successfully!')
        this.showEdit = false
      } catch (error) {
        console.error('Update Error:', error)
        alert('Failed to update profile. Please try again!')
      }
    },
   async handleChangePassword() {
  const { currentPassword, newPassword, confirmPassword } = this.passwordForm;

  // 1. ကွက်လပ် အားလုံး ဖြည့်ထားခြင်း ရှိမရှိ စစ်ဆေးခြင်း
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert('Please fill in all password fields!');
    return;
  }

  // 2. Password အသစ် အနည်းဆုံး ၆ လုံး ရှိရမည်
  if (newPassword.length < 6) {
    alert('New password must be at least 6 characters long!');
    return;
  }

  // 3. Password အသစ် နှင့် Confirm Password ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးခြင်း
  if (newPassword !== confirmPassword) {
    alert('New password and confirm password do not match!');
    return;
  }

  // 4. Password အသစ်သည် Password အဟောင်းနှင့် တူနေပါက တားမြစ်ခြင်း
  if (currentPassword === newPassword) {
    alert('New password cannot be the same as current password!');
    return;
  }

  const savedUser = JSON.parse(localStorage.getItem('loginUser'));
  if (!savedUser) {
    alert('Session expired. Please log in again!');
    return;
  }

  // 5. Current password မှန်/မမှန် စစ်ဆေးခြင်း
  if (savedUser.password && savedUser.password !== currentPassword) {
    alert('Current password is incorrect!');
    return;
  }

  // Backend သို့ ပို့မည့် Payload
  const passwordPayload = {
    userAccountId: savedUser.userAccountId,
    password: newPassword,
  };

  try {
    await UserAccountService.updatePassword(passwordPayload);

    // Local Storage နှင့် UI state ကို update လုပ်ခြင်း
    savedUser.password = newPassword;
    localStorage.setItem('loginUser', JSON.stringify(savedUser));
    this.loginUser = savedUser;

    alert('Password updated successfully!');

    // Form fields များကို Reset ပြန်ချခြင်း
    this.passwordForm.currentPassword = '';
    this.passwordForm.newPassword = '';
    this.passwordForm.confirmPassword = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.showEdit = false;
  } catch (error) {
    console.error('Password Update Error:', error);
    alert('Failed to update password. Please try again!');
  }
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
  padding: 100px 20px;
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

/* Dialog Styles */
.modern-profile-dialog {
  border-radius: 24px !important;
  background: #ffffff !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
  overflow: hidden;
}

.modern-dialog-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}
.modern-dialog-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

/* Navigation Tabs inside Dialog */
.dialog-tab-nav {
  display: flex;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 12px;
}

.dialog-tab-btn {
  flex: 1;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-tab-btn.active {
  background: #1b3d8a;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(27, 61, 138, 0.2);
}

.modern-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.modern-input-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  padding-left: 4px;
}
/* 💡 Wishlist UI Card Style များ */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.wishlist-item-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.wishlist-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
.wish-card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: block;
}
.wish-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.wish-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}
.wish-meta {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;
}
.wish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.wish-price {
  font-size: 15px;
  font-weight: 700;
  color: #16a34a;
}
.wish-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.wish-delete-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  transition: transform 0.2s;
}
.wish-delete-btn:hover {
  transform: scale(1.1);
}

/* Signup-style Input Wrapper & Eye Style */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 40px; /* Make space for eye icon on the right */
}

/* Signup file ထဲက ပုံစံအတိုင်း Class name နှင့် CSS transition style */
.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #1b3d8a;
}

.modern-input-field {
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  width: 100%;
  transition: all 0.2s ease;
}

.modern-input-field:focus {
  border-color: #1b3d8a;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(27, 61, 138, 0.15);
}

.dialog-cancel-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
}

.dialog-submit-btn {
  background-color: #1b3d8a !important;
  text-transform: none !important;
  font-size: 14px !important;
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
/* Booking List Item Layout */
.booking-list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-list-item {
  align-items: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: 1px solid rgba(226, 232, 240, 0.8);
}
.booking-list-item > div:not(.booking-info) {
  flex: 1;
  margin: 0 !important;
  padding: 0 15px !important;
  text-align: center; 
}

.booking-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.booking-img-box {
  padding: 0 !important;
  flex: 0 0 auto !important; 
}
/* Image Styling */
.booking-img-box img{
  width: 100px;
  height: 95px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

.booking-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* Middle Details */
.booking-info {
 margin-left: 18px;
  flex-shrink: 0;
}

.booking-package-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.booking-date-text {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  display: inline-block;
}

/* Right Status Badge */
.booking-status-box {
  display: flex;
  align-items: center;
  flex-shrink: 0; 
  margin-left: auto;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

/* Status colors (Approved / Pending / Cancelled) */
.status-badge.confirm {
  background-color: #ecfdf5;
  color: blue;
}
.status-badge.approved {
  background-color: #e6f4ea;
  color: #137333;
}

.status-badge.delete {
  background-color: #fce8e6;
  color: #c5221f;
}
</style>
