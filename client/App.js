/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {IP_ADDR, PORT} from '@env';
import * as Utils from './utils';
import StyledButton from './StyledButton';

//sends the pattern to the Node API to be saved on the Pi
const sendToPi = (matrix, cb) => {
  let matrixArray = [];
  matrixArray.push({
    rows: matrix.length,
    columns: matrix[0].length,
    pattern: matrix,
  });
  fetch(`${IP_ADDR}:${PORT}/patterns`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matrixArray),
  })
    .then(response => response.json())
    .then(responseJson => cb(responseJson.success.response))
    .catch(error => console.error(error.toString()));
};

//displays the pattern on the Pi
const getFromPi = () => {
  fetch(`${IP_ADDR}:${PORT}/patterns`)
    .then(res => res.json())
    .then(resJson => console.log(resJson))
    .catch(e => console.log(e.toString()));
};

const App = () => {
  const [matrixPattern, setMatrixPattern] = useState([]);
  const [matrixSize, setMatrixSize] = useState(null);

  //updates the value of the selected matrix cell
  const handlePress = id => {
    let updatedMatrix = [...matrixPattern];
    updatedMatrix[id].val === 0
      ? (updatedMatrix[id].val = 1)
      : (updatedMatrix[id].val = 0);
    setMatrixPattern(updatedMatrix);
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
