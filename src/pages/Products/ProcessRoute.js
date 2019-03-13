import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Drawer, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import EditDrawer from './edit/index';

import styles from './index.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ proRoutes, loading }) => ({
  proRoutes,
  loading: loading.models.proRoutes,
}))
class ProcessRoute extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    processList: [], // 所有工艺列表
    resourceList: [],// 所有产品信息
    itemData: {},// 修改时查询的数据
    pagination: {
      current: 1,
      pageSize: 10,
    },
    formValues: {
      name: '',
      productName: '',
    },
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
      dataIndex: 'productName',
    },
    // {
    //   title: '工序流程',
    //   dataIndex: 'craftsProcess',
    // },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
    },
    {
      title: '操作',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>,
    },
  ];

  componentDidMount () {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'proRoutes/fetch',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    const that = this;
    // 查询所有产品信息
    dispatch({
      type: 'resource/fetchBrief',
      payload: { type: 2 },
      callback (response) {
        const { data, code } = response;
        code == '200' && that.setState({ resourceList: data });
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
      type: 'proRoutes/fetch',
      payload: params,
    });
  };

  // 删除
  handleMenuClick = () => {
    const { dispatch } = this.props;
    const { selectedRows, pagination } = this.state;
    if (selectedRows.length === 0) return;
    const ids = [];
    selectedRows.map(item => {
      ids.push(`${item.id}`);
      return '';
    });
    dispatch({
      type: 'proRoutes/remove',
      payload: { ids },
      callback: response => {
        if (response.code === 200) {
          message.success('删除成功');
          this.setState({ selectedRows: [] });
        } else {
          message.warning(response.message);
        }
        this.handleStandardTableChange(pagination);
      },
    });
  };

  // 勾选选择
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 显示隐藏弹框
  handleModalVisible = (flag, rows) => {
    const { dispatch } = this.props;
    const that = this;
    if (rows && rows.id) {
      dispatch({
        type: 'proRoutes/fetch_id',
        payload: {
          id: rows.id,
        },
        callback (resp) {
          const { data = [] } = resp;
          data.map(item => {
            item.id = item.grid;
          });
          that.setState({
            itemData: Object.assign(rows, { itemList: data }),
            modalVisible: !!flag,
          });
        },
      });
    } else {
      that.setState({
        itemData: {},
        modalVisible: !!flag,
      });
    }
  };

  onClose = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleSubmit = (params, form) => {
    const { dispatch } = this.props;
    const { pagination, itemData = {} } = this.state;
    const isAdd = !itemData.id;
    dispatch({
      type: isAdd ? 'proRoutes/add' : 'proRoutes/update',
      payload: {
        id: itemData.id,
        ...params,
      },
      callback: response => {
        if (response.code === 200) {
          message.success(isAdd ? '添加成功' : '更新成功');
          form.resetFields();
          this.handleModalVisible();
          this.handleStandardTableChange(pagination);
        } else {
          message.warning(response.message);
        }
      },
    });
  };

  render () {
    const { proRoutes: { data }, loading, dispatch } = this.props;
    const { selectedRows, modalVisible, resourceList, itemData } = this.state;

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
              rowKey={'process'}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Drawer
          placement="right"
          width="100%"
          visible={modalVisible}
          closable={false}
          destroyOnClose
          onClose={this.onClose}
          bodyStyle={{ height: '100%', overflowX: 'hidden', padding: 0 }}
        >
          <EditDrawer dispatch={dispatch} handleSubmit={this.handleSubmit}
                      resourceList={resourceList}
                      itemData={itemData}
                      onClose={this.onClose} data={this.processList}/>
        </Drawer>
      </div>
    );
  }
}

export default ProcessRoute;
