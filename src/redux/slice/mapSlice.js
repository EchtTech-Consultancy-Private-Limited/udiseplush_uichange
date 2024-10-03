import { createSlice } from "@reduxjs/toolkit";

const MapSlice = createSlice({
  name: "Map",
  initialState: {
    mapData: [],
    stateMapDetails: {},
    mapLoaded: false,
    grossEData: null,
    updateFlag: false,
    matchingData: [],

    stateId: null,
    stateCodeForMap: null,
  },
  reducers: {
    updateMapData(state, action) {
      state.mapData = action.payload;
    },
    updateMapSession(state, action) {
      state.stateMapDetails = action.payload;
    },
    updateMapLoaded(state, action) {
      state.mapLoaded = action.payload;
    },
    filterGrossEvent(state, action) {
      state.grossEData = action.payload;
    },
    setUpdateFlag(state, action) {
      state.updateFlag = action.payload;
    },
    setmatchingData(state, action) {
      state.matchingData = action.payload;
    },

    setstateId(state, action) {
      state.stateId = action.payload;
    },
    setstateCodeForMap(state, action) {
      state.stateCodeForMap = action.payload;
    },
  },
});

export const {
  updateMapData,
  updateMapSession,
  updateMapLoaded,
  filterGrossEvent,
  setUpdateFlag,
  setmatchingData,
  setstateId,
  setstateCodeForMap
} = MapSlice.actions;
export default MapSlice.reducer;
