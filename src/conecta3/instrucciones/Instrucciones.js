import { Component } from 'react';
import './Instrucciones.css';
export default class Instrucciones extends Component{

    //este componente muestra unas breves instrucciones antes de empezar la partida. Utiliza el state 'gameStarted' recibido de props
    //para saber si debe empezar ya o no.
constructor(props){
    super(props);
    this.state = {gameStarted: this.props.gameStarted};
}

//comprueba si 'gameStarted' cambió en el state del componente padre, y lo actualiza en ese caso.
componentDidUpdate(){
    if(!(this.props.gameStarted === this.state.gameStarted)){
    this.setState({gameStarted: this.props.gameStarted});
    }
    }


    render(){
    return(
        <article id="articuloInstrucciones">
            <header>
                <h1>Conecta 4:</h1>
            </header>
            <main><p>El objetivo del juego es conseguir poner cuatro fichas adyacentes en el tablero</p>
            <p>Valen:</p>
            <ol>
                <li>En horizontal</li>
                <li>En vertical</li>
                <li>En diagonal</li>
            </ol>
            {/* el evento de este botón se recibe de props, sencillamente cambia el estado para comenzar la partida */}
            <button onClick={this.props.startGame}>Comenzar</button>
            </main>
        </article>
    )
    }
}