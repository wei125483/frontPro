import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Popconfirm,
  Col,
  Row,
  Modal,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import styles from './index.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
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
      width={720}
      title="新增采购计划"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={12}>
          <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="物料名称">
            {form.getFieldDecorator('materialName', {
              rules: [
                { required: true, message: '请输入物料名称！' },
                { max: 30, message: '最长不能超过30字符' },
              ],
            })(<Input placeholder="请输入" maxLength={30} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="proId" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="物料编号">
            {form.getFieldDecorator('materialId', {
              rules: [
                { required: true, message: '请输入物料编号！' },
                { max: 20, message: '最长不能超过20字符' },
                { pattern: /^\w+$/, message: '请输入字母+数字组合' },
              ],
            })(<Input placeholder="请输入" maxLength={20} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="数量">
            {form.getFieldDecorator('amount', {
              rules: [{ required: true, message: '请输入数量！' }],
            })(<InputNumber placeholder="请输入" max={999999} style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="到货时间">
            {form.getFieldDecorator('arrivalDate', {
              rules: [{ required: true, message: '请输入到货时间！' }],
            })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ purchase, loading }) => ({
  purchase,
  loading: loading.models.purchase,
}))
@Form.create()
class PurhaseList extends PureComponent {
  state = {
    modalVisible: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    reqParam: {
      name: '',
      startDate: '',
      endDate: '',
    },
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
    },
    {
      title: '物料编号',
      dataIndex: 'materialId',
    },
    {
      title: '数量',
      dataIndex: 'amount',
    },
    {
      title: '下单时间',
      dataIndex: 'createDate',
    },
    {
      title: '到货时间',
      dataIndex: 'arrivalDate',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Popconfirm
          title="确认要废弃这条采购计划吗？"
          onConfirm={() => this.confirmDel(record)}
          okText="确定"
          cancelText="取消"
        >
          <a href="#">废弃</a>
        </Popconfirm>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination, reqParam } = this.state;
    dispatch({
      type: 'purchase/fetch',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...reqParam,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg = [], sorter = {}) => {
    const { dispatch } = this.props;
    const { reqParam } = this.state;
    this.setState({ pagination });

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...reqParam,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'purchase/fetch',
      payload: params,
    });
  };

  confirmDel = rows => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    if (!rows || !rows.id) return;
    const ids = [];
    ids.push(rows.id);
    dispatch({
      type: 'purchase/remove',
      payload: { ids },
      callback: response => {
        if (response.code === 200) {
          message.success('废除成功');
        } else {
          message.warning(response.message);
        }
        this.handleStandardTableChange(pagination);
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'purchase/add',
      payload: {
        ...Object.assign(fields, { arrivalDate: moment(fields.arrivalDate).format('YYYY-MM-DD') }),
      },
      callback: response => {
        if (response.code === 200) {
          message.success('添加成功');
        } else {
          message.warning(response.message);
        }
        this.handleModalVisible();
        this.handleStandardTableChange(pagination);
      },
    });
  };

  render() {
    const {
      purchase: { data },
      loading,
    } = this.props;
    const { modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
            </div>
            <StandardTable
              rowSelection={null}
              selectedRows={[]}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </div>
    );
  }
}

export default PurhaseList;
