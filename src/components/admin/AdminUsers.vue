<template>
  <div>
    <!-- Stats Cards -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative">
          <div class="card-accent card-accent-blue"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Users</p>
                <p class="stat-value">{{ users.length }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="primary">mdi-account-plus-outline</v-icon>
                  <span class="ml-1">Registered accounts</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-blue">
                <v-icon size="18">mdi-account-group-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative">
          <div class="card-accent card-accent-amber"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Admins</p>
                <p class="stat-value">{{ totalAdmins }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="warning">mdi-shield-crown-outline</v-icon>
                  <span class="ml-1">Platform managers</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-amber">
                <v-icon size="18">mdi-shield-account-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative">
          <div class="card-accent card-accent-purple"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Customers</p>
                <p class="stat-value">{{ totalCustomers }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="secondary">mdi-account-outline</v-icon>
                  <span class="ml-1">Standard consumers</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-purple">
                <v-icon size="18">mdi-account-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative">
          <div class="card-accent card-accent-green"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Active Users</p>
                <p class="stat-value">{{ users.filter((u) => u.status === 1).length }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="success">mdi-check-circle-outline</v-icon>
                  <span class="ml-1">Currently enabled</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-green">
                <v-icon size="18">mdi-check-circle-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Bar -->
    <v-card class="filter-bar-card mb-4 pa-3">
      <v-row align="center" no-gutters class="ga-2">
        <v-col cols="12" sm="4" md="3">
          <v-text-field
            v-model="search"
            label="Search users..."
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="sleek-input"
            @update:model-value="clickSearch()"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-select
            v-model="userTypeFilter"
            label="User Type"
            :items="['ALL', 'ADMIN', 'CUSTOMER']"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="sleek-input"
            @update:model-value="clickUserType()"
          ></v-select>
        </v-col>
        <v-spacer class="hidden-xs-only"></v-spacer>
        <v-col cols="auto" class="text-right">
          <v-btn 
            color="primary" 
            class="btn-primary text-none text-caption font-weight-bold" 
            prepend-icon="mdi-plus" 
            elevation="0" 
            height="36"
            @click="openAddDialog"
          >
            Add User
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Data Table -->
    <v-card class="enterprise-card">
      <v-card-title class="pa-4 pb-2">
        <div>
          <h3 class="card-title-text mb-0">User Accounts Directory</h3>
          <p class="card-subtitle-text mb-0">Manage and audit registered portal users</p>
        </div>
      </v-card-title>
      <v-card-text class="pt-0 px-4 pb-4">
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :loading="loading"
          item-value="userAccountId"
          hide-default-footer
          class="premium-table elevation-0"
        >
          <template #item.profileName="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar
                :class="item.userType === 'ADMIN' ? 'avatar-warning' : 'avatar-gradient'"
                size="32"
                class="mr-3"
              >
                <span class="text-white font-weight-bold text-caption" style="font-size: 0.75rem !important;">{{
                  item.profileName.charAt(0).toUpperCase()
                }}</span>
              </v-avatar>
              <div>
                <p class="font-weight-semibold text-grey-darken-3 mb-0" style="font-size: 0.8rem !important; line-height: 1.2;">{{ item.profileName }}</p>
                <p class="text-caption text-grey mb-0" style="font-size: 0.7rem !important;">{{ item.email }}</p>
              </div>
            </div>
          </template>

          <template #item.phone="{ item }">
            <span class="text-body-2 text-grey-darken-1" style="font-size: 0.8rem !important;">{{ item.phone || '-' }}</span>
          </template>

          <template #item.userType="{ item }">
            <span
              class="status-chip"
              :class="item.userType === 'ADMIN' ? 'chip-admin' : 'chip-customer'"
            >
              <v-icon start size="11">{{
                item.userType === 'ADMIN' ? 'mdi-shield-account' : 'mdi-account'
              }}</v-icon>
              {{ item.userType }}
            </span>
          </template>

          <template #item.status="{ item }">
            <span
              class="status-chip cursor-pointer"
              :class="item.status === 1 ? 'status-confirm' : 'status-delete'"
              @click="toggleStatus(item)"
            >
              <v-icon start size="11">{{
                item.status === 1 ? 'mdi-check-circle' : 'mdi-close-circle-outline'
              }}</v-icon>
              {{ item.status === 1 ? 'Active' : 'Inactive' }}
            </span>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              color="primary"
              size="small"
              class="mr-1"
              @click="openEditDialog(item)"
            >
              <v-icon size="18">mdi-pencil-outline</v-icon>
              <v-tooltip activator="parent" location="top">Edit</v-tooltip>
            </v-btn>
            <v-btn icon variant="text" color="error" size="small" @click="openDeleteDialog(item)">
              <v-icon size="18">mdi-delete-outline</v-icon>
              <v-tooltip activator="parent" location="top">Delete</v-tooltip>
            </v-btn>
          </template>

          <template #no-data>
            <div class="premium-empty-state">
              <v-icon>mdi-account-group-outline</v-icon>
              <p class="empty-title">No users found</p>
              <p class="empty-text">Add users to get started</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-5 pb-2">
          <div>
            <h3 class="card-title-text" style="font-size: 1.1rem !important;">
              {{ editing ? 'Edit User' : 'Add New User' }}
            </h3>
            <p class="card-subtitle-text">
              {{ editing ? 'Update user account information' : 'Create a new credentials profile' }}
            </p>
          </div>
          <v-btn icon variant="text" size="small" @click="dialog = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-form @submit.prevent="saveUser" class="px-5 pb-5 pt-2 premium-form">
          <v-row class="form-row-spacing">
            <v-col cols="12">
              <v-text-field
                v-model="userForm.profileName"
                label="Profile Name"
                prepend-inner-icon="mdi-account-outline"
                :rules="[(v) => !!v || 'Profile name is required']"
                required
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="sleek-input"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userForm.email"
                label="Email Address"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
                required
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="sleek-input"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.phone"
                label="Phone"
                prepend-inner-icon="mdi-phone-outline"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="sleek-input"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.password"
                label="Password"
                type="password"
                prepend-inner-icon="mdi-lock-outline"
                :rules="[(v) => !!v || 'Password is required']"
                required
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="sleek-input"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="userForm.userType"
                label="User Type"
                :items="['ADMIN', 'CUSTOMER']"
                prepend-inner-icon="mdi-shield-account-outline"
                :rules="[(v) => !!v || 'User type is required']"
                required
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="sleek-input"
              ></v-select>
            </v-col>
          </v-row>

          <v-card-actions class="pa-0 pt-4">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" class="mr-2 text-none text-caption font-weight-bold" height="34" @click="dialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              type="submit"
              class="btn-primary text-none text-caption font-weight-bold"
              :disabled="!formValid"
              height="34"
              @click="clickSaveOrUpdate()"
            >
              {{ editing ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="380" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-5 text-center">
          <v-avatar size="48" class="avatar-error mb-3">
            <v-icon size="24" color="white">mdi-alert-outline</v-icon>
          </v-avatar>
          <h3 class="card-title-text text-center mb-1" style="font-size: 1.05rem !important;">Confirm Delete</h3>
          <p class="card-subtitle-text text-center">
            Are you sure you want to delete <strong>{{ itemToDelete?.profileName }}</strong>? This action cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2 text-none text-caption font-weight-bold" height="32" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error text-none text-caption font-weight-bold" height="32" @click="deleteUserAccountMethod()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../../lib/supabase'
import type { UserAccount } from '../../lib/supabase'

import userAccountService from '@/service/UserAccountService'
export default defineComponent({
  name: 'AdminUsers',
  data() {
    return {
      users: [] as UserAccount[],
      loading: true,
      dialog: false,
      deleteDialog: false,
      search: '',
      userTypeFilter: null as string | null,
      userForm: {
        userAccountId: '',
        profileName: '',
        phone: '',
        userType: 'CUSTOMER' as 'ADMIN' | 'CUSTOMER',
        email: '',
        password: '',
        status: 1,
      },
      editing: false,
      itemToDelete: null as UserAccount | null,
      headers: [
        { title: 'User', key: 'profileName', align: 'start' as const },
        { title: 'Email', key: 'email', align: 'start' as const },
        { title: 'Phone', key: 'phone', align: 'start' as const },
        { title: 'Type', key: 'userType', align: 'center' as const },
        { title: 'Status', key: 'status', align: 'center' as const },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
      ],
      filteredUsers: [],
    }
  },
  computed: {
    formValid(): boolean {
      return !!(
        this.userForm.profileName &&
        this.userForm.email &&
        this.userForm.password &&
        this.userForm.userType
      )
    },
    totalAdmins(): number {
      return this.users.filter((u) => u.userType === 'ADMIN').length
    },
    totalCustomers(): number {
      return this.users.filter((u) => u.userType === 'CUSTOMER').length
    },
  },
  async mounted() {
    await this.fetchUsers()
    this.getUserAccountMethod()
  },
  methods: {
    deleteUserAccountMethod: function () {
      this.deleteDialog = false
      userAccountService
        .deleteUserAccount(this.itemToDelete.userAccountId)
        .then((response) => {
          this.getUserAccountMethod()
        })
        .catch((err) => {
          console.error('API Fetch Error: ', err)
        })
    },
    getUserAccountMethod: function () {
      userAccountService
        .getUserAccount('ALL', '')
        .then((response) => {
          this.filteredUsers.splice(0)
          this.filteredUsers.push(...response)
        })
        .catch((err) => {
          console.error('API Fetch Error: ', err)
        })
    },
    clickSaveOrUpdate: function () {
      console.log(this.userForm)
      this.dialog = false
      if (this.userForm.userAccountId == 0) {
        userAccountService
          .addUserAccount(this.userForm)
          .then((response) => {
            this.getUserAccountMethod()
          })
          .catch((err) => {
            console.error('API Fetch Error: ', err)
          })
      } else {
        userAccountService
          .updateUserAccount(this.userForm)
          .then((response) => {
            this.getUserAccountMethod()
          })
          .catch((err) => {
            console.error('API Fetch Error: ', err)
          })
      }
    },
    clickUserType: function () {
      userAccountService
        .getUserAccount(this.userTypeFilter, '')
        .then((response) => {
          this.filteredUsers.splice(0)
          this.filteredUsers.push(...response)
        })
        .catch((err) => {
          console.error('API Fetch Error: ', err)
        })
    },
    clickSearch: function () {
      if (this.search == '') {
        return
      }
      userAccountService
        .getUserAccount('ALL', this.search)
        .then((response) => {
          this.filteredUsers.splice(0)
          this.filteredUsers.push(...response)
        })
        .catch((err) => {
          console.error('API Fetch Error: ', err)
        })
    },
    async fetchUsers() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('user_account')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.users = data || []
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },

    openAddDialog() {
      this.editing = false
      this.userForm = {
        userAccountId: 0,
        profileName: '',
        phone: '',
        userType: 'CUSTOMER',
        email: '',
        password: '',
        status: 1,
      }
      this.dialog = true
    },

    openEditDialog(user: UserAccount) {
      this.editing = true
      this.userForm = {
        userAccountId: user.userAccountId,
        profileName: user.profileName,
        phone: user.phone || '',
        userType: user.userType,
        email: user.email,
        password: user.password,
        status: user.status,
      }
      this.dialog = true
    },

    async saveUser() {
      try {
        if (this.editing) {
          const { error } = await supabase
            .from('user_account')
            .update({
              profileName: this.userForm.profileName,
              phone: this.userForm.phone || null,
              userType: this.userForm.userType,
              email: this.userForm.email,
              password: this.userForm.password,
              status: this.userForm.status,
            })
            .eq('userAccountId', this.userForm.userAccountId)

          if (error) throw error
        } else {
          const { error } = await supabase.from('user_account').insert([
            {
              profileName: this.userForm.profileName,
              phone: this.userForm.phone || null,
              userType: this.userForm.userType,
              email: this.userForm.email,
              password: this.userForm.password,
              status: this.userForm.status,
            },
          ])

          if (error) throw error
        }

        this.dialog = false
        await this.fetchUsers()
      } catch (error) {
        console.error('Error saving user:', error)
        const errorMessage = error as { code?: string; message?: string }
        if (errorMessage.code === '23505') {
          alert('A user with this email already exists.')
        }
      }
    },

    openDeleteDialog(user: UserAccount) {
      this.itemToDelete = user
      this.deleteDialog = true
    },

    async deleteUser() {
      if (!this.itemToDelete) return

      try {
        const { error } = await supabase
          .from('user_account')
          .delete()
          .eq('userAccountId', this.itemToDelete.userAccountId)

        if (error) throw error

        this.deleteDialog = false
        this.itemToDelete = null
        await this.fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    },

    async toggleStatus(user: UserAccount) {
      try {
        const newStatus = user.status === 1 ? 0 : 1
        const { error } = await supabase
          .from('user_account')
          .update({ status: newStatus })
          .eq('userAccountId', user.userAccountId)

        if (error) throw error
        await this.fetchUsers()
      } catch (error) {
        console.error('Error toggling status:', error)
      }
    },
  },
})
</script>

<style scoped>
/* Glassmorphism & Smooth Layout */
.stat-card {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 4px 20px 0 rgba(31, 38, 135, 0.02) !important;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  overflow: hidden;
}

.enterprise-card, .filter-bar-card {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 6px 24px 0 rgba(31, 38, 135, 0.03) !important;
  border-radius: 14px !important;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}

/* Specific Card Title Styling (Compact Font Size) */
.card-title-text {
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  letter-spacing: -0.01em !important;
}

.card-subtitle-text {
  font-size: 0.725rem !important;
  color: #64748b !important;
  font-weight: 400 !important;
  margin-top: 1px !important;
}

/* Hover Effect & Right Accent Glow */
.stat-card:hover, .enterprise-card:hover, .filter-bar-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.65) !important;
}

.card-accent {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  height: 100%;
}

.stat-card:has(.card-accent-blue):hover { box-shadow: 0 6px 24px 0 rgba(33, 150, 243, 0.15) !important; border-color: rgba(33, 150, 243, 0.3) !important; }
.stat-card:has(.card-accent-amber):hover { box-shadow: 0 6px 24px 0 rgba(255, 193, 7, 0.15) !important; border-color: rgba(255, 193, 7, 0.3) !important; }
.stat-card:has(.card-accent-purple):hover { box-shadow: 0 6px 24px 0 rgba(156, 39, 176, 0.15) !important; border-color: rgba(156, 39, 176, 0.3) !important; }
.stat-card:has(.card-accent-green):hover { box-shadow: 0 6px 24px 0 rgba(76, 175, 80, 0.15) !important; border-color: rgba(76, 175, 80, 0.3) !important; }

.card-accent-blue { background: linear-gradient(180deg, #2196f3, #64b5f6); }
.card-accent-amber { background: linear-gradient(180deg, #ffc107, #ffe082); }
.card-accent-purple { background: linear-gradient(180deg, #9c27b0, #ba68c8); }
.card-accent-green { background: linear-gradient(180deg, #4caf50, #81c784); }

/* Compact Mini Icons */
.stat-icon-container {
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon-container-blue { background: rgba(33, 150, 243, 0.08); color: #1565c0 !important; }
.stat-icon-container-amber { background: rgba(255, 193, 7, 0.08); color: #b78103 !important; }
.stat-icon-container-purple { background: rgba(156, 39, 176, 0.08); color: #6a1b9a !important; }
.stat-icon-container-green { background: rgba(76, 175, 80, 0.08); color: #2e7d32 !important; }

/* Mini Stats Typography */
.stat-label {
  font-size: 0.725rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 1px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 1px;
}
.stat-trend {
  font-size: 0.68rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

/* Sleek Input Fields */
.sleek-input :deep(.v-field) {
  border-radius: 8px !important;
  background-color: rgba(255, 255, 255, 0.3) !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  transition: all 0.25s ease-in-out;
}
.sleek-input :deep(.v-field--focused) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
}
.sleek-input :deep(.v-field__outline) {
  display: none !important; /* Remove Vuetify default outlines to enforce glass border */
}
.sleek-input :deep(.v-label) {
  font-size: 0.8rem !important;
  color: #64748b !important;
}

/* Premium Table - Compact Text */
.premium-table {
  background: transparent !important;
}
.premium-table :deep(th) {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #475569 !important;
  background: rgba(241, 245, 249, 0.3) !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
  padding: 8px 12px !important;
}
.premium-table :deep(td) {
  border-bottom: 1px solid rgba(241, 245, 249, 0.3) !important;
  padding: 6px 12px !important;
}

/* Modern Status Chips */
.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
}
.chip-admin { background: rgba(255, 193, 7, 0.1); color: #b78103; }
.chip-customer { background: rgba(156, 39, 176, 0.1); color: #6a1b9a; }
.status-confirm { background: rgba(76, 175, 80, 0.1); color: #1b5e20; }
.status-delete { background: rgba(244, 67, 54, 0.1); color: #b71c1c; }

.avatar-gradient { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
.avatar-warning { background: linear-gradient(135deg, #f59e0b, #ef4444) !important; }

/* Elegant Dialog Layout */
.premium-dialog {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(24px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(140%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.08) !important;
}

.form-row-spacing > div {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

/* Button & Dialog Avatars */
.avatar-error {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px 0 rgba(59, 130, 246, 0.15) !important;
}

.btn-error {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
  border-radius: 8px !important;
}

.premium-empty-state {
  text-align: center;
  padding: 30px 16px;
  color: #94a3b8;
}
.premium-empty-state .v-icon {
  font-size: 36px;
  margin-bottom: 8px;
  color: #cbd5e1;
}
.empty-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 2px;
}
.empty-text {
  font-size: 0.75rem;
}
</style>