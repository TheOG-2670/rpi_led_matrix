#define _CRT_SECURE_NO_WARNINGS

#include "shift_reg.h" //wiringPi, wiringShift, iostream, fstream, math
#include "Utils.h" //readPatternFromFile, binToHex, displayPattern

int main(int argc, char** argv)
{
	wiringPiSetup();
	init();

	if (argc < 2) {
		const int ledDelay = 10, patternTime = 50;
		const char *path = "/home/pi/led\ projects/led\ matrix/c++/shift_reg/patterns.txt";
		const threeDimVec p=readPatternFromFile(path);
		threeDimVec::const_iterator const_it;
		std::vector<std::vector<int>> hexPattern;

		for (const_it = p.begin(); const_it != p.end(); const_it++) {
			hexPattern = binToHex(*const_it, (*const_it).size());
			displayPattern(hexPattern, ledDelay, patternTime);
		}

	}
	else {
		writeOut(std::stoi(argv[1]), std::stoi(argv[2])); //turn on single LED from command line argument (if any)
		delay(1000);
	}

	writeOut(0, 0); //turn all LEDs off before program ends
	return 0;
}
