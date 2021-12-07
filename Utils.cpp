#include "shift_reg.h"
#include "Utils.h"

const void printHexPattern(const std::vector<std::vector<int>>& v)
{
	int count = 0;
	for (int i = 0; i < v.size(); i++) {
		while (count != v.size())
			std::cout << v[count++][1] << " ";
		std::cout << std::endl;
	}
}

const std::vector<std::vector<int>> binToHex(const std::vector<std::vector<int>>& p, const int size)
{

	std::vector<std::vector<int>> v(size);
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

const threeDimVec readPatternFromFile(const char* file) {
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