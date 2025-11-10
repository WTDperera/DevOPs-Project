import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentVideo: null,
  uploadProgress: 0,
  isUploading: false,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
  },
});

export const { setCurrentVideo, clearCurrentVideo, setUploadProgress, setIsUploading } =
  videoSlice.actions;
export default videoSlice.reducer;
