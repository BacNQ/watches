import NewsV from '../../page/news/index'

export const metadata = {
  title: 'Bài viết | B&Q Watches',
  description: 'Quản lý bài viết',
}

export default function NewsPage(props) {
  return (
    <div className='app'>
      <NewsV {...props}/>
    </div>
  );
}


