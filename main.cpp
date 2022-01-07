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

	if (argc > 1 && argc < 2) {
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
		std::cout << "usage: ./shift_reg_blink </path/to/pattern/file>|<rowNum><colNum>\n";
	}

	Utils::writeOut(0, 0); //turn all LEDs off before program ends
	return 0;
}
