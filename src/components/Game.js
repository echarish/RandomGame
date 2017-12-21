import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {

  static propTypes ={
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds : PropTypes.number.isRequired,
    onPlayAgain : PropTypes.func.isRequired,
  }

  state = {
    selectedIds : [],
    remainingSeconds : this.props.initialSeconds,
  };


  gameStatus = 'PLAYING';
  randomNumbers = Array.from({length : this.props.randomNumberCount}).
    map(() => 1 + Math.floor(10 * Math.random()));

  target = this.randomNumbers.slice(0, this.props.randomNumberCount - 2 )
    .reduce((acc, curr) => acc + curr, 0);
  // TODO: Shuffle random numbers

  shuffledRandomNumber = shuffle(this.randomNumbers);

  componentDidMount() {
    this.internalId =  setInterval(() => {
      this.setState((prevState) => {
        return {remainingSeconds : prevState.remainingSeconds - 1};
      }, () => {
        if(this.state.remainingSeconds === 0){
          clearInterval(this.internalId);
        }
      });
    },1000);
  }

  componentWillUnmount() {
    clearInterval(this.internalId);
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.selectedIds !== this.state.selectedIds
      || nextState.remainingSeconds === 0){
      this.gameStatus = this.calcGameStatus(nextState);
      if(this.gameStatus !== 'PLAYING'){
        clearInterval(this.internalId);
      }
    }
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds : [...prevState.selectedIds, numberIndex],
    }));
  };


  calcGameStatus = (nextState) => {
    const sumSelectd = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumber[curr];
    },0);
    if(nextState.remainingSeconds === 0){
      return 'LOST';
    }
    if(sumSelectd < this.target){
      return 'PLAYING';
    }
    if(sumSelectd === this.target){
      return 'WON';
    }
    if(sumSelectd > this.target){
      return 'LOST';
    }

  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>

        <View style={styles.randomContainer}>
          {this.shuffledRandomNumber.map((randomNumber,index) =>
            <RandomNumber key={index} id={index} number={randomNumber}
              isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
              onPress={this.selectNumber}/>
          )}
        </View>
        <View style={styles.actionBar}>
          { this.gameStatus !== 'PLAYING' &&
          <View>
            <Text style={styles.playResult}>You {this.gameStatus}</Text>
            <TouchableOpacity  style={styles.playAgain} onPress={this.props.onPlayAgain}>
              <Text style={styles.playAgainLink}>Play Again</Text></TouchableOpacity >
          </View>
          }
          <Text style={styles.remaingSeconds}>Remaining Second&apos;s : {this.state.remainingSeconds} </Text>
        </View>

        <Text style={styles.copyright}>@All copyright reserved by : HARISH KUMAR</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#ddd',
  },

  target: {
    fontSize: 40,
    backgroundColor : '#aaa',
    marginHorizontal: 50,
    textAlign: 'center'
  },

  randomContainer:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },

  remaingSeconds:{
    fontSize: 20,
    backgroundColor : '#aaa',
    marginHorizontal: 110,
    textAlign: 'center'
  },

  copyright:{
    textAlign: 'center'
  },

  playResult:{
    fontSize: 20,
    color : 'black',
    marginHorizontal: 110,
    textAlign: 'center',
  },

  playAgainLink:{
    fontSize: 20,
    color : 'blue',
    marginHorizontal: 110,
    textAlign: 'center',
    textDecorationLine: 'underline' ,
  },

  playAgain: {
    padding: 20,
  },

  actionBar:{
    //flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },

  STATUS_PLAYING: {
    backgroundColor : '#aaa'
  },

  STATUS_WON: {
    backgroundColor : 'green'
  },

  STATUS_LOST: {
    backgroundColor : 'red'
  },



});

export default Game;
