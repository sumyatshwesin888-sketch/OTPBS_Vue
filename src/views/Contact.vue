<template>
  <div class="travelgo-contact-wrapper">
    <div class="contact-container">
      
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
        <form @submit.prevent="handleSubmit">
          
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input type="text"  id="fullName" v-model="formData.fullName" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input  type="email"  id="email"  v-model="formData.email"  placeholder="Enter your email" required>
            </div>
          </div>

          <div class="form-group full-width">
            <label for="subject">Subject</label>
            <div class="select-wrapper">
              <select id="subject" v-model="formData.subject" required>
                <option value="" disabled selected>Select a subject</option>
                <option value="booking">Booking & Reservation</option>
                <option value="package">Travel Packages Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback & Suggestions</option>
              </select>
            </div>
          </div>

          <div class="form-group full-width">
            <label for="message">Message</label>
            <textarea id="message" v-model="formData.message" placeholder="Type your message..." rows="5" required></textarea>
          </div>

          <button type="submit" class="submit-btn">
            <i class="fas fa-paper-plane"></i> Send Message
          </button>

        </form>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactPage',
  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      console.log('Form Data Submitted:', this.formData);
      alert('Your message has been sent successfully!');
      
      this.formData = {
        fullName: '',
        email: '',
        subject: '',
        message: ''
      };
    }
  }
};
</script>

<style scoped>
.travelgo-contact-wrapper {
  background-color: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: calc(100vh - 80px); /* Navigation bar နေရာစာ ချန်ထားတာပါ */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.contact-container {
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 60px;
  background-size: 60% auto;
  background-repeat: no-repeat;
  background-position: left center;
}

.contact-info-side {
  flex: 1;
}

.main-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 1.4rem;
  color: #1e3a8a;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.description {
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 0 40px 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

.phone-ic { color: #2563eb; }
.email-ic { color: #3b82f6; }
.address-ic { color: #10b981; }
.hours-ic { color: #64748b; }

.info-text {
  display: flex;
  flex-direction: column;
}

.info-text .label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 2px;
}

.info-text .value {
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.4;
}

.contact-form-card {
  flex: 1.2;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 45px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(241, 245, 249, 0.9);
}

.form-row {
  display: flex;
  gap: 20px;
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
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.form-group input, 
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  color: #1e293b;
  background-color: #f8fafc;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
}

.form-group input:focus, 
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #2563eb;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
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
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  font-size: 0.85rem;
}

.submit-btn {
  width: 100%;
  background-color: #1d4ed8;
  color: #ffffff;
  border: none;
  padding: 14px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.2s ease;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #1e40af;
}


@media (max-width: 992px) {
  .contact-container {
    flex-direction: column;
    gap: 45px;
    background-size: 100% auto;
  }
  
  .contact-info-side, 
  .contact-form-card {
    width: 100%;
  }
  
  .main-title { font-size: 2.4rem; }
}

@media (max-width: 576px) {
  .form-row {
    flex-direction: column;
    gap: 24px;
  }
  
  .contact-form-card {
    padding: 25px;
  }
}
</style>