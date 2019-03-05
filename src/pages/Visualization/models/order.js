import { queryOrderList, addOrder } from '@/services/api';

export default {
  namespace: 'order',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch ({ payload }, { call, put }) {
      const response = yield call(queryOrderList, payload);
      const resData = {
        list: response.data.list || [],
        pagination: {
          current: response.data.pageNum || 1,
          pageSize: response.data.pageSize || 10,
          total: response.data.total || 0,
        },
      };
      resData.list.map(item => {
        if (item.status != 0 && item.status != 1) {
          Object.assign(item, { disabled: true });
        }
      });
      yield put({
        type: 'save',
        payload: resData,
      });
    },
    * add ({ payload, callback }, { call, put }) {
      const response = yield call(addOrder, payload);
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
