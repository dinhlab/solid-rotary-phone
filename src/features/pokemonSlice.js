import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiService from '../app/apiService'
import { POKEMONS_PER_PAGE } from '../app/config'
export const getPokemons = createAsyncThunk(
  'pokemons/getPokemons',
  async ({ page, search, type }, { rejectWithValue }) => {
    try {
      let url = `/pokemons?page=${page}&limit=${POKEMONS_PER_PAGE}`
      if (search) url += `&search=${search}`
      if (type) url += `&type=${type}`
      const response = await apiService.get(url)
      return response
    } catch (error) {
      return rejectWithValue({ message: error.message })
    }
  }
)
export const getPokemonById = createAsyncThunk(
  'pokemons/getPokemonById',
  async (id, { rejectWithValue }) => {
    try {
      const url = `/pokemons/${id}`
      const response = await apiService.get(url)
      if (!response) return rejectWithValue({ message: 'No data' })
      return response
    } catch (error) {
      return rejectWithValue({ message: error.message })
    }
  }
)
export const addPokemon = createAsyncThunk(
  'pokemons/addPokemon',
  async ({ name, id, imgUrl, types }, { rejectWithValue }) => {
    try {
      const url = '/pokemons'
      await apiService.post(url, { name, id, url: imgUrl, types })
      return
    } catch (error) {
      return rejectWithValue({ message: error.message })
    }
  }
)
export const editPokemon = createAsyncThunk(
  'pokemons/editPokemon',
  async ({ name, id, url, types }, { rejectWithValue }) => {
    try {
      const editUrl = `/pokemons/${id}`
      await apiService.put(editUrl, { name, url, types })
      return
    } catch (error) {
      return rejectWithValue({ message: error.message })
    }
  }
)
export const deletePokemon = createAsyncThunk(
  'pokemons/deletePokemon',
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      const deleteUrl = `/pokemons/${id}`
      await apiService.delete(deleteUrl)
      dispatch(getPokemonById())
      return
    } catch (error) {
      return rejectWithValue({ message: error.message })
    }
  }
)
const initialState = {
  isLoading: false,
  pokemons: [],
  pokemon: {
    pokemon: null,
    nextPokemon: null,
    previousPokemon: null
  },
  search: '',
  type: '',
  page: 1
}
const pokemonSlice = createSlice({
  name: 'pokemons',
  initialState,
  reducers: {
    changePage: (state, action) => {
      if (action.payload) {
        state.page = action.payload
      } else {
        state.page++
      }
    },
    typeQuery: (state, action) => {
      state.type = action.payload
    },
    searchQuery: (state, action) => {
      state.search = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPokemons.pending, (state) => {
        state.loading = true
        state.errorMessage = ''
      })
      .addCase(getPokemonById.pending, (state) => {
        state.loading = true
        state.errorMessage = ''
      })
      .addCase(addPokemon.pending, (state) => {
        state.loading = true
        state.errorMessage = ''
      })
      .addCase(deletePokemon.pending, (state) => {
        state.loading = true
        state.errorMessage = ''
      })
      .addCase(editPokemon.pending, (state) => {
        state.loading = true
        state.errorMessage = ''
      })
      .addCase(getPokemons.fulfilled, (state, action) => {
        state.loading = false
        const { search, type } = state
        if ((search || type) && state.page === 1) {
          state.pokemons = action.payload
        } else {
          const uniquePokemons = new Set(state.pokemons.map((pokemon) => pokemon.id))
          const newPokemons = action.payload.filter((pokemon) => !uniquePokemons.has(pokemon.id))
          state.pokemons = [...state.pokemons, ...newPokemons]
          console.log('uniquePokemons SET', uniquePokemons)
        }
      })
      .addCase(getPokemonById.fulfilled, (state, action) => {
        state.loading = false
        state.pokemon = action.payload
      })
      .addCase(addPokemon.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deletePokemon.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(editPokemon.fulfilled, (state) => {
        state.loading = true
      })
      .addCase(getPokemons.rejected, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.errorMessage = action.payload.message
        } else {
          state.errorMessage = action.error.message
        }
      })
      .addCase(getPokemonById.rejected, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.errorMessage = action.payload.message
        } else {
          state.errorMessage = action.error.message
        }
      })
      .addCase(addPokemon.rejected, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.errorMessage = action.payload.message
        } else {
          state.errorMessage = action.error.message
        }
      })
      .addCase(deletePokemon.rejected, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.errorMessage = action.payload.message
        } else {
          state.errorMessage = action.error.message
        }
      })
      .addCase(editPokemon.rejected, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.errorMessage = action.payload.message
        } else {
          state.errorMessage = action.error.message
        }
      })
  }
})
export const { changePage, searchQuery, typeQuery } = pokemonSlice.actions
export default pokemonSlice.reducer
