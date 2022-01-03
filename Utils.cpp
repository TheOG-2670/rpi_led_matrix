#include <iostream>
#include <math.h>
#include <wiringPi.h>
#include <wiringShift.h>
#include "Utils.h"
#include "MatrixPattern.h" //wiringPi, wiringShift, vector

const std::vector<std::vector<int>> Utils::binToHex(const std::vector<std::vector<int>>& p)
{
	std::vector<std::vector<int>> v(p.size());
	for (int i = 0; i < p.size(); i++) {
		int acc = 0;
		for (int j = 0; j < p[0].size(); j++) {
			if (p[i][j] == 1) {
				acc += pow(2, j);
			}
		}
		v[i].push_back(pow(2, i));
		v[i].push_back(acc);
	}
	return v;
}

const threeDimVec Utils::readPatternFromFile(const char* file) {
	std::vector<int> col;
	std::vector<std::vector<int>> row;
	threeDimVec pattern;
	std::ifstream in(file);

	int rows = 0, cols = 0, tmp;
	while (in.good())
	{
		in >> tmp;
		if (in.peek() == ',') { //peek next char from current position in stream
			rows = tmp;
			in.ignore(); //ignore comma
			in >> cols;
		}
		else {
			col.push_back(tmp);
			if (col.size() == (size_t)cols) {
				row.push_back(col);
				col.clear();
			}
			if (row.size() == (size_t)rows) {
				pattern.push_back(row);
				row.clear();
			}
		}
	}

	in.close();
	return pattern;
}

void init()
{
	pinMode(MRESET, OUTPUT);
	digitalWrite(MRESET, 0);
	digitalWrite(MRESET, 1);

	int pins[] = { DATAROW, LATCHROW, CLOCKROW, DATACOL, LATCHCOL, CLOCKCOL };
	for (int pin : pins)
	{
		pinMode(pin, OUTPUT);
		digitalWrite(pin, 0);

	}
	std::cout << "all pins successfully initialized!\n";
}

void Utils::writeOut(int rows, int cols)
{
	shiftOut(DATAROW, CLOCKROW, MSBFIRST, rows);
	shiftOut(DATACOL, CLOCKCOL, MSBFIRST, ~cols);
	digitalWrite(LATCHROW, 0);
	digitalWrite(LATCHROW, 1);
	digitalWrite(LATCHCOL, 0);
	digitalWrite(LATCHCOL, 1);
}
