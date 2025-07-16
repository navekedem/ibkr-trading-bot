import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './components/AppLayout/AppLayout';
import { ChartsPage } from './pages/ChartsPage';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { ScannerPage } from './pages/ScannerPage';

const RouterContent = () => {
    const { pathname } = useLocation();

    return (
        <Routes>
            <Route path="/" element={pathname === '/' ? <LoginPage /> : <AppLayout />}>
                <Route path="/charts" element={<ChartsPage />} />
                <Route path="/overview" element={<OverviewPage />} />
                <Route path="/scanner" element={<ScannerPage />} />
            </Route>
        </Routes>
    );
};

export const Router = () => {
    return (
        <BrowserRouter>
            <RouterContent />
        </BrowserRouter>
    );
};
