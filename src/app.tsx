import './app.css';
import { SideBarButton, sideBarButtonPath } from './components/layout';

import { BrowserRouter, Outlet } from 'react-router-dom';

import { AuthChecker } from './AuthChecker';






export const MainLayout = () => (
    <div>
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