const init = (() => {
    const startGame = document.querySelector('#btn-startGame');
    const namePlayerInputs = document.querySelectorAll('input[type=text]');
    const divStartGame = document.querySelector('.startGameContainer');
    const divGameContainer = document.querySelector('.gameContainer');


    let playerNames = [];
    let playerIcons = ['x', 'o'];
    let players = [];



    startGame.addEventListener('click', () => {
        _startGame();
    });
    function _setError() {
        for (let player of namePlayerInputs) {
            if (player.value != '') {
                player.classList.remove('alert');
            } else {
                player.classList.add('alert');
            }
        }
    }
    function _checkInput() {

        for (let player of namePlayerInputs) {
            if (player.value == '') {
                _setError();
                return false;
            }
        }
        return true;
    }
    function _startGame() {
        if (_checkInput()) {
            for (let player of namePlayerInputs) {

                playerNames.push(player.value);
            }
            _setPlayers();
            _displayGame();
            game();
        }

    }
    function _displayGame() {
        divStartGame.style.display = 'none';
        divGameContainer.style.display = 'block';
    }
    const player = (name, sign) => {
        return { name, sign };
    }
    function _setPlayers() {
        for (let i = 0; i < playerNames.length; i++) {
            players[i] = player(playerNames[i], playerIcons[i]);
        }
    }
    return { players };
})();

function game() {
    const gameStatus = document.querySelector('.gamestatus');
    const boardDivs = document.querySelectorAll('.board > div');


    let playtimes = 0;
    let clickedCells = ['', '', '', '', '', '', '', '', ''];
    let players = init.players;
    let currentPlayer = players[0].name;
    let currentPlayerSign = players[0].sign;

    const currentPlayerTurn = () => `It's your turn, ${currentPlayer}`;

    gameStatus.textContent = currentPlayerTurn();


    function updateClickedCells(index) {
        clickedCells[index] = currentPlayerSign;
        changePlayer();
    }

    function changePlayer() {
        if (playtimes % 2 == 0) {
            currentPlayer = players[1].name;
            currentPlayerSign = players[1].sign;
        } else {
            currentPlayer = players[0].name;
            currentPlayerSign = players[0].sign;
        }
        playtimes++;
        gameStatus.textContent = currentPlayerTurn();
    }

    function setDivClasses() {
        boardDivs.forEach((div) => {
            if (playtimes == 0) {
                div.classList.add('player1');
                div.textContent = players[0].sign;
            } else {
                if (div.classList.contains('player1')) {
                    div.classList.remove('player1');
                    div.classList.add('player2');
                    div.textContent = players[1].sign;
                } else {
                    div.classList.remove('player2');
                    div.classList.add('player1');
                    div.textContent = players[0].sign;
                }
            }
        });
    }
    function updateBoard() {
        for (let i = 0; i < clickedCells.length; i++) {
            if (clickedCells[i] != '') {
                boardDivs.forEach((div) => {
                    const clickedCellIndex = div.getAttribute('data-cell-index');
                    if (div.getAttribute('data-cell-index') == i) {
                        div.textContent = clickedCells[i];
                        div.removeEventListener('click', setClickEvent);
                    }
                });
            }
        }
        checkWinner();
    }

    function setWinnerDivs(div1, div2, div3) {
        boardDivs.forEach((div) => {
            const winningDiv = div.getAttribute('data-cell-index');
            div.removeEventListener('click', setClickEvent);

            if (winningDiv == div1 || winningDiv == div2 || winningDiv == div3) {
                div.classList.add('win');
            }
            if (div.classList.contains('set')) { } else {
                div.classList.add('unset');
            }
        });
    }
    function restartGame() {
        const restartGame = document.querySelector('#btn-restartGame');
        restartGame.style.display = 'block';
        restartGame.addEventListener('click', () => {
            location.reload()
        });
    }
    function checkWinner() {
        let winningPositions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningPositions.length; i++) {
            const winCondition = winningPositions[i];

            
            if (clickedCells[winCondition[0]] == players[0].sign && clickedCells[winCondition[1]] == players[0].sign && clickedCells[winCondition[2]] == players[0].sign) {
                const playerWon = () => players[0].name + ' wins!';
                gameStatus.textContent = playerWon();
                setWinnerDivs(winCondition[0], winCondition[1], winCondition[2]);
                restartGame();
                break;
            }
            if (clickedCells[winCondition[0]] == players[1].sign && clickedCells[winCondition[1]] == players[1].sign && clickedCells[winCondition[2]] == players[1].sign) {
                const playerWon = () => players[1].name + ' wins!';
                gameStatus.textContent = playerWon();
                setWinnerDivs(winCondition[0], winCondition[1], winCondition[2]);
                restartGame();
                break;
            }
            if (playtimes == 9) {
                const gameDraw = () => 'Game ended in a draw!';
                gameStatus.textContent = gameDraw();
                restartGame();
            }
            
        }



    }
    function setClickEvent(element) {
        element = element.target;
        const clickedCellIndex = element.getAttribute('data-cell-index');
        updateClickedCells(clickedCellIndex);
        setDivClasses();
        updateBoard();
        element.classList.add('set');
    }
    boardDivs.forEach((div) => {
        setDivClasses();
        div.addEventListener('click', setClickEvent);
    });

}

