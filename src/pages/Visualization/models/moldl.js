import { queryMoldL, queryMoldExport } from '@/services/api';

export default {
  namespace: 'moldl',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMoldL, payload);
      const resData = {
        list: response.data || [],
      };
      yield put({
        type: 'save',
        payload: resData,
      });
    },
    *exports({ payload, callback }, { call, put }) {
      const response = yield call(queryMoldExport, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
