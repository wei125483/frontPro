import { queryCrafts, queryCraftsById, addCrafts, delCrafts, updateCrafts } from '@/services/api';

export default {
  namespace: 'crafts',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryCrafts, payload);
      const resData = {
        list: response.data.list || [],
        pagination: {
          current: response.data.pageNum || 1,
          pageSize: response.data.pageSize || 10,
          total: response.data.total || 0,
        },
      };
      yield put({
        type: 'save',
        payload: resData,
      });
      if (callback) callback(resData);
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addCrafts, payload);
      if (callback) callback(response);
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(delCrafts, payload);
      if (callback) callback(response);
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateCrafts, payload);
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
