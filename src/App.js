import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Conecta4Full from './conecta3/fullpage/Conecta4Full';
import Conecta3 from './tableroUnicoComponente/Conecta3';
import HeaderAll from './header/Header';

function App() {
  return (
   <Router>
    <HeaderAll />
    <Routes>
      <Route path='/unComp' element={<Conecta3 />}></Route>
      <Route path='/' element={<Conecta4Full />}></Route>
    </Routes>
   </Router>
  );
}

export default App;
