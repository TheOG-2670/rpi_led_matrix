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
  const [selectedMatrixCells, setSelectedMatrixCells] = useState([]);

  let initialMatrix = initializeMatrix();

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

  const render = ({item}) => {
    const itemStyle = {
      width: 50,
      height: 50,
      margin: 7,
      backgroundColor: selectedMatrixCells.find(i => i.id === item.id)
        ? 'green'
        : 'grey',
    };

    return (
      <TouchableOpacity
        style={itemStyle}
        onPress={() => handlePress(item.id)}
      />
    );
  };

  return (
    <View style={styles.gridContainer}>
      <FlatList
        data={initialMatrix}
        renderItem={render}
        numColumns={5}
        extraData={selectedMatrixCells}
        keyExtractor={item => item.id}
      />
    </View>
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
