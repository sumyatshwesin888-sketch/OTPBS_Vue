<template>
  <div class="page-wrapper">
    <div class="stepper-container">
      <div class="stepper">
        <div class="step completed">
          <div class="circle">✓</div>
          <span>Package</span>
        </div>
        <div class="line"></div>
        <div class="step active">
          <div class="circle">2</div>
          <span>Payment</span>
        </div>
        <div class="line"></div>
        <div class="step">
          <div class="circle">3</div>
          <span>Confirmation</span>
        </div>
      </div>
    </div>

    <div class="checkout-grid">
      <section class="payment-section">
        <div class="card">
          <h2 class="section-title mb-4">Payment Method</h2>
          
          <div class="payment-options">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id" 
              class="payment-option"
              :class="{ selected: selectedMethod === method.id }"
              @click="selectedMethod = method.id"
            >
              <div class="radio-circle">
                <div v-if="selectedMethod === method.id" class="radio-dot" />
              </div>
              <span class="method-name">{{ method.name }}</span>
              <div class="method-logo" :style="{ background: method.color }">
                <span class="method-logo-text">{{ method.abbr }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="back-btn" @click="$router.go(-1)">Back</button>
          <button class="pay-btn" @click="handlePayment">Confirm Payment</button>
        </div>
      </section>

      <aside class="summary-section" v-if="booking && booking.package">
        <div class="card summary-card">
          <img :src="booking.package.image" :alt="booking.package.title" class="summary-img" />
          <div class="summary-content">
            <h3>{{ booking.package.title }}</h3>
            <p class="destination">{{ booking.package.city }}</p>
            
            <div class="summary-details">
              <div class="row"><span>Travelers</span><strong>{{ booking.travelerInfo.travelers }}</strong></div>
              <div class="row"><span>Duration</span><strong>{{ booking.package.duration }}</strong></div>
              <div class="row"><span>Date</span><strong>{{ booking.travelerInfo.date }}</strong></div>
              <hr />
              <div class="row total"><span>Total Amount</span><strong>{{ booking.totalAmount.toLocaleString() }} MMK</strong></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedMethod: 'kbzpay',
      booking: null,
      paymentMethods: [
        { id: 'kbzpay', name: 'KBZPay', abbr: 'KBZ', color: '#2563EB' },
        { id: 'wavepay', name: 'WavePay', abbr: 'Wave', color: '#F59E0B' },
        { id: 'ayapay', name: 'AYAPay', abbr: 'AYA', color: '#7C3AED' },
      ]
    };
  },

  mounted() {
    const savedData = localStorage.getItem('booking_data');
    if (savedData) {
      try {
        this.booking = JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse booking data", e);
      }
    } else {
      this.$router.push('/');
    }
  },

  methods: {
    handlePayment() {
      if (!this.selectedMethod) {
        alert("Please select a payment method.");
        return;
      }

      const savedData = localStorage.getItem('booking_data');
      let booking = savedData ? JSON.parse(savedData) : {};

      booking.paymentMethod = this.selectedMethod;
      booking.id = "BK-" + Math.floor(Math.random() * 90000 + 10000);
      booking.status = 'confirmed';
      booking.timestamp = new Date().toISOString();

      localStorage.setItem('booking_data', JSON.stringify(booking));

      alert('Payment Confirmed!');
      this.$router.push({ name: 'Confirmation' });
    }
  }
};
</script>

<style scoped>
.page-wrapper { max-width: 1100px; margin: 0 auto; padding: 20px; font-family: sans-serif; }

/* Stepper CSS */
.stepper-container { display: flex; justify-content: center; align-items: center; margin: 40px 0; width: 100%; }
.stepper { display: flex; align-items: center; gap: 20px; }
.step { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #9ca3af; font-weight: 500; }
.circle { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; font-weight: 700; background: #ffffff; }
.step.active .circle { background: #22c55e; border-color: #22c55e; color: #ffffff; }
.step.active span { color: #22c55e; font-weight: 700; }
.line { width: 100px; height: 2px; background: #d1d5db; margin-top: -20px; }

/* Layout & Cards */
.checkout-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }
.card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.section-title { font-size: 20px; font-weight: 700; color: #1a2340; margin-bottom: 20px; }

/* New Payment Method UI */
.payment-option { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 10px; cursor: pointer; transition: background 0.15s; margin-bottom: 12px; border: 2px solid #e5e7eb; }
.payment-option:hover { background: #f8fafc; border-color: #22c55e; }
.payment-option.selected { border-color: #22c55e; background: #f0fdf4; }
.radio-circle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ccc; display: flex; align-items: center; justify-content: center; }
.payment-option.selected .radio-circle { border-color: #22c55e; }
.radio-dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; }
.method-name { flex: 1; font-size: 15px; font-weight: 600; color: #222; }
.method-logo { width: 60px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.method-logo-text { color: #fff; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; }

/* Buttons & Summary */
.actions { display: flex; gap: 15px; margin-top: 20px; }
.pay-btn { flex: 1; padding: 18px; background: #22c55e; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; }
.back-btn { padding: 18px 30px; border: 1px solid #d1d5db; background: transparent; border-radius: 12px; cursor: pointer; }
.summary-img { width: 100%; height: 180px; object-fit: cover; border-radius: 12px; }
.row { display: flex; justify-content: space-between; margin: 12px 0; }
.total { color: #22c55e; font-size: 1.2rem; }

@media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr; } }
</style>