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
      MessageService.addMessage(this.formData)
        .then((response) => {
          alert('Your message has been sent successfully!')

          // 🟢 Message ပို့ပြီးရင် Form ထဲက Text တွေကို Auto ရှင်းပစ်မည့် ကုဒ်
          this.formData = {
            name: '',
            email: '',
            questionType: '',
            messageText: '',
          }
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
  padding: 100px 20px 60px 20px; /* Navbar မအုပ်အောင် top padding နည်းနည်းတိုးထားပါတယ် */
}

.contact-container {
  max-width: 960px; /* 🟢 1140px မှ 960px သို့ ခြုံ့လိုက်ပါတယ် (ပိုစစ်စစ်လစ်လစ် ဖြစ်သွားပါမယ်) */
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 40px; /* 🟢 60px မှ 40px သို့ လျှော့ထားပါတယ် */
}

.contact-info-side {
  flex: 1;
}

.main-title {
  font-size: 2.3rem; /* 🟢 3rem မှ 2.3rem သို့ အချိုးချလိုက်ပါတယ် */
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.15rem; /* 🟢 နည်းနည်းလေး သေးလိုက်ပါတယ် */
  color: #3b82f6;
  font-weight: 600;
  margin: 0 0 14px 0;
}

.description {
  color: #94a3b8;
  font-size: 0.95rem; /* 🟢 1.05rem မှ လျှော့ထားပါတယ် */
  line-height: 1.6;
  margin: 0 0 30px 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 🟢 28px မှ 20px သို့ ပိုကျစ်သွားအောင် ပြင်ထားပါတယ် */
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-box {
  width: 44px; /* 🟢 Icon Box အရွယ်အစား သေးလိုက်ပါတယ် */
  height: 44px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
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
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.info-text .value {
  font-size: 0.98rem;
  color: #f1f5f9;
  font-weight: 500;
  line-height: 1.3;
}

.contact-form-card {
  flex: 1.1;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 32px 35px; /* 🟢 Padding 50px မှ 32px သို့ ခြုံ့လိုက်ပါပြီ */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.form-row {
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  margin-bottom: 18px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 14px; /* 🟢 Input တွေကို အမြင့်ပြားပြီး ပိုကျစ်သွားအောင် လုပ်ထားပါတယ် */
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.92rem;
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
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
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
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  font-size: 0.8rem;
}

.submit-btn {
  width: 100%;
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  padding: 12px; /* 🟢 Button Size လေး ခြုံ့ပေးထားပါတယ် */
  font-size: 0.98rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(26, 115, 232, 0.3);
  transition: all 0.25s ease;
  margin-top: 6px;
}

.submit-btn:hover {
  background-color: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 115, 232, 0.4);
}

@media (max-width: 992px) {
  .contact-container {
    flex-direction: column;
    gap: 40px;
  }

  .contact-info-side,
  .contact-form-card {
    width: 100%;
  }

  .main-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 576px) {
  .form-row {
    flex-direction: column;
    gap: 18px;
  }

  .contact-form-card {
    padding: 24px 18px;
  }
}
</style>
