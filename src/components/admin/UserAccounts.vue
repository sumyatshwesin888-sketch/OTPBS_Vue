<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../lib/supabase'
import type { UserAccount } from '../lib/supabase'

export default defineComponent({
  name: 'UserAccounts',
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
        status: 1
      },
      editing: false,
      itemToDelete: null as UserAccount | null,
      headers: [
        { title: 'User', key: 'profileName', align: 'start' as const },
        { title: 'Email', key: 'email', align: 'start' as const },
        { title: 'Phone', key: 'phone', align: 'start' as const },
        { title: 'Type', key: 'userType', align: 'center' as const },
        { title: 'Status', key: 'status', align: 'center' as const },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
      ]
    }
  },
  computed: {
    filteredUsers(): UserAccount[] {
      let result = this.users
      if (this.search) {
        const term = this.search.toLowerCase()
        result = result.filter(u =>
          u.profileName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.phone && u.phone.toLowerCase().includes(term))
        )
      }
      if (this.userTypeFilter) {
        result = result.filter(u => u.userType === this.userTypeFilter)
      }
      return result
    },
    formValid(): boolean {
      return !!(
        this.userForm.profileName &&
        this.userForm.email &&
        this.userForm.password &&
        this.userForm.userType
      )
    },
    totalAdmins(): number {
      return this.users.filter(u => u.userType === 'ADMIN').length
    },
    totalCustomers(): number {
      return this.users.filter(u => u.userType === 'CUSTOMER').length
    }
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
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
        userAccountId: '',
        profileName: '',
        phone: '',
        userType: 'CUSTOMER',
        email: '',
        password: '',
        status: 1
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
        status: user.status
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
              status: this.userForm.status
            })
            .eq('userAccountId', this.userForm.userAccountId)

          if (error) throw error
        } else {
          const { error } = await supabase
            .from('user_account')
            .insert([{
              profileName: this.userForm.profileName,
              phone: this.userForm.phone || null,
              userType: this.userForm.userType,
              email: this.userForm.email,
              password: this.userForm.password,
              status: this.userForm.status
            }])

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
    }
  }
})
</script>

<template>
  <div>
    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-blue"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Users</p>
                <p class="stat-value">{{ users.length }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-blue">
                <v-icon size="22">mdi-account-group-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-amber"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Admins</p>
                <p class="stat-value">{{ totalAdmins }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-amber">
                <v-icon size="22">mdi-shield-account-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-purple"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Customers</p>
                <p class="stat-value">{{ totalCustomers }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-purple">
                <v-icon size="22">mdi-account-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-green"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Active</p>
                <p class="stat-value">{{ users.filter(u => u.status === 1).length }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-green">
                <v-icon size="22">mdi-check-circle-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Bar -->
    <v-card class="filter-bar mb-6">
      <v-row align="center">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            label="Search users..."
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="userTypeFilter"
            label="User Type"
            :items="[
              { title: 'All Types', value: null },
              { title: 'Admin', value: 'ADMIN' },
              { title: 'Customer', value: 'CUSTOMER' }
            ]"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="5" class="text-right">
          <v-btn
            color="primary"
            class="btn-primary"
            prepend-icon="mdi-plus"
            @click="openAddDialog"
          >
            Add User
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Data Table -->
    <v-card class="enterprise-card">
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        item-value="userAccountId"
        class="premium-table elevation-0"
      >
        <template #item.profileName="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar
              :class="item.userType === 'ADMIN' ? 'avatar-warning' : 'avatar-gradient'"
              size="40"
              class="mr-3"
            >
              <span class="text-white font-weight-bold text-caption">{{ item.profileName.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <div>
              <p class="font-weight-medium text-grey-darken-3 mb-0">{{ item.profileName }}</p>
              <p class="text-caption text-grey mb-0">{{ item.email }}</p>
            </div>
          </div>
        </template>

        <template #item.phone="{ item }">
          <span class="text-body-2">{{ item.phone || '-' }}</span>
        </template>

        <template #item.userType="{ item }">
          <span
            class="status-chip"
            :class="item.userType === 'ADMIN' ? 'chip-admin' : 'chip-customer'"
          >
            <v-icon start size="14">{{ item.userType === 'ADMIN' ? 'mdi-shield-account' : 'mdi-account' }}</v-icon>
            {{ item.userType }}
          </span>
        </template>

        <template #item.status="{ item }">
          <span
            class="status-chip cursor-pointer"
            :class="item.status === 1 ? 'status-confirm' : ''"
            @click="toggleStatus(item)"
          >
            <v-icon start size="14">{{ item.status === 1 ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
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
            <v-icon>mdi-pencil-outline</v-icon>
            <v-tooltip activator="parent" location="top">Edit</v-tooltip>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="error"
            size="small"
            @click="openDeleteDialog(item)"
          >
            <v-icon>mdi-delete-outline</v-icon>
            <v-tooltip activator="parent" location="top">Delete</v-tooltip>
          </v-btn>
        </template>

        <template #no-data>
          <div class="premium-empty-state">
            <v-icon>mdi-account-group-outline</v-icon>
            <p class="empty-title">No users found</p>
            <p class="empty-text">Add users to get started</p>
            <v-btn color="primary" class="btn-primary mt-4" prepend-icon="mdi-plus" @click="openAddDialog">
              Add User
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="560" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-6 pb-0">
          <div>
            <h3 class="text-h6 font-weight-bold text-grey-darken-3">{{ editing ? 'Edit User' : 'Add New User' }}</h3>
            <p class="text-caption text-grey mt-1">{{ editing ? 'Update user information' : 'Create a new user account' }}</p>
          </div>
          <v-btn icon variant="text" size="small" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-form @submit.prevent="saveUser" class="pa-6 pt-4 premium-form">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.profileName"
                label="Profile Name"
                prepend-inner-icon="mdi-account-outline"
                :rules="[v => !!v || 'Profile name is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="[
                  v => !!v || 'Email is required',
                  v => /.+@.+\..+/.test(v) || 'Email must be valid'
                ]"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.phone"
                label="Phone"
                prepend-inner-icon="mdi-phone-outline"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userForm.password"
                label="Password"
                type="password"
                prepend-inner-icon="mdi-lock-outline"
                :rules="[v => !!v || 'Password is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="userForm.userType"
                label="User Type"
                :items="['ADMIN', 'CUSTOMER']"
                prepend-inner-icon="mdi-shield-account-outline"
                :rules="[v => !!v || 'User type is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="userForm.status"
                label="Status"
                :items="[{ title: 'Active', value: 1 }, { title: 'Inactive', value: 0 }]"
                prepend-inner-icon="mdi-toggle-switch-outline"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-select>
            </v-col>
          </v-row>

          <v-card-actions class="pa-0 pt-6">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" class="mr-2" @click="dialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              type="submit"
              class="btn-primary"
              :disabled="!formValid"
            >
              {{ editing ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-6 text-center">
          <v-avatar size="56" class="avatar-error mb-4">
            <v-icon size="28" color="white">mdi-alert-outline</v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">Confirm Delete</h3>
          <p class="text-body-2 text-grey">
            Are you sure you want to delete <strong>{{ itemToDelete?.profileName }}</strong>? This action cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error" @click="deleteUser">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>
