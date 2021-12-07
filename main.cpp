#define _CRT_SECURE_NO_WARNINGS
#include "shift_reg.h" //wiringPi, wiringShift, iostream
#include <fstream> //ifstream
#include <vector>
#include <string>
#include <stdlib.h>
#include <math.h> //pow()
using namespace std;

const void printHexPattern(const vector<vector<int>>& v)
{
	int count = 0;
	for (int i = 0; i < v.size(); i++) {
		while (count != v.size())
			cout << v[count++][1] << " ";
		cout << endl;
	}
}

const vector<vector<int>> binToHex(const vector<vector<int>> &p, const int size)
{

	vector<vector<int>> v(size);
	for (int i = 0; i < size; i++) {
		int acc = 0;
		for (int j = 0; j < size; j++) {
			if (p[i][j] == 1) {
				acc += pow(2, j);
			}
		}
		v[i].push_back(pow(2, i));
		v[i].push_back(acc);
	}

	printHexPattern(v);
	return v;
}

void displayPattern(const vector<vector<int>>& v, const int delayTime, const int patternTime)
{
	int count = 0;
	while (count++ < patternTime)
	{

		writeOut(v[0][0], v[0][1]);
		delay(delayTime);
		writeOut(0, 0); //prevent ghosting effect on adjacent LEDs
		
		writeOut(v[1][0], v[1][1]);
		delay(delayTime);
		writeOut(0, 0);

		writeOut(v[2][0], v[2][1]);
		delay(delayTime);
		writeOut(0, 0);
	}

}

typedef vector<vector<vector<int>>> threeDimVec;
const threeDimVec readPatternFromFile(const char *file) {
	vector<int> col;
	vector<vector<int>> row;
	threeDimVec pattern;
	ifstream in(file);

	int rows=0, cols=0, tmp;
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
			if (col.size() == cols) {
				row.push_back(col);
				col.clear();
			}
			if (row.size() == rows) {
				pattern.push_back(row);
				row.clear();
			}
		}
	}

	in.close();
	return pattern;
}

int main(int argc, char** argv)
{
	wiringPiSetup();
	init();

	if (argc < 2) {
		const int ledDelay = 10, patternTime = 50;
		const char* path = "/home/pi/led\ projects/led\ matrix/c++/shift_reg/patterns.txt";
		const threeDimVec p=readPatternFromFile(path);
		threeDimVec::const_iterator const_it;
		
		for(const_it=p.begin(); const_it != p.end(); const_it++)
			displayPattern(binToHex(*const_it, (*const_it).size()), ledDelay, patternTime);

	}
	else {
		writeOut(std::stoi(argv[1]), std::stoi(argv[2])); //turn on single LED from command line argument (if any)
		delay(1000);
	}

	writeOut(0, 0); //turn all LEDs off before program ends
	return 0;
}
