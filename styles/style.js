import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  header: {
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#ffcf98',
    flexDirection: 'row',
    borderColor: '#f08000',
    borderWidth: 5,
    borderStyle: 'dashed'
  },
  footer: {
    marginTop: 20,
    backgroundColor: '#f08000',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  title2: {
    color: '#fff',
    fontFamily: 'AmericanTypewriter-CondensedLight',
    fontWeight: 'bold',
    fontSize: 25,
    letterSpacing: 3,
    alignSelf: 'center'
  },
  author: {
    color: '#ffffff',
    fontFamily: 'AmericanTypewriter-CondensedLight',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
    margin: 10,
  },
  gameboard: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  col: {
    flex: 1
  },
  colitem: {
    alignSelf: 'center',
  },
  row: {
    width: '80%',
    alignSelf: 'center',
  },
  textinput: {
    borderWidth: 2,
    width: '80%'
  },
  button: {
    marginTop: 20,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f08000",
    width: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clearbutton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff553e",
    width: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 100
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20
  },
  buttonText2: {
    color: "#ffffff",
    fontSize: 15
  },
  smalltext: {
    alignSelf: 'flex-start',
    fontSize: 10,
    marginLeft: 10,
    color: '#444'
  }
});

/**
 * let board = [];

export default function Gameboard({ navigation, route }) {

  const [playerName, setPlayerName] = useState('')
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
  const [status, setStatus] = useState('Start the game by throwing dices!')
  const [gameEndStatus, setGameEndStatus] = useState(false)
  // Ovatko nopat kiinnitetty
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false))
  // Noppien silmäluvut
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0))
  // Onko silmäluvuille valittu pisteet
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false))
  // Kerätyt pisteet
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0))
  // Tulostaulun pisteet
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
    )
  }

  const selectDice = (i) => {
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

  // new
  const setDicePointsTotalAndUpdateSum = (points) => {
    setDicePointsTotal(points);
    const sum = points.reduce((total, value) => total + value, 0);
    setTotalSum(sum);
  };


  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={"pointsRow" + spot} style={styles.col}>
        <Text key={"pointsRow" + spot} style={styles.colitem}>
          {getSpotTotal(spot)}
        </Text>
      </Col>
    )
  }

  const selectDicePoints = (i) => {
    if (nbrOfThrowsLeft === 0) {
      let selectedPoints = [...selectedDicePoints]
      let points = [...dicePointsTotal]
      if (!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1)
      }
      else {
        alert('You already selected points for ' + (i + 1))
        return points[i]
      }
      //setDicePointsTotal(points)
      setDicePointsTotalAndUpdateSum(points)
      setSelectedDicePoints(selectedPoints)
      return points[i]
    }
    else {
      setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points')
    }
  }

  const savePlayerPoints = async () => {
    const newKey = scores.length + 1;
    const currentDate = new Date().toISOString().split('T')[0];
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    const totalPoints = dicePointsTotal.reduce((total, points) => total + points, 0)

    const playerPoints = {
      key: newKey,
      name: playerName,
      date: currentDate,
      time: time,
      points: totalPoints //yhteispisteet (mahd bonus mukaan)
    }
    try {
      const newScore = [...scores, playerPoints]
      const jsonValue = JSON.stringify(newScore)
      await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue)
    }
    catch (e) {
      console.log('Save error: ' + e)
    }
  }

  const getScoreboardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY)
      if (jsonValue !== null) {
        let tempScores = JSON.parse(jsonValue)
        setScores(tempScores)
      }
    }
    catch (e) {
      console.log('Read error: ' + e)
    }
  }

  const throwDices = () => {
    if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
      setStatus('Select your points before the next throw')
      return 1;
    }
    else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
      setGameEndStatus(false)
      diceSpots.fill(0)
      dicePointsTotal.fill(0)
    }

    let spots = [...diceSpots]
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1)
        board[i] = 'dice-' + randomNumber;
        spots[i] = randomNumber;
      }
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1)
    setDiceSpots(spots)
    setStatus('Select and throw dices again')
  }

  function getSpotTotal(i) {
    return dicePointsTotal[i];
  }

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
    )
  }

  function getDicePointsColor(i) {
    return selectedDicePoints[i] && !gameEndStatus ? "black" : "#d64400";
  }

  return (
    <>
      <Header />
      <View style={styles.gameboard}>

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
          onPress={nbrOfThrowsLeft > 0 ? () => throwDices() : null}
          style={[styles.button, { opacity: nbrOfThrowsLeft === 0 ? 0.5 : 1 }]}>

          <Text style={styles.buttonText2}>THROW DICES</Text>
        </TouchableOpacity>

        <Text>Total: {totalSum}</Text>
        <Text>You are {63 - totalSum} points away from bonus</Text>
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

 */