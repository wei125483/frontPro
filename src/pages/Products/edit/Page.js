import React, { PureComponent } from 'react';
import G6Editor from '@antv/g6-editor';
import { Drawer, Button, Form } from 'antd';
import ItemEditor from './ItemEditor';
import styles from './style.less';

class Page extends PureComponent {
  constructor (props) {
    super(props);
    this.element = React.createRef();
    this.state = {
      data: {},
      visible: false,
    };
  }

  componentDidMount () {
    const { editor } = this.props;

    const page = new G6Editor.Flow({
      graph: {
        container: this.element.current,
      },
    });
    page.on('node:click', ev => {
      const { shape, id } = ev.item.model;
      const { dataList } = this.props;
      let obj = { craftsId: shape };
      dataList.map((item) => {
        if (item.id === id) {
          Object.assign(obj, item);
        }
      });
      this.setState({
        visible: true,
        data: { ...obj },
      });
    });
    editor.add(page);
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 保存数据
  handleSubmit = (fieldsValue) => {
    const { form, callBack } = this.props;
    const { data } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      const nowData = {};
      nowData.devices = [...fieldsValue];
      nowData.id = data.id;
      nowData.craftsId = data.craftsId;
      nowData.minLimitNum = values.minLimitNum;
      nowData.produceId = values.produceId;
      // // 将表单传回Index页面
      callBack(nowData);
      this.onClose();
    });
  };

  render () {
    // 获取节点出事数据
    const { data, visible } = this.state;
    // 获取form表单
    const {
      form: { getFieldDecorator },
      resourceList,
      equipList,
    } = this.props;

    return (
      // 嵌套类
      <React.Fragment>
        <div className={styles.page} ref={this.element}/>
        <Drawer
          title="路线详情"
          closable={false}
          visible={visible}
          placement="right"
          width="680"
          onClose={this.onClose}
          destroyOnClose
        >
          <Form className="ant-advanced-search-form">
            <ItemEditor itemData={data} resourceList={resourceList} handleSubmit={this.handleSubmit}
                        equipList={equipList} getFieldDecorator={getFieldDecorator}/>
          </Form>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default Form.create()(Page);
