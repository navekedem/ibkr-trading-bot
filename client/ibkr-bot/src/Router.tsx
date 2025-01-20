import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout/AppLayout';
import { ChartsPage } from './pages/ChartsPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';

export const Router = () => {
    const pathname = window.location.pathname;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={pathname === '/' ? null : <AppLayout />}>
                    <Route index element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/charts" element={<ChartsPage />} />
                    <Route path="/overview" element={<OverviewPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
