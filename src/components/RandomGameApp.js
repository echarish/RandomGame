import React from 'react';
import Game from './Game';


export default class RandomGameApp extends React.Component {

  state = {
    gameKey : 1,
  };


resetGame = () => {
  this.setState((prevState) => {
    return {gameKey : prevState.gameKey + 1};
  });
};


render() {
  return (
    <Game key={this.state.gameKey} randomNumberCount={6}
      initialSeconds={10} onPlayAgain={this.resetGame}/>
  );
}
}
