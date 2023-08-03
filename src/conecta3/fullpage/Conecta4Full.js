import React from "react";
import { Component } from "react";
import './Conecta4Full.css';
import Header from "../ui/header/Header";
import VictoryControl from "../ui/victorycontrol/VictoryControl";
import Tablero from "../tablero/Tablero";
import Instrucciones from "../instrucciones/Instrucciones";

//este es el componente padre de toda la aplicación. Contiene toda la lógica del flujo de la partida que se realiza sobre una ref
//que se pasa como prop al componente con el tablero. Su state contiene detalles como qué jugador está actuando o quién ganó la partida
//los cuales se pasan a los componentes relevantes a su vez.
//this.rows y this.columns se utilizan para crear el tablero y luego iterar sobre el, si se cambia el número el tablero cambiará de tamaño.
//no están en state porque no cambiarán en el transcurso de la partida.
export default class Conecta4Full extends Component {

    constructor() {
        //el state mantiene detalles de la partida y sus jugadores, el ref maneja la tabla.
        //rows y columns se pasaran como props al componente de tabla para montarla dinámicamente. Se podrían cambiar y la aplicación
        //funcionaría igual. Se inician en 6 y 7 porque es lo que pedía el ejercicio.
        super();
        this.state = { player: 'player1', winner: null, tied: false, totalMatches: 0, victories: 0, gameStarted: false };
        this.tableRef = React.createRef();
        this.rows = 6;
        this.columns = 7;
        

    }

    paintColumn = (e) => {
        if (this.state.player === 'player2') {
            this.setState({ ...this.state.gameStarted, ...this.state.winner, ...this.state.tied, ...this.state.totalMatches, ...this.state.victories,  player: 'player1' });

        } else {
            //esta variable encuentra la posicion en el indice del row de la celda pulsada. Puesto que todas las propiedades de la tabla son
            //clave-valor, se haya el índice buscando la clave (que es un número similar al de un índice) a través de su valor.
            let indexInRow = Object.keys(e.target.parentElement.children).find(key => e.target.parentElement.children[key] === e.target);

            //este loop itera los rows de la tabla mediante la variable i e intenta pintar el indice sacado anteriormente de la posición
            //de la celda pulsada. Trata de pintar desde abajo hasta arriba, subiendo un nivel si la celda elegida ya tiene la clase p1 o p2.
            //en caso de haberse declarado un ganador, no se ejecuta.
            if (!this.state.winner) {
                for (let i = this.rows - 1; i > -1; i--) {
                    if (this.tableRef.current.children[i].children[indexInRow] &&
                        !this.tableRef.current.children[i].children[indexInRow].classList.contains('p1') &&
                        !this.tableRef.current.children[i].children[indexInRow].classList.contains('p2')) {
                        this.tableRef.current.children[i].children[indexInRow].classList.add('p1');
                        //Pasa el turno a la cpu ycomprueba si hay un ganador mediante la siguiente función. Si hay victoria, asigna el ganador al 
                        //jugador1 ya que este evento es nuestro turno. si no, la propiedad de state winner sigue en null.
                        //Tras ello, utiliza una callback para llamar a la función de movimiento de la cpu, de modo que sólo se hace tras las 
                        //comprobaciones pertinentes.
                        this.setState({...this.state.gameStarted,...this.state.totalMatches, ...this.state.victories, player: 'player2', winner: this.checkWinner(this.tableRef.current.children[i].children[indexInRow], indexInRow) ? 'player1' : this.state.tied ? 'tied' : null, }, () => { this.cpuMovesRandom(); });

                        break;
                    }
                }
            }
        }
    }
    //esta es una función intermediaria que comprueba si hay alguien que haya conseguido 4 seguidas horizontal, vertical o diagonal 
    // llamando a funciones específicas por cada uno. Se utiliza el || para evitar comprobaciones redundantes si alguna de las
    //anteriores ya dio un ganador.
    //la comprobación de empate se hace al final, de modo que nunca se pueda empatar si ya hay alguna condición de victoria.
    checkWinner = (paintedCell, indexInRow) => {
        console.log(this.state.player);
        return (this.checkWinnerHorizontal(paintedCell) || this.checkWinnerVertical(paintedCell, indexInRow)
            || this.checkWinnerDiagonalLeft(paintedCell, indexInRow) || this.checkWinnerDiagonalRight(paintedCell, indexInRow) || this.checkTie());

    }

    checkWinnerHorizontal = (paintedCell) => {
        //comprobación en lateral.
        //hay una variable para ver que color estamos comprobando, otra para contar cuanto para ganar y otras dos para comprobar derecha
        //e izquierda.
        let checkClass = this.state.player === 'player1' ? 'p1' : 'p2';
        let countWin = 1;
        let toTheRight = paintedCell;
        let toTheLeft = paintedCell;

        //comprueba si hay mas celdas en el mismo row y si tienen el mismo color, de ser asi aumenta el contador para ganar y la variable
        //utilizada para señalar a la celda pasa a señalar a la recien comprobada. En caso contrario, rompe el loop y pasa al siguiente.
        while (toTheRight.nextSibling && countWin < 4) {
            if (toTheRight.nextSibling.classList.contains(checkClass)) {
                countWin++
                toTheRight = toTheRight.nextSibling;

            } else {
                break;
            }
        }
        //exactamente lo mismo, pero hacia la izquierda, utilizando previousSibling. La variable de contador de victoria se mantiene entre ambos.
        while (toTheLeft.previousSibling && countWin < 4) {
            if (toTheLeft.previousSibling.classList.contains(checkClass)) {
                countWin++
                toTheLeft = toTheLeft.previousSibling;

            } else {
                return false;
            }
        }
        //al final esto devuelve true si hubo 4 seguidas con la misma clase o false en caso contrario.
        return countWin >= 4;

    }

    checkWinnerVertical = (paintedCell, indexInRow) => {
        //similar a la funcion horizontal, pero en la misma columna. Por lo que iteraremos el parentElement y los siblings de este.
        //recibe el indice de la celda que estamos comprobando para facilitar las cosas, de otro modo habría que extraerla antes de la
        //celda recibida.

        let checkClass = this.state.player === 'player1' ? 'p1' : 'p2';
        let countWin = 1;
        let goingUp = paintedCell.parentElement;
        let goingDown = paintedCell.parentElement;

        while (goingDown.nextSibling && countWin < 4) {
            if (goingDown.nextSibling.children[indexInRow].classList.contains(checkClass)) {
                countWin++
                goingDown = goingDown.nextSibling;

            } else {
                break;
            }
        }
        //exactamente lo mismo, pero hacia la izquierda, utilizando previousSibling. La variable de contador de victoria se mantiene entre ambos.
        while (goingUp.previousSibling && countWin < 4) {
            if (goingUp.previousSibling.children[indexInRow].classList.contains(checkClass)) {
                countWin++
                goingUp = goingUp.previousSibling;

            } else {
                return false;
            }
        }
        return countWin >= 4;

    }
    //aqui queremos comprobar si hay victoria en diagonal de izquierda a derecha (arriba a abajo) por lo que combinamos las dos anteriores.
    //Se utiliza goingUp para ascender de row con el parentComponent y goingLeft para mover el indice recibido de la celda pulsada
    //hacia la izquierda, de modo que se comprueba la diagonal superior izquierda y luego goingDown y goingRight para hacer su opuesto.
    checkWinnerDiagonalLeft = (paintedCell, indexInRow) => {
        let checkClass = this.state.player === 'player1' ? 'p1' : 'p2';
        let countWin = 1;
        let goingUp = paintedCell.parentElement;
        let goingRight = indexInRow;
        let goingLeft = indexInRow;
        let goingDown = paintedCell.parentElement;

        while (goingDown.nextSibling && countWin < 4) {
            //este if comprueba si la celda está en uno de los extremos de la pantalla. En caso de estarlo, rompe este loop puesto que 
            //no habría a donde ir.
            if (goingDown.cells[goingRight].nextSibling) {

                ++goingRight;
            } else {
                break;
            }
            if (goingDown.nextSibling.cells[goingRight] && goingDown.nextSibling.cells[goingRight].classList.contains(checkClass)) {
                countWin++
                goingDown = goingDown.nextSibling;
            } else {
                break;
            }
        }

        while (goingUp.previousSibling && countWin < 4) {
            if (goingUp.cells[goingLeft].previousSibling) {

                --goingLeft;
            } else {
                break;
            }
            if (goingUp.previousSibling.children[goingLeft] && goingUp.previousSibling.children[goingLeft].classList.contains(checkClass)) {
                countWin++
                goingUp = goingUp.previousSibling;
            } else {
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

        while (goingUp.previousSibling && countWin < 4) {
            if (goingUp.cells[goingRight].nextSibling) {
                ++goingRight;
            } else {
                break;
            }

            if (goingUp.previousSibling.cells[goingRight] && goingUp.previousSibling.cells[goingRight].classList.contains(checkClass)) {
                countWin++
                goingUp = goingUp.previousSibling;
            } else {
                break;
            }
        }

        while (goingDown.nextSibling && countWin < 4) {
            if (goingDown.cells[goingLeft].previousSibling) {

                --goingLeft;
            } else {
                break;
            }
            if (goingDown.nextSibling.cells[goingLeft] && goingDown.nextSibling.cells[goingLeft].classList.contains(checkClass)) {
                countWin++
                goingDown = goingDown.nextSibling;
            } else {
                break;
            }
        }
        return countWin >= 4;
    };

    //esta función comprueba si existe empate. Para haber un empate, el tablero se debe llenar sin haber un ganador.
    //por la naturaleza del tablero, para comprobar esto solamente hace falta ver si la primera fila de la tabla ya tiene todas las 
    //celdas cubiertas, en cuyo caso devolverá verdadero. Se cambia el valor de tied en el state, lo cual entra en juego al hacer
    //update del state en la función paintColumn para elegir un ganador.
    checkTie = () => {
        for (let i = 0; i < this.tableRef.current.children[0].children.length; i++) {
            if (!this.tableRef.current.children[0].children[i].classList.contains('p1') &&
                !this.tableRef.current.children[0].children[i].classList.contains('p2')) {
                return false;
            }
        }

        //se pasa una callback al setState para evitar problemas de asincronia al asignar empate.
        this.setState({ ...this.state.gameStarted, ...this.state.totalMatches, ...this.state.victories, ...this.state.player, ...this.state.winner, tied: true }, () => this.setState({ ...this.state.player, ...this.state.tied, ...this.state.totalMatches, winner: 'tied' }));
        return false;
    }

    //esta función es para simular un segundo jugador. El código genera un número random entre 0 y el número de columnas asignado en el
    //constructor (menos 1) y trata de pintar de la misma manera que el jugador. Luego hace las comprobaciones pertinentes de victoria y 
    //devuelve el turno.
    cpuMovesRandom = () => {
        let empty = false;
        let indexInRow = 0;
        if (!this.state.winner) {
            //este loop comprueba si la columna seleccionada esta llena comprobándola en el primer row del tablero, en caso de ser así
            //genera otro número y vuelve a intentarlo.
            while (!empty) {

                indexInRow = Math.floor(Math.random() * this.columns);
                empty = (!this.tableRef.current.firstChild.children[indexInRow].classList.contains('p1') && !this.tableRef.current.firstChild.children[indexInRow].classList.contains('p2'));
            }
            for (let i = this.rows - 1; i > -1; i--) {
                if (this.tableRef.current.children[i].children[indexInRow] &&
                    !this.tableRef.current.children[i].children[indexInRow].classList.contains('p1') &&
                    !this.tableRef.current.children[i].children[indexInRow].classList.contains('p2')) {
                    this.tableRef.current.children[i].children[indexInRow].classList.add('p2');
                    this.setState({ ...this.state.player, ...this.state.tied, winner: this.checkWinner(this.tableRef.current.children[i].children[indexInRow], indexInRow) ? 'player2' : (this.state.tied ? 'tied' : null) });
                    break;
                }
            }
            this.setState({ ...this.state.gameStarted, ...this.state.totalMatches, ...this.state.victories, ...this.state.tied, ...this.state.winner, player: 'player1' });
        }
    }
//como su nombre indica, esta función resetea todo el estado salvo el número total de partidas y victorias. Se utiliza para empezar
//nuevas partidas.
    resetEverything = () =>{
        let matchWinner = this.state.winner;
        this.setState({player: 'player1', winner: null, tied: false, totalMatches: this.state.totalMatches+1, victories: matchWinner === 'player1' ?  this.state.victories+1 : this.state.victories });
        
    }

    //como su nombre indica, esta función resetea el número de partidas y victorias guardadas en el state. Se pasa al componente
    //victoryControl que es donde está el botón para llamarla.
resetStats = () => {
    this.setState({...this.state.gameStarted, ...this.state.player, ...this.state.winner, ...this.state.tied, totalMatches: 0, victories: 0})
}

    //esta también tiene nombre indicativo. Cambia el state de gameStarted a true para quitar el componente de instrucciones
    //y ya mostrar el tablero. Se pasa al componente instrucciones como props porque el botón para esto esta allí.
startGame = () => {
    this.setState({gameStarted: true, ...this.state.player, ...this.state.winner, ...this.state.tied, ...this.state.totalMatches, ...this.state.victories})
}


    render() {
        let botonReset = <div id="buttonControl"><button id="buttonReset" onClick={this.resetEverything}>Reset Game</button></div>

        return (
            <article>
                <Header />
                {/* el tablero recibe la ref para manejarlo, la función para pintar columnas y el número de celdas y filas que tendrá. */}
                {/* si la partida ya terminó de un modo u otro muestra un botón para volver a empezar. */}
                {/* Al iniciar la aplicación se muestran instrucciones, cuando se pulsa on botón en ellas se quitan y se muestra el tablero.
                al haber un ganador o empate, el tablero se quita y se muestra un mensaje de victoria.
                Todo esto se controla a través de variables del estado. */}
                {!this.state.gameStarted ? <Instrucciones startGame={this.startGame} gameStarted={this.state.startGame}/> : (!this.state.winner ? <Tablero tableRef={this.tableRef} paintColumn={this.paintColumn} rows={this.rows} cells={this.columns} /> : botonReset)}
                {/* el victoryControl recibe las partes del state que interesa enseñar al jugador */}
                <VictoryControl winner={this.state.winner} victories={this.state.victories} totalMatches={this.state.totalMatches} resetStats={this.resetStats}/>
            </article>
        )


    }

}