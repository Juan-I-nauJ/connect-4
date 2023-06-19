import {Link} from 'react-router-dom';
import './Header.css';

export default function HeaderAll(){
    return (
        <div id="headerAll">
        <ul>
      
            <Link to='/unComp'>Conecta 4 1 componente</Link>
            <Link to='/'>Conecta 4 Full</Link>

        

        </ul>
        </div>
    )
}