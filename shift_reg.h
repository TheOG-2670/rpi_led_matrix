#include <iostream>
#include <vector>
#include <wiringPi.h>
#include <wiringShift.h>

#define DATAROW 15
#define LATCHROW 16
#define CLOCKROW 1

#define DATACOL 4
#define LATCHCOL 5
#define CLOCKCOL 6

#define MRESET 29

void init();
void writeOut(int rows, int cols);
void displayPattern(const std::vector<std::vector<int>>& v, const int delayTime, const int patternTime);