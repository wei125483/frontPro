import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Drawer, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import EditDrawer from './edit/index';

import styles from './index.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class ProcessRoute extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '工艺线路名称',
      dataIndex: 'name',
    },
    {
      title: '加工产品',
      dataIndex: 'desc',
    },
    {
      title: '工序流程',
      dataIndex: 'callNo',
      render: val => `${val} 万`,
    },
    {
      title: '创建时间',
      dataIndex: 'updatedAt',
    },
    {
      title: '创建人',
      dataIndex: 'desc2',
    },
    {
      title: '操作',
      render: (text, record) => <a>编辑</a>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
      type: 'rule/fetch',
      payload: params,
    });
  };

  // 删除
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  // 勾选选择
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 显示隐藏弹框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  onClose = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  render() {
    const {
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleMenuClick} key="remove">
                    批量删除
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Drawer
          title={
            <div>
              <span>新增工艺路线</span>
              <Button
                style={{ float: 'right', marginRight: '50px' }}
                type="default"
                size="small"
                onClick={this.onClose}
                icon="close-circle"
              >
                取消
              </Button>
              <Button
                className={styles.DrawerSaveBtn}
                onClick={this.onClose}
                type="primary"
                size="small"
                icon="file-done"
              >
                保存
              </Button>
            </div>
          }
          placement="right"
          width="100%"
          visible={modalVisible}
          closable={false}
          destroyOnClose
          onClose={this.onClose}
          bodyStyle={{ height: 'calc(100% - 55px)', padding: 0 }}
        >
          <EditDrawer />
        </Drawer>
      </div>
    );
  }
}

export default ProcessRoute;
