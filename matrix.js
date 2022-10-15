function matrix(r, c) {
    this.rows = [];
    this.row_length = r;
    this.column_length = c; 
}

function populateMatrix(matrix) {
    matrix.rows = new Array(matrix.row_length);
    // loops through the rows
    for(i = 0; i < matrix.row_length; i++) {
        matrix.rows[i] = new Array(matrix.column_length);
        
        // loops through the columns
        for(q = 0; q < matrix.rows[i].length; q++) {

            // assigns the value to each index
            matrix.rows[i][q] = Math.floor(Math.random() * 10);
        }
    }
}

// prints a matrix
function printMatrix(matrix) {
    for(i = 0; i < matrix.row_length; i++) {
        var line = "";
        for(q = 0; q < matrix.column_length; q++) {
            line += matrix.rows[i][q] + " ";
        }
        console.log(line);
    }
}

// Multiplies two matricies together.
function multipleMatricies(m1, m2) {
    if(m1.column_length != m2.row_length) {
        console.log("Cannot multiply matricies together, m1.columns length is not equal to m2.rows length.");
        return;
    }

    // Length and width of the multiplied matrix
    length = m1.column_length;
    width = m2.row_length;

    var ret = new matrix(length, width);
    ret.rows = new Array(length);

    // loops throuh each cell in the returning array 
    for(i = 0; i < length; i++) {
        ret.rows[i] = new Array(width);
        for(q = 0; q < width; q++) {
            // calculates the count for each cell
            count = 0;
            for(k = 0; k < m1.row_length; k++) {
                count += m1.rows[k][i] * m2.rows[q][k];
            }

            // assigns the count to the indexed cell
            ret.rows[i][q] = count;
        }
    }

    // returns m1*m2
    return ret;
}

var m1 = new matrix(5,5);
var m2 = new matrix(5,5);

populateMatrix(m1);
populateMatrix(m2);

printMatrix(m1);
console.log("\n\n");
printMatrix(m2);
console.log("\n\n");

var multiplied = multipleMatricies(m1,m2);
printMatrix(multiplied);