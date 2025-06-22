import reactLogo from './assets/react.svg';
import './app.css';
import { SideBarButton, sideBarButtonPath } from './components/layout';

import { BrowserRouter, Outlet } from 'react-router-dom';

import { AuthChecker } from './AuthChecker';






export const MainLayout = () => (
    <div>
        <div style={{ position: 'fixed', top: '-15px', left: '-17px', zIndex: 100 }}> {/* */}
            <img src={reactLogo} className="logo react" alt="React logo" style={{ width: '290px', height: '160px' }} />
        </div>
        <SideBarButton buttons={sideBarButtonPath} />
        <main style={{ marginLeft: '270px' }}>
            <Outlet />
        </main>
    </div>
);

const App = () => {
    return (
        <BrowserRouter>
            <AuthChecker />
        </BrowserRouter>
    );
}

export default App;