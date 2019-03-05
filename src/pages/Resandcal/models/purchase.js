import { queryPurchase, addPurchase, delPurchase } from '@/services/api';

export default {
  namespace: 'purchase',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch ({ payload }, { call, put }) {
      const response = yield call(queryPurchase, payload);
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
    * add ({ payload, callback }, { call, put }) {
      const response = yield call(addPurchase, payload);
      if (callback) callback(response);
    },
    * remove ({ payload, callback }, { call, put }) {
      const response = yield call(delPurchase, payload);
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
