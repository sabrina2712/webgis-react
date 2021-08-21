import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colorPickerVisibility: {
    DTW: false,
    WD: false,
    WH: false,
    SPC: false,
    PP: false,
    DD: false,
  },
  features: {
    DTW: false,
    WD: false,
    WH: false,
    SPC: false,
    PP: false,
    DD: false,
  },
  colors: {
    DTW: "rgba(255,0, 0, 0.7)",
    WD: "rgba(0, 128, 0, 0.9)",
    WH: "rgb(56, 31, 65, 0.7)",
    SPC: "rgba(201, 224, 50, 0.8)",
    PP: "rgb(19, 17, 250,0.8)",
    DD: "rgb(179, 167, 228,.7)",
  },
  opens: {
    isDtwOpen: false,
    isWdOpen: false,
    isWhOpen: false,
    isPumpOpen: false,
    isDDOpen: false,
    isSpcOpen: false,
    open: false,
  },
  checked: {
    dtwIsChecked: false,
    wdIsChecked: false,
    whIsChecked: false,
    pumpIsChecked: false,
    ddIsChecked: false,
    spcIsChecked: false,
  },
};

export const countrySlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    addCategory: (slice, action) => {
      slice.values.push(action.payload);
    },
    setSelectedCategory: (slice, action) => {
      slice.selectedCategory = action.payload;
    },
    setCategoryDetail: (slice, action) => {
      slice.showCategorieDeatil = action.payload;
    },
  },
});
