import CategoriesV from '../../page/category/index'

export const metadata = {
  title: 'Danh mục | B&Q Watches',
  description: 'Quản lý danh mục',
}

export default function CategoriesVPage(props) {
  return (
    <div className='app'>
      <CategoriesV {...props}/>
    </div>
  );
}


