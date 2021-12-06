#include "shift_reg.h" //wiringPi, wiringShift, iostream
#include <vector>
#include <math.h> //pow()
using namespace std;

const void printHexPattern(const vector<vector<int>> &v)
{
	int count=0;
		for(int i=0; i < v.size(); i++){
			while(count != v.size())
				cout<<v[count++][1]<< " ";
			cout<<endl;
		}
}

const vector<vector<int>> binToHex(const vector<vector<int>> p, const int size)
{
	
		vector<vector<int>> v(size);
		for (int i=0; i < size; i++) {
			int acc = 0;
			for (int j=0; j < size; j++) {
				if (p[i][j]==1) {
					acc += pow(2, j);
				}
			}
			v[i].push_back(pow(2,i));
			v[i].push_back(acc);
		}
		
		printHexPattern(v);
		return v;
}

void displayPattern(const vector<vector<int>> &v, const int delayTime, const int patternTime)
{
	int count=0;
	while(count++<patternTime)
	{
		writeOut(v[0][0], v[0][1]);
		delay(delayTime);
		writeOut(0,0); //prevent ghosting effect on adjacent LEDs
				
		writeOut(v[1][0], v[1][1]);
		delay(delayTime);
		writeOut(0,0); //prevent ghosting effect on adjacent LEDs
			
		if(v.size() > 2)
		{
			writeOut(v[2][0], v[2][1]);
			delay(delayTime);
			writeOut(0,0);
		}
	}
		
}

int main(int argc, char **argv)
{
	wiringPiSetup();
	init();
	
	if (argc < 2){
		const int size=3, ledDelay=10, patternTime=30;
		vector<vector<vector<int>>> twoByTwoPattern{
			{
				{1, 0}, //[1,1]
				{0, 0}
			},
			{
				{0, 1}, //[1,2]
				{0, 0},
			},
			{
				{0, 0},
				{0, 1} //[2,2]
			},
			{
				{0, 0},
				{1, 0} //[2,1]
			}
		};
		
		vector<vector<vector<int>>> threeByThreePattern{
			{
				{1, 0, 1},
				{0, 1, 0},
				{1, 0, 1}
			},
			{
				{0, 1, 0},
				{1, 0, 1},
				{0, 1, 0}
			},
			{
				{1, 1, 1},
				{1, 1, 1},
				{1, 1, 1}
			},
			{
				{1, 1, 1},
				{1, 0, 1},
				{1, 1, 1}
			},
			{
				{0, 0, 0},
				{0, 1, 0},
				{0, 0, 0}
			}
		};
		
		
		for(auto &pattern: threeByThreePattern){
			displayPattern(binToHex(pattern, 3), ledDelay, patternTime);
		}
		
	}
	else{
		writeOut(std::stoi(argv[1]), std::stoi(argv[2])); //turn on single LED from command line argument (if any)
		delay(1000);
	}
	
	writeOut(0,0); //turn all LEDs off before program ends
	return 0;
}
