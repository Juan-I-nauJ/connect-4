import React from "react";
import { Component } from "react";
import './Conecta3.css';

//si hay dudas al respecto, se llama conecta3 porque es la tercera vez que intento montar esto
export default class Conecta3 extends Component{


constructor(){
    //el state mantiene detalles de la partida y sus jugadores, el ref maneja la tabla y se puede pasar 
    //a componentes padres llegado el caso mediante ref forwarding..
    super();
    this.state = {player: 'player1',  winner: null};
    this.tableRef = React.createRef();

}
//esta función maneja los eventos de click sobre la tabla, pintando las celdas según la columna pulsada de abajo hacia arriba.
paintColumn = (e) => {
    this.setState({...this.state.winner, player: (this.state.player === 'player1' ? 'player2' : 'player1') });
    let currentPlayer = this.state.player === 'player1' ? 'player1' : 'player2';
    console.log('the player is: ', this.state.player);
    //esta variable encuentra la posicion en el indice del row de la celda pulsada. Puesto que todas las propiedades de la tabla son
    //objetos, se haya el índice buscando la clave (que es un número similar al de un índice) a través de su valor.
let indexInRow = Object.keys(e.target.parentElement.children).find(key => e.target.parentElement.children[key] === e.target);
     //esta variable encuentra la posición en el array de rows de la tabla de la fila pulsada
// console.log('this cell is index '+indexInRow+' in the row '+ row);
    //este loop itera los rows de la tabla mediante la variable i e intenta pintar el indice sacado anteriormente de la posición
     //de la celda pulsada. Trata de pintar desde abajo hasta arriba, subiendo un nivel si la celda elegida ya tiene la clase p1 o p2.
      //en caso de haberse declarado un ganador, no se ejecuta.
if(!this.state.winner){
for(let i = 6; i > -1; i--){
if(!this.tableRef.current.children[i].children[indexInRow].classList.contains('p1') &&
!this.tableRef.current.children[i].children[indexInRow].classList.contains('p2')){
    this.tableRef.current.children[i].children[indexInRow].classList.add(this.state.player === 'player1' ? 'p1' : 'p2');
    //comprueba si hay un ganador mediante la siguiente función. Si hay victoria, asigna el ganador al jugador en cuyo turno estamos.
    //si no, la propiedad de state winner sigue en null.
    this.setState({...this.state.player, winner: this.checkWinner(this.tableRef.current.children[i].children[indexInRow], indexInRow) ? currentPlayer : null}); 
    break;
}
}
}
}

//esta es una función intermediaria que comprueba si hay alguien que haya conseguido 4 seguidas horizontal, vertical o diagonal 
// llamando a funciones específicas por cada uno. Se utiliza el || para evitar comprobaciones redundantes si alguna de las
//anteriores ya dio un ganador.
checkWinner = (paintedCell, indexInRow) => {
  return this.checkWinnerHorizontal(paintedCell) || this.checkWinnerVertical(paintedCell, indexInRow) 
  || this.checkWinnerDiagonalLeft(paintedCell, indexInRow) || this.checkWinnerDiagonalRight(paintedCell, indexInRow);

}

checkWinnerHorizontal = (paintedCell) =>{
    //comprobación en lateral.
    //hay una variable para ver que color estamos comprobando, otra para contar cuanto para ganar y otras dos para comprobar derecha
    //e izquierda.
let checkClass = this.state.player === 'player1' ? 'p1' : 'p2';
console.log('la celda es', paintedCell);
let countWin = 1;
let toTheRight = paintedCell;
let toTheLeft = paintedCell;

//comprueba si hay mas celdas en el mismo row y si tienen el mismo color, de ser asi aumenta el contador para ganar y la variable
//utilizada para señalar a la celda pasa a señalar a la recien comprobada. En caso contrario, rompe el loop y pasa al siguiente.
while(toTheRight.nextSibling && countWin < 4){
    if(toTheRight.nextSibling.classList.contains(checkClass)){
        countWin++
        toTheRight = toTheRight.nextSibling;

    }else{
        break;
    }
}
//exactamente lo mismo, pero hacia la izquierda, utilizando previousSibling. La variable de contador de victoria se mantiene entre ambos.
while(toTheLeft.previousSibling && countWin < 4){
    if(toTheLeft.previousSibling.classList.contains(checkClass)){
        countWin++
        toTheLeft = toTheLeft.previousSibling;

    }else{
        return false;
    }
}
//al final esto devuelve true si hubo 4 seguidas con la misma clase o false en caso contrario.
return countWin >= 4; 

}

checkWinnerVertical = (paintedCell, indexInRow)=>{
    //similar a la funcion horizontal, pero en la misma columna. Por lo que iteraremos el parentElement y los siblings de este.
    //recibe el indice de la celda que estamos comprobando para facilitar las cosas, de otro modo habría que extraerla antes de la
    //celda recibida.
    
    let checkClass = this.state.player === 'player1' ? 'p1' : 'p2';
    let countWin = 1;
    let goingUp = paintedCell.parentElement;
    let goingDown = paintedCell.parentElement;
    
    while(goingDown.nextSibling && countWin < 4){
        if(goingDown.nextSibling.cells[indexInRow].classList.contains(checkClass)){
            countWin++
            goingDown = goingDown.nextSibling;
    
        }else{
            break;
        }
    }
    //exactamente lo mismo, pero hacia la izquierda, utilizando previousSibling. La variable de contador de victoria se mantiene entre ambos.
    while(goingUp.previousSibling && countWin < 4){
        if(goingUp.previousSibling.cells[indexInRow].classList.contains(checkClass)){
            countWin++
            goingUp = goingUp.previousSibling;
    
        }else{
            return false;
        }
    }
    return countWin >= 4; 

}
//aqui queremos comprobar si hay victoria en diagonal de izquierda a derecha (arriba a abajo) por lo que combinamos las dos anteriores.
//Se utiliza goingUp para ascender de row con el parentComponent y goingLeft para mover el indice recibido de la celda pulsada
//hacia la izquierda, de modo que se comprueba la diagonal superior izquierda y luego goingDown y goingRight para hacer su opuesto.
checkWinnerDiagonalLeft = (paintedCell, indexInRow)=>{
    let checkClass = this.state.player === 'player1' ? 'p1' : 'p2';
    let countWin = 1;
    let goingUp = paintedCell.parentElement;
    let goingRight = indexInRow;
    let goingLeft = indexInRow;
    let goingDown = paintedCell.parentElement;

while(goingDown.nextSibling && countWin < 4){
    if(goingDown.cells[goingRight].nextSibling){

    ++goingRight;
    }
if(goingDown.nextSibling.cells[goingRight] && goingDown.nextSibling.cells[goingRight].classList.contains(checkClass)){
    countWin++
    goingDown = goingDown.nextSibling;
}else{
    break;
}
}

while(goingUp.previousSibling && countWin < 4){
    if(goingUp.cells[goingLeft].previousSibling){

    --goingLeft;
    }
if(goingUp.previousSibling.cells[goingLeft] && goingUp.previousSibling.cells[goingLeft].classList.contains(checkClass)){
    countWin++
    goingUp = goingUp.previousSibling;
}else{
    break;
}
}
return countWin >= 4; 
    };

//exactamente como la anterior, pero en espejo.
checkWinnerDiagonalRight = (paintedCell, indexInRow) => {
    let checkClass = this.state.player === 'player1' ? 'p1' : 'p2';
    let countWin = 1;
    let goingDown = paintedCell.parentElement;
    let goingRight = indexInRow;
    let goingLeft = indexInRow;
    let goingUp = paintedCell.parentElement;

    while(goingUp.previousSibling && countWin < 4){
        if(goingUp.cells[goingRight].nextSibling){
            ++goingRight;
        }

    if(goingUp.previousSibling.cells[goingRight] && goingUp.previousSibling.cells[goingRight].classList.contains(checkClass)){
        countWin++
        goingUp = goingUp.previousSibling;
    }else{
        break;
    }
}

while(goingDown.nextSibling && countWin < 4){
    if(goingDown.cells[goingLeft].previousSibling){
        
        --goingLeft;
        }
if(goingDown.nextSibling.cells[goingLeft] && goingDown.nextSibling.cells[goingLeft].classList.contains(checkClass)){
    countWin++
    goingDown = goingDown.nextSibling;
}else{
    break;
}
}
return countWin >= 4; 
    };


showThis(e){
    //esta linea muestra en que celda está el elemento pulsado, de 0 a 5.
// console.log(Object.keys(e.target.parentElement.children).find(key => e.target.parentElement.children[key] === e.target));

//esta otra linea muestra qué celda fue pulsada y en qué row se encuentra.
// console.log(e.target, e.target.parentElement);
}
  render(){
    return (
      
            <main>
            <table id="conecta-4-tabla"  >
                <tbody ref={this.tableRef} onClick={this.paintColumn}>
                    {/* es posible el contenido del tbody for una funcion iteradora. */}
    <tr id='1'>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
    </tr>
    <tr id='2'>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr id='3'>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr id='4'>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr id='5'>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
    </tr>
    <tr id='6'>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
        <td ></td>
    </tr>
    <tr id='7' >
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>
<p>Winner is: {this.state.winner}</p>
            </main>
  
    )
}

}