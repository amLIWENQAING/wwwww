import React,{Component} from 'react';
import {Tree,Button,Input,Form,Row,Spin,Modal,Tooltip,message} from 'antd';
import {map} from 'lodash';

// import {Link} from 'react-router-dom';
// import { get } from 'http';

const TreeNode = Tree.TreeNode;

const UPPTree = (props) => {
    return (
        <Tree showLine defaultExpandAll={true}>
            <TreeNode title="parent 1" key="0-0">
                <TreeNode title="parent 1-0" key="0-0-0">
                    <TreeNode title={<div><span>leaf</span>&nbsp;&nbsp;&nbsp;&nbsp;<Button type="primary" size="small">按钮</Button></div>} key="0-0-0-0"/>
                    <TreeNode title="leaf" key="0-0-0-0"/>
                    <TreeNode title="leaf" key="0-0-0-1"/>
                    <TreeNode title="leaf" key="0-0-0-2"/>
                </TreeNode>
                <TreeNode title="parent 1-1" key="0-0-1">
                    <TreeNode title="leaf" key="0-0-1-0"/>
                </TreeNode>
                <TreeNode title="parent 1-2" key="0-0-2">
                    <TreeNode title="leaf" key="0-0-2-0"/>
                    <TreeNode title="leaf" key="0-0-2-1"/>
                </TreeNode>
            </TreeNode>
        </Tree>
    )
}
const x = 3;
const y = 2;
const z = 1;
const gData = [];
const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

class UppDragTree extends Component {
  constructor(props){
    super(props);
    this.state = {
      gData : props.result,
      editValidateStatu:'',
      addValidateStatu:'',
      editHelp :null,
      addHelp:null,
      inputingStr:'',
      spinning : false,
      expandedKeys:[]
    };
  }
  componentWillReceiveProps(){
      this.setState(state=>{state.spinning = true;return state;});
      
      this.loadData();
    }
  componentWillMount(){
    this.setState(state=>{state.spinning = true;return state;});
    
    this.loadData();
  }
  
  onDragEnter = (info) => {
    //console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };
  onDrop = (info) => {
    //console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.gData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i - 1, 0, dragObj);
      }
    } else {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }
    this.setState({
      gData: data,
    });
  };

  //选择树节点
  onSelectNode = (selectedKeys,e) => {
    // console.log(e.node.props.nodeItem)
    // let selectedNode = e.node.props.nodeItem;
    // if (selectedNode.depth == 2 && e.selected) {
      // let parent = this.getItem(this.state.gData,selectedNode,1)
      // this.props.getSpeciality(parent,selectedNode)
    // } else {
      // this.props.getSpeciality({},{})
    // }
  }

  SetgDate = (data)=>{
    this.setState({gData})
  };
   /**
   * 更改状态
   * 
   * @memberof UppDragTree
   */
  changeStatus=(item)=>{
    this.setState(state=>{state.spinning = true;return state;});

    this.props.updateActiveState(item)
    .then(r=>{
      this.loadData();
    })
    .catch(error=>{

    });
  };

  deleteOrganizationStructure=(item)=>{
    let self = this;

    Modal.confirm({
      title: '确认删除',
      content: '确认删除该组织结构，'+ item.name,
      onOk() {
        self.setState(state=>{state.spinning = true;return state;});

        self.props.deleteOrganizationStructure(item.id)
        .then(r=>{
          self.loadData();
        })
        .catch(error=>{
    
        });
      },
      onCancel() {},
    });
  };

  getItem =(arr, item,parent)=>{
    for(let i =0;i<arr.length;i++){
      if(arr[i].id == item.id){
        return arr[i];
      }      
      else{
        let result = this.getItem(arr[i].children,item);
        if(result){
          if (parent) {
            return arr[i];
          } else {
            return result;
          }
        }
      }
    }
    return null;
  }

  clearAddEditItem = (arr)=>{
    for(let i=0;i<arr.length;i++){
      
      if(arr[i].editting)
      {
        arr[i].editting = false;
      }

      if(arr[i].adding){
        arr.splice(i,1);
        i--;
      }      
      if(i>=0 && arr[i].children)
        this.clearAddEditItem(arr[i].children);
    }
  }

  handleEdit=(item,e)=>{
    e.preventDefault();
    this.setState(state=>{
      this.clearAddEditItem(state.gData);
      let sourceItem = this.getItem(state.gData,item);
      if(sourceItem != null){
        sourceItem.editting  = true;
      }
      state.inputingStr  = sourceItem.name;
      return state;
    });
  }

  //给子集添加节点
  handleAddChildren=(item)=>{
    let expandedKeys = this.state.expandedKeys;
    let chengge = 0
    if (expandedKeys.length == 0 && expandedKeys.indexOf(item.id + "") == -1) {
      expandedKeys.push(item.id + "")
    } else if (expandedKeys.length > 0 && expandedKeys.indexOf(item.id + "") == -1) {
      expandedKeys.push(item.id + "");
      chengge = 1;
    }
    this.setState(state=>{
      this.clearAddEditItem(state.gData);
      let sourceItem = this.getItem(state.gData,item);
      if(sourceItem != null){
        sourceItem.children.push(
          {
            id:'',
            name:'',
            depth:0,
            isUsing:true,
            children:[],
            adding:true,
            parentId : sourceItem.id,
          }
        );
      }
      state.expandedKeys=expandedKeys;
      return state;
    });
    if (chengge) {
      this.refs['treeNode' + item.id].onExpand()
    }
  }

  handleSaveAdd= (item) => {
    if (this.state.inputingStr) {
      this.setState(state=>{state.spinning = true; return state;});
      let sourceItem = this.getItem(this.state.gData,item);      
      sourceItem.name  = this.state.inputingStr;
      this.props.addStructure(sourceItem)
      .then(r=>{
        if (r.result.success) {
          this.loadData();
          message.success(r.result.msg)
        } else {
          this.loadData();
          message.error(r.result.msg)
        }
        
      })
      .catch(error=>{
        console.log(error)
        message.error("添加组织机构出现错误")
        this.setState(state=>{state.spinning = false; return state;});
      });
    } else {
      message.error("请填写科室或专业")
    }
  }

  handleSaveUpdate=(item)=>{

    this.setState(state=>{state.spinning = true; return state;});

    let sourceItem = this.getItem(this.state.gData,item);      
    sourceItem.name  = this.state.inputingStr;

    this.props.saveEdit(sourceItem)
    .then(r=>{
      this.loadData();
    })
    .catch(error=>{

    });
  }

  validateInput = (item,e)=>{
    //alert('asd');
    let value = e.target.value;
    this.setState(state=>{
      state.inputingStr = value;
      return state;
    });
  }

  //添加一级组织结构
  addFirstLevelStructure =()=>{
    this.clearAddEditItem(this.state.gData);
    this.setState(state=>{
      state.gData.push(
        {
          id:'',
          name:'',
          depth:0,
          isUsing:true,
          children:[],
          adding:true,
          parentId:0,
        }
      );
      return state;
    });
  }

  //删除组织结构
  handleClose(item,e) {
    e.preventDefault();
    //console.log(this.state.gData)
    this.clearAddEditItem(this.state.gData);
    // if (this.state.gData.indexOf(item) != -1) {
    //   this.setState(state=>{
    //     state.gData.splice(this.state.gData.indexOf(item),1)
    //     return state;
    //   });
    // } else {
    // }
  }

  //展开/收起节点时触发
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    });
  }

  loadData=()=>{
    this.props.loadData().then(dataResult=>{      
      let arr = map(dataResult.result,(node)=>{
        return this.props.covertData(node);
      });

      this.setState(state=>{
        state.gData = arr;
        
        state.inputingStr = '';
        state.spinning = false;

        return state;
      });

    })
    .catch((error)=>{});
  }
  setNodeName = (name) => {
    if(name.length >20) {
      name = name.substring(0,5) + '...'
    }
    return name
  }

  loop = data => data.map((item) => {
    let statusText=item.isUsing?"禁用":"启用";
    
    const addNode=(item)=>(
      <div style={{display:'inline-block'}}>
        <Form.Item style={{display:'inline-block'}}>
          <Input onChange={ e=>{this.validateInput(item,e)} } maxLength='20'/>
        </Form.Item>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button shape="circle" icon="check" size="small" title="保存新增" onClick={ ()=>{this.handleSaveAdd(item)} }></Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button shape="circle" icon="close" size="small" title="取消" onClick={ e=>{this.handleClose(item,e)} }></Button>
      </div>
    );

    const editNode=(item)=>(
      <div style={{display:'inline-block'}}>
        <Form.Item style={{display:'inline-block'}} validateStatus={this.state.editValidateStatu} help={this.state.editHelp} >
          <Input onChange={(e)=>{this.validateInput(item,e)} } defaultValue={item.name} maxLength='20'/>
        </Form.Item>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button shape="circle" icon="check" size="small" title="保存修改" onClick={ ()=>{this.handleSaveUpdate(item)} }></Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
         <Button shape="circle" icon="close" size="small" title="取消" onClick={ e=>{this.handleClose(item,e)} }></Button>
      </div>
    );

    const displayNode =(item)=> (
      <div style={{display:'inline-block'}}>
        <Tooltip title={item.name}>
          <span >{this.setNodeName(item.name)}</span>
        </Tooltip>
        {item.depth==1&&<Button shape="circle" icon="plus" size="small" title="新增子类" style={{marginLeft:'12px'}} onClick={()=>{this.handleAddChildren(item)} }></Button>}
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button shape="circle" icon="edit" size="small" onClick={e=>{this.handleEdit(item,e)}}  title="编辑"></Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button shape="circle" icon="minus" size="small" data-id={item.id} onClick={()=>{this.deleteOrganizationStructure(item)} } title="删除"></Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button type={item.isUsing?"danger":"primary"} size="small" data-id={item.id} data-status={!item.isUsing} onClick={()=>{ this.changeStatus(item)} }>{statusText}</Button>
      </div>
    );

    const nodeInfo = (item)=>{
      if(item.editting){
        return editNode(item);
      }
      else if(item.adding){
        return addNode(item);
      }
      return displayNode(item);
    }
    
    if (item.children && item.children.length) {
      return <TreeNode key={item.id.toString()} title={nodeInfo(item)} nodeItem={item} ref={'treeNode' + item.id}>{this.loop(item.children)}</TreeNode>;
    }
      return <TreeNode key={item.id.toString()} title={nodeInfo(item)} nodeItem={item} ref={'treeNode' + item.id}/>;
  });

  render() {
    let resultData  = this.state.gData;
    const spinning = this.state.spinning;
    const expandedKeys = this.state.expandedKeys;
    return (
      <Spin spinning={spinning}>
        {resultData&&resultData.length>0&&
        <Tree
          showLine
          expandedKeys={expandedKeys}
          onExpand={this.onExpand}
          // defaultExpandedKeys={expandedKeys}
          //autoExpandParent
          //className="draggable-tree"
          //draggable
          //onDragEnter={this.onDragEnter}
          //onDrop={this.onDrop}
          onSelect={this.onSelectNode}
        >
          {this.loop(resultData)}
        </Tree>}
      </Spin>
    );
  }
}

export {UPPTree,UppDragTree}