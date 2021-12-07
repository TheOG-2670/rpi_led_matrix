
/*
2x2 matrix representation

COL  COL
  |  |
  V  V
 _____
| 0 0 | -> ROW
| 0 0 | -> ROW
 -----

		COL 0 |	COL 1 |	COL 2 |	COL 3 |	COL 4 |	COL 5 |	COL 6 |	COL 7
 ROW 0: 0 		0 		0 		0 		0 		0 		0 		0
 ROW 1: 0
 ROW 2: 0
 ROW 3: 0
 ROW 4: 0
 ROW 5: 0
 ROW 6: 0
 ROW 7: 0

ex:
row 1, col 1 (MSBFIRST)
 
  COL: 00000010 -> value: 2^1=2
  |
  V 
 _____
| 0 0 | -> ROW: 00000010
| 0 1 |
 -----

*/
#include "shift_reg.h"

void init()
{
	pinMode(MRESET, OUTPUT);
	digitalWrite(MRESET, 0);
	digitalWrite(MRESET, 1);
	
	int pins[]={DATAROW, LATCHROW, CLOCKROW, DATACOL, LATCHCOL, CLOCKCOL};
	for(int pin: pins)
	{
		pinMode(pin, OUTPUT);
		digitalWrite(pin, 0);
		
	}
	std::cout<<"all pins successfully initialized!\n";
}

void writeOut(int rows, int cols)
{
	shiftOut(DATAROW, CLOCKROW, MSBFIRST, rows);
	shiftOut(DATACOL, CLOCKCOL, MSBFIRST, ~cols);
	digitalWrite(LATCHROW, 0);
	digitalWrite(LATCHROW, 1);
	digitalWrite(LATCHCOL, 0);
	digitalWrite(LATCHCOL, 1);
}
