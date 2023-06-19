import React from "react";
import { Component } from "react";
import './Tablero.css';

//este componente solamente tiene el tablero del juego.
//recibe la función del evento onClick y un ref para utilizar en el cuerpo de la tabla.
export default class Tablero extends Component{

constructor(props){
    super(props);
}

//esta función pone el tablero en blanco, para resetear la partida en curso. Recoge todas las celdas en un array y las itera borrando
//las clases que representan fichas de cada una.
resetBoard = () => {
  let arregloCeldas = document.querySelectorAll('td');
  arregloCeldas.forEach(element => {element.classList.remove('p1'); element.classList.remove('p2')});
    
  }


render(){
    //aqui la tabla es renderizada dinámicamente. Primero utilizamos Array.from para crear y llenar un array inmediatamente.
    //el objeto cuya propiedad es 'length' ya da el tamaño que tendra el array, que lo saca de props. La siguiente función es de mapeado
    //similar a un .map para devolver un objeto html por cada posición en el array.
    //Dentro de cada tr de este array hay otro anidado con características similares que crea las celdas.
    let tableBody = Array.from({ length: this.props.rows }, (element, rowIndex) => (
        <tr key={rowIndex + 1}>
          {Array.from({ length: this.props.cells }, (_, cellIndex) => (
            <td key={cellIndex}></td>
          ))}
        </tr>
      ));
   




    return (
      
            <main>
              <button id="resetBoard" onClick={this.resetBoard}>Reset board state</button>
            <table id="conecta-4-tabla"  >
                <tbody ref={this.props.tableRef} onClick={this.props.paintColumn}>
                    {/* tableBody pone la cantidad de trs y tds dados por el componente padre. */}
                    {tableBody}

    </tbody>
</table>
            </main>
  
    )
}

}






