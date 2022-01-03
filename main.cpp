#define _CRT_SECURE_NO_WARNINGS

#include <wiringPi.h>
#include <wiringShift.h>
#include "MatrixPattern.h"
#include "Utils.h" //readPatternFromFile, binToHex, displayPattern

int main(int argc, char** argv)
{
	wiringPiSetup();
	init();

	if (argc < 2) {

		const char *path = "/home/pi/led_matrix/shift_reg/pattern.txt";
		threeDimVec v = Utils::readPatternFromFile(path); //file holds multiple patterns

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
	else {
		Utils::writeOut(std::stoi(argv[1]), std::stoi(argv[2])); //turn on single LED from command line argument (if any)
		delay(1000);
	}

	Utils::writeOut(0, 0); //turn all LEDs off before program ends
	return 0;
}
