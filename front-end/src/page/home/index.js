import './style.scss'
import CategoryMain from "../../components/category/CategoryMain"
import SectionTrending from "../../components/sections/SectionTrending"
import WatchStyle from "../../components/sections/WatchStyle"
import LuxuryCollection from "../../components/sections/LuxuryCollection"
import LuxuryWatches from "../../components/sections/LuxuryWatches"
import FeaturedBrand from "../../components/sections/FeaturedBrand"
import HistoryProduct from "../../components/sections/HistoryProduct"
import News from "../../components/sections/News"
export default function Home() {
  return (
    <div className='page-home'>
      <div className="container">
        <div className="category-main">
          <CategoryMain />
        </div>
        <div className="section-trending mt-3">
          <SectionTrending />
        </div>
        <div className="section-styles">
          <WatchStyle />
        </div>
        <div className="section-brand">
          <FeaturedBrand />
        </div>
        <div className="section-luxury-collection">
          <LuxuryCollection />
        </div>
        <div className="section-luxury-watches">
          <LuxuryWatches />
        </div>
        <div className="section-history">
          <HistoryProduct />
        </div>
        <div className="section-news">
          <News />
        </div>
      </div>
    </div>
  );
}