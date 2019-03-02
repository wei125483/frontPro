import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Col, Row, Icon, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './index.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    modalLenght,
    handleAddModalLenght,
  } = props;
  const onAddMould = () => {
    const obj = modalLenght;
    obj.push({ id: new Date().getTime(), proId: '', proNum: '' });
    handleAddModalLenght(obj);
  };
  const onDelMould = index => {
    const obj = modalLenght;
    obj.splice(index, 1);
    handleAddModalLenght(obj);
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      width={960}
      title="新增产品BOM"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={24}>
          <h3>产品</h3>
        </Col>
        <Col span={8}>
          <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="订单号">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true, message: '请输入订单号' }],
            })(<Input placeholder="请输入订单号" maxLength={20}/>)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem key="proId" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="客户名称">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true, message: '客户名称' }],
            })(<Input placeholder="请输入客户名称"/>)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="产品名称">
            {form.getFieldDecorator('productId', {
              rules: [{ required: true, message: '请选择产品名称' }],
            })(<Input placeholder="请输入产品名称"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="下单日期">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true, message: '请选择下单日期' }],
            })(<Input placeholder="请选择下单日期"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="交货日期">
            {form.getFieldDecorator('deliveryDate', {
              rules: [{ required: true, message: '请选择交货日期' }],
            })(<Input placeholder="请选择交货日期"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="数量">
            {form.getFieldDecorator('amount', {
              rules: [{ required: true, message: '请输入数量' }],
            })(<Input placeholder="请输入数量"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="优先级">
            {form.getFieldDecorator('priority', {
              rules: [{ required: true, message: '请输入优先级' }],
            })(<Input placeholder="请输入优先级"/>)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
class OrderList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    modalLenght: [],
    formValues: {},
  };

  columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
    },
    {
      title: '产品编号',
      dataIndex: 'desc',
    },
    {
      title: '产品名称',
      dataIndex: 'street1',
    },
    {
      title: '需求数量',
      dataIndex: 'street',
    },
    {
      title: '交货日期',
      dataIndex: 'callNo1',
    },
    {
      title: '现有库存',
      dataIndex: 'callNo',
    },
    {
      title: '供需差额',
      dataIndex: 'callNo',
    },
    {
      title: '距交期天数',
      dataIndex: 'callNo',
    },
    {
      title: '优先级',
      dataIndex: 'updatedAt',
    },
    {
      title: '状态',
      dataIndex: 'desc2',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/fetch',
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
      type: 'order/fetch',
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
          type: 'order/remove',
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
      modalLenght: [],
      modalVisible: !!flag,
    });
  };

  // 添加addModalLenght
  handleAddModalLenght = array => {
    this.setState({
      modalLenght: JSON.parse(JSON.stringify(array)),
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  render() {
    const {
      order: { data },
      loading,
    } = this.props;
    const { selectedRows, modalLenght, modalVisible } = this.state;
    const parentMethods = {
      modalLenght,
      handleAddModalLenght: this.handleAddModalLenght,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}> */}
              {/* 新增 */}
              {/* </Button> */}
              <Button icon="cluster" type="primary" onClick={() => this.handleModalVisible(true)}>
                排产
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
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </div>
    );
  }
}

export default OrderList;
