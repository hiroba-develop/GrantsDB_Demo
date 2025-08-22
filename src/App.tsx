import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Subsidies from './pages/Subsidies';
import SubsidyDetail from './pages/SubsidyDetail';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import SubsidiesArchive from './pages/SubsidiesArchive';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const basename = import.meta.env.BASE_URL;

  return (
    <AuthProvider>
      <Router basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/subsidies" element={<Subsidies />} />
                  <Route path="/subsidies/archive" element={<SubsidiesArchive />} />
                  <Route path="/subsidies/:id" element={<SubsidyDetail />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
