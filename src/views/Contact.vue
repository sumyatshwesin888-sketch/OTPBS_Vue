<template>
  <div class="travelgo-contact-wrapper">
    <div class="contact-container">
      <!-- Left Side: Contact Information -->
      <div class="contact-info-side">
        <h1 class="main-title">Contact Us</h1>
        <p class="subtitle">We'd love to hear from you!</p>
        <p class="description">
          Have questions, need assistance, or want to provide feedback?<br />
          Our team is here to help you.
        </p>

        <div class="info-list">
          <div class="info-item">
            <div class="icon-box phone-ic">
              <i class="fas fa-phone-alt"></i>
            </div>
            <div class="info-text">
              <span class="label">Phone</span>
              <span class="value">+95 9 447 067 146</span>
            </div>
          </div>

          <div class="info-item">
            <div class="icon-box email-ic">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="info-text">
              <span class="label">Email</span>
              <span class="value">travelgo@gmail.com</span>
            </div>
          </div>

          <div class="info-item">
            <div class="icon-box address-ic">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="info-text">
              <span class="label">Address</span>
              <span class="value">Yangon, Myanmar</span>
            </div>
          </div>

          <div class="info-item">
            <div class="icon-box hours-ic">
              <i class="far fa-clock"></i>
            </div>
            <div class="info-text">
              <span class="label">Working Hours</span>
              <span class="value">Mon - Fri : 9:00 AM - 4:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-form-card">
        <form>
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                v-model="formData.name"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label for="subject">Subject</label>
            <div class="select-wrapper">
              <select id="subject" v-model="formData.questionType" required>
                <option value="" disabled selected>Select a subject</option>
                <option v-for="type in questionType" :key="type.questionTypeId" :value="type">
                  {{ type.question }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group full-width">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="formData.messageText"
              placeholder="Type your message..."
              rows="5"
              required
            ></textarea>
          </div>

          <button type="button" class="submit-btn" @click="saveMessage">
            <i class="fas fa-paper-plane"></i> Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import MessageService from '@/service/MessageService'

export default {
  name: 'ContactPage',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        questionType: '',
        messageText: '',
      },
      questionType: [],
    }
  },
  created() {
    this.loadQuestionTypes()
  },
  methods: {
    loadQuestionTypes() {
      MessageService.getQuestionTypes()
        .then((response) => {
          console.log('Backend Data:', response)
          this.questionType = response
        })
        .catch((err) => {
          console.error('Error fetching question types: ', err)
        })
    },
    saveMessage() {
      let qt = {}
      qt.questionTypeId = 1
      this.formData.questionType = qt
      MessageService.addMessage(this.formData)
        .then((response) => {
          alert('Your message has been sent successfully!')
        })
        .catch((err) => {
          console.error('API Fetch Error: ', err)
          alert('Failed to send message. Please try again.')
        })
    },
  },
}
</script>

<style scoped>
.travelgo-contact-wrapper {
  background-color: #0b132b;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.contact-container {
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
}

.contact-info-side {
  flex: 1;
}

.main-title {
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.35rem;
  color: #3b82f6;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.description {
  color: #94a3b8;
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0 0 40px 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.phone-ic {
  color: #60a5fa;
}
.email-ic {
  color: #60a5fa;
}
.address-ic {
  color: #34d399;
}
.hours-ic {
  color: #94a3b8;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.info-text .label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-text .value {
  font-size: 1.1rem;
  color: #f1f5f9;
  font-weight: 500;
  line-height: 1.4;
}

.contact-form-card {
  flex: 1.2;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 50px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.form-row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  margin-bottom: 24px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  color: #0f172a;
  background-color: #f8fafc;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #1d4ed8;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1);
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.select-wrapper::after {
  content: '\f078';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  font-size: 0.85rem;
}

.submit-btn {
  width: 100%;
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 16px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(26, 115, 232, 0.3);
  transition: all 0.25s ease;
  margin-top: 12px;
}

.submit-btn:hover {
  background-color: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 115, 232, 0.4);
}

@media (max-width: 992px) {
  .contact-container {
    flex-direction: column;
    gap: 50px;
  }

  .contact-info-side,
  .contact-form-card {
    width: 100%;
  }

  .main-title {
    font-size: 2.6rem;
  }
}

@media (max-width: 576px) {
  .form-row {
    flex-direction: column;
    gap: 24px;
  }

  .contact-form-card {
    padding: 30px 20px;
  }
}
</style>
