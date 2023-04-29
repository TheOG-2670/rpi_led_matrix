#target_file: prerequisite_file:
#<TAB>command rule
#$(ARG) -> ARG="<...>" in command line

C++FILES:= main.cpp MatrixPattern.cpp Utils.cpp
C++FLAGS:=-Wall -o matrix_patterns
LIBS:=-lwiringPi

all:
	g++ $(C++FILES) $(C++FLAGS) $(LIBS)
run:
	./matrix_patterns $(ARGS)
single:
	./matrix_patterns $(ARGS)
loop:
	while [ 1 ]; \
	do \
		./matrix_patterns $(ARGS); \
	done
	
clean:
	rm matrix_patterns
