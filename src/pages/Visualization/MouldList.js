import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './index.less';
import moment from 'moment/moment';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ moldl, loading }) => ({
  moldl,
  loading: loading.models.moldl,
}))
@Form.create()
class MouldList extends PureComponent {
  state = {
    formValues: {
      startDate: '1970-01-01',
      endDate: moment(new Date()).format('YYYY-MM-DD'),
    },
  };

  columns = [
    {
      title: '模具',
      dataIndex: 'name',
    },
    {
      title: '01/01',
      dataIndex: 'desc',
    },
    {
      title: '01/01',
      dataIndex: 'street1',
    }, {
      title: '01/01',
      dataIndex: 'street',
    },
    {
      title: '01/01',
      dataIndex: 'callNo1',
      render: val => `${val} 万`,
    },
    {
      title: '01/01',
      dataIndex: 'callNo',
      render: val => `${val} 万`,
    },
    {
      title: '01/01',
      dataIndex: 'updatedAt',
    },
    {
      title: '01/01',
      dataIndex: 'desc2',
    },
  ];

  componentDidMount () {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'moldl/fetch',
      payload: {
        ...formValues,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg = [], sorter = {}) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'moldl/fetch',
      payload: params,
    });
  };

  render () {
    const {
      moldl: { data },
      loading,
    } = this.props;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              rowSelection={null}
              selectedRows={[]}
              loading={loading}
              data={data}
              columns={this.columns}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default MouldList;
