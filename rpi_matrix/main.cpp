#define _CRT_SECURE_NO_WARNINGS

#include <wiringPi.h>
#include <wiringShift.h>
#include "MatrixPattern.h" //stack
#include "Utils.h" //readPatternFromFile, binToHex, displayPattern

int main(int argc, char** argv)
{
	wiringPiSetup();
	init();

	if (argc == 2) {
		threeDimVec v = Utils::readPatternFromFile(argv[1]); //file holds multiple patterns
		std::queue<MatrixPattern> patternStack;
		for (auto& i : v) {
			MatrixPattern mp(i.size(), i[0].size(), i); //rows, cols, pattern
			patternStack.push(mp);
		}

		while (!patternStack.empty()) {
			patternStack.front().displayPattern(3, 5); //params: delay (ms) -> delay between patterns; patternTime (ms) -> duration of a pattern
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
