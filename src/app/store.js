import { configureStore } from '@reduxjs/toolkit'
import pokemonReducers from '../features/pokemonSlice'
const store = configureStore({
  reducer: {
    pokemons: pokemonReducers
  }
})

export default store
