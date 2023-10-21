import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function Header() {

  const [font] = useFonts({
    Bungee: require('../assets/fonts/BungeeSpice-Regular.ttf')
  })

  if (!font) {
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={headerstyle.container}>
        <MaterialCommunityIcons
          name={"dice-multiple"}
          size={80}
          color={"#d64400"}
          style={{ alignSelf: 'center' }} />

        <Text style={headerstyle.textformat}>Mini-Yahtzee</Text>
      </View>
    </View>
  );
}

const headerstyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  textformat: {
    fontFamily: 'Bungee',
    fontWeight: 'bold',
    fontSize: 45,
    color: 'white',
    alignSelf: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 10, height: 3 },
    textShadowRadius: 10,
  }
})