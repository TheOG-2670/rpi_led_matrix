#ifndef MATRIX_PATTERN_H
#define MATRIX_PATTERN_H

#include <vector>
#include <stack>
#include "Utils.h"

class MatrixPattern 
{
	int numRows, numCols, delayTime, patterTime;
	std::stack<std::vector<int>> pattern;

public:
	MatrixPattern(int, int, const std::vector<std::vector<int>>& v);
	void setRows(int);
	int getRows();
	void setCols(int);
	int getCols();
	void displayPattern(const int, const int);
};

#endif // !MATRIX_PATTERN_H