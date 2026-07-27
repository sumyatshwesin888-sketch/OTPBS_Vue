<template>
  <div class="page-wrapper">
    <div class="stepper-container">
      <div class="stepper">
        <div class="step completed"><div class="circle">✓</div><span>Package</span></div>
        <div class="line"></div>
        <div class="step completed"><div class="circle">✓</div><span>Payment</span></div>
        <div class="line"></div>
        <div class="step active"><div class="circle">3</div><span>Confirmation</span></div>
      </div>
    </div>

    <!-- booking data ရှိမှသာ ဒီ card တစ်ခုလုံးကို ပေါ်စေရန် v-if ထည့်ပါ -->
    <div class="card details-card" v-if="booking">
      <div :class="['card success-card', statusCardConfig.class]">
        <div class="success-icon">{{ statusCardConfig.icon }}</div>
        <h1>{{ statusCardConfig.title }}</h1>
        <p>{{ statusCardConfig.message }}</p>
      </div>

      <div class="package-header">
        <h2>{{ booking.package.title }}</h2>
        <p>{{ booking.id || 'N/A' }}</p>
        <span class="duration-badge">{{ booking.package.day }}Days/
        {{ booking.package.night }}Nights</span>
      </div>

      <div class="summary-details">
        <div class="row"><span>Traveler Name</span> <strong>{{ booking.travelerInfo.name }}</strong></div>
        <div class="row"><span>Email</span> <strong>{{ booking.travelerInfo.email }}</strong></div>
        <div class="row"><span>Contact</span> <strong>{{ booking.travelerInfo.phone }}</strong></div>
        <div class="row"><span>Travelers</span> <strong>{{ booking.travelerInfo.travelers }}</strong></div>
        <div class="row"><span>Payment</span> <strong>{{ booking.paymentMethod }}</strong></div>
        
        <div class="row">
          <span>Booking Status</span> 
          <strong :style="{ color: statusCardConfig.statusColor }">{{ currentStatus }}</strong>
        </div>
        
        <hr />
        <div class="row total"><span>Total Amount</span> <strong>{{ booking.totalAmount }} MMK</strong></div>
      </div>

      <div class="action-buttons">
        <button class="back-btn" @click="$router.go(-1)">Back</button>
        <button class="btn-primary" @click="$router.push('/packages')">Browse More Packages</button>
      </div>
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
.template {
  background: radial-gradient(circle at top, #eaf3ff, #f6f9ff);
}

/* Page တစ်ခုလုံးကို Fixed ဖြစ်စေပြီး Screen တစ်ခုစာအတွင်း တိကျစွာပေါ်စေရန် */
.page-wrapper {
  width: 55%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
}

.stepper-container {
  display: flex;
  justify-content: center;
   margin-top:70px; 
  margin-bottom: 30px;
}

.stepper {
  display: flex;
  align-items: center;
   gap: 25px;              /* step တွေအကွာအဝေး */
  padding: 10px 35px; 
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(30, 64, 175, 0.12);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
 gap: 4px;
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

.circle {
 width: 32px;
   height: 32px;
   font-size: 13px;
   border-radius: 50%;
  
   display: flex;
   align-items: center;
   justify-content: center;
   border: 2px solid #cbd5e1;
   background: white;
   font-weight: 700;
   transition: all 0.3s ease;
}

.step.active .circle {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-color: #2563eb;
    color: white;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}

.step.completed .circle {
   background: #1d4ed8;
    border-color: #1d4ed8;
    color: white;
}

.line {
  width: 80px;
  height: 2px;
  background: linear-gradient(to right, #dbeafe, #93c5fd);
}


/* BASE CARD */
.card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 16px 24px;
  box-shadow: 0 15px 35px rgba(30, 64, 175, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.08);
}

/* =========================
   ✨ SUCCESS CARD
========================= */
.success-card {
  position: relative;
  text-align: center;
  padding: 12px 20px;
  border-radius: 20px;
  color: white;
  overflow: hidden;
  margin-bottom: 12px;
  transition: background 0.5s ease, box-shadow 0.5s ease;
}

/* Dynamic Live Status Classes */
.status-confirming {
  background: linear-gradient(135deg, #1d4ed8, #0ea5e9) !important;
}

.status-approved {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.25) !important;
}

.status-cancelled {
  background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.25) !important;
}

.success-card::before {
  content: "";
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  top: -60px;
  right: -60px;
  filter: blur(20px);
}

.success-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.success-card h1 {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 2px;
}

.success-card p {
  font-size: 11px;
  opacity: 0.9;
  margin: 0;
}

/* =========================
   🎟️ DETAILS CARD
========================= */
.details-card {
  position: relative;
  border-radius: 20px;
  border: 1px solid #e0e7ff;
}

.details-card::before,
.details-card::after {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  background: #f6f9ff;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.details-card::before {
  left: -12px;
}

.details-card::after {
  right: -12px;
}

/* HEADER */
.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.package-header h2 {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.package-header p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.duration-badge {
  padding: 5px 12px;
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
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px dashed #e5e7eb;
  color: #334155;
}

.row strong {
  color: #0f172a;
}

/* TOTAL */
.total {
  border: none;
  font-size: 17px;
  font-weight: 800;
  color: #1d4ed8;
  padding-top: 10px;
}

/* BUTTONS */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.back-btn {
  padding: 12px 18px;
  border-radius: 14px;
  border: 1px solid #cbd5f5;
  background: white;
  color: #1d4ed8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .page-wrapper {
    height: auto;
    overflow: auto;
    padding: 20px 10px;
  }
  .action-buttons {
    flex-direction: column;
  }
}
</style><style scoped>
.template {
  background: radial-gradient(circle at top, #eaf3ff, #f6f9ff);
}

/* Page တစ်ခုလုံး Viewport အတွင်း Fixed ဖြစ်စေရန် */
.page-wrapper {
  
  max-width: 1100px;
  width: 55%;
  margin: 0 auto;
  padding: 10px 20px;
  font-family: "Inter", sans-serif;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Stepper ကို မူလအရွယ်အစားအတိုင်း ထားရှိသည် */
.stepper-container {
  display: flex;
  justify-content: center;
  margin-top:70px; 
  margin-bottom: 30px;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 10px 35px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(30, 64, 175, 0.12);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

.circle {
  width: 32px;
  height: 32px;
  font-size: 13px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #cbd5e1;
  background: white;
  font-weight: 700;
  transition: all 0.3s ease;
}

.step.active .circle {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-color: #2563eb;
  color: white;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}

.step.completed .circle {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: white;
}

.line {
  width: 80px;
  height: 2px;
  background: linear-gradient(to right, #dbeafe, #93c5fd);
}

/* BASE CARD - ကဒ်အရွယ်အစားကို ကျစ်လျဉ်းစေရန် ပြုလုပ်ထားသည် */
.card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 16px 24px;
  box-shadow: 0 15px 35px rgba(30, 64, 175, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.08);
}

/* =========================
   ✨ SUCCESS CARD (Height သေးငယ်စေရန်)
========================= */
.success-card {
  position: relative;
  text-align: center;
  padding: 12px 20px;
  border-radius: 18px;
  color: white;
  overflow: hidden;
  margin-bottom: 10px;
  transition: background 0.5s ease, box-shadow 0.5s ease;
}

.status-confirming {
  background: linear-gradient(135deg, #1d4ed8, #0ea5e9) !important;
}

.status-approved {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2) !important;
}

.status-cancelled {
  background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2) !important;
}

.success-card::before {
  content: "";
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  top: -60px;
  right: -60px;
  filter: blur(20px);
}

.success-icon {
  width: 30px;
  height: 30px;
  margin: 0 auto 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  backdrop-filter: blur(10px);
}

.success-card h1 {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 2px;
}

.success-card p {
  font-size: 11px;
  opacity: 0.9;
  margin: 0;
}

/* =========================
   🎟️ DETAILS CARD
========================= */
.details-card {
  position: relative;
  border-radius: 20px;
  border: 1px solid #e0e7ff;
}

.details-card::before,
.details-card::after {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  background: #f6f9ff;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.details-card::before {
  left: -12px;
}

.details-card::after {
  right: -12px;
}

/* HEADER */
.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.package-header h2 {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.package-header p {
  font-size: 11px;
  color: #64748b;
  margin: 0;
}

.duration-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #1d4ed8;
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

/* ROWS */
.row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 12px;
  border-bottom: 1px dashed #e5e7eb;
  color: #334155;
}

.row strong {
  color: #0f172a;
}

/* TOTAL */
.total {
  border: none;
  font-size: 15px;
  font-weight: 800;
  color: #1d4ed8;
  padding-top: 6px;
}

/* BUTTONS */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.btn-primary {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.back-btn {
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid #cbd5f5;
  background: white;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .page-wrapper {
    height: auto;
    overflow: auto;
    padding: 20px 10px;
  }
  .action-buttons {
    flex-direction: column;
  }
}
</style>