const rows = 12;  // 11 rows of 7 seats and 1 row of 3 seats
const seatsPerRow = 7;
const lastRowSeats = 3;
let seatMap = [];

// all seats are available initially
// 0 indicates that seats are available
// 1 indicates seats are booked
let seatArr = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1] 
    // here, last row has only 3 seats
    // to ease the calculations, 
    // we have 7 rows in last row in array
    // out of which 4 seats are represented as booked seats
];

/*
* function to create the seats using DOM manipulation
*/
function renderSeatMap() {
    const seatMapDiv = document.getElementById('seat-map');
    seatMapDiv.innerHTML = '';  // Clear the current seat map

    seatArr.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        row.forEach((seat, seatIndex) => {
            // only 3 divs to be added in last row
            if(rowIndex == rows - 1 && seatIndex >= lastRowSeats) {
                return;
            }
            const seatDiv = document.createElement('div');
            seatDiv.className = 'seat' + (seat ? ' booked' : '');
            seatDiv.innerText = `${rowIndex + 1}-${seatIndex + 1}`;
            rowDiv.appendChild(seatDiv);
        });
        seatMapDiv.appendChild(rowDiv);
    });
}

/*
* function to book the seats when button is clicked
*/
function bookSeats() {
    const numSeats = parseInt(document.getElementById('seats').value);
    if (numSeats < 1 || numSeats > 7) {
        alert("You can only book between 1 and 7 seats at a time.");
        return;
    }

    tryToBookSeats(numSeats);
    
    renderSeatMap();
}

/*
* function to book the seats 
*/
function tryToBookSeats(numSeats) {
    // contains coordinates of available seats
    let zeros = [];

    // maintain count of available seats per row
    let availableSeatCntPerRow = [];

    for (let i = 0; i < seatArr.length; i++) {
        let cnt = 0;
        for (let j = 0; j < seatArr[i].length; j++) {
            if (seatArr[i][j] === 0) {
                zeros.push([i, j]);
                cnt++;
            }
        }

        availableSeatCntPerRow.push(cnt);
    }

    // Step 2: Check if we have enough available seats
    if (zeros.length < numSeats) {
        return alert("Not enough seats in the train");
    }

    // Step 3: Check if we can book seats in single row
    for(let i = 0; i < seatArr.length; i++) {
        let tmp = numSeats;
        
        // available seats in the row
        if(availableSeatCntPerRow[i] >= numSeats) {
            console.log("here");
            // book seats in the row
            for(let j = 0; j < seatArr[i].length; j++) {
                if(seatArr[i][j] == 0 && numSeats > 0) {
                    numSeats--;
                    seatArr[i][j] = 1;
                }
            }
            
            return alert(`Booked ${tmp} seat(s).`);
        }
    }

    // Step 4: Generate all combinations of 'numSeats' zeros
    let combinations = generateCombinations(zeros, numSeats);
    
    // Step 5: Calculate the total distance for each combination
    let minDistance = Infinity;
    let bestCombination = null;

    combinations.forEach(combination => {
        let totalDistance = 0;
        // Calculate the distance between every pair of points in the combination
        for (let i = 0; i < combination.length; i++) {
            for (let j = i + 1; j < combination.length; j++) {
                totalDistance += manhattanDistance(combination[i], combination[j]);
            }
        }
        // Step 6: Find the combination with the smallest total distance
        if (totalDistance < minDistance) {
            minDistance = totalDistance;
            bestCombination = combination;
        }
    });
    
    // booking 'numSeats' seats which are closest
    bestCombination.forEach(best => {
        seatArr[best[0]][best[1]] = 1;
    });

    alert(`Booked ${numSeats} seat(s).`);
}

/*
* Helper function to generate combinations
*/
function generateCombinations(arr, k) {
    let result = [];
    function helper(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            path.push(arr[i]);
            helper(i + 1, path);
            path.pop();
        }
    }
    helper(0, []);
    return result;
}

/*
* Helper function to calculate Manhattan distance between two points
*/
function manhattanDistance(p1, p2) {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

// Initialize seats on page load
renderSeatMap();
