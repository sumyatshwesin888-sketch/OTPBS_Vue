<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyProfile',
  data() {
    return {
      profileForm: {
        fullName: 'Admin',
        phone: '',
        email: 'admin@gmail.com'
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      saving: false,
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'success'
    }
  },
  computed: {
    profileFormValid(): boolean {
      return !!(this.profileForm.fullName && this.profileForm.email)
    },
    passwordFormValid(): boolean {
      return !!(
        this.passwordForm.currentPassword &&
        this.passwordForm.newPassword &&
        this.passwordForm.confirmPassword &&
        this.passwordForm.newPassword === this.passwordForm.confirmPassword &&
        this.passwordForm.newPassword.length >= 6
      )
    },
    userInitial(): string {
      return this.profileForm.fullName?.charAt(0).toUpperCase() || 'A'
    }
  },
  methods: {
    async saveProfile() {
      this.saving = true
      await new Promise(resolve => setTimeout(resolve, 800))
      this.saving = false
      this.snackbarMessage = 'Profile updated successfully!'
      this.snackbarColor = 'success'
      this.snackbar = true
    },

    async updatePassword() {
      this.saving = true
      await new Promise(resolve => setTimeout(resolve, 800))
      this.saving = false
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.snackbarMessage = 'Password updated successfully!'
      this.snackbarColor = 'success'
      this.snackbar = true
    }
  }
})
</script>

<template>
  <div>
    <v-row>
      <!-- Profile Overview Card -->
      <v-col cols="12" lg="4">
        <v-card class="enterprise-card text-center pa-6">
          <div class="profile-avatar-wrapper mb-4">
            <v-avatar size="120" class="profile-avatar-large">
              <span class="profile-initial-large">{{ userInitial }}</span>
            </v-avatar>
            <div class="profile-status-dot"></div>
          </div>

          <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">{{ profileForm.fullName }}</h3>
          <p class="text-body-2 text-grey mb-3">{{ profileForm.email }}</p>

          <v-chip color="primary" variant="flat" class="mb-4" size="small">
            <v-icon start size="14">mdi-shield-account</v-icon>
            ADMINISTRATOR
          </v-chip>

          <v-divider class="my-4"></v-divider>

          <div class="profile-meta text-left">
            <div class="d-flex align-center mb-3">
              <v-icon size="18" color="grey" class="mr-3">mdi-email-outline</v-icon>
              <div>
                <p class="text-caption text-grey mb-0">Email</p>
                <p class="text-body-2 font-weight-medium">{{ profileForm.email }}</p>
              </div>
            </div>
            <div class="d-flex align-center mb-3">
              <v-icon size="18" color="grey" class="mr-3">mdi-phone-outline</v-icon>
              <div>
                <p class="text-caption text-grey mb-0">Phone</p>
                <p class="text-body-2 font-weight-medium">{{ profileForm.phone || 'Not set' }}</p>
              </div>
            </div>
            <div class="d-flex align-center">
              <v-icon size="18" color="grey" class="mr-3">mdi-calendar-outline</v-icon>
              <div>
                <p class="text-caption text-grey mb-0">Member Since</p>
                <p class="text-body-2 font-weight-medium">June 2024</p>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Edit Profile Form Card -->
      <v-col cols="12" lg="8">
        <v-card class="enterprise-card pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <div class="stat-icon-container stat-icon-container-blue mr-3">
              <v-icon size="20" color="white">mdi-account-edit</v-icon>
            </div>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-0">Edit Profile</h3>
              <p class="text-caption text-grey mb-0">Update your personal information</p>
            </div>
          </div>

          <v-form @submit.prevent="saveProfile">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="profileForm.fullName"
                  label="Full Name"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="[v => !!v || 'Full name is required']"
                  required
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="profileForm.phone"
                  label="Phone Number"
                  prepend-inner-icon="mdi-phone-outline"
                  placeholder="+1 (555) 000-0000"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="profileForm.email"
                  label="Email Address"
                  prepend-inner-icon="mdi-email-outline"
                  readonly
                  disabled
                  hint="Email cannot be changed"
                  persistent-hint
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-card-actions class="pa-0 pt-4">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                type="submit"
                class="btn-primary"
                :loading="saving"
                :disabled="!profileFormValid"
                prepend-icon="mdi-content-save-outline"
              >
                Save Changes
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>

        <!-- Password Update Card -->
        <v-card class="enterprise-card pa-6">
          <div class="d-flex align-center mb-6">
            <div class="stat-icon-container stat-icon-container-amber mr-3">
              <v-icon size="20" color="white">mdi-lock-reset</v-icon>
            </div>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-0">Update Password</h3>
              <p class="text-caption text-grey mb-0">Change your account password</p>
            </div>
          </div>

          <v-form @submit.prevent="updatePassword">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="passwordForm.currentPassword"
                  label="Current Password"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  :rules="[v => !!v || 'Current password is required']"
                  required
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  @click:append-inner="showCurrentPassword = !showCurrentPassword"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="passwordForm.newPassword"
                  label="New Password"
                  prepend-inner-icon="mdi-lock-plus-outline"
                  :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showNewPassword ? 'text' : 'password'"
                  :rules="[
                    v => !!v || 'New password is required',
                    v => v.length >= 6 || 'Password must be at least 6 characters'
                  ]"
                  required
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  @click:append-inner="showNewPassword = !showNewPassword"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="passwordForm.confirmPassword"
                  label="Confirm New Password"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :rules="[
                    v => !!v || 'Please confirm your password',
                    v => v === passwordForm.newPassword || 'Passwords do not match'
                  ]"
                  required
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-card-actions class="pa-0 pt-4">
              <v-spacer></v-spacer>
              <v-btn
                color="warning"
                type="submit"
                class="btn-secondary"
                :loading="saving"
                :disabled="!passwordFormValid"
                prepend-icon="mdi-lock-reset"
              >
                Update Password
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      location="top"
      rounded="pill"
      class="premium-snackbar"
    >
      <div class="d-flex align-center">
        <v-icon start>mdi-check-circle-outline</v-icon>
        {{ snackbarMessage }}
      </div>
    </v-snackbar>
  </div>
</template>

<style scoped>
.profile-avatar-wrapper {
  position: relative;
  display: inline-block;
}

.profile-avatar-large {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
}

.profile-initial-large {
  color: white;
  font-weight: 700;
  font-size: 48px;
}

.profile-status-dot {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #10b981;
  border: 3px solid white;
}

.profile-meta {
  padding: 0 8px;
}
</style>
