import { queryMold, queryMoldBrief, addMold, delMold, updateMold } from '@/services/api';

export default {
  namespace: 'mold',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryMold, payload);
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
    },
    * fetchBrief({ payload, callback }, { call, put }) {
      const response = yield call(queryMoldBrief, payload);
      if (callback) callback(response);
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addMold, payload);
      if (callback) callback(response);
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(delMold, payload);
      if (callback) callback(response);
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateMold, payload);
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
