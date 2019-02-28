import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Col, Row, Icon, Modal, InputNumber } from 'antd';
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
      width={740}
      title="新增模具"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={12}>
          <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="模具名称">
            {form.getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入模具名称！' },
                { max: 20, message: '最长不能超过20字符' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="proId" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="模具编号">
            {form.getFieldDecorator('serialNum', {
              rules: [
                { required: true, message: '请输入模具编号' },
                { max: 15, message: '最长不能超过15字符' },
                { pattern: /^\w+$/, message: '请输入字母+数字组合' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="产品编号">
            {form.getFieldDecorator('productIds', {
              rules: [{ required: true, message: '请输入产品编号！' }],
            })(<Input placeholder="请输入" />)}
            <Icon className={styles.formIcon} onClick={() => onAddMould()} type="plus-circle" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="穴数">
            {form.getFieldDecorator('amount', {
              rules: [{ required: true, message: '请输入穴数！' }],
            })(<InputNumber max={99} placeholder="请输入" style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
        {modalLenght.map((item, index) => {
          return (
            <div key={index}>
              <Col span={12}>
                <FormItem
                  key="type"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  label="产品编号"
                >
                  {form.getFieldDecorator(`productIds${item.id}`, {
                    rules: [{ required: true, message: '请输入产品编号！' }],
                    initialValue: item.proId || '',
                  })(<Input placeholder="请输入" />)}
                  <Icon
                    className={styles.formIcon}
                    onClick={() => onDelMould(index)}
                    type="minus-circle"
                  />
                </FormItem>
              </Col>
            </div>
          );
        })}
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ mold, loading }) => ({
  mold,
  loading: loading.models.mold,
}))
@Form.create()
class MouldList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    modalLenght: [],
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
      title: '模具名称',
      dataIndex: 'name',
    },
    {
      title: '模具编号',
      dataIndex: 'serialNum',
    },
    {
      title: '规格',
      dataIndex: 'callNo',
    },
    {
      title: '产品编号',
      dataIndex: 'productSerialNum',
      render: val => {
        return val.toString();
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'mold/fetch',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
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
      type: 'mold/fetch',
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
          type: 'mold/remove',
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
    console.log(fields);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'mold/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
    //
    // message.success('添加成功');
    // this.handleModalVisible();
  };

  render() {
    const {
      mold: { data },
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </div>
    );
  }
}

export default MouldList;
