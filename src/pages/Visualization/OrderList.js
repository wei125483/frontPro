import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  InputNumber,
  Progress, Col,
  Row,
  Table,
  Spin,
  Icon,
  Popconfirm,
  Select,
  Modal,
  Drawer,
  Radio,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import OrderProduction from './OrderProduction.js';
import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, resourceList, handleAdd, craftRouteList, changeProInfo, handleModalVisible, proList, handleAddProList } = props;
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
    if (key === 'productId') {
      changeProInfo(value);
    }
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {};
      params.orderDate = moment(fieldsValue.orderDate).format('YYYY-MM-DD');
      params.deliveryDate = moment(fieldsValue.deliveryDate).format('YYYY-MM-DD');
      params.priority = fieldsValue.priority;
      params.serialNum = fieldsValue.serialNum;
      params.customer = fieldsValue.customer;
      params.productList = [...proList];
      handleAdd(params, form);
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
            {form.getFieldDecorator('serialNum', {
              rules: [{ required: true, message: '请输入订单号' }],
            })(<Input placeholder="请输入订单号" maxLength={20}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="proId" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="客户名称">
            {form.getFieldDecorator('customer', {
              rules: [{ required: true, message: '客户名称' }],
            })(<Input placeholder="请输入客户名称"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="下单日期">
            {form.getFieldDecorator('orderDate', {
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
            })(<InputNumber max={100} min={1} style={{ width: '100%' }} placeholder="请输入优先级"/>)}
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
                        craftRouteList.map(item => {
                          return (<Option key={item.id} value={item.id}>{item.name}</Option>);
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
                  })(<InputNumber maxLength={7} min={0} placeholder="请输入数量" style={{ width: '100%' }}
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
    draVisible: false,
    scheVisible: false,
    selectedRows: [],
    proList: [{ productId: '', amount: '', craftRouteId: '' }],
    resourceList: [],
    craftRouteList: [],//产品下的工艺线路
    scheduleType: 1,
    resultList: [], // 排程结果
    interval: null,
    progress: 0,
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
      type: 'resource/fetchRouter',
      payload: { id: proId },
      callback (response) {
        const { data, code } = response;
        code == '200' && that.setState({ craftRouteList: data });
      },
    });
  };

  // 排产
  handleMenuClick = e => {
    const { selectedRows, interval } = this.state;
    const { dispatch } = this.props;
    const that = this;
    const ids = [];
    selectedRows.map(item => {
      ids.push(`${item.id}`);
      return '';
    });
    if (selectedRows.length === 0) return;

    this.handleDrawerVisible(true);
    this.setState({
      orderIds: ids,
    });

    dispatch({
      type: 'order/orderProgress',
      callback (response) {
        const { data } = response;
        if (data.isFinish) {
          clearInterval(interval);
          that.setState({ interval: null, resultList: data.result });
        }
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

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const that = this;

    dispatch({
      type: 'order/add',
      payload: {
        ...fields,
      },
      callback (resp) {
        const { pagination } = that.state;
        if (resp.code === 200) {
          message.success('添加成功');
          form.resetFields();
          that.handleModalVisible(false);
          that.handleStandardTableChange(pagination);
        } else {
          message.warning(resp.message);
        }
      },
    });
  };

  handleDrawerVisible = flag => {
    this.setState({
      draVisible: !!flag,
    });
  };
  onClose = () => {
    this.setState({
      scheduleType: 1,
      orderIds: [],
      selectedRows: [],
      draVisible: false,
    });
  };
  scheduleTypeChange = (v) => {
    this.setState({
      scheduleType: v.target.value || '',
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

  setScheVisible = (v) => {
    const { dispatch } = this.props;
    const { scheduleType, orderIds } = this.state;
    let interval = null;
    const timeout = setTimeout(() => {
      this.setState({ progress: 50 });
      clearTimeout(timeout);
    }, 1200);
    this.setState({ scheVisible: v });

    const that = this;
    // 订单排程任务提交
    dispatch({
      type: 'order/schedule',
      payload: { type: scheduleType, orderIds: orderIds.toString() },
      callback (response) {
        const { code } = response;
        if (code === 200) {
          interval = setInterval(() => {
            // 3秒请求是否排程完成
            dispatch({
              type: 'order/orderProgress',
              callback (response) {
                const { data } = response;
                if (data.isFinish) {
                  clearInterval(interval);
                  that.setState({ interval: null, resultList: data.result, scheVisible: false, progress: 100 });
                }
              },
            });
          }, 3000);
          that.setState({ interval });
        } else {
          message.warning(response.message);
        }
      },
    });
  };

  scheVisibleOptimize = (v) => {
    const { dispatch } = this.props;
    let interval = null;
    const timeout = setTimeout(() => {
      this.setState({ progress: 50 });
      clearTimeout(timeout);
    }, 1200);
    this.setState({ scheVisible: v });

    const that = this;

    interval = setInterval(() => {
      // 3秒请求是否排程完成
      dispatch({
        type: 'order/orderProgress',
        callback (response) {
          const { data } = response;
          if (data.isFinish) {
            clearInterval(interval);
            console.log(that.state.scheVisible);
            that.setState({ interval: null, resultList: data.result, scheVisible: false, progress: 100 });
          }
        },
      });
    }, 3000);

  };

  clearScheVisible = () => {

    const { dispatch } = this.props;
    const { interval } = this.state;
    const that = this;
    // 取消订单排程
    dispatch({
      type: 'order/orderCancel',
      callback (response) {
        const { code } = response;
        clearInterval(interval);
        that.setState({ scheVisible: false, progress: 0, interval: null });
        if (code !== 200) {
          message.warning(response.message);
        }
      },
    });
  };

  render () {
    const { order: { data }, loading, dispatch } = this.props;
    const { selectedRows, proList, orderIds, modalVisible, progress, draVisible, resourceList, craftRouteList, scheVisible, resultList } = this.state;
    const parentMethods = {
      proList,
      resourceList,
      craftRouteList,
      changeProInfo: this.getCraftRouteListById,
      handleAddProList: this.handleAddProList,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const titleStyle = {
      display: 'flex',
      justifyContent: 'space-between',
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
          title={<div style={titleStyle}>
            <div>
              <span style={{ 'fontWeight': 600, 'padding': '0 50px 0 20px' }}>订单策略</span>
              制令单的生成方式：
              <RadioGroup onChange={this.scheduleTypeChange} value={this.state.scheduleType}>
                <Radio value={1}>按天生成</Radio>
                <Radio value={2}>按班次生成</Radio>
              </RadioGroup>
            </div>
            <div>
              <Button type={'primary'} onClick={() => {
                this.setScheVisible(true);
              }}>排程</Button>
            </div>
          </div>}
          visible={draVisible}
          closable={false}
          destroyOnClose
          onClose={this.onClose}
        >
          <OrderProduction orderIds={orderIds}
                           dispatch={dispatch}
                           scheVisibleOptimize={this.scheVisibleOptimize}
                           dataList={resultList}
                           onClose={this.onClose}/>
        </Drawer>
        <Modal title="任务排产中" visible={scheVisible} footer={null} closable={false} maskClosable={false}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 30 }}><Spin size='large' tip='loading...'/></div>
            <div style={{ marginBottom: 30 }}>正在努力排产中，排产时间可能过长，请稍等...</div>
            <div style={{ marginBottom: 40 }}><Progress percent={progress} status="active"/></div>
            <div>
              <Popconfirm title="确定要终止排程吗？" onConfirm={this.clearScheVisible}
                          icon={<Icon type="question-circle-o" style={{ color: 'red' }}/>}>
                <Button type={'default'}> &nbsp; &nbsp; &nbsp;取&nbsp; &nbsp;消 &nbsp; &nbsp; &nbsp;</Button>
              </Popconfirm>,
            </div>
          </div>
        </Modal>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </div>
    );
  }
}

export default OrderList;
