import { Component } from "react";
import './VictoryControl.css';
export default class VictoryControl extends Component{

    //este componente muestra quién ganó la partida, si alguien la ganó. Recibe el ganador del state del componente padre y lo toma
    //como state propio.
    //además, recibe el número total de partidas y victorias del jugador para mostrarlas.
    constructor(props){
        super(props);
        this.state = {winner:props.winner, victories: props.victories, totalMatches: props.totalMatches};
    }

//para que se actualice en tiempo real al haber un ganador, se utiliza este ciclo de vida. Comprueba al actualizarse el componente
//si el valor de cada prop cambió, y en ese caso las actualiza.
componentDidUpdate(){
if((!(this.props.winner === this.state.winner)) || !(this.props.totalMatches === this.state.totalMatches)){
this.setState({winner: this.props.winner, victories: this.props.victories, totalMatches: this.props.totalMatches});
}
}

//muestra tres divs distintos en función de la existencia de un ganador y la identidad del mismo.
    render(){
        if(this.state.winner && this.state.winner !== 'tied'){
        return(
            <div id="victory-control2">
                <p>WINNER IS {this.state.winner} !!</p>
            </div>
        )
        }else if(this.state.winner && this.state.winner === 'tied'){
            return(
                <div id="victory-control">
                    <p>The fierce battle ended in a tie.</p>
                </div>
            )
        }
        else{
            return(
            <div id="victory-control">
            <p>The winner has yet to be decided.</p>
            <p>Out of {this.state.totalMatches} matches you have won {this.state.victories} of them</p>
            <button id="resetStats" onClick={this.props.resetStats}>Reset game stats</button>
        </div>
            );
        }
    }
}