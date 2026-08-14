// src/store/quizSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchRules = createAsyncThunk(
  'quiz/fetchRules',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('https://mavj.tj/api/admin/rules', {
        headers: { accept: 'application/json' },
      })
      console.log(data)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message)
    }
  }
)

