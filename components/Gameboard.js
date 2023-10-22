import Header from './Header';
import Footer from './Footer';
import styles from '../styles/style';
import { TouchableOpacity, Text, View } from 'react-native';
import { Col, Row, Container } from 'react-native-flex-grid';
import { useEffect, useState } from 'react';
import { MAX_SPOT, NBR_OF_DICES, NBR_OF_THROWS, SCOREBOARD_KEY, BONUS_POINTS_LIMIT } from '../constants/Game';
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
    if (nbrOfThrowsLeft === 0 && !roundFinished) {
      setStatus('Select your points before the next round');
      return 1;
    } else if (nbrOfThrowsLeft === 0 && roundFinished) {
      if (round < MAX_SPOT) {
        setIsNewRound(true);
        setRoundFinished(false);
      } else {
        setStatus('Game over. All points selected!');
      }
      return;
    }

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
  };

  // Functions related to points
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
      setDicePointsTotalAndUpdateSum(points);
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

  function setDicePointsTotalAndUpdateSum(points) {
    setDicePointsTotal(points);
    const sum = points.reduce((total, value) => total + value, 0);
    setTotalSum(sum);
  };

  // Functions related to rounds and game flow
  function startNewRound() {
    setRound(prevRound => prevRound + 1);
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setDiceSpots(new Array(NBR_OF_DICES).fill(0));
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
    setIsNewRound(false);
    setRoundFinished(false);
  };

  function getDicePointsColor(i) {
    return selectedDicePoints[i] && !gameEndStatus ? "black" : "#d64400";
  }

  const savePlayerPoints = async () => {
    const date = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(/\//g, '.');

    const currentDate = formattedDate;
    const newKey = scores.length + 1;
    const time = date.toISOString().split('T')[1].substring(0, 5);
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

  // UI rendering
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

        <Container fluid>
          <Row>{dicesRow}</Row>
        </Container>

        <Text style={styles.smalltext}>Throws left: {nbrOfThrowsLeft}</Text>

        <TouchableOpacity
          onPress={isNewRound ? startNewRound : throwDices}
          style={styles.button}>
          <Text style={styles.buttonText2}>
            {isNewRound ? 'START NEW ROUND' : 'THROW DICES'}
          </Text>
        </TouchableOpacity>

        <Text>Total: {totalSum}</Text>
        <Text>You are {BONUS_POINTS_LIMIT - totalSum} points away from bonus</Text>
        <Text></Text>

        <Container fluid>
          <Row style={styles.row}>{pointsRow}</Row>
          <Row style={styles.row}>{pointstoSelectRow}</Row>
        </Container>

        <TouchableOpacity onPress={savePlayerPoints} style={styles.button}>
          <Text style={styles.buttonText2}>SAVE POINTS</Text>
        </TouchableOpacity>

        <Text>Player: {playerName}</Text>
      </View>

      <Footer />
    </>
  )

}
