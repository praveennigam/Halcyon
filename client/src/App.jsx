import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import Providers from './components/Providers';
import AllVisitsPage from './pages/AllVisitsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BookPage from './pages/BookPage';
import MissingPage from './pages/MissingPage';

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<BookPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/admin/list" element={<AllVisitsPage />} />
            <Route path="*" element={<MissingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
