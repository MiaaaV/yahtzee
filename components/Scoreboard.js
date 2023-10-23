import Header from './Header';
import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import { NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';


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
        tempScores.sort((a, b) => b.points - a.points).slice(0, NBR_OF_SCOREBOARD_ROWS)
        setScores(tempScores)
      }
    }
    catch (e) {
      console.log('Read error: ' + e)
    }
  }

  return (
    <>
      <Header />

      <View style={{ alignItems: 'center', marginVertical: 10, marginBottom: 40 }}>
        <View style={{ borderRadius: 50, backgroundColor: '#ffffffbb' }}>
          <MaterialCommunityIcons
            name={'trophy'}
            size={80}
            color={'#ffbb00'}
            width={'auto'} />
        </View>

      </View>

      <View>
        {scores.length === 0 ?
          <Text style={styles.title2}>Scoreboard is empty</Text>
          :
          <>
            <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
              <Text style={[styles.smalltext, { marginLeft: 5 }]}>Name</Text>
              <Text style={[styles.smalltext, { marginLeft: 45 }]}>Date</Text>
              <Text style={[styles.smalltext, { marginLeft: 95 }]}>Time</Text>
              <Text style={[styles.smalltext, { marginLeft: 30 }]}>Points</Text>
            </View>

            {scores.map((player, index) => (
              index < NBR_OF_SCOREBOARD_ROWS &&
              <DataTable.Row key={player.key} style={{ justifyContent: 'center' }}>

                <DataTable.Cell style={{ maxWidth: 20 }}>
                  <Text>{index + 1 + '.'}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ justifyContent: 'center' }}>
                  <Text>{player.name}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ justifyContent: 'center' }}>
                  <Text>{player.date}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ justifyContent: 'center' }}>
                  <Text>{player.time}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ justifyContent: 'flex-start', maxWidth: 50 }}>
                  <Text style={{ fontWeight: 'bold', color: '#f08000' }}>{player.points}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </>
        }

      </View>
    </>
  )

}