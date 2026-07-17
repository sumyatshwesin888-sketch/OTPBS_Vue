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
      
      <div :class="['card success-card', statusCardConfig.class]">
        <div class="success-icon">{{ statusCardConfig.icon }}</div>
        <h1>{{ statusCardConfig.title }}</h1>
        <p>{{ statusCardConfig.message }}</p>
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
          
          <!-- Live Status Row  -->
          <div class="row">
            <span>Booking Status</span> 
            <strong :style="{ color: statusCardConfig.statusColor }">{{ currentStatus }}</strong>
          </div>
          
          <hr />
          <div class="row total"><span>Total Amount</span> <strong>{{ booking.totalAmount }} MMK</strong></div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="back-btn" @click="$router.go(-1)">Back</button>
      <button class="btn-outline" @click="downloadReceipt">Download Receipt</button>
      <button class="btn-primary" @click="$router.push('/packages')">Browse More Packages</button>
    </div>
  </div>
</template>

<script>

import { supabase } from '../lib/supabase'

export default {
  data() {
    return {
      booking: null,
      currentStatus: 'CONFIRM', 
      realtimeChannel: null
    };
  },
  computed: {
    
    statusCardConfig() {
      switch (this.currentStatus) {
        case 'APPROVED':
          return {
            title: 'Booking Approved!',
            message: 'Congratulations! Your booking has been officially approved. Have a wonderful trip!',
            icon: '✓',
            class: 'status-approved',
            statusColor: '#10b981'
          };
        case 'DELETE':
          return {
            title: 'Booking Cancelled',
            message: 'This booking has been cancelled or declined. Please contact support for assistance.',
            icon: '✕',
            class: 'status-cancelled',
            statusColor: '#ef4444'
          };
        case 'CONFIRM':
        default:
          return {
            title: 'Payment Confirmed!',
            message: 'Thank you for your payment. Your booking is currently awaiting admin approval.',
            icon: '✓',
            class: 'status-confirming',
            statusColor: '#2563eb'
          };
      }
    }
  },
  mounted() {
   
    const savedData = localStorage.getItem('booking_data');
    if (savedData) {
      this.booking = JSON.parse(savedData);
      
      
      this.currentStatus = this.booking.status || 'CONFIRM';

     
      this.subscribeToBookingStatus();
    } else {
      this.$router.push('/'); 
    }
  },
  beforeUnmount() {
    
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
    }
  },
  methods: {
    subscribeToBookingStatus() {
      
      const bookingId = this.booking.id || this.booking.saleId;
      if (!bookingId) return;

      
      this.realtimeChannel = supabase
        .channel(`booking-status-${bookingId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'sale',
            filter: `saleId=eq.${bookingId}`
          },
          (payload) => {
            if (payload.new && payload.new.status) {
              
              this.currentStatus = payload.new.status;
              
              
              this.booking.status = payload.new.status;
              localStorage.setItem('booking_data', JSON.stringify(this.booking));
            }
          }
        )
        .subscribe();
    },
    downloadReceipt() {
      alert("Receipt download initiated!");
    }
  }
};
</script>

<style scoped>
.template{
   background: radial-gradient(circle at top, #eaf3ff, #f6f9ff);
}
.page-wrapper {
  max-width: 1050px;
  margin: 0 auto;
  padding: 42px 20px;
  font-family: "Inter", sans-serif;
}


.stepper-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 26px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.12);
  border: 1px solid rgba(37, 99, 235, 0.08);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #94a3b8;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #dbeafe;
  font-weight: 700;
  transition: all 0.3s ease;
}

.step.active .circle {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.35);
}

.step.completed .circle {
  background: #1d4ed8;
  color: white;
  border-color: #1d4ed8;
}

.line {
  width: 80px;
  height: 2px;
  background: linear-gradient(to right, #dbeafe, #93c5fd);
}

/* GRID */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 26px;
}

/* BASE CARD */
.card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 22px;
  padding: 26px;
  box-shadow: 0 18px 45px rgba(30, 64, 175, 0.12);
  border: 1px solid rgba(37, 99, 235, 0.08);
}

/* =========================
   ✨ SUCCESS CARD (DYNAMIC AIR TICKET STYLE)
========================= */
.success-card {
  position: relative;
  text-align: center;
  padding: 42px 25px;
  border-radius: 22px;
  color: white;
  overflow: hidden;
  transition: background 0.5s ease, box-shadow 0.5s ease; /* အခြေအနေပြောင်းတဲ့အခါ animation ချောမွေ့စေရန် */
}

/* Dynamic Live Status Classes for Success Card */
.status-confirming {
  background: linear-gradient(135deg, #1d4ed8, #0ea5e9) !important;
}

.status-approved {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  box-shadow: 0 18px 45px rgba(16, 185, 129, 0.25) !important;
}

.status-cancelled {
  background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
  box-shadow: 0 18px 45px rgba(239, 68, 68, 0.25) !important;
}

/* animated glow */
.success-card::before {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  top: -80px;
  right: -80px;
  filter: blur(30px);
}

.success-card::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.25);
  top: 55%;
  left: 0;
  transform: rotate(-6deg);
}

.success-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.success-card h1 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 6px;
}

.success-card p {
  font-size: 13px;
  opacity: 0.9;
}

/* =========================
   🎟️ DETAILS CARD (TICKET STYLE)
========================= */
.details-card {
  position: relative;
  border-radius: 22px;
  border: 1px solid #e0e7ff;
}

/* ticket cut effect */
.details-card::before,
.details-card::after {
  content: "";
  position: absolute;
  width: 26px;
  height: 26px;
  background: #f6f9ff;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.details-card::before {
  left: -14px;
}

.details-card::after {
  right: -14px;
}

/* HEADER */
.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.package-header h2 {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.package-header p {
  font-size: 12px;
  color: #64748b;
}

.duration-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #1d4ed8;
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

/* ROWS */
.row {
  display: flex;
  justify-content: space-between;
  padding: 11px 0;
  font-size: 14px;
  border-bottom: 1px dashed #e5e7eb;
  color: #334155;
}

.row strong {
  color: #0f172a;
}

/* TOTAL */
.total {
  border: none;
  font-size: 18px;
  font-weight: 800;
  color: #1d4ed8;
  padding-top: 14px;
}

/* BUTTONS */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 26px;
}

.btn-primary {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 25px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-outline {
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  border: 2px solid #1d4ed8;
  background: white;
  color: #1d4ed8;
  font-weight: 700;
  cursor: pointer;
}

.back-btn {
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid #cbd5f5;
  background: white;
  color: #1d4ed8;
  font-weight: 600;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>