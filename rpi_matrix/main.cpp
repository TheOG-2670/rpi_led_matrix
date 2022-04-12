#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <wiringPi.h>
#include <wiringShift.h>
#include "MatrixPattern.h"
#include "Utils.h" //readPatternFromFile, binToHex, displayPattern

int main(int argc, char** argv)
{
	wiringPiSetup();
	init();

	if (argc == 2) {
		threeDimVec v = Utils::readPatternFromFile(argv[1]); //file holds multiple patterns

		std::stack<MatrixPattern> patternStack;
		for (auto& i : v) {
			MatrixPattern mp(i.size(), i[0].size(), i); //rows, cols, pattern
			patternStack.push(mp);
		}

		while (!patternStack.empty()) {
			patternStack.top().displayPattern(3, 300);
			patternStack.pop();
		}

	}
	else if(argc == 3){
		Utils::writeOut(std::stoi(argv[1]), std::stoi(argv[2]));
	}
	else {
		std::cout << "usage: ./shift_reg_blink <pattern file> OR <row> <col> \n";
	}
	return 0;
}
