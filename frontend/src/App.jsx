import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';


import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel';


export default function App () {
return (
  <>
  <Router>
    <Routes>
          <Route path = "/" element ={<HomePage />}/>

          <Route path = "/admin" element ={<AdminPanel />}/>
    </Routes>
    </Router>
  </>
)

}


