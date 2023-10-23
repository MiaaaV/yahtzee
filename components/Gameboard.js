import Header from './Header';
import styles from '../styles/style';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Col, Row, Container } from 'react-native-flex-grid';
import { useEffect, useState } from 'react';
import { MAX_SPOT, NBR_OF_DICES, NBR_OF_THROWS, SCOREBOARD_KEY, BONUS_POINTS_LIMIT, BONUS_POINTS } from '../constants/Game';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

let board = [];

export default function Gameboard({ navigation, route }) {

  const [round, setRound] = useState(1)
  const [isNewRound, setIsNewRound] = useState(false)
  const [roundFinished, setRoundFinished] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
  const [status, setStatus] = useState('Start the game by throwing dices!')
  const [gameEndStatus, setGameEndStatus] = useState(false)
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false))
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0))
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false))
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0))
  const [scores, setScores] = useState([])
  const [totalSum, setTotalSum] = useState(0)
  const [savePoints, setSavePoints] = useState(false)
  const [bonusText, setBonusText] = useState("You are 63 points away from bonus!")

  useEffect(() => {
    if (playerName === '' && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScoreboardData()
    })
    return unsubscribe
  }, [navigation])

  const dicesRow = [];
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={"dice" + dice}>
        <TouchableOpacity key={"dice" + dice} onPress={() => selectDice(dice)}>
          <MaterialCommunityIcons
            name={board[dice]}
            key={"dice" + dice}
            size={50}
            color={getDiceColor(dice)} />
        </TouchableOpacity>
      </Col>
    );
  }

  function selectDice(i) {
    if (gameEndStatus) {
      setStatus('Game over. All points selected!\nRemember to save your points.');
      return;
    }
    if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
      let dices = [...selectedDices];
      dices[i] = selectedDices[i] ? false : true;
      setSelectedDices(dices);
    }
    else {
      setStatus('You have to throw dices first!')
    }
  }

  function getDiceColor(i) {
    return selectedDices[i] ? "#d64400" : "#f08000";
  }

  function throwDices() {

    let spots = [...diceSpots];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1);
        board[i] = 'dice-' + randomNumber;
        spots[i] = randomNumber;
      }
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    setDiceSpots(spots);
    setStatus('Select and throw dices again');
    setIsNewRound(false);
    setRoundFinished(false);
  };

  // state update fix
  useEffect(() => {
    if (selectedDicePoints.every(point => point) || gameEndStatus) {
      setGameEndStatus(true);
      setRoundFinished(true);
      setStatus('Game over. All points selected!\nRemember to save your points.');
      return;
    } else if (nbrOfThrowsLeft === 0 && !roundFinished) {
      setStatus('Select your points before the next round');
      return;
    } else if (nbrOfThrowsLeft === 0 && roundFinished) {
      if (round < MAX_SPOT) {
        setIsNewRound(true);
        setRoundFinished(false);
      } else {
        setStatus('Game over. All points selected!\nRemember to save your points.');
      }
      return;
    }
  }, [nbrOfThrowsLeft, roundFinished, selectedDicePoints, gameEndStatus]);


  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={"pointsRow" + spot} style={styles.col}>
        <Text key={"pointsRow" + spot} style={styles.colitem}>
          {getSpotTotal(spot)}
        </Text>
      </Col>
    );
  }


  function selectDicePoints(i) {
    if (nbrOfThrowsLeft === 0) {
      let selectedPoints = [...selectedDicePoints];
      let points = [...dicePointsTotal];

      if (!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1);
      } else {
        alert('You already selected points for ' + (i + 1));
        return points[i];
      }
      setTotalDicePoints(points);
      setSelectedDicePoints(selectedPoints);
      setRoundFinished(true);
      return points[i];

    } else {
      alert('Throw total of ' + NBR_OF_THROWS + ' times before setting points');
    }
  };

  function getSpotTotal(i) {
    return dicePointsTotal[i];
  }

  function setTotalDicePoints(points) {
    setDicePointsTotal(points);
    const sum = points.reduce((total, value) => total + value, 0);
    let updatedSum = sum;
    let newBonusText = `You are ${BONUS_POINTS_LIMIT - sum} points away from bonus!`;

    if (sum >= 63) {
      updatedSum = sum + BONUS_POINTS;
      newBonusText = 'Congrats! Bonus points (50) added';
    }

    setBonusText(newBonusText);
    setTotalSum(updatedSum);
  }


  function startNewRound() {
    setRound(prevRound => prevRound + 1);
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setDiceSpots(new Array(NBR_OF_DICES).fill(0));
    setIsNewRound(false);
    setRoundFinished(false);
    setStatus('Throw dices to start the new round!')
  };

  function getDicePointsColor(i) {
    return selectedDicePoints[i] ? "#555" : "#d64400";
  }

  const savePlayerPoints = async () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;

    const currentDate = formattedDate;
    const newKey = scores.length + 1;
    const time_options = { hour12: false, hour: '2-digit', minute: '2-digit' };
    const time = date.toLocaleString('en-US', time_options);
    const totalPoints = dicePointsTotal.reduce((total, points) => total + points, 0);

    const playerPoints = {
      key: newKey,
      name: playerName,
      date: currentDate,
      time: time,
      points: totalPoints
    };

    try {
      const newScore = [...scores, playerPoints];
      const jsonValue = JSON.stringify(newScore);
      await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
    } catch (e) {
      console.log('Save error: ' + e);
    }
    alert('Points saved successfully!')
  };

  const getScoreboardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      if (jsonValue !== null) {
        let tempScores = JSON.parse(jsonValue);
        setScores(tempScores);
      }
    } catch (e) {
      console.log('Read error: ' + e);
    }
  };

  const pointstoSelectRow = [];
  for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointstoSelectRow.push(
      <Col key={"buttonsRow" + diceButton} style={styles.col}>
        <TouchableOpacity key={"buttonsRow" + diceButton}
          style={styles.colitem}
          onPress={() => selectDicePoints(diceButton)}>
          <MaterialCommunityIcons
            name={"numeric-" + (diceButton + 1) + "-circle"}
            key={"buttonsRow" + diceButton}
            size={40}
            style={{ width: '100%' }}
            color={getDicePointsColor(diceButton)} />
        </TouchableOpacity>
      </Col>
    );
  }

  const restartGame = () => {
    setRound(1);
    setIsNewRound(false);
    setRoundFinished(false);
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setStatus('Start the game by throwing dices!');
    setGameEndStatus(false);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setDiceSpots(new Array(NBR_OF_DICES).fill(0));
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
    setDicePointsTotal(new Array(MAX_SPOT).fill(0));
    setScores([]);
    setTotalSum(0);
    setSavePoints(false);

    navigation.navigate('Home')
  };

  return (
    <>
      <Header />
      <View style={styles.gameboard}>

        <Text style={styles.title2}>Round {round}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <MaterialCommunityIcons
            name={"hand-pointing-right"}
            key={"buttonsRow"}
            size={40}
            color='#d64400' />

          <Text>{status}</Text>
        </View>

        <Container fluid >
          <Row>{dicesRow}</Row>
        </Container>

        <Text style={styles.smalltext}>Throws left: {nbrOfThrowsLeft}</Text>

        {isNewRound && !gameEndStatus && (
          <TouchableOpacity
            onPress={startNewRound}
            style={[styles.button, { width: 200 }]}>

            <Text style={[styles.buttonText2, { fontWeight: 'bold' }]}>
              START NEW ROUND
            </Text>
          </TouchableOpacity>
        )}

        {gameEndStatus && (
          <TouchableOpacity
            onPress={() => { restartGame(); }}
            style={[styles.button, { marginTop: 20 }]}>

            <Text style={[styles.buttonText2, { fontWeight: 'bold' }]}>NEW GAME</Text>
          </TouchableOpacity>
        )}

        {!isNewRound && !gameEndStatus && (
          <TouchableOpacity
            onPress={throwDices}
            style={[styles.button, { opacity: nbrOfThrowsLeft === 0 ? 0.5 : 1 }]}
            disabled={nbrOfThrowsLeft === 0}>

            <Text style={[styles.buttonText2, { fontWeight: 'bold' }]}>
              THROW DICES
            </Text>
          </TouchableOpacity>
        )}


        <Text style={user.bonustxt}>Total: {totalSum}</Text>
        <Text style={user.smallbonustxt}>{bonusText}</Text>

        <Container fluid>
          <Row style={styles.row}>{pointsRow}</Row>
          <Row style={styles.row}>{pointstoSelectRow}</Row>
        </Container>

        <TouchableOpacity
          onPress={() => { savePlayerPoints(); setSavePoints(true); }}
          style={[styles.button, { opacity: gameEndStatus && !savePoints ? 1 : 0.5 }]}
          disabled={!(gameEndStatus && !savePoints)}>

          <Text style={[styles.buttonText2, { fontWeight: 'bold' }]}>SAVE POINTS</Text>
        </TouchableOpacity>

        <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
          <MaterialCommunityIcons name='account-cowboy-hat'
            size={130}
            color='#d64400'
            style={{ marginTop: 5 }} />

          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={user.h1}>Player:</Text>
            <Text style={{ fontSize: 20 }}>{playerName}</Text>
          </View>
        </View>


      </View>

    </>
  )

}

const user = StyleSheet.create({
  h1: {
    color: '#f08000',
    fontSize: 20,
    fontWeight: 'bold'
  },
  bonustxt: {
    marginTop: 20,
    fontSize: 20,
    color: '#d64400',
    fontWeight: 'bold'
  },
  smallbonustxt: {
    fontSize: 12,
    marginBottom: 20,
    marginTop: 10
  }
})
