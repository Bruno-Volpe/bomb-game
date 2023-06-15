import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import params from './src/params';
import MineField from './src/components/MineField';
import Header from './src/components/Header';
import LevelSelections from './src/screens/LevelSelections';
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed
} from './src/functions'

export default function App() {
  const cols = params.getColumsAmount()
  const rows = params.getRowsAmount()
  const minesAmount = Math.ceil(cols * rows * params.difficultLevel)

  const [globalState, setGlobalState] = useState({
    board: createMinedBoard(rows, cols, minesAmount),
    won: false,
    lost: false,
    screen: false
  })

  const onOpenField = (row, column) => {
    const board = cloneBoard(globalState.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    const won = wonGame(board)

    if (lost) {
      showMines(board)
      Alert.alert('Perdeuuu', 'Que burro!')
    }

    if (won) {
      Alert.alert('You WIN')
    }

    setGlobalState(prevState => ({ ...prevState, board, lost, won }))
  }

  const onSelectField = (row, column) => {
    const board = cloneBoard(globalState.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if (won) {
      Alert.alert('Parabéns', 'Você Venceu!')
    }

    setGlobalState(prevState => ({ ...prevState, board, won }))
  }

  const onLevelSelected = level => {
    params.difficultLevel = level
    setGlobalState({
      board: createMinedBoard(rows, cols, minesAmount),
      won: false,
      lost: false,
      screen: false
    })
  }

  return (
    <View style={styles.container}>
      <LevelSelections isVisible={globalState.screen} onLevelSelected={onLevelSelected} onCancel={(prevState) => setGlobalState({ ...prevState, screen: false })} ></LevelSelections>
      <Header flagsLeft={minesAmount - flagsUsed(globalState.board)} onNewGame={() => setGlobalState({
        board: createMinedBoard(rows, cols, minesAmount),
        won: false,
        lost: false,
        screen: false
      })} onFlagPress={(prevState) => setGlobalState({ ...prevState, screen: false })} ></Header>

      <View style={styles.board} >
        <MineField onOpenField={onOpenField} board={globalState.board} onSelectField={onSelectField} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
});
