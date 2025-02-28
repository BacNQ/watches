import HeaderTop from "../../components/headers/HeaderTop"
import CategoryMain from "../../components/category/CategoryMain"
export default function Home() {
    return (
      <div className='page-home'>
        <div className="header">
          <HeaderTop/>
        </div>
        <div className="category-main">
          <CategoryMain/>
        </div>
      </div>
    );
  }