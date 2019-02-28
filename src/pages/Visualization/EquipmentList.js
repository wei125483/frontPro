import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';

import styles from './index.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ devicel, loading }) => ({
  devicel,
  loading: loading.models.devicel,
}))
@Form.create()
class EquipmentList extends PureComponent {
  state = {
    formValues: {
      startDate: '1970-01-01',
      endDate: moment(new Date()).format('YYYY-MM-DD'),
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '设备',
      dataIndex: 'name',
    },
    {
      title: '01/01',
      dataIndex: 'desc',
    },
    {
      title: '01/01',
      dataIndex: 'street1',
    },
    {
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

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues, pagination } = this.state;
    dispatch({
      type: 'devicel/fetch',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg = [], sorter = {}) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.setState({ pagination });

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
      type: 'devicel/fetch',
      payload: params,
    });
  };

  render() {
    const {
      devicel: { data },
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

export default EquipmentList;
