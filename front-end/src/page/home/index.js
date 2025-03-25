import './style.scss'
import HeaderTop from "../../components/headers/HeaderTop"
import CategoryMain from "../../components/category/CategoryMain"
import SectionTrending from "../../components/sections/SectionTrending"
export default function Home() {
  return (
    <div className='page-home'>
      <div className="container">
        <div className="header">
          <HeaderTop />
        </div>
        <div className="category-main">
          <CategoryMain />
        </div>
        <div className="section-trending">
          <SectionTrending />
        </div>
      </div>
    </div>
  );
}