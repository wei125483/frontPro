import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Button, Col, Row, Modal, message, Radio } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, itemData = {} } = props;
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
      width={1000}
      title="新增库存"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={12}>
          <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="产品名称">
            {form.getFieldDecorator('name', {
              initialValue: itemData.name || '',
              rules: [{ required: true }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="proId" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="产品编号">
            {form.getFieldDecorator('serialNum', {
              initialValue: itemData.serialNum || '',
              rules: [{ required: true }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="产品类型">
            {form.getFieldDecorator('productType', {
              initialValue: itemData.productType || 1,
              rules: [{ required: true }],
            })(
              <Select style={{ width: '100%' }} placeholder="请选择">
                <Option value={1}>原料</Option>
                <Option value={2}>半成品</Option>
                <Option value={3}>成品</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="生产类型">
            {form.getFieldDecorator('sourceType', {
              initialValue: itemData.sourceType || 1,
              rules: [{ required: true }],
            })(
              <Select style={{ width: '100%' }} placeholder="请选择">
                <Option value={1}>采购</Option>
                <Option value={2}>自产</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="unit" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="单位">
            {form.getFieldDecorator('unit', {
              initialValue: itemData.unit || '',
              rules: [{ required: true }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="当前库存">
            {form.getFieldDecorator('num', {
              initialValue: itemData.num || '',
              rules: [{ required: true }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource,
}))
@Form.create()
class ResourceList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    itemData: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    productType: '1',
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '料品编号',
      dataIndex: 'materialNum',
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      render: val => {
        // 1 - 原料； 2 - 半成品； 3 - 成品
        const index = val || 1;
        return ['原料', '半成品', '成品'][index - 1];
      },
    },
    {
      title: '生产类型',
      dataIndex: 'index',
      render: val => {
        // 1 - 采购; 2 - 自产；
        const index = val || 1;
        return ['采购', '自产'][index - 1];
      },
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '当前库存',
      dataIndex: 'num',
    },
    {
      title: '操作',
      render: val => {
        return <a onClick={() => this.updateModalVisible(val)}>编辑</a>;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { productType, pagination } = this.state;
    dispatch({
      type: 'resource/fetch',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        productType,
      },
    });
  }

  // 改变分页请求接口
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { productType } = this.state;
    this.setState({ pagination });
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      productType,
    };

    dispatch({
      type: 'resource/fetch',
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
      type: 'resource/remove',
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

  // 切换物料类型
  handleSearch = e => {
    e.preventDefault();
    const selectIndex = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
        productType: selectIndex,
      },
    });
  };

  // 添加时弹出层
  handleModalVisible = flag => {
    this.setState({
      itemData: {},
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

  // 添加执行函数
  handleAdd = fields => {
    const { dispatch } = this.props;
    const { itemData, pagination } = this.state;
    const isAdd = !itemData.name;
    dispatch({
      type: isAdd ? 'resource/add' : 'resource/update',
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
      resource: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, itemData } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      itemData, // 修改数据时，赋值对象
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Radio.Group defaultValue="1" onChange={this.handleSearch} buttonStyle="solid">
                <Radio.Button value="1">成品</Radio.Button>
                <Radio.Button value="2">半成品</Radio.Button>
                <Radio.Button value="3">原料</Radio.Button>
              </Radio.Group>
              <Button
                className={styles.add}
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
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
              rowKey="resourceTable"
              selectedRows={selectedRows}
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

export default ResourceList;
