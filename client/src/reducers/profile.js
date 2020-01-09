import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  GET_YT
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  videos: {},
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return { ...state, profile: payload, loading: false };
    case GET_PROFILES:
      return { ...state, profiles: payload, loading: false };
    case GET_REPOS:
      return { ...state, repos: payload, loading: false };
    case GET_YT:
      return { ...state, videos: payload, loading: false };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
        repos: [],
        videos: []
      };
    case CLEAR_PROFILE:
      return { ...state, profile: null, repos: [], videos: [], loading: false };
    default:
      return state;
  }
}
