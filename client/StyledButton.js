import React from 'react';
import {View, Button, StyleSheet} from 'react-native';

const StyledButton = ({title, color, onPress}) => {
  return (
    <View style={styles.button}>
      <Button
        title={title}
        color={color !== undefined ? color : null}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 5,
  },
});

export default StyledButton;
