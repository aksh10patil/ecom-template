import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/Context';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel';


export default function App () {
return (
  <>
  <Router>
    <Routes>
          <Route path = "/" element ={<HomePage />}/>

          <Route path="/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
    </Routes>
    </Router>
  </>
)

}


