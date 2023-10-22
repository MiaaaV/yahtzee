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