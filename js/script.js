var state = {board: [], currentGame: [], savedGames: [] }

function start() {
    readLocalStorage();
    createBoard();
    newGame();
}

function readLocalStorage(){
    if (!window.localStorage){
        return;
    }

    var savedGamesFromLS = window.localStorage.getItem('saved-games')

    if (savedGamesFromLS){
        state.savedGames = JSON.parse(savedGamesFromLS)
    }
}

function writeToLocalStorage(){
    window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames))
}

function createBoard(){
    state.board = [];

    for (i = 1; i <= 60; i++){
        state.board.push(i);
    }
}

function newGame(){
    resetGame();
    render();
}

function render(){
    renderBoard();
    renderButtons();
    renderSavedGames();
}

function renderBoard(){
    var divBoard = document.querySelector('#megasena-board')
    divBoard.innerHTML = '';

    var ulNumbers = document.createElement('ul')
    ulNumbers.classList.add('numbers');

    for(var i = 0; i < state.board.length; i++){
        var currentNumber = state.board[i];

        var liNumber = document.createElement('li')
        liNumber.classList.add('number');
        liNumber.textContent = currentNumber;
        liNumber.addEventListener('click', handleNumberClick)

        if (isNumberInGame(currentNumber)){
            liNumber.classList.add('selected-number');
        }

        ulNumbers.appendChild(liNumber)
    }
    divBoard.appendChild(ulNumbers)
}

function handleNumberClick(event){
    var value = Number(event.currentTarget.textContent);

    if (isNumberInGame(value)){
        removeNumberFromGame(value);
    }
    else {
        addNumberToGame(value);
    }
    
    render();

}

function renderButtons(){
    var divButtons = document.querySelector('#megasena-buttons')
    divButtons.innerHTML = '';
    
    var buttonNewGame = createNewGameButton();
    var buttonRandomGame = createRandomGameButton();
    var buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(buttonNewGame);
    divButtons.appendChild(buttonRandomGame);
    divButtons.appendChild(buttonSaveGame);

}

function createNewGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Novo jogo';

    button.addEventListener('click', newGame)

    return button;
}

function createRandomGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Jogo Aleatório';

    button.addEventListener('click', randomGame)

    return button;
}

function createSaveGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Salvar Jogo';
    button.disabled = !isGameComplete();

    button.addEventListener('click', saveGame)

    return button;
}

function renderSavedGames(){
    var divSavedGames = document.querySelector('#megasena-saved-games')
    divSavedGames.innerHTML = '';

    if (state.savedGames.length === 0){
        divSavedGames.innerHTML = '<p>Nenhum jogo salvo <p/>'
    } else {
        var h2 = document.createElement('h2');
        h2.textContent = 'Jogos salvos';
        
        var ulSavedGames = document.createElement('ul');
        ulSavedGames.classList.add('saved-games');

        for (var i = 0; i < state.savedGames.length; i++){
            var currentGame = state.savedGames[i];

            var liGames = document.createElement('li');
            // liGames.textContent = currentGame.join(', ');

            var numbers = currentGame
            .map(number => number.toString().padStart(2, '0'))
            .join(' ');

            liGames.textContent = numbers;


            ulSavedGames.appendChild(liGames)
        }
        divSavedGames.appendChild(h2);
        divSavedGames.appendChild(ulSavedGames)
    }

}

function addNumberToGame(numberToAdd){
    if (numberToAdd < 1 || numberToAdd > 60){
        console.error('Número inválido: ', numberToAdd)
        return;
    }
    if (state.currentGame.length >= 6){
        console.error('O jogo está completo')
        return;
    }
    if (isNumberInGame(numberToAdd)) {
        console.error('O número ', numberToAdd , ' já está no jogo')
        return;
    }

    state.currentGame.push(numberToAdd)
    state.currentGame.sort();
}

function removeNumberFromGame(numberToRemove){
    if (numberToRemove < 1 || numberToRemove > 60){
        console.error('Número inválido: ', numberToRemove)
        return;
    }


    var newGame = [];

    for (var i = 0; i < state.currentGame.length; i++){
        var currentNumber = state.currentGame[i];

        if (currentNumber === numberToRemove){
            continue;
        }

        newGame.push(currentNumber)
    }
    state.currentGame = newGame;
}

function isNumberInGame(numberToCheck){
    return (state.currentGame.includes(numberToCheck));
}

function saveGame(){
    if (!isGameComplete()){
        console.error('O jogo não está completo')
        return;
    }
    state.savedGames.push(state.currentGame)
    writeToLocalStorage()
    newGame();
}

function isGameComplete(){
    return (state.currentGame.length === 6);
}

function resetGame(){
    state.currentGame = [];
}

function randomGame(){
    resetGame();

    while(!isGameComplete()){
        var randomNumber = Math.ceil(Math.random() * 60);
        addNumberToGame(randomNumber);
    }
    state.currentGame.sort();
    render();
}


start();