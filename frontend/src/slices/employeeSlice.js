import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDesignationsAndDepartments = createAsyncThunk(
    'employee/fetchDesignationsAndDepartments',
    async () => {
        const response = await axios.get('/api/employees/get-designations-and-departments');
        return response.data;
    }
);

const employeeSlice = createSlice({
    name: 'employee',
    initialState: {
        designations: [],
        departments: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDesignationsAndDepartments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDesignationsAndDepartments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.designations = action.payload.designations;
                state.departments = action.payload.departments;
            })
            .addCase(fetchDesignationsAndDepartments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default employeeSlice.reducer;