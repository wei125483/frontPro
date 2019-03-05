import { queryProRoutes, queryProRoutesById, addProRoutes, delProRoutes, updateProRoutes } from '@/services/api';

export default {
  namespace: 'proRoutes',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch ({ payload }, { call, put }) {
      const response = yield call(queryProRoutes, payload);
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
    * fetch_id ({ payload, callback }, { call }) {
      const response = yield call(queryProRoutesById, payload);
      if (callback) callback(response);
    },
    * add ({ payload, callback }, { call }) {
      const response = yield call(addProRoutes, payload);
      if (callback) callback(response);
    },
    * remove ({ payload, callback }, { call }) {
      const response = yield call(delProRoutes, payload);
      if (callback) callback(response);
    },
    * update ({ payload, callback }, { call }) {
      const response = yield call(updateProRoutes, payload);
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
