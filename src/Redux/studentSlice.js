import { createSlice } from '@reduxjs/toolkit';
const studentSlice = createSlice({
    name: 'student',
    initialState: {
        students: {
            allStudents: [],
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        getStudentStart: (state) => {
            state.students.isFetching = true;
        },
        getStudentSuccess: (state, action) => {
            state.students.isFetching = false;
            state.students.allStudents = action.payload;
        },
        getStudentFailure: (state) => {
            state.students.isFetching = false;
            state.students.error = true;
        },
        deleteStudentStart: (state) => {
            state.students.isFetching = true;
        },
        deleteStudentSuccess: (state, action) => {
            state.students.isFetching = false;
            state.students.allStudents = action.payload;
        },
        deleteStudentFailure: (state) => {
            state.students.isFetching = false;
            state.students.error = true;
        },
        addStudentStart: (state) => {
            state.students.isFetching = true;
            state.students.error = false;
        },
        addStudentSuccess: (state, action) => {
            state.students.isFetching = false;
            state.students.allStudents.push(action.payload);
        },
        addStudentFailure: (state) => {
            state.students.isFetching = false;
            state.students.error = true;
        },
        updateStudentStart: (state) => {
            state.students.isFetching = true;
        },
        updateStudentSuccess: (state, action) => {
            state.students.isFetching = false;
            state.students.allStudents = state.students.allStudents.map((student) =>
                student._id === action.payload._id ? action.payload : student
            );
        },
        updateStudentFailure: (state) => {
            state.students.isFetching = false;
            state.students.error = true;
        },
    },
})
export const { getStudentStart, getStudentSuccess, getStudentFailure, deleteStudentFailure, deleteStudentStart, deleteStudentSuccess, addStudentFailure, addStudentStart, addStudentSuccess,
    updateStudentStart, updateStudentSuccess, updateStudentFailure
 } = studentSlice.actions;
export default studentSlice.reducer;