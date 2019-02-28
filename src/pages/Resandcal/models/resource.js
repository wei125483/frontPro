import { queryResource, addResource, delResource, updateResource,queryResourceBrief } from '@/services/api';

export default {
  namespace: 'resource',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch ({ payload }, { call, put }) {
      const response = yield call(queryResource, payload);
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
    * fetchBrief ({ payload }, { call, put }) {
      const response = yield call(queryResourceBrief, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    * add ({ payload, callback }, { call, put }) {
      const response = yield call(addResource, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    * remove ({ payload, callback }, { call, put }) {
      const response = yield call(delResource, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    * update ({ payload, callback }, { call, put }) {
      const response = yield call(updateResource, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
