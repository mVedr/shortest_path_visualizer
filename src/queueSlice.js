import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: []
}

export const queueSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers:{
        addJourney: (state,action) => {
            //Some bug is causing 2 elements to be removed so adding 2 same
            //elements at once
            state.tasks.push(action.payload,action.payload)
        },
        removeJourney: (state) => {
            if (state.tasks.length>0){
                state.tasks = state.tasks.slice(1);
            }
        }
    }
})

export const {addJourney,removeJourney} = queueSlice.actions

export default queueSlice.reducer