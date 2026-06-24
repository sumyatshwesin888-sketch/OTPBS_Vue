<template>
  <div class="page-wrapper">
    <div class="stepper-container">
      <div class="stepper">
        <div class="step completed"><div class="circle">✓</div><span>Package</span></div>
        <div class="line"></div>
        <div class="step completed"><div class="circle">✓</div><span>Payment</span></div>
        <div class="line"></div>
        <div class="step active"><div class="circle">3</div><span>Confirm</span></div>
      </div>
    </div>

    <div class="checkout-grid" v-if="booking">
      <div class="card success-card">
        <div class="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Thank you for your payment. Your booking has been successfully processed.</p>
      </div>

      
        

        <div class="card details-card">
          <div class="package-header">
            <h2>{{ booking.package.title }}</h2>
            <p>{{ booking.id || 'N/A' }}</p>
            <span class="duration-badge">{{ booking.package.duration }}</span>
          </div>
          <div class="summary-details">
            
            <div class="row"><span>Traveler Name</span> <strong>{{ booking.travelerInfo.name }}</strong></div>
            <div class="row"><span>Email</span> <strong>{{ booking.travelerInfo.email }}</strong></div>
            <div class="row"><span>Contact</span> <strong>{{ booking.travelerInfo.phone }}</strong></div>
            <div class="row"><span>Date</span> <strong>{{ booking.travelerInfo.date }}</strong></div>
            <div class="row"><span>Travelers</span> <strong>{{ booking.travelerInfo.travelers }}</strong></div>
            <div class="row"><span>Payment</span> <strong>{{ booking.paymentMethod }}</strong></div>
            <hr />
            <div class="row total"><span>Total Amount</span> <strong>{{ booking.totalAmount }} MMK</strong></div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-outline" @click="downloadReceipt">Download Receipt</button>
        <button class="btn-primary" @click="$router.push('/packages')">Browse More Packages</button>
      </div>
    </div>
  
</template>

<script>
export default {
  data() {
    return {
      booking: null
    };
  },
  mounted() {
    // Retrieve data saved from PaymentPage.vue via localStorage
    const savedData = localStorage.getItem('booking_data');
    if (savedData) {
      this.booking = JSON.parse(savedData);
    } else {
      this.$router.push('/'); // Redirect if no data found
    }
  },
  methods: {
    downloadReceipt() {
      alert("Receipt download initiated!");
    }
  }
};
</script>

<style scoped>

.card details-card{border-radius: 25%;}
.page-wrapper { max-width: 900px; margin: 0 auto; padding: 20px; }
.card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }

/* Grid Layout */
.booking-content { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; margin-top: 20px; }

/* Success Card */
.success-card { text-align: center; margin-bottom: 20px; }
.success-icon { width: 50px; height: 50px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; }

/* Package Card */
.package-header { display: flex; justify-content: space-between; align-items: center; }
.duration-badge { background: #f0fdf4; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }

/* Details */
.section-title { margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
.row { display: flex; justify-content: space-between; margin-bottom: 15px; }
.total { font-size: 1.3rem; color: #22c55e; font-weight: 800; margin-top: 10px; }

/* Responsive */
@media (max-width: 768px) {
  .booking-content { grid-template-columns: 1fr; }
}

/* Stepper (Keep original) */
.stepper-container { display: flex; justify-content: center; margin-bottom: 40px; }
.stepper { display: flex; align-items: center; gap: 20px; }
.step { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #9ca3af; }
.circle { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; font-weight: bold; background: white; }
.step.active .circle { background: #22c55e; border-color: #22c55e; color: white; }
.line { width: 80px; height: 2px; background: #d1d5db; margin-top: -20px; }

/* Buttons */
.action-buttons { display: flex; gap: 15px; margin-top: 30px; }
.btn-primary { flex: 1; padding: 15px; background: #22c55e; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; }
.btn-outline { flex: 1; padding: 15px; background: white; border: 1px solid #22c55e; color: #22c55e; border-radius: 12px; cursor: pointer; font-weight: 600; }
</style>