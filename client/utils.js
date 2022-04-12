//creates the matrix on launch and when 'clear' is pressed
const initializeMatrix = matrixSize => {
  let matrix = [];
  for (let i = 0; i < matrixSize; i++) {
    matrix.push({
      id: i,
      val: 0,
    });
  }
  return matrix;
};

//loops through objects in the original matrix array, adding the values to
//their respective rows and columns. the final array is then returned
const translateToBinary = matrixPattern => {
  let rows = [],
    cols = [],
    j = 0,
    a = Math.sqrt(matrixPattern.length),
    count = 0;
  for (let i = 0; i < Math.sqrt(matrixPattern.length); i++) {
    for (; j < a; j++) {
      cols[count++] = matrixPattern[j].val;
    }

    if (j <= matrixPattern.length) {
      a += Math.sqrt(matrixPattern.length);
      rows[i] = cols;
      cols = [];
      count = 0;
    }
  }
  return rows;
};

//clears the current pattern on the screen by reinitializing the matrix to default
const clearPattern = matrixSize => {
  return initializeMatrix(matrixSize);
};

export {initializeMatrix, translateToBinary, clearPattern};
