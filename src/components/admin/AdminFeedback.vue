<template>
  <div>
    <!-- Premium Glassmorphic Summary Cards Matrix -->
    <v-row class="mb-4" no-gutters style="gap: 12px; display: flex; flex-wrap: nowrap; overflow-x: auto;">
      <v-col style="min-width: 220px; flex: 1;">
        <v-card class="stat-card glass-card shadow-glow-amber">
          <div class="card-accent accent-amber"></div>
          <v-card-text class="pa-3">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Average Rating</p>
                <p class="stat-value text-amber-darken-2">
                  {{ averageRating }}
                  <v-icon size="14" color="amber" class="ml-1">mdi-star</v-icon>
                </p>
              </div>
              <v-avatar size="28" class="stat-icon-container bg-amber-lighten-5">
                <v-icon size="16" color="amber-darken-2">mdi-star-face</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col style="min-width: 220px; flex: 1;">
        <v-card class="stat-card glass-card shadow-glow-blue">
          <div class="card-accent accent-blue"></div>
          <v-card-text class="pa-3">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Ratings</p>
                <p class="stat-value text-blue-darken-2">{{ ratings.length }}</p>
              </div>
              <v-avatar size="28" class="stat-icon-container bg-blue-lighten-5">
                <v-icon size="16" color="blue-darken-2">mdi-star-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col style="min-width: 220px; flex: 1;">
        <v-card class="stat-card glass-card shadow-glow-purple">
          <div class="card-accent accent-purple"></div>
          <v-card-text class="pa-3">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Comments</p>
                <p class="stat-value text-purple-darken-2">{{ comments.length }}</p>
              </div>
              <v-avatar size="28" class="stat-icon-container bg-purple-lighten-5">
                <v-icon size="16" color="purple-darken-2">mdi-comment-text-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col style="min-width: 220px; flex: 1;">
        <v-card class="stat-card glass-card shadow-glow-green">
          <div class="card-accent accent-green"></div>
          <v-card-text class="pa-3">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Customer Messages</p>
                <p class="stat-value text-green-darken-2">{{ messages.length }}</p>
              </div>
              <v-avatar size="28" class="stat-icon-container bg-green-lighten-5">
                <v-icon size="16" color="green-darken-2">mdi-email-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Navigation Control System -->
    <v-tabs v-model="activeTab" class="premium-tabs mb-4" color="primary" align-tabs="start">
      <v-tab value="ratings" class="text-none font-weight-bold text-caption rounded-t-lg">
        <v-icon start size="16">mdi-star-box-outline</v-icon>
        Ratings
        <v-badge :content="ratings.length" color="amber-darken-2" inline class="ml-2 core-badge"></v-badge>
      </v-tab>
      <v-tab value="comments" class="text-none font-weight-bold text-caption rounded-t-lg">
        <v-icon start size="16">mdi-comment-multiple-outline</v-icon>
        Comments
        <v-badge :content="comments.length" color="purple-darken-2" inline class="ml-2 core-badge"></v-badge>
      </v-tab>
      <v-tab value="messages" class="text-none font-weight-bold text-caption rounded-t-lg">
        <v-icon start size="16">mdi-inbox-text-outline</v-icon>
        Messages
        <v-badge :content="messages.length" color="green-darken-2" inline class="ml-2 core-badge"></v-badge>
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- ================= RATINGS LEDGER LAYER ================= -->
      <v-window-item value="ratings">
        <v-card class="filter-bar-card mb-4 pa-3">
          <v-row align="center" no-gutters>
            <v-col cols="12" sm="5" md="4">
              <v-text-field
                v-model="ratingSearch"
                label="Search product ratings index..."
                prepend-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                class="sleek-input"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="enterprise-card">
          <v-card-text class="pa-3">
            <v-data-table
              :headers="ratingHeaders"
              :items="filteredRatings"
              :loading="ratingLoading"
              item-value="ratingId"
              hide-default-footer
              class="premium-table elevation-0"
              fixed-header
              height="380"
            >
              <template #item.product.title="{ item }">
                <span class="font-weight-semibold text-grey-darken-3 text-caption-custom">
                  {{ item.product?.title || 'System Inventory Void' }}
                </span>
              </template>

              <template #item.rating="{ item }">
                <v-rating
                  :model-value="item.rating"
                  readonly
                  color="amber"
                  half-increments
                  density="compact"
                  size="x-small"
                ></v-rating>
              </template>

              <template #item.date="{ item }">
                <span class="text-grey-darken-1 text-caption-custom">{{ formatDate(item.date) }}</span>
              </template>

              <template #item.actions="{ item }">
  <v-btn 
    icon 
    variant="text" 
    color="error" 
    size="small" 
    density="comfortable"
    @click="openDeleteRatingDialog(item)"
  >
    <v-icon size="16">mdi-delete-outline</v-icon>
    <v-tooltip activator="parent" location="top">
      Delete Rating
    </v-tooltip>
  </v-btn>
</template>

              <template #no-data>
                <div class="premium-empty-state pa-6 text-center">
                  <v-avatar size="42" color="grey-lighten-4" class="mb-2">
                    <v-icon color="grey-darken-1" size="20">mdi-star-off-outline</v-icon>
                  </v-avatar>
                  <p class="card-title-text mb-0">No scores logged</p>
                  <p class="card-subtitle-text">Score transactions populate upon public alignment verification submissions</p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ================= COMMENTS LEDGER LAYER ================= -->
      <v-window-item value="comments">
        <v-card class="filter-bar-card mb-4 pa-3">
          <v-row align="center" no-gutters>
            <v-col cols="12" sm="5" md="4">
              <v-text-field
                v-model="commentSearch"
                label="Search user review parameters..."
                prepend-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                class="sleek-input"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="enterprise-card">
          <v-card-text class="pa-3">
            <v-data-table
              :headers="commentHeaders"
              :items="filteredComments"
              :loading="commentLoading"
              item-value="commentId"
              hide-default-footer
              class="premium-table elevation-0"
              fixed-header
              height="380"
            >
              <template #item.product.title="{ item }">
                <span class="font-weight-semibold text-grey-darken-3 text-caption-custom">
                  {{ item.product?.title || 'System Inventory Void' }}
                </span>
              </template>

              <template #item.message="{ item }">
                <span class="text-grey-darken-3 text-caption-custom d-block py-1 text-truncate" style="max-width: 320px;">
                  {{ truncateText(item.message, 80) }}
                </span>
              </template>

              <template #item.date="{ item }">
                <span class="text-grey-darken-1 text-caption-custom">{{ formatDate(item.date) }}</span>
              </template>

              <template #item.actions="{ item }">
                <v-btn icon variant="text" color="slate-600" size="small" density="comfortable" class="mr-1" @click="openEditCommentDialog(item)">
                  <v-icon size="16">mdi-pencil-outline</v-icon>
                  <v-tooltip activator="parent" location="top">Edit Node</v-tooltip>
                </v-btn>
                <v-btn icon variant="text" color="error" size="small" density="comfortable" @click="openDeleteCommentDialog(item)">
                  <v-icon size="16">mdi-delete-outline</v-icon>
                  <v-tooltip activator="parent" location="top">Purge Node</v-tooltip>
                </v-btn>
              </template>

              <template #no-data>
                <div class="premium-empty-state pa-6 text-center">
                  <v-avatar size="42" color="grey-lighten-4" class="mb-2">
                    <v-icon color="grey-darken-1" size="20">mdi-comment-off-outline</v-icon>
                  </v-avatar>
                  <p class="card-title-text mb-0">No textual critiques</p>
                  <p class="card-subtitle-text">Operational text modules map automatically down from consumer input nodes</p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ================= MESSAGES INBOX LAYER ================= -->
      <v-window-item value="messages">
        <v-card class="filter-bar-card mb-4 pa-3">
          <v-row align="center" no-gutters class="ga-2">
            <v-col cols="12" sm="5" md="3">
              <v-text-field
                v-model="messageSearch"
                label="Search communications index..."
                prepend-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                class="sleek-input"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="messageFilter"
                label="Filter by Topic Structural Class"
                :items="[
                  { title: 'All Categories', value: null },
                  ...questionTypes.map(q => ({ title: q.question, value: q.questionTypeId }))
                ]"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                class="sleek-input"
              ></v-select>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="enterprise-card">
          <v-card-text class="pa-3">
            <v-data-table
              :headers="messageHeaders"
              :items="filteredMessages"
              :loading="messageLoading"
              item-value="messageId"
              hide-default-footer
              class="premium-table elevation-0"
              fixed-header
              height="380"
            >
              <template #item.name="{ item }">
                <div class="d-flex align-center py-1">
                  <v-avatar size="24" class="purple-gradient mr-2 glass-avatar shadow-glow-mini">
                    <span class="text-white font-weight-bold" style="font-size: 0.65rem;">{{ item.name ? item.name.charAt(0).toUpperCase() : '?' }}</span>
                  </v-avatar>
                  <span class="font-weight-semibold text-grey-darken-3 text-caption-custom">{{ item.name || 'Unknown User' }}</span>
                </div>
              </template>

              <template #item.email="{ item }">
                <span class="text-grey-darken-2 text-caption-custom">{{ item.email || '-' }}</span>
              </template>

              <template #item.questionType.question="{ item }">
                <span v-if="item.questionType" class="status-chip chip-cyan d-inline-flex align-center">
                  {{ item.questionType.question }}
                </span>
                <span v-else class="status-chip chip-void text-caption-custom">General Query</span>
              </template>

              <template #item.messageText="{ item }">
                <span class="text-grey-darken-3 text-caption-custom d-block text-truncate" style="max-width: 200px;">
                  {{ truncateText(item.messageText, 50) }}
                </span>
              </template>

              <template #item.date="{ item }">
                <span class="text-grey-darken-1 text-caption-custom">{{ formatDate(item.date) }}</span>
              </template>

              <template #item.actions="{ item }">
                
                <v-btn icon variant="text" color="error" size="small" density="comfortable" @click="openDeleteMessageDialog(item)">
                  <v-icon size="16">mdi-delete-outline</v-icon>
                  <v-tooltip activator="parent" location="top">Drop Ledger</v-tooltip>
                </v-btn>
              </template>

              <template #no-data>
                <div class="premium-empty-state pa-6 text-center">
                  <v-avatar size="42" color="grey-lighten-4" class="mb-2">
                    <v-icon color="grey-darken-1" size="20">mdi-email-off-outline</v-icon>
                  </v-avatar>
                  <p class="card-title-text mb-0">Inbox clear</p>
                  <p class="card-subtitle-text">External lead capture dispatches append matrix vectors inside this channel space</p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- ================= MODAL SCHEMATICS DIALOGS ================= -->

    <!-- Edit Comment Structural Dialog -->
    <v-dialog v-model="commentDialog" max-width="450px" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-4 pb-1">
          <div>
            <h3 class="card-title-text" style="font-size: 1rem !important;">Update Review Parameter</h3>
            <p class="card-subtitle-text">Modify contextual statement parameters inside the localized content record</p>
          </div>
          <v-btn icon variant="text" size="small" @click="commentDialog = false">
            <v-icon size="16">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-4 pb-4 pt-2 premium-form">
          <v-form @submit.prevent="saveComment">
            <v-row class="form-row-spacing">
              <v-col cols="12">
                <v-textarea
                  v-model="commentForm.message"
                  label="Statement Corpus Content *"
                  rows="4"
                  prepend-inner-icon="mdi-comment-text-edit-outline"
                  :rules="[v => !!v || 'Message content mapping index state required']"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card-actions class="pa-0 pt-4">
              <v-spacer></v-spacer>
              <v-btn variant="outlined" class="mr-2 text-none text-caption font-weight-bold" height="32" @click="commentDialog = false">Cancel</v-btn>
              <v-btn color="primary" type="submit" class="btn-primary text-none text-caption font-weight-bold" height="32" :disabled="!commentFormValid">
                Commit Variable
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Inspect/Edit Message Parameters Dialog -->
    <v-dialog v-model="messageDialog" max-width="520px" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-4 pb-1">
          <div>
            <h3 class="card-title-text" style="font-size: 1rem !important;">Audit Communication Node</h3>
            <p class="card-subtitle-text">Inspect structural metadata parameters or redirect question type vectors</p>
          </div>
          <v-btn icon variant="text" size="small" @click="messageDialog = false">
            <v-icon size="16">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-4 pb-4 pt-2 premium-form">
          <v-form @submit.prevent="saveMessage">
            <v-row class="form-row-spacing">
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="messageForm.name"
                  label="Identity Lead Label *"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="[v => !!v || 'Sender label declaration required']"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="messageForm.email"
                  label="Network Destination Email *"
                  type="email"
                  prepend-inner-icon="mdi-at"
                  :rules="[v => !!v || 'Routing address vector required']"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="messageForm.questionTypeId"
                  label="Structural Categorization Hub Allocation"
                  :items="questionTypes"
                  item-title="question"
                  item-value="questionTypeId"
                  prepend-inner-icon="mdi-shape-outline"
                  clearable
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="messageForm.messageText"
                  label="Transmission Core Text Payload *"
                  rows="4"
                  prepend-inner-icon="mdi-text-alignment-left"
                  :rules="[v => !!v || 'Message payload state required']"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card-actions class="pa-0 pt-4">
              <v-spacer></v-spacer>
              <v-btn variant="outlined" class="mr-2 text-none text-caption font-weight-bold" height="32" @click="messageDialog = false">Cancel</v-btn>
              <v-btn color="primary" type="submit" class="btn-primary text-none text-caption font-weight-bold" height="32" :disabled="!messageFormValid">
                Synchronize Log
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Destructive Comment Removal Isolation Modal -->
    <v-dialog v-model="deleteCommentDialog" max-width="380px" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-4 text-center">
          <v-avatar size="44" class="avatar-error mb-2 shadow-glow-error">
            <v-icon size="20" color="white">mdi-alert-circle-outline</v-icon>
          </v-avatar>
          <h3 class="card-title-text text-center mb-1">Confirm Review Purge</h3>
          <p class="card-subtitle-text text-center px-1">
            Are you absolutely sure you want to decouple this statement node? This entity ledger action removes data down from the system schema space permanently.
          </p>
        </v-card-text>
        <v-card-actions class="pa-3 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2 text-none text-caption font-weight-bold" height="30" @click="deleteCommentDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error text-none text-caption font-weight-bold" height="30" @click="deleteComment">Execute Purge</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteRatingDialog" max-width="380px" persistent>

  <v-card class="premium-dialog">

    <v-card-text class="pa-4 text-center">

      <v-avatar 
        size="44" 
        class="avatar-error mb-2 shadow-glow-error"
      >
        <v-icon size="20" color="white">
          mdi-alert-circle-outline
        </v-icon>
      </v-avatar>


      <h3 class="card-title-text mb-1">
        Confirm Rating Delete
      </h3>


      <p class="card-subtitle-text">
        Are you sure you want to permanently remove this rating record?
      </p>

    </v-card-text>


    <v-card-actions class="pa-3 pt-0 justify-center">

      <v-btn
        variant="outlined"
        class="mr-2 text-none"
        height="30"
        @click="deleteRatingDialog=false"
      >
        Cancel
      </v-btn>


      <v-btn
        color="error"
        class="btn-error text-none"
        height="30"
        @click="deleteRating"
      >
        Delete
      </v-btn>


    </v-card-actions>


  </v-card>

</v-dialog>

    <!-- Destructive Message Removal Isolation Modal -->
    <v-dialog v-model="deleteMessageDialog" max-width="380px" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-4 text-center">
          <v-avatar size="44" class="avatar-error mb-2 shadow-glow-error">
            <v-icon size="20" color="white">mdi-trash-can-outline</v-icon>
          </v-avatar>
          <h3 class="card-title-text text-center mb-1">Drop Ticket Ledger</h3>
          <p class="card-subtitle-text text-center px-1">
            Are you sure you want to drop the message sequence allocated to <strong>{{ messageToDelete?.name }}</strong>? Reversing this schema layer drop is unsupported.
          </p>
        </v-card-text>
        <v-card-actions class="pa-3 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2 text-none text-caption font-weight-bold" height="30" @click="deleteMessageDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error text-none text-caption font-weight-bold" height="30" @click="deleteMessage">Drop Node</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import type { Rating, Comment, Message ,QuestionType  } from '../../lib/supabase'
import feedbackService from '@/service/feedbackService'


export default defineComponent({
  name: 'AdminFeedback',
  data() {
    return {
      activeTab: 'ratings',

      // Ratings
      ratings: [] as Rating[],
      ratingLoading: false,
      ratingSearch: '',

      deleteRatingDialog: false,
ratingToDelete: null as Rating | null,

      // Comments
      comments: [] as Comment[],
      commentLoading: false,
      commentSearch: '',
      commentDialog: false,
      deleteCommentDialog: false,
      commentForm: {
        commentId: '',
        productId: '',
        message: ''
      },
      editingComment: false,
      commentToDelete: null as Comment | null,

      // Messages
      messages: [] as Message[],
      questionTypes: [] as QuestionType[],
      messageLoading: false,
      messageSearch: '',
      messageFilter: null as number | null,
      messageDialog: false,
      deleteMessageDialog: false,
      messageForm: {
        messageId: '',
        questionTypeId: null as number | null,
        name: '',
        email: '',
        messageText: ''
      },
      editingMessage: false,
      messageToDelete: null as Message | null,

      ratingHeaders: [
        { title: 'Product', key: 'product.title', align: 'start' as const },
        { title: 'Rating', key: 'rating', align: 'center' as const },
        { title: 'Date', key: 'date', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false }
      ],

      commentHeaders: [
        { title: 'Product', key: 'product.title', align: 'start' as const },
        { title: 'Comment', key: 'message', align: 'start' as const },
        { title: 'Date', key: 'date', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false }
      ],

      messageHeaders: [
        { title: 'Name', key: 'name', align: 'start' as const },
        { title: 'Email', key: 'email', align: 'start' as const },
        { title: 'Category', key: 'questionType.question', align: 'start' as const },
        { title: 'Message', key: 'messageText', align: 'start' as const },
        { title: 'Date', key: 'date', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    filteredRatings(): Rating[] {
       if (!this.ratingSearch) {
    return this.ratings
  }

  const term = this.ratingSearch.toLowerCase().trim()

  return this.ratings.filter(r => {

    const productTitle =
      r.product?.title?.toLowerCase() || ''

    const rating =
      String(r.rating || '').toLowerCase()

    const userName =
      r.userAccount?.profileName?.toLowerCase() || ''

    const date =
      this.formatDate(r.date).toLowerCase()


    return (
      productTitle.includes(term) ||
      rating.includes(term) ||
      userName.includes(term) ||
      date.includes(term)
    )

  })
    },

    filteredComments(): Comment[] {
      if (!this.commentSearch) {
    return this.comments
  }


  const term = this.commentSearch.toLowerCase().trim()


  return this.comments.filter(c => {


    const productTitle =
      c.product?.title?.toLowerCase() || ''


    const message =
      c.message?.toLowerCase() || ''


    const user =
      c.userAccount?.profileName?.toLowerCase() || ''


    const date =
      this.formatDate(c.date).toLowerCase()


    return (

      productTitle.includes(term) ||
      message.includes(term) ||
      user.includes(term) ||
      date.includes(term)

    )

  })
    },

    filteredMessages(): Message[] {
     let result = this.messages


 if(this.messageSearch){

 const term =
 this.messageSearch.toLowerCase().trim()


 result=result.filter(m =>

 (m.name || '').toLowerCase().includes(term) ||

 (m.email || '').toLowerCase().includes(term) ||

 (m.messageText || '').toLowerCase().includes(term)

 )

 }


 if(this.messageFilter){

 result=result.filter(
 m =>
 m.questionType?.questionTypeId === this.messageFilter
 )

 }


 return result
    },

    commentFormValid(): boolean {
      return !!this.commentForm.message
    },

    messageFormValid(): boolean {
      return !!(this.messageForm.name && this.messageForm.email && this.messageForm.messageText)
    },

    // Statistics
    averageRating(): number {
      if (this.ratings.length === 0) return 0
      return Math.round((this.ratings.reduce((sum, r) => sum + r.rating, 0) / this.ratings.length) * 10) / 10
    },

    ratingDistribution(): Record<number, number> {
      const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      this.ratings.forEach(r => {
        dist[r.rating] = (dist[r.rating] || 0) + 1
      })
      return dist
    }
  },
  async mounted() {
    

    await Promise.all([
      this.getRatingsMethod(),
    this.getCommentsMethod(),
     this.getMessagesMethod(),
  this.getQuestionTypesMethod()

      // this.fetchRatings(),
      // this.fetchComments(),
      // this.fetchMessages(),
      // this.fetchQuestionTypes()
    ])
  },
  methods: {


    async getRatingsMethod(){
      this.ratingLoading = true
      feedbackService.getRatings()
        .then((res) => {
           console.log("RATING DATA =",res)
          this.ratings = res || []
        })
        .catch((err) => console.error('Rating Fetch Error:', err))
        .finally(() => { this.ratingLoading = false })
    },

    async getCommentsMethod() {
      this.commentLoading = true
      feedbackService.getComments()
        .then((res) => {
          this.comments = res || []
        })
        .catch((err) => console.error('Comment Fetch Error:', err))
        .finally(() => { this.commentLoading = false })
    },

    async getMessagesMethod() {
  this.messageLoading = true

  feedbackService.getMessages()
    .then((res) => {
       console.log("MESSAGE API DATA =",res)
      this.messages = res || []
    })
    
    .catch((err) => console.error('Message Fetch Error:', err))
    .finally(() => {
      this.messageLoading = false
    })
},

async getQuestionTypesMethod() {
  feedbackService.getQuestionTypes()
    .then((res) => {
      this.questionTypes = res || []
    })
    .catch((err) => console.error('Question Type Fetch Error:', err))
},

    // // === Ratings Methods ===
    // async fetchRatings() {
    //   this.ratingLoading = true
    //   try {
    //     const { data, error } = await supabase
    //       .from('rating')
    //       .select('*, product(*)')
    //       .order('date', { ascending: false })

    //     if (error) throw error
    //     this.ratings = data || []
    //   } catch (error) {
    //     console.error('Error fetching ratings:', error)
    //   } finally {
    //     this.ratingLoading = false
    //   }
    // },

    // // === Comments Methods ===
    // async fetchComments() {
    //   this.commentLoading = true
    //   try {
    //     const { data, error } = await supabase
    //       .from('comment')
    //       .select('*, product(*)')
    //       .order('date', { ascending: false })

    //     if (error) throw error
    //     this.comments = data || []
    //   } catch (error) {
    //     console.error('Error fetching comments:', error)
    //   } finally {
    //     this.commentLoading = false
    //   }
    // },

    openEditCommentDialog(comment: Comment) {
      this.editingComment = true
      this.commentForm = {
        commentId: comment.commentId,
        productId: comment.productId,
        message: comment.message
      }
      this.commentDialog = true
    },

    async saveComment() {
      try {

    const dto = {
      commentId: this.commentForm.commentId,
      productId: this.commentForm.productId,
      message: this.commentForm.message
    }


    console.log("UPDATE COMMENT ID =>", this.commentForm.commentId)
    console.log("UPDATE DTO =>", dto)


    await feedbackService.updateComment(
      this.commentForm.commentId,
      dto
    )


    this.commentDialog = false

    await this.getCommentsMethod()


  } catch(err) {

    console.error(
      "Comment Update Error:",
      err
    )

  }
    },

    resetCommentForm(){

  this.commentForm = {

    commentId: '',

    productId: '',

    message: ''

  }

},

    openDeleteCommentDialog(comment: Comment) {
      this.commentToDelete = comment
      this.deleteCommentDialog = true
    },
    openDeleteRatingDialog(rating: Rating) {

  this.ratingToDelete = rating
  this.deleteRatingDialog = true

},
async deleteRating(){

  if(!this.ratingToDelete) return


  feedbackService
    .deleteRating(this.ratingToDelete.ratingId)

    .then(()=>{

      this.deleteRatingDialog = false

      this.ratingToDelete = null

      this.getRatingsMethod()

    })

    .catch((err)=>{

      console.error(
        'Delete Rating Error:',
        err
      )

    })

},

    async deleteComment() {
       if (!this.commentToDelete) return

  feedbackService
    .deleteComment(this.commentToDelete.commentId)
    .then(() => {
      this.deleteCommentDialog = false
      this.commentToDelete = null
      this.getCommentsMethod()
    })
    .catch((err) => console.error('Delete Comment Error:', err))
    },

    // === Messages Methods ===
    // async fetchMessages() {
    //   this.messageLoading = true
    //   try {
    //     const { data, error } = await supabase
    //       .from('message')
    //       .select('*, questionType(*)')
    //       .order('date', { ascending: false })

    //     if (error) throw error
    //     this.messages = data || []
    //   } catch (error) {
    //     console.error('Error fetching messages:', error)
    //   } finally {
    //     this.messageLoading = false
    //   }
    // },

    // async fetchQuestionTypes() {
    //   try {
    //     const { data } = await supabase.from('question_type').select('*')
    //     this.questionTypes = data || []
    //   } catch (error) {
    //     console.error('Error fetching question types:', error)
    //   }
    // },

    openEditMessageDialog(message: Message) {
     this.editingMessage=true

this.messageForm={
 messageId: message.messageId,

 questionTypeId:
    message.questionType?.questionTypeId || null,

 name: message.name,

 email: message.email,

 messageText: message.messageText
}


this.messageDialog=true
    },

    async saveMessage() {
     try{

      const payload = {

 messageId:this.messageForm.messageId,

 questionType:{
    questionTypeId:this.messageForm.questionTypeId
 },

 name:this.messageForm.name,

 email:this.messageForm.email,

 messageText:this.messageForm.messageText

}
 await feedbackService.updateMessage(
    this.messageForm.messageId,
    payload
 )


 this.messageDialog=false

 this.resetMessageForm()

 await this.getMessagesMethod()


}catch(err){

 console.error(
   "Message Update Error:",
   err
 )

}  },

  resetMessageForm(){

 this.messageForm={
    messageId:'',
    questionTypeId:null,
    name:'',
    email:'',
    messageText:''
 }

},

    openDeleteMessageDialog(message: Message) {
      this.messageToDelete = message
      this.deleteMessageDialog = true
    },

    async deleteMessage() {
      if (!this.messageToDelete) return

  feedbackService
    .deleteMessage(this.messageToDelete.messageId)
    .then(() => {
      this.deleteMessageDialog = false
      this.messageToDelete = null
      this.getMessagesMethod()
    })
    .catch((err) => console.error('Delete Message Error:', err))
    },



    formatDate(date:any): string {

  if(!date){
    return '-'
  }


  // Backend format: 22-07-2026 21:34:49
  const parts = date.split(' ')


  if(parts.length === 2){

    const dmy = parts[0].split('-')
    const time = parts[1]


    const newDate = new Date(
      `${dmy[2]}-${dmy[1]}-${dmy[0]}T${time}`
    )


    return newDate.toLocaleDateString('en-US',{
      year:'numeric',
      month:'short',
      day:'numeric'
    })

  }


  return '-'

},

    truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '-'

  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength) + '...'
}
  }
})
</script>

<style scoped>
/* Glassmorphism Structural Architecture Paradigms */
.enterprise-card, .filter-bar-card, .glass-card {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}

.enterprise-card:hover, .filter-bar-card:hover, .glass-card:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.55) !important;
}

/* Micro Typography Spec Definitions */
.card-title-text {
  font-size: 0.9rem !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  letter-spacing: -0.01em !important;
}

.card-subtitle-text {
  font-size: 0.7rem !important;
  color: #64748b !important;
  font-weight: 400 !important;
}

.text-caption-custom {
  font-size: 0.78rem !important;
}

/* Glass Data Input Schematics */
.sleek-input :deep(.v-field) {
  border-radius: 8px !important;
  background-color: rgba(255, 255, 255, 0.3) !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  transition: all 0.2s ease;
}
.sleek-input :deep(.v-field--focused) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}
.sleek-input :deep(.v-field__outline) {
  display: none !important;
}
.sleek-input :deep(.v-label) {
  font-size: 0.78rem !important;
  color: #64748b !important;
}

/* Navigation Subsystem Adjustments */
.premium-tabs :deep(.v-btn) {
  letter-spacing: normal !important;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  margin-right: 4px;
}
.premium-tabs :deep(.v-tab--selected) {
  background: rgba(255, 255, 255, 0.7) !important;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.05) !important;
  border-bottom: 2px solid #3b82f6 !important;
}
.core-badge :deep(.v-badge__wrapper) {
  font-size: 0.65rem !important;
  height: 15px !important;
  min-width: 15px !important;
}

/* High-Density Matrix Table Specifications */
.premium-table {
  background: transparent !important;
}
.premium-table :deep(th) {
  font-size: 0.725rem !important;
  font-weight: 600 !important;
  color: #475569 !important;
  background: rgba(241, 245, 249, 0.4) !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
  padding: 6px 10px !important;
}
.premium-table :deep(td) {
  border-bottom: 1px solid rgba(241, 245, 249, 0.25) !important;
  padding: 4px 10px !important;
}

/* Micro Action Badges & Gradients */
.status-chip {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 600;
}
.chip-cyan { background: rgba(6, 182, 212, 0.08); color: #0891b2; }
.chip-void { background: rgba(148, 163, 184, 0.08); color: #64748b; }
.purple-gradient { background: linear-gradient(135deg, #a855f7, #7c3aed) !important; }
.glass-avatar { border: 1px solid rgba(255, 255, 255, 0.5) !important; }

/* Micro Summary Cards Metrics with Smooth Glows */
.stat-card {
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.01) !important;
}
.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 3px;
}
.accent-amber { background: #f59e0b; }
.accent-blue { background: #3b82f6; }
.accent-purple { background: #a855f7; }
.accent-green { background: #10b981; }

.shadow-glow-amber:hover { box-shadow: 0 0 15px rgba(245, 158, 11, 0.12) !important; }
.shadow-glow-blue:hover { box-shadow: 0 0 15px rgba(59, 130, 246, 0.12) !important; }
.shadow-glow-purple:hover { box-shadow: 0 0 15px rgba(168, 85, 247, 0.12) !important; }
.shadow-glow-green:hover { box-shadow: 0 0 15px rgba(16, 185, 129, 0.12) !important; }

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.stat-value {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 2px;
}

/* Elegant Soft Dialog Setups */
.premium-dialog {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(130%) !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  border-radius: 14px !important;
  box-shadow: 0 10px 30px 0 rgba(31, 38, 135, 0.06) !important;
}
.form-row-spacing > div {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

/* Global Visual Elements Framework */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border-radius: 6px !important;
  box-shadow: 0 3px 10px 0 rgba(59, 130, 246, 0.15) !important;
}
.btn-error {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
  border-radius: 6px !important;
}
.avatar-error { background: linear-gradient(135deg, #ef4444, #b91c1c); }
.shadow-glow-error { box-shadow: 0 0 12px rgba(239, 68, 68, 0.2) !important; }
.shadow-glow-mini { box-shadow: 0 2px 6px rgba(168, 85, 247, 0.2); }
</style>