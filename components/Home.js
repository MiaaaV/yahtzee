import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Keyboard, StyleSheet, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS } from '../constants/Game';
import styles from '../styles/style';

export default Home = ({ navigation }) => {

  const [playerName, setPlayerName] = useState('')
  const [hasPlayerName, setHasPlayerName] = useState('')

  const handlePlayerName = (value) => {
    if (value.trim().length > 0) {
      setHasPlayerName(true)
      Keyboard.dismiss()
    }
  }

  return (
    <>
      <Header />

      <ScrollView>
        <View style={styles.container}>
          {!hasPlayerName ?
            <>
              <MaterialCommunityIcons name='emoticon-cool'
                size={90}
                color='#d64400'
                style={{ marginBottom: 5 }} />
              <Text style={home.h2}>Ready to play some Yahtzee?</Text>
              <Text></Text>

              <Text style={home.text}>We need a name for the scoreboard. What should we call you by?</Text>
              <Text></Text>

              <TextInput onChangeText={setPlayerName} autoFocus={true}
                label="Name"
                mode='outlined'
                width={250}
                textColor='#f08000'
                outlineColor='#f08000'
                activeOutlineColor='#d64400'
                selectionColor='#d64400' />

              <TouchableOpacity style={styles.button} onPress={() => handlePlayerName(playerName)} activeOpacity={0.7}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </>

            :

            <>
              <Text style={home.h1}>Rules of the game</Text>
              <Text></Text>

              <Text multiline='true' style={home.text}>
                <Text style={{ fontWeight: 'bold' }}>THE GAME: </Text>

                Upper section of the classic Yahtzee
                dice game. You have {NBR_OF_DICES} dices and
                for the every dice you have {NBR_OF_THROWS} throws.
                After each throw you can keep dices in
                order to get same dice spot counts as many as
                possible. In the end of the turn you must select
                your points from {MIN_SPOT} to {MAX_SPOT}.
                Game ends when all points have been selected.
                The order for selecting those is free.
              </Text>
              <Text></Text>

              <Text multiline='true' style={home.text}>
                <Text style={{ fontWeight: 'bold' }}>POINTS: </Text>
                After each turn game calculates the sum
                for the dices you selected. Only the dices having
                the same spot count are calculated. Inside the
                game you can not select same points from {MIN_SPOT} to {MAX_SPOT} again.
              </Text>
              <Text></Text>

              <Text multiline='true' style={home.text}>
                <Text style={{ fontWeight: 'bold' }}>GOAL: </Text>
                To get points as much as possible. {BONUS_POINTS_LIMIT} points is the limit of
                getting bonus which gives you {BONUS_POINTS} points more.
              </Text>
              <Text></Text>

              <Text style={home.h2}>Good luck, {playerName}</Text>
              <MaterialCommunityIcons name='waze'
                size={90}
                color='#d64400' />

              <TouchableOpacity style={[styles.button, { marginBottom: 100 }]}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Gameboard', { player: playerName })}>
                <Text style={[{ letterSpacing: 5, fontWeight: '500' }, styles.buttonText]}>PLAY</Text>
              </TouchableOpacity>

            </>
          }
        </View>
      </ScrollView>

      <Footer />
    </>
  )
}

const home = StyleSheet.create({
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 20
  },
  h2: {
    fontWeight: 'bold',
    fontSize: 15
  },
  text: {
    width: '75%',
    marginBottom: 10
  }
})