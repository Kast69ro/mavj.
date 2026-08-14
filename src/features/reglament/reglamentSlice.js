import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchRules } from './reglament'


const rulesSlice = createSlice({
  name: 'rules',
  initialState: {
    data: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRules.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const payload = action.payload
        state.data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.rules)
            ? payload.rules
            : Array.isArray(payload?.data)
              ? payload.data
              : []
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default rulesSlice.reducer