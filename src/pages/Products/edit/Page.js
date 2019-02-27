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
      data: [],
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
      const { id } = ev.item.model;
      const { dataList } = this.props;
      console.log('dataList', dataList, id);
      let data = {};
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].id === id) {
          data = dataList[i];
          break;
        }
      }
      this.setState({
        visible: true,
        data: Object.keys(data).map(key => {
          return {
            name: key,
            value: data[key],
          };
        }),
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
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, callBack } = this.props;
    form.validateFields((err, values) => {
      const data = [];
      let i = 0;
      while (values[`name-${i}`] !== undefined) {
        if (values[`name-${i}`] !== '') {
          data[values[`name-${i}`]] = values[`value-${i}`];
        }
        i++;
      }
      // 将表单传回Index页面
      callBack(values);
      this.onClose();
    });
  };

  // 添加属性
  add = () => {
    this.setState(preState => {
      preState.data.push({
        name: '',
        value: '',
      });
      return preState;
    });
  };

  // 删除属性
  delete = (i) => {
    this.setState(preState => {
      preState.data.splice(i, 1);
      return preState;
    });
  };

  render () {
    // 获取节点出事数据
    const { data, visible } = this.state;
    // 获取form表单
    const { form: { getFieldDecorator } } = this.props;

    return (
      // 嵌套类
      <React.Fragment>
        <div className={styles.page} ref={this.element}/>
        <Drawer title="路线详情" closable={false} visible={visible} placement="right" width="400" onClose={this.onClose}
                destroyOnClose={true}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
            <ItemEditor data={data} getFieldDecorator={getFieldDecorator}/>
            <br/>
            <Button type="primary" htmlType="submit" block>保存</Button>
          </Form>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default Form.create()(Page);
