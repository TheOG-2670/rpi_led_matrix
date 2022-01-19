#pragma once
#ifndef UTILS_H
#define UTILS_H

#define DATAROW 15
#define LATCHROW 16
#define CLOCKROW 1

#define DATACOL 4
#define LATCHCOL 5
#define CLOCKCOL 6

#define MRESET 29

#include <fstream> //ifstream
#include <math.h> //pow()
#include <vector>

typedef std::vector<std::vector<std::vector<int>>> threeDimVec;

class Utils {
public:
	static const std::vector<std::vector<int>> binToHex(const std::vector<std::vector<int>>& p);
	static const threeDimVec readPatternFromFile(const char* file);
	static void writeOut(int, int);
};

void init();

#endif // UTILS_H
