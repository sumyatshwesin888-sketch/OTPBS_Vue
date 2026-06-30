<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../lib/supabase'
import type { Rating, Comment, Message, QuestionType } from '../lib/supabase'

export default defineComponent({
  name: 'Feedback',
  data() {
    return {
      activeTab: 'ratings',

      // Ratings
      ratings: [] as Rating[],
      ratingLoading: false,
      ratingSearch: '',

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
      messageFilter: null as string | null,
      messageDialog: false,
      deleteMessageDialog: false,
      messageForm: {
        messageId: '',
        questionTypeId: '' as string | null,
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
        { title: 'Category', key: 'questionType.typeName', align: 'start' as const },
        { title: 'Message', key: 'messageText', align: 'start' as const },
        { title: 'Date', key: 'date', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    filteredRatings(): Rating[] {
      if (!this.ratingSearch) return this.ratings
      const term = this.ratingSearch.toLowerCase()
      return this.ratings.filter(r =>
        r.product?.title?.toLowerCase().includes(term)
      )
    },

    filteredComments(): Comment[] {
      if (!this.commentSearch) return this.comments
      const term = this.commentSearch.toLowerCase()
      return this.comments.filter(c =>
        c.product?.title?.toLowerCase().includes(term) ||
        c.message.toLowerCase().includes(term)
      )
    },

    filteredMessages(): Message[] {
      let result = this.messages
      if (this.messageSearch) {
        const term = this.messageSearch.toLowerCase()
        result = result.filter(m =>
          m.name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          m.messageText.toLowerCase().includes(term)
        )
      }
      if (this.messageFilter) {
        result = result.filter(m => m.questionTypeId === this.messageFilter)
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
      this.fetchRatings(),
      this.fetchComments(),
      this.fetchMessages(),
      this.fetchQuestionTypes()
    ])
  },
  methods: {
    // === Ratings Methods ===
    async fetchRatings() {
      this.ratingLoading = true
      try {
        const { data, error } = await supabase
          .from('rating')
          .select('*, product(*)')
          .order('date', { ascending: false })

        if (error) throw error
        this.ratings = data || []
      } catch (error) {
        console.error('Error fetching ratings:', error)
      } finally {
        this.ratingLoading = false
      }
    },

    // === Comments Methods ===
    async fetchComments() {
      this.commentLoading = true
      try {
        const { data, error } = await supabase
          .from('comment')
          .select('*, product(*)')
          .order('date', { ascending: false })

        if (error) throw error
        this.comments = data || []
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        this.commentLoading = false
      }
    },

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
        const { error } = await supabase
          .from('comment')
          .update({ message: this.commentForm.message })
          .eq('commentId', this.commentForm.commentId)

        if (error) throw error

        this.commentDialog = false
        await this.fetchComments()
      } catch (error) {
        console.error('Error saving comment:', error)
      }
    },

    openDeleteCommentDialog(comment: Comment) {
      this.commentToDelete = comment
      this.deleteCommentDialog = true
    },

    async deleteComment() {
      if (!this.commentToDelete) return

      try {
        const { error } = await supabase
          .from('comment')
          .delete()
          .eq('commentId', this.commentToDelete.commentId)

        if (error) throw error

        this.deleteCommentDialog = false
        this.commentToDelete = null
        await this.fetchComments()
      } catch (error) {
        console.error('Error deleting comment:', error)
      }
    },

    // === Messages Methods ===
    async fetchMessages() {
      this.messageLoading = true
      try {
        const { data, error } = await supabase
          .from('message')
          .select('*, questionType(*)')
          .order('date', { ascending: false })

        if (error) throw error
        this.messages = data || []
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        this.messageLoading = false
      }
    },

    async fetchQuestionTypes() {
      try {
        const { data } = await supabase.from('question_type').select('*')
        this.questionTypes = data || []
      } catch (error) {
        console.error('Error fetching question types:', error)
      }
    },

    openEditMessageDialog(message: Message) {
      this.editingMessage = true
      this.messageForm = {
        messageId: message.messageId,
        questionTypeId: message.questionTypeId || null,
        name: message.name,
        email: message.email,
        messageText: message.messageText
      }
      this.messageDialog = true
    },

    async saveMessage() {
      try {
        const { error } = await supabase
          .from('message')
          .update({
            name: this.messageForm.name,
            email: this.messageForm.email,
            messageText: this.messageForm.messageText,
            questionTypeId: this.messageForm.questionTypeId || null
          })
          .eq('messageId', this.messageForm.messageId)

        if (error) throw error

        this.messageDialog = false
        await this.fetchMessages()
      } catch (error) {
        console.error('Error saving message:', error)
      }
    },

    openDeleteMessageDialog(message: Message) {
      this.messageToDelete = message
      this.deleteMessageDialog = true
    },

    async deleteMessage() {
      if (!this.messageToDelete) return

      try {
        const { error } = await supabase
          .from('message')
          .delete()
          .eq('messageId', this.messageToDelete.messageId)

        if (error) throw error

        this.deleteMessageDialog = false
        this.messageToDelete = null
        await this.fetchMessages()
      } catch (error) {
        console.error('Error deleting message:', error)
      }
    },

    formatDate(date: string | null): string {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    truncateText(text: string, maxLength: number): string {
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength) + '...'
    }
  }
})
</script>

<template>
  <div>
    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-amber"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Average Rating</p>
                <p class="stat-value">{{ averageRating }}<v-icon size="16" color="amber" class="ml-1">mdi-star</v-icon></p>
              </div>
              <div class="stat-icon-container stat-icon-container-amber">
                <v-icon size="22">mdi-star-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-blue"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Ratings</p>
                <p class="stat-value">{{ ratings.length }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-blue">
                <v-icon size="22">mdi-star-outline</v-icon>
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
                <p class="stat-label">Total Comments</p>
                <p class="stat-value">{{ comments.length }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-purple">
                <v-icon size="22">mdi-comment-outline</v-icon>
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
                <p class="stat-label">Customer Messages</p>
                <p class="stat-value">{{ messages.length }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-green">
                <v-icon size="22">mdi-email-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" class="premium-tabs mb-6">
      <v-tab value="ratings">
        <v-icon start size="18">mdi-star</v-icon>
        Ratings
        <v-badge :content="ratings.length" color="primary" inline class="ml-2" size="small"></v-badge>
      </v-tab>
      <v-tab value="comments">
        <v-icon start size="18">mdi-comment</v-icon>
        Comments
        <v-badge :content="comments.length" color="primary" inline class="ml-2" size="small"></v-badge>
      </v-tab>
      <v-tab value="messages">
        <v-icon start size="18">mdi-email</v-icon>
        Messages
        <v-badge :content="messages.length" color="primary" inline class="ml-2" size="small"></v-badge>
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Ratings Tab -->
      <v-window-item value="ratings">
        <v-card class="filter-bar mb-6">
          <v-row align="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="ratingSearch"
                label="Search ratings..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                variant="outlined"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="enterprise-card">
          <v-data-table
            :headers="ratingHeaders"
            :items="filteredRatings"
            :loading="ratingLoading"
            item-value="ratingId"
            class="premium-table elevation-0"
          >
            <template #item.product.title="{ item }">
              <span class="font-weight-medium text-body-2">{{ item.product?.title || 'N/A' }}</span>
            </template>

            <template #item.rating="{ item }">
              <v-rating
                :model-value="item.rating"
                readonly
                color="amber"
                half-increments
                density="compact"
              ></v-rating>
            </template>

            <template #item.date="{ item }">
              <span class="text-body-2 text-grey">{{ formatDate(item.date) }}</span>
            </template>

            <template #item.actions>
              <v-btn icon variant="text" color="error" size="small" @click="">
                <v-icon>mdi-delete-outline</v-icon>
                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
              </v-btn>
            </template>

            <template #no-data>
              <div class="premium-empty-state">
                <v-icon>mdi-star-outline</v-icon>
                <p class="empty-title">No ratings yet</p>
                <p class="empty-text">Ratings will appear here when customers submit feedback</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- Comments Tab -->
      <v-window-item value="comments">
        <v-card class="filter-bar mb-6">
          <v-row align="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="commentSearch"
                label="Search comments..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                variant="outlined"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="enterprise-card">
          <v-data-table
            :headers="commentHeaders"
            :items="filteredComments"
            :loading="commentLoading"
            item-value="commentId"
            class="premium-table elevation-0"
          >
            <template #item.product.title="{ item }">
              <span class="font-weight-medium text-body-2">{{ item.product?.title || 'N/A' }}</span>
            </template>

            <template #item.message="{ item }">
              <p class="text-body-2 py-2">{{ truncateText(item.message, 80) }}</p>
            </template>

            <template #item.date="{ item }">
              <span class="text-body-2 text-grey">{{ formatDate(item.date) }}</span>
            </template>

            <template #item.actions="{ item }">
              <v-btn
                icon
                variant="text"
                color="primary"
                size="small"
                class="mr-1"
                @click="openEditCommentDialog(item)"
              >
                <v-icon>mdi-pencil-outline</v-icon>
                <v-tooltip activator="parent" location="top">Edit</v-tooltip>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="openDeleteCommentDialog(item)"
              >
                <v-icon>mdi-delete-outline</v-icon>
                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
              </v-btn>
            </template>

            <template #no-data>
              <div class="premium-empty-state">
                <v-icon>mdi-comment-outline</v-icon>
                <p class="empty-title">No comments yet</p>
                <p class="empty-text">Comments will appear here when customers share their thoughts</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- Messages Tab -->
      <v-window-item value="messages">
        <v-card class="filter-bar mb-6">
          <v-row align="center">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="messageSearch"
                label="Search messages..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                variant="outlined"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="messageFilter"
                label="Filter by Category"
                :items="[
                  { title: 'All Categories', value: null },
                  ...questionTypes.map(q => ({ title: q.typeName, value: q.questionTypeId }))
                ]"
                density="comfortable"
                variant="outlined"
                hide-details
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="enterprise-card">
          <v-data-table
            :headers="messageHeaders"
            :items="filteredMessages"
            :loading="messageLoading"
            item-value="messageId"
            class="premium-table elevation-0"
          >
            <template #item.name="{ item }">
              <div class="d-flex align-center py-2">
                <v-avatar size="36" class="avatar-gradient mr-2">
                  <span class="text-white text-caption font-weight-bold">{{ item.name.charAt(0) }}</span>
                </v-avatar>
                <span class="font-weight-medium text-body-2">{{ item.name }}</span>
              </div>
            </template>

            <template #item.questionType.typeName="{ item }">
              <v-chip
                v-if="item.questionType"
                size="small"
                class="status-chip"
                style="background: rgba(59,130,246,0.1); color: #2563eb;"
              >
                {{ item.questionType.typeName }}
              </v-chip>
              <span v-else class="text-grey text-body-2">N/A</span>
            </template>

            <template #item.messageText="{ item }">
              <span class="text-body-2">{{ truncateText(item.messageText, 50) }}</span>
            </template>

            <template #item.date="{ item }">
              <span class="text-body-2 text-grey">{{ formatDate(item.date) }}</span>
            </template>

            <template #item.actions="{ item }">
              <v-btn
                icon
                variant="text"
                color="primary"
                size="small"
                class="mr-1"
                @click="openEditMessageDialog(item)"
              >
                <v-icon>mdi-eye-outline</v-icon>
                <v-tooltip activator="parent" location="top">View/Edit</v-tooltip>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="openDeleteMessageDialog(item)"
              >
                <v-icon>mdi-delete-outline</v-icon>
                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
              </v-btn>
            </template>

            <template #no-data>
              <div class="premium-empty-state">
                <v-icon>mdi-email-outline</v-icon>
                <p class="empty-title">No messages yet</p>
                <p class="empty-text">Customer inquiries will appear here</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Edit Comment Dialog -->
    <v-dialog v-model="commentDialog" max-width="500" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-6 pb-0">
          <h3 class="text-h6 font-weight-bold text-grey-darken-3">Edit Comment</h3>
          <v-btn icon variant="text" size="small" @click="commentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-form @submit.prevent="saveComment" class="pa-6 pt-4 premium-form">
          <v-textarea
            v-model="commentForm.message"
            label="Comment"
            rows="4"
            :rules="[v => !!v || 'Comment is required']"
            required
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          ></v-textarea>

          <v-card-actions class="pa-0 pt-6">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" class="mr-2" @click="commentDialog = false">Cancel</v-btn>
            <v-btn color="primary" type="submit" class="btn-primary" :disabled="!commentFormValid">Update</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- View/Edit Message Dialog -->
    <v-dialog v-model="messageDialog" max-width="600" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-6 pb-0">
          <h3 class="text-h6 font-weight-bold text-grey-darken-3">Message Details</h3>
          <v-btn icon variant="text" size="small" @click="messageDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-form @submit.prevent="saveMessage" class="pa-6 pt-4 premium-form">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="messageForm.name"
                label="Name"
                :rules="[v => !!v || 'Name is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="messageForm.email"
                label="Email"
                type="email"
                :rules="[v => !!v || 'Email is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="messageForm.questionTypeId"
                label="Category"
                :items="questionTypes"
                item-title="typeName"
                item-value="questionTypeId"
                clearable
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="messageForm.messageText"
                label="Message"
                rows="4"
                :rules="[v => !!v || 'Message is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-textarea>
            </v-col>
          </v-row>

          <v-card-actions class="pa-0 pt-6">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" class="mr-2" @click="messageDialog = false">Cancel</v-btn>
            <v-btn color="primary" type="submit" class="btn-primary" :disabled="!messageFormValid">Update</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Comment Dialog -->
    <v-dialog v-model="deleteCommentDialog" max-width="420" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-6 text-center">
          <v-avatar size="56" class="avatar-error mb-4">
            <v-icon size="28" color="white">mdi-alert-outline</v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">Confirm Delete</h3>
          <p class="text-body-2 text-grey">Are you sure you want to delete this comment? This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2" @click="deleteCommentDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error" @click="deleteComment">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Message Dialog -->
    <v-dialog v-model="deleteMessageDialog" max-width="420" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-6 text-center">
          <v-avatar size="56" class="avatar-error mb-4">
            <v-icon size="28" color="white">mdi-alert-outline</v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">Confirm Delete</h3>
          <p class="text-body-2 text-grey">Are you sure you want to delete this message from <strong>{{ messageToDelete?.name }}</strong>? This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2" @click="deleteMessageDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error" @click="deleteMessage">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>
