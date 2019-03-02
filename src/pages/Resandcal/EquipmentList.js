import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Row, Col, Tabs, Button, DatePicker, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './index.less';
import moment from 'moment';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { form, handleAdd, state, handleModalVisible, changeWeeks } = props;
  const { modalVisible, moldList, itemData, weeks, weekCheckout } = state;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.activeTime = moment(fieldsValue.activeTime).format('YYYY-MM-DD');
      fieldsValue.moldIds = `[${fieldsValue.moldIds.toString()}]`;
      handleAdd(fieldsValue, form);
    });
  };

  const moldInitV = {};
  if (itemData.moldIds && itemData.moldIds.split(',').length) {
    moldInitV.initialValue = itemData.moldIds.split(',');
  }

  return (
    <Modal destroyOnClose title={itemData.moldIds?'修改设备信息':'新增信息'} width={720} visible={modalVisible} onOk={okHandle}
           onCancel={() => handleModalVisible()}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={12}>
          <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="设备名称">
            {form.getFieldDecorator('name', {
              initialValue: itemData.name || '',
              rules: [
                { required: true, message: '请输入设备名称！' },
                { max: 15, message: '最长不能超过15字符' },
              ],
            })(<Input placeholder="请输入" maxLength={15}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="serialNum" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="设备编号">
            {form.getFieldDecorator('serialNum', {
              initialValue: itemData.serialNum || '',
              rules: [
                { required: true, message: '请输入设备名称！' },
                { max: 10, message: '最长不能超过10字符' },
              ],
            })(<Input placeholder="请输入" maxLength={10}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="设备类型">
            {form.getFieldDecorator('deviceType', {
              initialValue: itemData.deviceType || '1',
              rules: [{ required: true, message: '请输入设备类型！' }],
            })(
              <Select style={{ width: '100%' }}>
                <Option value="1">注塑</Option>
                <Option value="2">电镀</Option>
                <Option value="3">组装</Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="moldIds" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="适用模具">
            {form.getFieldDecorator('moldIds', {
              ...moldInitV,
              rules: [{ required: true, message: '请选择适用模具！' }],
            })(
              <Select style={{ width: '100%' }} mode="multiple" showSearch optionFilterProp="children">
                {
                  moldList.map(item => {
                    return (<Option key={item.serialNum} value={item.moldId}>{item.moldName}</Option>);
                  })
                }
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="moldIds" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开始周期">
            {form.getFieldDecorator('weekStart', {
              initialValue: itemData.weekStart || 1,
            })(
              <Select style={{ width: '100%' }} onChange={changeWeeks}>
                {
                  weeks.map((item, index) => {
                    return (<Option key={`start${item.index}`} value={index + 1}>{item}</Option>);
                  })
                }
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="moldIds" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="结束周期">
            {form.getFieldDecorator('weekEnd', {
              initialValue: itemData.weekEnd || '',
              rules: [{ required: true, message: '请选择结束周期！' }],
            })(
              <Select style={{ width: '100%' }}>
                {
                  weeks.map((item, index) => {
                    return (<Option key={`end${item.index}`} disabled={weekCheckout > index + 1}
                                    value={index + 1}>{item}</Option>);
                  })
                }
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="moldIds" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="截止日期">
            {form.getFieldDecorator('activeTime', {
              initialValue: itemData.activeTime || '',
              rules: [{ required: true, message: '请输入截止日期！' }],
            })(
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>,
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ equip, loading }) => ({
  equip,
  loading: loading.models.equip,
}))
@Form.create()
class EquipmentList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    itemData: {},
    moldList: [],
    weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
    weekCheckout: 0,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    formValues: {},
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备编号',
      dataIndex: 'serialNum',
    },
    {
      title: '设备工艺类型',
      dataIndex: 'deviceType',
    },
    {
      title: '适用模型',
      dataIndex: 'moldIds',
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
    },
    {
      title: '操作',
      render: (text, record) => (
        <div>
          <a onClick={() => this.updateModalVisible(record)}>编辑</a>&nbsp;
        </div>
      ),
    },
  ];

  columns1 = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备编号',
      dataIndex: 'serialNum',
    },
    {
      title: '周重复开始时间',
      dataIndex: 'weekStart',
      render: (v = 1) => {
        return this.state.weeks[v - 1];
      },
    },
    {
      title: '周重复结束时间',
      dataIndex: 'weekEnd',
      render: (v = 1) => {
        return this.state.weeks[v - 1];
      },
    },
    {
      title: '截止时间',
      dataIndex: 'activeTime',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'equip/fetch',
      payload: {
        ...pagination,
      },
    });

    const that = this;

    // 查询所有模具信息
    dispatch({
      type: 'mold/fetchBrief',
      payload: {},
      callback(response) {
        const { data, code } = response;
        if (code == '200') {
          that.setState({
            moldList: data,
          });
        }
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
      type: 'equip/fetch',
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
      type: 'equip/remove',
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // 修改时弹出层
  updateModalVisible = obj => {
    this.setState({
      itemData: obj,
      modalVisible: true,
    });
  };

  handleAdd = (fields, form) => {

    const { dispatch } = this.props;
    const { itemData, pagination } = this.state;
    const isAdd = !itemData.id;
    const param = Object.assign(fields, { 'moldIds': fields.moldIds.toString() });
    dispatch({
      type: isAdd ? 'equip/add' : 'equip/update',
      payload: isAdd ? param : Object.assign(itemData, fields),
      callback: response => {
        if (response.code === 200) {
          form.resetFields();
          message.success(isAdd ? '添加成功' : '更新成功');
          this.handleModalVisible();
        } else {
          message.warning(response.message);
        }
        this.handleStandardTableChange(pagination);
      },
    });
  };

  changeWeeks = (v) => {
    this.setState({
      weekCheckout: v,
    });
  };

  render() {
    const {
      equip: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      state: this.state,
      changeWeeks: this.changeWeeks,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Tabs defaultActiveKey="1" onChange={() => {
            }}>
              <TabPane tab="设备列表" key="1">
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
              </TabPane>
              <TabPane tab="设备工作日历" key="2">
                <StandardTable
                  rowSelection={null}
                  selectedRows={[]}
                  loading={loading}
                  data={data}
                  columns={this.columns1}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </TabPane>
            </Tabs>
            ,
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </div>
    );
  }
}

export default EquipmentList;
