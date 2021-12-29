#include <iostream>
#include <wiringPi.h>
#include <wiringShift.h>
#include "MatrixPattern.h"

MatrixPattern::MatrixPattern(int numRows, int numCols, const std::vector<std::vector<int>>& v)
{
	if (numRows && numCols) {
		this->numRows = numRows;
		this->numCols = numCols;

		for(int i=0; i < numRows; i++)
			this->pattern.push(Utils::binToHex(v, numRows)[i]);
	}
}

void MatrixPattern::setRows(int numRows)
{
	if (numRows > 0) {
		this->numRows = numRows;
	}
}

int MatrixPattern::getRows()
{
	return numRows;
}

void MatrixPattern::setCols(int numCols)
{
	if (numCols > 0) {
		this->numCols = numCols;
	}
}

int MatrixPattern::getCols()
{
	return numCols;
}

void MatrixPattern::displayPattern(const int delayTime, const int patternTime)
{
	int count = 0, i=0, j=0; //j->column element in each row vector
	std::stack<std::vector<int>> currPatt;
	while (count++ < patternTime)
	{
		currPatt = this->pattern;
		while (i++<numRows) { //i->row vector element in the pattern stack
			Utils::writeOut(currPatt.top()[j], currPatt.top()[j + 1]);
			delay(delayTime);
			Utils::writeOut(0, 0); //prevent ghosting effect on adjacent LEDs
			currPatt.pop();
		}
		i = 0;
	}
}