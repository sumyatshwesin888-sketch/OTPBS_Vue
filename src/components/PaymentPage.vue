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
          <h2>Payment Method</h2>
          <div class="payment-options">
            <label 
              v-for="method in paymentMethods" 
              :key="method.id" 
              :class="['payment-card', { selected: selectedMethod === method.id }]"
            >
              <input type="radio" :value="method.id" v-model="selectedMethod" />
              <div class="method-info">
                <span class="icon">{{ method.icon }}</span>
                <span>{{ method.name }}</span>
              </div>
            </label>
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
      selectedMethod: 'kbz',
      booking: null,
      paymentMethods: [
       
        { id: 'kbz', name: 'KBZ Pay', icon: '📱' },
        { id: 'wave', name: 'Wave Pay', icon: '🌊' },
        { id: 'cb', name: 'CB Pay', icon: '💵' }
      ]
    };
  },

  mounted() {
  const savedData = localStorage.getItem('booking_data');
  
  if (savedData) {
    try {
      this.booking = JSON.parse(savedData);
      console.log("Successfully loaded booking:", this.booking);
    } catch (e) {
      console.error("Failed to parse booking data", e);
    }
  } else {
    console.warn("No booking data found in localStorage");
    // data မရှိရင် အရင် page ကို ပြန်ပို့ပါ
    this.$router.push('/');
  }
},

  computed: {
    totalAmount() {
      // 1. Check if booking exists to avoid null errors
      if (!this.booking) return 0;
      
      // 2. Access the nested properties correctly
      // price comes from the package object
      // travelers comes from the travelerInfo object
      return this.booking.package.price * this.booking.travelerInfo.travelers;
    }
  },
  methods: {
    handlePayment() {
      
      if (!this.selectedMethod) {
    alert("Please select a payment method.");
    return;
  }

  // ၂။ LocalStorage ထဲက ရှိပြီးသား Booking Data ကို အရင်ယူခြင်း
  const savedData = localStorage.getItem('booking_data');
  let booking = savedData ? JSON.parse(savedData) : {};

  // ၃။ ရှိပြီးသား Data ထဲသို့ Payment အချက်အလက်များ ထပ်ပေါင်းထည့်ခြင်း
  booking.paymentMethod = this.selectedMethod;
  booking.id = "BK-" + Math.floor(Math.random() * 90000 + 10000); // ID အသစ်တစ်ခု generate လုပ်ပေးခြင်း
  booking.status = 'confirmed';
  booking.timestamp = new Date().toISOString();

  // ၄။ Data အားလုံးကို LocalStorage ထဲသို့ ပြန်သိမ်းခြင်း
  localStorage.setItem('booking_data', JSON.stringify(booking));

  // ၅။ အောင်မြင်ကြောင်း အကြောင်းကြားပြီး Confirmation Page သို့ သွားခြင်း
  alert('Payment Confirmed!');
  
  // Router name 'Confirmation' သို့မဟုတ် path '/confirmation' သုံးပြီးသွားပါ
  this.$router.push({ name: 'Confirmation' });
    }
  }
};
</script>

<style scoped>
.page-wrapper { max-width: 1100px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
.payment-wrapper { max-width: 1000px; margin: 40px auto; padding: 20px; font-family: 'Segoe UI', sans-serif; }

/* Stepper CSS */
/* Stepper Container */
/* Stepper Container - အလယ်တည့်တည့် ထားရန် */
.stepper-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
  width: 100%;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* တစ်ခုချင်းစီအတွက် Style */
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9ca3af; /* မပြီးသေးတဲ့ step အတွက် မီးခိုးရောင် */
  font-weight: 500;
}

/* Circle ပုံစံ */
.circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: #ffffff;
  transition: all 0.3s ease;
}

/* Active Step (အစိမ်းရောင်) */
.step.active .circle {
  background: #22c55e; /* Tailwind green-500 */
  border-color: #22c55e;
  color: #ffffff;
}
.step.active span {
  color: #22c55e;
  font-weight: 700;
}

/* Connect Line */
.line {
  width: 100px;
  height: 2px;
  background: #d1d5db;
  margin-top: -20px; /* Label နဲ့ Circle အလယ်တည့်တည့်ဖြစ်အောင် ချိန်ညှိပါ */
}
/* Layout & Cards */
.checkout-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }
.card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

/* Payment Methods */
.payment-card { display: flex; align-items: center; padding: 18px; border: 2px solid #e5e7eb; border-radius: 12px; margin-bottom: 12px; cursor: pointer; transition: 0.3s; }
.payment-card:hover { border-color: #22c55e; }
.payment-card.selected { border-color: #22c55e; background: #f0fdf4; }
.method-info { display: flex; align-items: center; gap: 15px; }

/* Buttons */
.actions { display: flex; gap: 15px; margin-top: 20px; }
.pay-btn { flex: 1; padding: 18px; background: #22c55e; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; }
.back-btn { padding: 18px 30px; border: 1px solid #d1d5db; background: transparent; border-radius: 12px; cursor: pointer; }

/* Summary */
.summary-img { width: 100%; height: 180px; object-fit: cover; border-radius: 12px; }
.row { display: flex; justify-content: space-between; margin: 12px 0; }
.total { color: #22c55e; font-size: 1.2rem; }

@media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr; } }
</style>