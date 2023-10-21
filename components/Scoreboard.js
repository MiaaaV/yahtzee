import Header from './Header';
import Footer from './Footer';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import { NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../styles/style';


export default function Scoreboard({ navigation }) {

  const [scores, setScores] = useState([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScoreboardData()
    })
    return unsubscribe
  }, [navigation])

  const getScoreboardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY)
      if (jsonValue !== null) {
        let tempScores = JSON.parse(jsonValue)
        tempScores.sort((a, b) => b.points - a.points);
        setScores(tempScores)
      }
    }
    catch (e) {
      console.log('Read error: ' + e)
    }
  }

  const clearScoreboard = async () => {
    try {
      await AsyncStorage.clear()
      setScores([])
    }
    catch (e) {
      console.log('Clear error: ' + e)
    }
  }

  return (
    <>
      <Header />
      <ScrollView>
        <View>
          <Text>Scoreboard</Text>
          {scores.length === 0 ?
            <Text>Scoreboard is empty</Text>
            :
            scores.slice(-NBR_OF_SCOREBOARD_ROWS).map((player, index) => (
              index < NBR_OF_SCOREBOARD_ROWS &&
              <DataTable.Row key={player.key}>
                <DataTable.Cell>
                  <Text>{index + 1}</Text>
                </DataTable.Cell>

                <DataTable.Cell>
                  <Text>{player.name}</Text>
                </DataTable.Cell>

                <DataTable.Cell>
                  <Text>{player.date}</Text>
                </DataTable.Cell>

                <DataTable.Cell>
                  <Text>{player.time}</Text>
                </DataTable.Cell>

                <DataTable.Cell>
                  <Text>{player.points}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))
          }
        </View>

        <View>
          <Pressable onPress={clearScoreboard}>
            <Text>CLEAR SCOREBOARD</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Footer />
    </>
  )

}