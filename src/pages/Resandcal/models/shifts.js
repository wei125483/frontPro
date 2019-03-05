import { queryShifts, addShifts, delShifts, updateShifts } from '@/services/api';

export default {
  namespace: 'shifts',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    * fetch ({ payload }, { call, put }) {
      const response = yield call(queryShifts, payload);
      const resData = {
        list: response.data || [],
      };
      yield put({
        type: 'save',
        payload: resData,
      });
    },
    * add ({ payload, callback }, { call, put }) {
      const response = yield call(addShifts, payload);
      if (callback) callback(response);
    },
    * remove ({ payload, callback }, { call, put }) {
      const response = yield call(delShifts, payload);
      if (callback) callback(response);
    },
    * update ({ payload, callback }, { call, put }) {
      const response = yield call(updateShifts, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
