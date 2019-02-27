import React, { PureComponent } from 'react';
import G6Editor from '@antv/g6-editor';
import { Tree } from 'antd';
import styles from './style.less';

const { DirectoryTree } = Tree;
const { TreeNode } = Tree;

class ItemPannel extends PureComponent {
  constructor (props) {
    super(props);
    this.element = React.createRef();
  }

  componentDidMount () {
    const { editor } = this.props;
    const itempannel = new G6Editor.Itempannel({
      container: this.element.current,
    });
    editor.add(itempannel);
  }

  render () {
    const { data } = this.props;
    return (
      <div className={styles.itempannel} ref={this.element}>
        <DirectoryTree multiple defaultExpandAll>
          {
            data.map(tree => {
                return <TreeNode
                  className="getItem"
                  title={tree.name}
                  key={tree.id}
                  data-shape={tree.id}
                  data-type="node"
                  data-size="170*34"
                  isLeaf/>;
              },
            )
          }
        </DirectoryTree>
      </div>
    );
  }
}

export default ItemPannel;
