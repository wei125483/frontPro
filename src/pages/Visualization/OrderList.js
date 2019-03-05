import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  InputNumber,
  Col,
  Row,
  Table,
  Icon,
  Select,
  Modal,
  Drawer,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import OrderProduction from './OrderProduction.js';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, resourceList, handleAdd, handleModalVisible, proList, handleAddProList } = props;
  const onAddMould = () => {
    const obj = proList;
    obj.push({ productId: '', amount: '', craftRouteId: '' });
    handleAddProList(obj);
  };
  const onDelMould = index => {
    const obj = proList;
    obj.splice(index, 1);
    handleAddProList(obj);
  };
  const onChangeMould = (index, key, value) => {
    const obj = [...proList];
    obj[index][key] = value;
    handleAddProList(obj);
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue, proList);
      const params = {};
      params.orderTime = moment(fieldsValue.orderTime).format('YYYY-MM-DD');
      params.deliveryDate = moment(fieldsValue.deliveryDate).format('YYYY-MM-DD');
      params.priority = fieldsValue.priority;
      params.productList = [...proList];
      // form.resetFields();
      // handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      width={960}
      title="新增订单信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={12}>
          <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="订单号">
            {form.getFieldDecorator('orderId', {
              rules: [{ required: true, message: '请输入订单号' }],
            })(<Input placeholder="请输入订单号" maxLength={20}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="proId" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="客户名称">
            {form.getFieldDecorator('userName', {
              rules: [{ required: true, message: '客户名称' }],
            })(<Input placeholder="请输入客户名称"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="下单日期">
            {form.getFieldDecorator('orderTime', {
              rules: [{ required: true, message: '请选择下单日期' }],
            })(<DatePicker placeholder="请选择下单日期" style={{ width: '100%' }}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="交货日期">
            {form.getFieldDecorator('deliveryDate', {
              rules: [{ required: true, message: '请选择交货日期' }],
            })(<DatePicker placeholder="请选择交货日期" style={{ width: '100%' }}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="优先级">
            {form.getFieldDecorator('priority', {
              rules: [{ required: true, message: '请输入优先级' }],
            })(<Input placeholder="请输入优先级"/>)}
          </FormItem>
        </Col>
        <Col span={12} className={styles.noDataFill}/>
        {proList.map((item, index) => {
          return (
            <div key={index}>
              <Col span={8}>
                <FormItem key="type" labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} label="产品名称">
                  {form.getFieldDecorator(`pro${index}`, {
                    rules: [{ required: true, message: '请选择产品名称' }],
                  })(
                    <Select style={{ width: '100%' }} onChange={(v) => onChangeMould(index, 'productId', v)}>
                      {
                        resourceList.map(item => {
                          return (<Option key={item.serial_num} value={item.materialId}>{item.materialName}</Option>);
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem key="type" labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} label="工艺线路">
                  {form.getFieldDecorator(`craft${index}`, {
                    rules: [{ required: true }],
                  })(
                    <Select style={{ width: '100%' }} onChange={(v) => onChangeMould(index, 'craftRouteId', v)}>
                      {
                        resourceList.map(item => {
                          return (<Option key={item.serial_num} value={item.materialId}>{item.materialName}</Option>);
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem key="type" labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} label="需求数量">
                  {form.getFieldDecorator(`amount${index}`, {
                    rules: [{ required: true, message: '请输入数量' }],
                  })(<InputNumber maxLength={7} placeholder="请输入数量" style={{ width: '100%' }}
                                  onChange={(v) => onChangeMould(index, 'amount', v)}/>)}
                  {
                    index !== 0 &&
                    <Icon className={styles.formIcon} onClick={e => onDelMould(index)} type="minus-circle"/>
                  }
                </FormItem>
              </Col>
            </div>
          );
        })}
        <Col span={24}>
          <Button style={{ width: '100%', marginTop: 16, marginBottom: 8 }} type="dashed" onClick={onAddMould}
                  icon="plus">
            新增一条产品信息
          </Button>
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
    DraVisible: false,
    selectedRows: [],
    proList: [{ productId: '', amount: '', craftRouteId: '' }],
    resourceList: [],
    craftRouteList: [],//产品下的工艺线路
    pagination: {
      current: 1,
      pageSize: 10,
    },
    formValues: {},
  };

  columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
    },
    {
      title: '产品编号',
      dataIndex: 'productNo',
      render (text, rows) {
        return rows.productList ? rows.productList[0].serialNum : '';
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      render (text, rows) {
        return rows.productList ? rows.productList[0].name : '';
      },
    },
    {
      title: '需求数量',
      dataIndex: 'productAmount',
      render (text, rows) {
        return rows.productList ? rows.productList[0].amount : '';
      },
    },
    {
      title: '现有库存',
      dataIndex: 'productNum',
      render (text, rows) {
        return rows.productList ? rows.productList[0].num : '';
      },
    },
    {
      title: '供需差额',
      dataIndex: 'num',
      render (text, rows) {
        const { amount = 0, num = 0 } = rows.productList;
        return amount > num ? amount - num : 0;
      },
    },
    {
      title: '交货日期',
      dataIndex: 'deliveryDate',
    },
    {
      title: '距交期天数',
      dataIndex: 'deliveryDiff',
      render (text) {
        const deliDate = moment(text);
        const nowDate = moment();
        return deliDate.diff(nowDate, 'day');
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render (t = 2) {
        return ['未排程', '已排程', ''][t];
      },
    },
  ];

  componentDidMount () {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'order/fetch',
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
      type: 'order/fetch',
      payload: params,
    });
  };

  // 根据产品ID查询产品下的工艺线路
  getCraftRouteListById = (proId) => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'resource/fetchBrief',
      payload: { type: proId },
      callback (response) {
        const { data, code } = response;
        code == '200' && that.setState({ craftRouteList: data });
      },
    });
  };

  // 排产
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const ids = [];
    selectedRows.map(item => {
      ids.push(`${item.id}`);
      return '';
    });
    if (selectedRows.length === 0) return;
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
      proList: [{ productId: '', amount: '', craftRouteId: '' }],
      modalVisible: !!flag,
    });
  };

  // 添加addProList
  handleAddProList = array => {
    this.setState({
      proList: JSON.parse(JSON.stringify(array)),
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

  handleDrawerVisible = flag => {
    this.setState({
      DraVisible: !!flag,
    });
  };

  queryAllProduct = (record, index) => {
    const { productList } = record;
    const proColumns = [
      {
        title: '产品编号',
        dataIndex: 'serialNum',
      },
      {
        title: '产品名称',
        dataIndex: 'name',
      },
      {
        title: '需求数量',
        dataIndex: 'amount',
      },
      {
        title: '现有库存',
        dataIndex: 'num',
      },
    ];
    return <Table rowKey={`proTable${index}`} size={'small'} dataSource={productList} pagination={false}
                  bordered={false}
                  columns={proColumns}/>;
  };

  render () {
    const { order: { data }, loading, dispatch } = this.props;
    const { selectedRows, proList, modalVisible, DraVisible, resourceList } = this.state;
    const parentMethods = {
      proList,
      resourceList,
      handleAddProList: this.handleAddProList,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleMenuClick} key="remove">
                    排产
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              expandedRowRender={record => this.queryAllProduct(record)}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Drawer
          placement="bottom"
          height="80%"
          visible={DraVisible}
          closable={false}
          destroyOnClose
          onClose={this.handleDrawerVisible(false)}
          // bodyStyle={{ height: '100%', overflowX: 'hidden', padding: 0 }}
        >
          <OrderProduction/>
        </Drawer>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </div>
    );
  }
}

export default OrderList;
