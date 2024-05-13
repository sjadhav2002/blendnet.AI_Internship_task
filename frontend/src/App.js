import './App.css';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home/home';
import SignUp from './Pages/Login+SignUp/signup';
import Login from './Pages/Login+SignUp/login';
import Dashboard from './Pages/Dashboard/dashboard';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/dashboard" exact element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
