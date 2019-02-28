import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Tabs, Button, Transfer, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './index.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;
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
  const targetKeys = [];
  const mockData = [];
  for (let i = 0; i < 20; i += 1) {
    const data = {
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description ${i + 1}`,
      chosen: Math.random() * 2 > 1,
    };
    if (data.chosen) {
      targetKeys.push(data.key);
    }
    mockData.push(data);
  }
  const renderItem = item => {
    const customLabel = (
      <span className="custom-item">
        {item.title} - {item.description}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  };

  return (
    <Modal
      destroyOnClose
      title="新增设备"
      width="600px"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="设备名称">
        {form.getFieldDecorator('name', {
          rules: [
            { required: true, message: '请输入设备名称！' },
            { min: 15, message: '最长不能超过15字符' },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem key="serialNum" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="设备编号">
        {form.getFieldDecorator('serialNum', {
          rules: [
            { required: true, message: '请输入设备名称！' },
            { min: 10, message: '最长不能超过10字符' },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="设备类型">
        {form.getFieldDecorator('deviceType', {
          rules: [{ required: true, message: '请输入设备类型！' }],
        })(
          <Select style={{ width: '100%' }}>
            <Option value="1">注塑</Option>
            <Option value="2">电镀</Option>
            <Option value="3">组装</Option>
          </Select>
        )}
      </FormItem>
      <FormItem key="moldIds" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="使用模具">
        {form.getFieldDecorator('moldIds', {
          rules: [{ required: true, message: '请输入使用模具！' }],
        })(
          <Select style={{ width: '100%' }} mode="multiple">
            <Option value="1">模具1</Option>
            <Option value="2">模具2</Option>
            <Option value="3">模具3</Option>
          </Select>
        )}
      </FormItem>
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
      title: '日历模式',
      dataIndex: 'callNo',
      render: val => `${val} 万`,
    },
    {
      title: '时间',
      dataIndex: 'desc1',
    },
    {
      title: '日历',
      dataIndex: 'desc2',
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

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { itemData, pagination } = this.state;
    const isAdd = !itemData.name;
    dispatch({
      type: isAdd ? 'equip/add' : 'equip/update',
      payload: isAdd
        ? Object.assign(fields, { availableNum: fields.num })
        : Object.assign(itemData, fields),
      callback: response => {
        if (response.code === 200) {
          message.success(isAdd ? '添加成功' : '更新成功');
          this.handleModalVisible();
          this.handleStandardTableChange(pagination);
        } else {
          message.warning(response.message);
        }
      },
    });
  };

  render() {
    const {
      equip: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Tabs defaultActiveKey="1" onChange={() => {}}>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </div>
    );
  }
}

export default EquipmentList;
