import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Drawer, Select, message, Input } from 'antd';
import StandardTable from '@/components/StandardTable';
import EditDrawer from './edit/index';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ proRoutes, loading }) => ({
  proRoutes,
  loading: loading.models.proRoutes,
}))
@Form.create()
class ProcessRoute extends PureComponent {
  state = {
    modalVisible: true,
    selectedRows: [],
    processList: [], // 所有工艺列表
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
    {
      title: '工序流程',
      dataIndex: 'craftsProcess',
    },
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
      render: (text, record) => <a>编辑</a>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'proRoutes/fetch',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
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

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log(fieldsValue);
    });
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'proRoutes/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
    // message.success('添加成功');
    // this.handleModalVisible();
  };

  render() {
    const {
      proRoutes: { data },
      loading,
      form,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const { dispatch } = this.props;

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
          title={<div>
            <Form layout="inline">
              <FormItem key="title">
                <span className={styles.titleSpan}>新增工艺路线</span>
              </FormItem>
              <FormItem key="name" label="工艺线路名称">
                {form.getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入工艺线路名称！' }, { max: 20, message: '工艺线路名称长度不能超过20字符' }],
                })(<Input placeholder="请输入" maxLength={20}/>)}
              </FormItem>
              <FormItem key="type" label="产品名称">
                {form.getFieldDecorator('product', {
                  initialValue: 1,
                  rules: [{ required: true, message: '请选择产品名称！' }],
                })(
                  <Select style={{ width: '160px' }} placeholder="请选择">
                    <Option value={1}>原料</Option>
                    <Option value={2}>半成品</Option>
                    <Option value={3}>成品</Option>
                  </Select>,
                )}
              </FormItem>
              <Button style={{ float: 'right', margin: '10px 50px 0 0' }} type="default" size="small"
                      onClick={this.onClose} icon="close-circle">取消</Button>
              <Button className={styles.DrawerSaveBtn} type="primary" onClick={this.handleSubmit} size="small"
                      icon="file-done">保存</Button>
            </Form>
          </div>}
          placement="right"
          width="100%"
          visible={modalVisible}
          closable={false}
          destroyOnClose
          onClose={this.onClose}
          bodyStyle={{ height: 'calc(100% - 74px)', overflowX: 'hidden', padding: 0 }}
        >
          <EditDrawer dispatch={dispatch} data={this.processList}/>
        </Drawer>
      </div>
    );
  }
}

export default ProcessRoute;
