<template>
  <div class="page-wrapper">
    <div class="stepper-container">
      <div class="stepper">
        <div class="step active">
          <div class="circle">1</div>
          <span>Package</span>
        </div>
        <div class="line"></div>
        <div class="step ">
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
    

    <div class="checkout-layout">
      <div class="form-section">
        <h3>Traveler Information</h3>
        <form @submit.prevent="validateForm">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="form.name" type="text" placeholder="Enter your name" />
            <span class="error" v-if="errors.name">{{ errors.name }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="form.phone" type="text" placeholder="09xxxxxxxxx" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="form.email" type="email" placeholder="example@mail.com" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Number of Travelers</label>
              <select v-model="form.travelers">
                <option v-for="n in 10" :key="n" :value="n">{{ n }} Traveler(s)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Travel Date</label>
              <input v-model="form.date" type="date" required />
            </div>
          </div>

          <button type="submit" class="btn-submit" v-on:click="proceedToPayment" >Continue to Payment</button>
        </form>
      </div>

      <div class="summary-section" v-if="selectedPackage">
  <div class="summary-card">
    <img :src="selectedPackage.image" :alt="selectedPackage.title" class="package-img" />
    <div class="card-body">
      <h3>{{ selectedPackage.title }}</h3>
      <p>Duration: {{ selectedPackage.duration }}</p>
      
      <div class="price-row">
        <span>Price/Person</span>
        <strong>{{ selectedPackage.price.toLocaleString() }} MMK</strong>
      </div>
      <div class="price-row">
        <span>Travelers</span>
        <strong>{{ form.travelers }}</strong>
      </div>
      
      <hr />
      
      <div class="total-row">
        <span>Total Amount</span>
        <strong>{{ totalPrice.toLocaleString() }} MMK</strong>
      </div>
    </div>
  </div>
  </div>
</div>
  </div>
  
  
  
</template>
<script>
import { useAuthStore } from '../store/auth';
export default {
  data() {
    return {

      errors: {},
       selectedPackage: null,
       form: { 
        name: '', 
        email: '', 
        phone: '', 
        travelers: 1, 
        date: '' 
      },
      packagesDataset: [
        
    {id: 1,
    title: 'Hpa-An Explore',
    overview:
      'This basic itinerary is highly suitable for budget-conscious travelers and groups of friends who want to joyfully explore the main landmark caves of Hpa-An.',
    price: 195000 ,
    duration: '3 Days / 2 Nights',
    group_size: '2 - 10 People',
    rating: '4.7',
    reviews: '45',
    type: 'domestic',
    level: 'budget',
    city: 'Hpa An',
    country: 'Myanmar',
    
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKM47OeGkz0jR-u1pXERcqjcANzdiJW8Qwlf-ADoF4QGplTaPI9TLIppc&s=10',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Arrival & Sunset Temple Watch',
        description:
          'Arrive at Bagan airport, check-in to hotel and head out to experience the iconic panoramic golden sunset.',
      },
      {
        title: 'Full Day Temple Exploration',
        description:
          'Visit Ananda Temple, Shwezigon Pagoda, and Dhammayangyi Temple with a professional local guide.',
      },
      {
        title: 'Local Crafts & Departure',
        description:
          'Explore traditional lacquerware workshops and enjoy a smooth departure back home.',
      },
    ],
  },
  {
    id: 2,
    title: 'Hpa-An Adventure',
    overview: 'The best itinerary for nature lovers who want to personally climb Mt. Zwegabin and create lasting memories filled with adventure.',
    price: 390000,
    duration: '4Days / 3Nights',
    group_size: '2-8 People',
    rating: '4.8',
    reviews: '72',
    type: 'domestic',
    level: 'standard',
    city: 'Hpa An',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC2F6dkl--5ZgGST33-gDENeFeDjfWokz5G0caN9E_sHarjggPWSNBUe0&s=10',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 3,
    title: 'Hpa-An Luxury Retreat ',
    overview: 'A premium itinerary for relaxing peacefully at a high-end VIP resort by the Thanlwin River, while traveling luxuriously with a private VIP car and private boats.',
    price: 950000,
    duration: '5Days / 4Nights',
    group_size: '2-8 People',
    rating: '5.0',
    reviews: '38',
    type: 'domestic',
    level: 'premium',
    city: 'Hpa An',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhKjPwzLJT5EpxUj3ligmXhDLn6WOAxCdc3aoTQSiz8MhKwdmJxb3xOIkU&s=10',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 4,
    title: 'Bagan Heritage Exolore',
    overview: 'An affordable tour exploring ancient Bagan pagodas, famous sunset viewpoints, and rich Myanmar cultural heritage.',
    price: 650000 ,
    duration: '3Days / 2Nights',
    group_size: '2-15 People',
    rating: '4.8',
    reviews: '180',
    type: 'domestic',
    level: 'budget',
    city: 'Bagan',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1611005886618-bfe24df4ef39?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Arrival & Sunset Temple Watch',
        description:
          'Arrive at Bagan airport, check-in to hotel and head out to experience the iconic panoramic golden sunset.',
      },
      {
        title: 'Full Day Temple Exploration',
        description:
          'Visit Ananda Temple, Shwezigon Pagoda, and Dhammayangyi Temple with a professional local guide.',
      },
      {
        title: 'Local Crafts & Departure',
        description:
          'Explore traditional lacquerware workshops and enjoy a smooth departure back home.',
      },
    ],
  },
  {
    id: 5,
    title: 'Bagan Cultural Discover',
    overview: "A suitable package for families and friends to fully experience Bagan's ancient temples, local culture, and Ayeyarwady scenic river views.",
    price: 950000,
    duration: '4Days / 3Nights',
    group_size: '2-12 People',
    rating: '4.9',
    reviews: '220',
    type: 'domestic',
    level: 'standard',
    city: 'Bagan',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 6,
    title: 'Bagan Royal',
    overview: 'A premium package featuring a breathtaking sunrise hot-air balloon flight, luxury resort stay, and private guided tours for an unforgettable escape.',
    price: 1850000 ,
    duration: '4Days / 3Nights',
    group_size: '2-4 People(Private)',
    rating: '5',
    reviews: '62',
    type: 'domestic',
    level: 'premium',
    city: 'Bagan',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1512411030090-b18420b9b3e1?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 7,
    title: 'Ngwe Saung Costal Escape',
    overview: 'A budget-friendly coastal escape designed for travelers looking to relax peacefully in the sea breeze and experience natural beach beauty.',
    price: 750000,
    duration: '4Days / 3Nights',
    group_size: '2-20 People',
    rating: '4.5',
    reviews: '126',
    type: 'domestic',
    level: 'budget',
    city: 'Ngwe Saung',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 8,
    title: 'Ngwe Saung Coastal Experience',
    overview: 'A comfortable travel experience tailored to fully enjoy beach activities, local exploration, and high-quality resort relaxation.',
    price: 1200000,
    duration: '5Days / 4Nights',
    group_size: '2-15 People',
    rating: '4.8',
    reviews: '246',
    type: 'domestic',
    level: 'standard',
    city: 'Ngwe Saung',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 9,
    title: 'Ngwe Saung Ocean Prestige',
    overview: 'A premium seaside escape combining tranquility and ultra-luxury experiences, featuring private accommodations and VIP services.',
    price: 2200000,
    duration: '5Days / 4Nights',
    group_size: '2-8 People',
    rating: '4.9',
    reviews: '89',
    type: 'domestic',
    level: 'premium',
    city: 'Ngwe Saung',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 10,
    title: 'Kalaw Trekking',
    overview: "A suitable package for nature lovers wanting to experience Kalaw's cool climate, pine forests, mountain trekking, and local markets.",
    price: 420000,
    duration: '3Days / 2Nigts',
    group_size: '2-12 People',
    rating: '4.7',
    reviews: '135',
    type: 'domestic',
    level: 'budget',
    city: 'Kalaw',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 11,
    title: 'Kalaw Advanture',
    overview: 'A great vacation for families and friends to visit Kalaw and Inle Lake in one trip, exploring natural beauty, tradition, and Intha lifestyle.',
    price: 720000,
    duration: '4Days / 3Nights',
    group_size: '2-10 People',
    rating: '4.9',
    reviews: '185',
    type: 'domestic',
    level: 'standard',
    city: 'Kalaw',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 12,
    title: 'Kalaw Luxury Retreat',
    overview: 'A VIP retreat to relax peacefully in a luxury mountain resort, enjoying private tours, premium dining, and pristine nature.',
    price: 1250000,
    duration: '5Days / 4Nights',
    group_size: '2-6 People',
    rating: '5',
    reviews: '29',
    type: 'domestic',
    level: 'premium',
    city: 'Kalaw',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 13,
    title: 'Bangkok City Tour',
    overview: 'Tailored for travelers who want to stay in a convenient shopping area in downtown Bangkok, go shopping, and explore famous temples and street food.',
    price: 1650000,
    duration: '4Days / 3Nights',
    group_size: '2-12 People',
    rating: '4.6',
    reviews: '112',
    type: 'international',
    level: 'budget',
    city: 'Bangkok',
    country: 'Thailand',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 14,
    title: 'Chiang Mai Cultural Heritage',
    overview: "A perfect cultural getaway for families to explore Chiang Mai's golden mountain temples, interact ethically with rescued elephants, and experience ancient Northern Thai (Lanna) traditions.",
    price: 2550000,
    duration: '5Days / 4Nights',
    group_size: '2-10 People',
    rating: '4.8',
    reviews: '150',
    type: 'international',
    level: 'standard',
    city: 'Chiang Mai',
    country: 'Thailand',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 15,
    title: 'Phuket Luxury Island Resort',
    overview: 'A top-tier honeymoon and luxury itinerary featuring a lavish stay at an exclusive private pool villa in Phuket and a private yacht cruise to the famous Phi Phi Islands.',
    price: 4450000,
    duration: '5Days / 4Nights',
    group_size: '2-4 People',
    rating: '5.0',
    reviews: '85',
    type: 'international',
    level: 'premium',
    city: 'Phuket',
    country: 'Thailand',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 16,
    title: 'Tokyo City Explore',
    overview: "A budget-friendly tour to experience Japanese culture while visiting Tokyo's modern skyscrapers, traditional shrines, and famous shopping districts.",
    price: 3250000,
    duration: '5Days / 4Nights',
    group_size: '2-10 People',
    rating: '4.8',
    reviews: '142',
    type: 'international',
    level: 'budget',
    city: 'Tokyo',
    country: 'Japan',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 17,
    title: 'Tokyo Mount Fuji Advanture',
    overview: 'An ideal package for families and friends to experience Tokyo, Mt. Fuji, and Hakone scenery in one trip, including an Onsen, cable car, and cruise.',
    price: 4250000,
    duration: '6Days / 5Nights',
    group_size: '2-10 People',
    rating: '4.9',
    reviews: '198',
    type: 'international',
    level: 'standard',
    city: 'Tokyo',
    country: 'Japan',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 18,
    title: 'Osaka & Kyoto Cherry Blossom Tour',
    overview:
      'Experience the perfect blend of modern technology and rich traditional culture in Japan.',
    price: 6850000,
    duration: '7Days/ 6Nights',
    group_size: '2-6 People',
    hotel: 'Premium City Hotel',
    rating: '5.0',
    reviews: '210',
    city: 'Oscaka',
    country: 'Japan',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Tokyo Arrival',
        description: 'Welcome to Japan! Transfer to your hotel and explore Shinjukus neon streets.',
      },
      {
        title: 'Shibuya Crossing & Mt Fuji View',
        description:
          'Walk across the worlds busiest crossroad and enjoy a scenic bullet-train view of Mt. Fuji.',
      },
      {
        title: 'Historic Kyoto Temples',
        description: 'Visit Fushimi Inari Shrine with its thousands of vermilion torii gates.',
      },
      {
        title: 'Cherry Blossom Park Walk',
        description: 'Stroll through sakura paradise inside Ueno Park.',
      },
      {
        title: 'Shopping Day Akihabara',
        description: 'Unleash your inner tech geek in Akihabara anime and electronics town.',
      },
      {
        title: 'Sayonara Tokyo',
        description: 'Last-minute souvenir packing and flight back home.',
      },
    ],
  },
  {
    id: 19,
    title: 'Singapore City Escape',
    overview: 'A budget-friendly city escape to explore modern cityscapes, iconic landmarks, and famous shopping streets.',
    price: 2850000 ,
    duration: '4Days / 3Nights',
    group_size: '2-25 People',
    rating: '4.6',
    reviews: '112',
    type: 'international',
    level: 'budget',
    city: 'Singapore',
    country: 'Singapore',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 20,
    title: 'Singapore Advanture',
    overview: 'A complete Singapore experience combining leisure and high-energy excitement at top theme parks and wildlife attractions.',
    price: 3850000 ,
    duration: '5Days / 4Nights',
    group_size: '2-20 People',
    rating: '4.8',
    reviews: '128',
    type: 'international',
    level: 'standard',
    city: 'Singapore',
    country: 'Singapore',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 21,
    title: 'Singapore Luxury Prestige Escape',
    overview: 'An ultra-luxury city escape designed for high-end lifestyles, featuring VIP services, premium accommodation, and night cruises.',
    price: 6500000,
    duration: '5Days / 4Nights',
    group_size: '2-6 People',
    rating: '4.9',
    reviews: '156',
    type: 'international',
    level: 'premium',
    city: 'Singapore',
    country: 'Singapore',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 22,
    title: 'Shanghai City Explore',
    overview: "An affordable tour to explore Shanghai's famous landmarks like The Bund, Oriental Pearl Tower, Yu Garden, and traditional Chinese street food.",
    price: 1950000 ,
    duration: '4Days / 3Nights',
    group_size: '2-12 People',
    rating: '4.7',
    reviews: '165',
    type: 'international',
    level: 'budget',
    city: 'Shanghai',
    country: 'China',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1548861216-1771f34ecf2a?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 23,
    title: 'Shanghai & Suzhou Cultural Discovery',
    overview: 'A perfect combination package for families and friends to visit modern Shanghai and the classical traditional gardens of Suzhou.',
    price: 2950000 ,
    duration: '5Days / 4Nights',
    group_size: '2-10 People',
    rating: '4.9',
    reviews: '240',
    type: 'international',
    level: 'standard',
    city: 'Shanghai',
    country: 'China',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1525596662741-e94ff9926de3?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
    ],
  },
  {
    id: 24,
    title: 'Shanghai Luxury Skyline ',
    overview: 'A premium package specially curated for honeymooners and luxury travelers, featuring high skyline views, VIP shopping, and a luxury river cruise.',
    price: 4850000,
    duration: '5Days / 4Nights',
    group_size: '2-4 People',
    rating: '5.0',
    reviews: '95',
    type: 'international',
    level: 'premium',
    city: 'Shanghai',
    country: 'China',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Myeik Arrival',
        description:
          'Check-in to your ocean-view room and spend the evening relaxing by the beach.',
      },
      {
        title: 'Island Hopping & Snorkeling',
        description:
          'Sail across crystal clear waters, snorkel with exotic marine life, and enjoy a fresh seafood lunch on the beach.',
      },
      {
        title: 'Sea Gypsy Village Culture Visit',
        description:
          'Interact with local Moken communities and discover their unique seafaring traditions.',
      },
      {
        title: 'Souvenir Shopping & Departure',
        description: 'Grab local pearls and snacks before heading back to the airport.',
      },
      
    ],
  },
],
    
       
currentStep: 1,
      steps: ['Traveler Info', 'Payment', 'Confirmation'],
      form: { name: '', phone: '', email: '', travelers: 1, date: '' },
      errors: {},
      


    }
  },

  computed: {


    totalPrice() {
      if (!this.selectedPackage) return 0;
      return this.selectedPackage.price * this.form.travelers;
    }
  },

  created() {
    const authStore = useAuthStore();

    // 1. Authentication Check: Redirect to login if not logged in
    if (!authStore.isLoggedIn) {
      this.$router.push('/login');
      return;
    }
    if (authStore.user) {
      this.form.name = authStore.user.fullName || '';
      this.form.phone = authStore.user.phone || '';
      this.form.email = authStore.user.email || '';
    }
  },
  mounted() {
    this.loadSelectedPackage();
    const today = new Date().toISOString().split('T')[0];
    this.form.date = today;
  },

   watch: {
    '$route.params.id'() {
      this.loadSelectedPackage();
    }
  },
  methods: {
  // 1. Package အချက်အလက်များ Load လုပ်ခြင်း
  loadSelectedPackage() {
    const id = this.$route.params.id;
    this.selectedPackage = this.packagesDataset.find(p => p.id == id);
  },

  // 2. Data များကို localStorage ထဲ သိမ်းဆည်းခြင်း
  saveBookingData() {
    const bookingData = {
      package: this.selectedPackage, // .image, .title, .price, .duration များပါဝင်ရမည်
      travelerInfo: this.form,      // .name, .email, .travelers, .date များပါဝင်ရမည်
      totalAmount: this.totalPrice
    };
    localStorage.setItem('booking_data', JSON.stringify(bookingData));
  },

  // 3. Validation စစ်ဆေးခြင်း
  validateForm() {
    this.errors = {};
      if (!this.form.name) this.errors.name = 'Full name is required';
      
      if (Object.keys(this.errors).length === 0) {
        // Proceed to payment (update route as per your project)
        this.$router.push('/payment');
      }
  },

  // 4. Button နှိပ်သည့်အခါ ခေါ်မည့် Function
  proceedToPayment() {
    this.validateForm();
  }
}
  };


   /*props: {},
  mounted: function() {},
  
  watch: {},
  components: {}*/

</script>
<style scoped>
.checkout-container { max-width: 1000px; margin: 40px auto; padding: 20px; font-family: sans-serif; }
.checkout-layout { display: flex; 
  gap: 30px; 
  align-items: flex-start; }
.form-section { flex: 70%; background: #fff; padding: 30px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
/* Summary Section Styling */
.summary-section {
  flex: 1; /* Layout အချိုးကို ချိန်ညှိရန် */
  min-width: 300px;
}

.summary-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden; /* ပုံကို ထောင့်ဝိုင်းအောင် လုပ်ပေးသည် */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); /* ပိုမိုနက်ရှိုင်းသော Shadow */
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px); /* Hover လုပ်ရင် အနည်းငယ်တက်လာမည် */
}

.package-img {
  width: 100%;
  height: 220px;
  object-fit: cover; /* ပုံမပျက်အောင် ဖြတ်ညှိပေးသည် */
}

.card-body {
  padding: 24px;
}

.card-body h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.card-body p {
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

/* Price Rows */
.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 1rem;
  color: #374151;
}

hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
}

/* Total Amount Styling */
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  color: #16a34a; /* အစိမ်းရောင်ဖြင့် Highlight လုပ်သည် */
  font-weight: 700;
}
.page-wrapper { max-width: 800px; margin: 0 auto; padding: 20px; }
/* Stepper Layout */
.stepper-container { 
 
  display: flex; 
  justify-content: center; 
  margin: 40px 0; 
}

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
/* Form Elements */
.form-group { margin-bottom: 15px; width: 100%; }
.form-row { display: flex; gap: 15px; }
input, select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
.btn-submit { background: #16A34A; color: white; padding: 15px; border: none; border-radius: 8px; cursor: pointer; width: 100%; }

/* Summary Card */
.summary-card { background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
.summary-card img { width: 100%; height: 200px; object-fit: cover; }
.card-body { padding: 20px; }
.price-row, .total-row { display: flex; justify-content: space-between; margin: 10px 0; }
.total-row { color: #16A34A; font-size: 1.2rem; }

@media (max-width: 768px) { .checkout-layout { flex-direction: column; } }
</style>

""