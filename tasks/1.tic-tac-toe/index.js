const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const SIZE = 3;

const container = document.getElementById('fieldWrapper');

let roundInfo = {
    round : 0,
    winnerExist : false,
    field : resetField(),
};


startGame();
addResetListener();

function startGame() {
    renderGrid(SIZE);
}
function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    console.group('Cell Info')
    console.log(`Position: ${row}, ${col}`);
    console.log(`Value before click: ${roundInfo.field[row][col]}`);
    if (roundInfo.field[row][col] != 0 || roundInfo.winnerExist) {
        return;
    }
    roundInfo.round++;
    roundInfo.field[row][col] = roundInfo.round % 2 ? 1 : -1;
    renderSymbolInCell(roundInfo.round % 2 ? CROSS : ZERO, row, col);
    checkWinner();
    console.log(`Value before after: ${roundInfo.field[row][col]}`);
    console.groupEnd();
}

function checkWinner() {
    let sum;

    for (let i = 0; i < SIZE; i++) {

        sum = sumCells(i, 0, 0, 1);
        if (calculateWinner(sum)) {
            renderColorInCell(i, 0, 0, 1);
            return;
        }
        //console.log(`Sum ${sum}`);
    }
    for (let j = 0; j < SIZE; j++) {
        sum = sumCells(0, j, 1, 0);
        if (calculateWinner(sum)) {
            renderColorInCell(0, j, 1, 0);
            return;
        }
    }

    sum = sumCells(0, 0, 1, 1);
    if (calculateWinner(sum)) {
        renderColorInCell(0, 0, 1, 1);
        return;
    }

    sum = sumCells(0, SIZE-1, 1, -1);
    if (calculateWinner(sum)) {
        renderColorInCell(0, SIZE-1, 1, -1);
        return;
    }

    if (roundInfo.round === 9) {
        alert("Победила дружба!");
    }
}

function sumCells(rowStart, colStart, rowStep = 1, colStep = 1) {
    let sum = 0
    let row = rowStart;
    let col = colStart;
    let iteration = 1;
    do{
        sum += roundInfo.field[row][col];
        row += rowStep;
        col += colStep;
        iteration ++;
    } while(iteration <= SIZE); 
    return sum;
}

function calculateWinner(sum) {
    if (sum === SIZE) {
        roundInfo.winnerExist = true;
        alert("Победил X!");
        return true;
    }
    if (sum === -SIZE) {
        roundInfo.winnerExist = true;
        alert("Победил O!");
        return true;
    }
    return false
}

function renderColorInCell(rowStart, colStart, rowStep = 1, colStep = 1, color = '#d33') {
    let row = rowStart;
    let col = colStart;
    let iteration = 1;
    do{
        let targetCell = findCell(row, col);
        targetCell.style.color = color;
        row += rowStep;
        col += colStep;
        iteration ++;
    } while(iteration <= SIZE); 
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    console.log('reset!');
    roundInfo.field = resetField();
    roundInfo.round = 0;
    roundInfo.winnerExist = false;
    startGame();
}

function resetField() {
    let arr = [];
    for (let i = 0; i < SIZE; i++) {
        arr[i] = [];
        for (let j = 0; j < SIZE; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}


/* Test Function */
/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
