<template>
<div class="marketplace-wrapper">
  <header class="header-section">
  <div class="search-bar">
        <input type="text" placeholder="Search packages or destinations..." v-model="searchQuery" />
        
          <select v-model="sortOption" class="sort-select">
  <option value="">Sort By Price</option>
  <option value="low">Lowest Price</option>
  <option value="high">Highest Price</option>
</select>
          

        
        <button class="filter-btn">Filters</button>
      </div>

      <div class="pill-filters">
        <button 
          v-for="cat in categories" 
          :key="cat" 
          @click="selectedCategory = cat"
          :class="['cat-btn', { active: selectedCategory === cat }]"
        >
          {{ cat }}
        </button>
      </div>

      <main class="package-grid">
        <div v-for="pkg in filteredPackages" :key="pkg.id" class="card">
        <div class="img-wrapper">
          <img :src="pkg.image" :alt="pkg.title" />
          <span class="badge">{{ pkg.category }}</span>
          
        </div>
        <div class="card-content">
          <h3>{{ pkg.title }}</h3>
          <div class="meta">
            <span>🕒 {{ pkg.days }} Days</span>
            <span>📍 {{ pkg.location }}</span>
            <span>👥 {{ pkg.pax }}</span>
          </div>
          <div class="price-section">
            <div>
              
              <p class="current-price">{{ pkg.price }}Ks<small>/person</small></p>
            </div>
            <div class="actions">
            <button class="btn-details">Details</button>
            
          </div>
          </div>
        </div>
      </div>
      </main>
      </header>
</div>
</template>
<script>
export default {
  data() {
    return {
      searchQuery: '',
      sortOption: '',
      selectedCategory: 'All',
      categories: ['All', 'China', 'Thailand', 'Singapore', 'Japan'],
      packages: [
        
  // Thailand
  {
    id: 1,
    title: 'Bangkok Retail Therapy & Street Food Tour',
    category: 'Thailand',
    days: '4 Days / 3 Nights',
    location: 'Bangkok, Thailand',
    pax: '2 - 12 People',
    price: 1650000,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    title: 'Bangkok & Pattaya Family Fun Vacation',
    category: 'Thailand',
    days: '5 Days / 4 Nights',
    location: 'Bangkok, Pattaya, Thailand',
    pax: '2 - 10 People',
    price: 2550000,
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    title: 'Phuket Ultra-Luxury Private Pool Villa Escape',
    category: 'Thailand',
    days: '5 Days / 4 Nights',
    location: 'Phuket, Thailand',
    pax: '2 - 4 People (Private)',
    price: 4450000,
    image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=400&q=80'
  },

  // Japan
  {
    id: 4,
    title: 'Tokyo & Mount Fuji Adventure',
    category: 'Japan',
    days: '5 Days / 4 Nights',
    location: 'Tokyo, Japan',
    pax: '2 - 6 People',
    price: 3250000,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    title: 'Kyoto Cultural Experience',
    category: 'Japan',
    days: '4 Days / 3 Nights',
    location: 'Kyoto, Japan',
    pax: '2 - 8 People',
    price: 2450000,
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 6,
    title: 'Osaka City Discovery',
    category: 'Japan',
    days: '6 Days / 5 Nights',
    location: 'Osaka, Japan',
    pax: '2 - 10 People',
    price: 3550000,
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=400&q=80'
  },

  // China
  {
    id: 7,
    title: 'Shanghai City Highlights & Street Food Explorer',
    category: 'China',
    days: '4 Days / 3 Nights',
    location: 'Shanghai, China',
    pax: '2 - 12 People',
    price: 1950000,
    image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 8,
    title: 'Shanghai & Suzhou Cultural Discovery',
    category: 'China',
    days: '5 Days / 4 Nights',
    location: 'Shanghai, Suzhou, China',
    pax: '2 - 10 People',
    price: 2950000,
    image: 'https://images.unsplash.com/photo-1538428494232-9c0f8a0ab403?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 9,
    title: 'Shanghai Luxury Skyline & VIP Experience',
    category: 'China',
    days: '5 Days / 4 Nights',
    location: 'Shanghai, China',
    pax: '2 - 4 People (Private)',
    price: 4850000,
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80'
  },

  // Singapore
  {
    id: 10,
    title: 'Singapore City Escape',
    category: 'Singapore',
    days: '4 Days / 3 Nights',
    location: 'Singapore',
    pax: '2 - 12 People',
    price: 2850000,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 11,
    title: 'Singapore Adventure Experience',
    category: 'Singapore',
    days: '5 Days / 4 Nights',
    location: 'Singapore',
    pax: '2 - 10 People',
    price: 3850000,
    image: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 12,
    title: 'Singapore Prestige Escape',
    category: 'Singapore',
    days: '5 Days / 4 Nights',
    location: 'Singapore',
    pax: '2 - 4 People (Private)',
    price: 6550000,
    image: 'https://images.unsplash.com/photo-1496939376851-89342e90adcd?auto=format&fit=crop&w=400&q=80'
  },
]
      
    };
  },
  methods: {
    setCategory(cat) {
      this.selectedCategory = cat;
    }

    
  },
  computed: {
    filteredPackages() {
      let filtered = this.packages;
       if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(
        item => item.category === this.selectedCategory
      );
    }

     if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();

      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    if (this.sortOption === 'low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'high') {
      filtered.sort((a, b) => b.price - a.price);
    }
return filtered;
    }
  }
};
   /*props: {},
  mounted: function() {},
  
  watch: {},
  components: {}
};*/
</script>
<style scoped>

.filter-btn{border-radius: 50px; border: 2px solid #eceff6; background: white; color: black; cursor: pointer;padding: 12px; }

.cat-btn{border-radius: 50px; border: 2px solid #eceff6; background: white; color: black; cursor: pointer;padding: 12px;}
.cat-btn.active {
  background-color: #2563EB;
  color: white;
  border-color: #2563EB;
  font-weight: bold;
}
cat-btn:hover {
  background-color: #2563EB;
  color: white;
}

.sort-select{border-radius: 50px; border: 2px solid #eceff6; background: white; color: black; cursor: pointer;padding: 12px;justify-content: center;}
.marketplace-wrapper { background: #F4F7FC; min-height: 100vh; padding: 40px 5%; }

/* Header & Search */
.search-bar { display: flex; gap: 12px; max-width: 900px; margin: 0 auto 30px; }
.search-bar input { flex: 1; padding: 15px 20px; border-radius: 16px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.pill-filters { display: flex; gap: 10px; justify-content: center; overflow-x: auto; padding-bottom: 10px;border-radius: 30%; }
.pill { padding: 8px 24px; border-radius: 50px; border: none; background: white; cursor: pointer; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.pill.active { background: #2563EB; color: white; }

/* Responsive Grid */
.package-grid { 
  display: grid; gap: 24px; 
  grid-template-columns: repeat(3, 1fr); 
}
@media (max-width: 1024px) { .package-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .package-grid { grid-template-columns: 1fr; } }

/* Cards */
.card { background: white; border-radius: 16px; overflow: hidden; transition: 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.card:hover { transform: translateY(-10px); box-shadow: 0 20px 25px rgba(0,0,0,0.1); }
.img-wrapper { height: 200px; position: relative; }
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.badge { position: absolute; top: 15px; left: 15px; background: rgba(255,255,255,0.9); padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; }

/* Card Body */
.card-content { padding: 20px; }
.meta { display: flex; gap: 15px; font-size: 0.85rem; color: #64748b; margin-bottom: 15px; }
.price-section { display: flex; align-items: baseline; gap: 10px; margin-bottom: 20px; }
.old-price { text-decoration: line-through; color: #94a3b8; font-size: 0.9rem; }
.current-price { font-size: 1.4rem; font-weight: 700; color: #2563EB; }

/* Buttons */
.actions { display: flex; gap: 10px; }
.btn-details { flex: 1; padding: 12px; border-radius: 50px; border: 2px solid #2563EB; background: white; color: #2563EB; cursor: pointer; }
.btn-details:hover{ box-shadow: 0 20px 25px rgba(0,0,0,0.1);background-color: #2563EB;color: white; }
.btn-book { flex: 1; padding: 12px; border-radius: 50px; border: none; background: #2563EB; color: white; cursor: pointer; }
</style>

""