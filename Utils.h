#pragma once
#ifndef UTILS_H
#define UTILS_H

#include <fstream> //ifstream
#include <math.h> //pow()
#include "shift_reg.h"

typedef std::vector<std::vector<std::vector<int>>> threeDimVec;

const void printHexPattern(const std::vector<std::vector<int>>& v);
const std::vector<std::vector<int>> binToHex(const std::vector<std::vector<int>>& p, const int size);
const threeDimVec readPatternFromFile(const char* file);

#endif // UTILS_H
