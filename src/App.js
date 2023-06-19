import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Conecta4Full from './conecta3/fullpage/Conecta4Full';

function App() {
  return (
   <Router>
    <Routes>
      <Route path='/' element={<Conecta4Full />}></Route>
    </Routes>
   </Router>
  );
}

export default App;
