import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser : (state,action) => {
      state.user = action.payload
    }
  },
})

export const { setUser } = appSlice.actions

export default appSlice.reducer