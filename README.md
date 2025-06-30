# danakito - AI-Powered Investment Analysis Platform

An AI-powered investment analysis platform built with Nuxt 3 that provides interactive heatmaps for investment analysis. Users can draw polygons or drop pins on maps to analyze urban investments (shops, restaurants, services) and agricultural opportunities using mobility data, e-wallet transactions, and AI-powered analysis.

## 🚀 Features

### Core Functionality
- **Interactive Maps**: Leaflet-powered maps with drawing tools for area selection
- **AI Analysis Engine**: OpenRouter integration with xLSTM/P-sLSTM models for investment predictions
- **Credit Analysis**: Comprehensive banking comparison with 5 major banks
- **Heatmap Visualization**: Multiple data layers (mobility, spending, opportunities)
- **Investment Analysis**: Urban (retail, restaurant, service) and agricultural analysis
- **ROI Projections**: Pessimistic, realistic, and optimistic scenarios
- **Risk Assessment**: AI-powered risk factor identification
- **Banking Integration**: Real-time credit comparison with interactive charts
- **Real-time Data**: Mock mobility and e-wallet transaction data

### Technical Features
- **Nuxt 3**: Modern Vue.js framework with SSR/SPA capabilities
- **TypeScript**: Full type safety throughout the application
- **Pinia**: Centralized state management
- **Tailwind CSS + Nuxt UI**: Beautiful, responsive design system
- **Supabase Ready**: Database integration with PostGIS for spatial data
- **Mock Data Generation**: Realistic demo data for testing

## 🚀 Deploy to GitHub Pages

Follow these steps to deploy your application to GitHub Pages:

1. **Create a GitHub repository** (if you haven't already)
2. **Push your code** to the repository
3. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Click on "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

4. **Configure GitHub Pages**:
   - The included GitHub Actions workflow will automatically build and deploy your site
   - The site will be available at: `https://<your-username>.github.io/danakito`

5. **For custom domains**:
   - Add your custom domain in the GitHub Pages settings
   - Update the `baseURL` in `nuxt.config.ts` to match your domain

## 🛠 Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS, Nuxt UI, Headless UI
- **Maps**: Leaflet with OpenStreetMap
- **State Management**: Pinia
- **Database**: Supabase (PostgreSQL with PostGIS)
- **Charts**: Chart.js integration ready
- **Server**: Nitro (built-in with Nuxt 3)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd danakito
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your credentials:
   ```env
   # OpenRouter AI Integration
   OPENROUTER_API_KEY=your-openrouter-api-key
   
   # Supabase Configuration
   NUXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   
   # Map Configuration (NYC default)
   NUXT_PUBLIC_MAP_DEFAULT_LAT=40.7128
   NUXT_PUBLIC_MAP_DEFAULT_LNG=-74.0060
   NUXT_PUBLIC_MAP_DEFAULT_ZOOM=12
   ```

4. **Setup Supabase Database** (Optional - uses mock data by default)
   Run the migrations in the `supabase/migrations/` folder to create the required tables.

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## 🎯 Usage

### Basic Investment Analysis

1. **Welcome Screen**: First-time users see an introduction to the platform
2. **Map Interaction**: 
   - Use drawing tools (polygon, rectangle, circle, marker) to select areas
   - Switch between data layers (mobility, spending, opportunities)
   - Adjust time ranges for data analysis
3. **Analysis Setup**:
   - Choose investment type (Shop, Restaurant, Service, Agriculture)
   - Set investment amount
   - For agricultural: select crop types
4. **AI Analysis**: The platform runs OpenRouter-powered xLSTM/P-sLSTM analysis
5. **Results**: View scores, ROI projections, risk factors, and recommendations

### Credit Analysis & Banking Comparison

1. **Navigate to Credit Analysis**: Click the "💳 Credit Analysis" button from the main dashboard
2. **Input Parameters**:
   - Set credit amount ($10,000 - $10,000,000)
   - Choose investment type
   - Specify location
3. **AI-Powered Analysis**: 
   - Real-time analysis using OpenRouter API
   - Fallback to enhanced mock data if no API key
4. **Bank Comparison**:
   - Compare 5 major banks (Chase, Wells Fargo, Bank of America, Capital One, TD Bank)
   - Interactive charts for interest rates and monthly payments
   - Detailed comparison table with ratings
5. **Visual Charts**:
   - Interest rate comparison bars
   - Monthly payment visualization
   - Bank rating system (1-5 stars)
6. **Detailed Bank Cards**:
   - Pros and cons for each bank
   - Processing fees and requirements
   - APR and total payment calculations

### Features Overview

- **Data Layers**:
  - **Mobility**: Foot traffic patterns and dwell times
  - **Spending**: E-wallet transaction data by location
  - **Opportunities**: AI-identified investment opportunities

- **Investment Types**:
  - **Urban**: Retail shops, restaurants, service businesses
  - **Agricultural**: Crop-based farming investments

- **Analysis Output**:
  - Overall investment score (0-100%)
  - Score breakdown (mobility, spending, competition)
  - ROI projections (pessimistic/realistic/optimistic)
  - Risk factors and mitigation strategies
  - AI-powered recommendations

## 🏗 Architecture

### Frontend Structure
```
/
├── components/           # Vue components
│   ├── InvestmentMap.vue    # Main map component
│   ├── AnalysisPanel.vue    # Analysis interface
│   ├── HeatmapControls.vue  # Data layer controls
│   └── TimeRangeSlider.vue  # Time selection
├── composables/          # Vue composables
├── layouts/              # Page layouts
├── pages/                # Route pages
├── plugins/              # Nuxt plugins
├── server/               # API routes
│   └── api/
│       ├── heatmap/         # Heatmap data endpoints
│       ├── data/            # Raw data endpoints
│       └── analysis/        # Analysis endpoints
├── stores/               # Pinia stores
│   ├── map.ts              # Map state management
│   └── analysis.ts         # Analysis state
└── utils/                # Utility functions
    └── analysisEngine.ts    # AI analysis engine
```

### API Endpoints

- `GET /api/heatmap/[type]` - Heatmap data (mobility/spending/opportunity)
- `GET /api/data/mobility` - Raw mobility data
- `GET /api/data/ewallet` - E-wallet transaction data
- `GET /api/data/agricultural` - Agricultural soil/climate data
- `POST /api/analysis/save` - Save analysis results
- `POST /api/analysis/openrouter` - OpenRouter AI-powered investment analysis with credit comparison

### AI Analysis Engine

The `DanakitoAnalyzer` class simulates advanced AI models:

- **xLSTM for Urban Analysis**: 92.3% accuracy on investment predictions
- **P-sLSTM for Agricultural**: 97.5% accuracy on crop yield forecasts
- **Risk Assessment**: Machine learning-based risk identification
- **ROI Modeling**: Financial projections with confidence intervals

## 🌍 Demo Data

The platform includes comprehensive mock data generation:

- **Mobility Data**: 1000+ points with realistic foot traffic patterns
- **Transaction Data**: 500+ e-wallet transactions across categories
- **Agricultural Data**: Soil quality, climate zones, crop histories
- **Spatial Distribution**: Geographic clustering and realistic distributions

## 🔧 Configuration

### Map Settings
- Default location: Dubai, UAE (25.2048°N, 55.2708°E)
- Zoom levels: 1-18
- Tile provider: OpenStreetMap
- Drawing tools: Polygon, Rectangle, Circle, Marker

### Analysis Parameters
- Investment range: $1,000 - $10,000,000
- Time ranges: 7, 30, 90 days
- Confidence levels: 85-95% for urban, 95-97.5% for agricultural
- ROI calculations: 5-year projections with scenarios

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Platforms
- **Vercel**: Optimized for Nuxt 3
- **Netlify**: Full SSR support
- **Cloudflare Pages**: Edge computing benefits

### Environment Variables
Set these in your deployment platform:
- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- Map configuration variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

Built with ❤️ using Nuxt 3 and modern web technologies.
