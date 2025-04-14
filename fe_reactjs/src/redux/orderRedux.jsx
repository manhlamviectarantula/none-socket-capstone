import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        ShowtimeInfo: {
            MovieName: "",
            Poster: "",
            Duration: "",
            BranchID: null,
            BranchName: "",
            TheaterName: "",
            StartTime: "",
            ShowDate: "",
        },
        selectedSeats: [],
        orderFoods: []
    },
    reducers: {
        addSeat: (state, action) => {
            state.selectedSeats = action.payload;
        },
        addShowtime: (state, action) => {
            state.ShowtimeInfo.MovieName = action.payload.MovieName
            state.ShowtimeInfo.Poster = action.payload.Poster
            state.ShowtimeInfo.Duration = action.payload.Duration
            state.ShowtimeInfo.BranchID = action.payload.BranchID
            state.ShowtimeInfo.BranchName = action.payload.BranchName
            state.ShowtimeInfo.TheaterName = action.payload.TheaterName
            state.ShowtimeInfo.StartTime = action.payload.StartTime
            state.ShowtimeInfo.ShowDate = action.payload.ShowDate
        },
        addOrderFoods: (state, action) => {
            const food = action.payload;
            const existingFoodIndex = state.orderFoods.findIndex(item => item.FoodID === food.FoodID);

            if (existingFoodIndex !== -1) {
                state.orderFoods[existingFoodIndex].quantity += 1;
            } else {
                state.orderFoods.push({ ...food, quantity: 1 });
            }
        },
        decreaseOrderFood: (state, action) => {
            const food = action.payload;
            const existingFoodIndex = state.orderFoods.findIndex(item => item.FoodID === food.FoodID);

            if (existingFoodIndex !== -1) {
                if (state.orderFoods[existingFoodIndex].quantity > 1) {
                    state.orderFoods[existingFoodIndex].quantity -= 1;
                } else {
                    state.orderFoods.splice(existingFoodIndex, 1);
                }
            }
        },
        resetOrder: (state) => {
            state.ShowtimeInfo = {
                MovieName: "",
                Poster: "",
                Duration: "",
                BranchID: null,
                BranchName: "",
                TheaterName: "",
                StartTime: "",
                ShowDate: "",
            };
            state.selectedSeats = [];
            state.orderFoods = [];
        }
    }
})

export const { addSeat, addShowtime, addOrderFoods, decreaseOrderFood, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;