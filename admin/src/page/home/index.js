import './style.scss'
import Dashboard from '../../components/dashboard/index'

export default function Home() {
    return (
        <div className='page-home'>
            <div className="container">
                <div className='dashboard'>
                    <Dashboard />
                </div>
            </div>
        </div>
    );
}