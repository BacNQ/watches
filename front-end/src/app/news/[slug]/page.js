import NewsPage from '../../../page/news/index';
import { getNewsDetail } from '../../../services/common';

export default async function NewsDetail({ params }) {
  const { slug } = await params;
  const news = await getNewsDetail(slug);
  return <NewsPage params={params} news={news?.data} />
}
