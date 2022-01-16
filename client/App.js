/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity} from 'react-native';

const initializeMatrix = () => {
  let matrix = [];
  for (let i = 0; i < 25; i++) {
    matrix.push({
      id: i,
    });
  }
  return matrix;
};

const App = () => {
  const [matrixPattern, setMatrixPattern] = useState([]);
  const [matrixSize, setMatrixSize] = useState(null);

  const handlePress = id => {
    let updatedMatrix = [...selectedMatrixCells];
    if (selectedMatrixCells.find(i => i.id === id) !== undefined) {
      updatedMatrix.splice(
        selectedMatrixCells.indexOf(selectedMatrixCells.find(i => i.id === id)),
        1,
      );
    } else {
      updatedMatrix.push(initialMatrix.find(i => i.id === id));
    }
    setSelectedMatrixCells(updatedMatrix);
  };

  //renders each matrix cell in the grid displayed
  const renderMatrixCell = ({item}) => {
    const itemStyle = {
      width: 50,
      height: 50,
      margin: 7,
      backgroundColor: item.val === 1 ? 'green' : 'grey',
    };

    return (
      <TouchableOpacity
        style={itemStyle}
        onPress={() => handlePress(item.id)}
      />
    );
  };

  //initial matrix construction
  useEffect(() => {
    setMatrixSize(25);
    setMatrixPattern(Utils.initializeMatrix(matrixSize));
  }, [matrixSize]);

  return (
    <>
      <View style={styles.gridContainer}>
        <FlatList
          data={matrixPattern}
          renderItem={renderMatrixCell}
          numColumns={5}
          keyExtractor={item => item.id}
        />

        <View style={styles.buttonMatrixGrid}>
          <StyledButton
            title={'save'}
            color={'green'}
            onPress={() => {
              sendToPi(Utils.translateToBinary(matrixPattern), response => {
                ToastAndroid.show(response, 1);
              });
            }}
          />
          <StyledButton title={'display'} onPress={() => getFromPi()} />
          <StyledButton
            title={'clear'}
            color={'red'}
            onPress={() => setMatrixPattern(Utils.clearPattern(matrixSize))}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    height: '100%',
  },
  buttonMatrixGrid: {
    marginBottom: -30,
  },
});

export default App;
