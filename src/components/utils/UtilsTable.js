import React from 'react';
import {Button,Row,Col,Tabs} from 'antd'
import {UPPTable, UPPSearch} from '../common/index';

const TabPane = Tabs.TabPane;

class UtilsTable extends React.Component {
    getFields() {
        const {top,search,tabs,table} = this.props.data;
        const {columns,tableInfo,fetchData} = table;
        const children = [];
        let TopCol = {};
        if(top && top.title) {
            TopCol = <Col span={24} key={1}>
                <span
                    style={{
                    "fontSize": 18,
                    "fontWeight": "bold",
                    "float": "left",
                    "marginRight": 10,
                    "marginBottom":'25px'
                    }}>{top.title}</span>
                {(top.operation||top.selfDefault)  &&
                    <div className="table-operations" style={{height:'28px'}}>
                    {top.operation && top.operation.map((item, index) => <span key={index}>
                        <Button type="primary" style={item.style} onClick={item.fun} key={index}>{item.name} </Button>
                        <span style={{fontSize:'12px',color:'#ccc',marginTop:'5px',position:'relative',top:'5px'}}>
                            {item.notice||''}
                        </span>
                        </span>)}
                        {top.selfDefault&&top.selfDefault.map((item,index)=>item.component)}
                    </div>
                }
                {/* {
                    top.selfDefault &&
                    <div className="table-operations" style={{ height: '28px' }}>
                        {top.selfDefault[0].component}
                    </div>
                } */}
            </Col>
            children.push(TopCol);
        } else if (top && top.operation) {
            children.push(<Col span={24} key={1}>
                <div className="table-operations" style={{height:'28px'}}>
                        {top.operation.map((item,index)=><Button type="primary" style={item.style} onClick={item.fun} key={index}>{item.name} </Button>)}
                    </div>
                </Col>);
        }
        if (search && search.searchFields && search.searchFields.length > 0) {
            children.push(<Col span={24} key={2}>
                    <UPPSearch searchFields={search.searchFields} getSearchFields={search.getSearchFields} resetField={search.resetField} isResetField={search.isResetField||''}></UPPSearch>
                </Col>);
        }
        if (tabs && tabs.tabData.length > 0) {
            children.push(<Col span={24} style={{marginTop:'15px'}} key={3}>
            <Tabs onTabClick={tabs.fun} defaultActiveKey={tabs.defaultActiveKey ? tabs.defaultActiveKey : tabs.tabData[0].key + ''}>
                {tabs.tabData.map((item,index)=><TabPane tab={item.name} key={item.key}></TabPane>)}
            </Tabs>            
            </Col>);
        }
        if (table.columns) {
            if (table.rowSelection&&table.onRow) {
                children.push(<Col span={24} style={{marginTop:'15px'}} key={4}>
                    <UPPTable columns={columns} tableInfo={tableInfo} fetchData = {fetchData} rowSelection={table.rowSelection} onRow={table.onRow} pagination={table.pagination}/>
                </Col>);
            } else if(table.rowSelection){
                children.push(<Col span={24} style={{marginTop:'15px'}} key={4}>
                    <UPPTable columns={columns} tableInfo={tableInfo} fetchData = {fetchData} rowSelection={table.rowSelection} pagination={table.pagination}/>
                </Col>);
            }else if(table.onRow){
                children.push(<Col span={24} style={{marginTop:'15px'}} key={4}>
                    <UPPTable columns={columns} tableInfo={tableInfo} fetchData = {fetchData} onRow={table.onRow} pagination={table.pagination}/>
                </Col>);
            }else{
                children.push(<Col span={24} style={{marginTop:'15px'}} key={4}>
                    <UPPTable columns={columns} tableInfo={tableInfo} fetchData = {fetchData} pagination={table.pagination}/>
                </Col>);
            }
        }

        return children;
    }
    render() {
        return (
            <div>
                <Row>
                    {this.getFields()}
                </Row>
                {this.props.children}
            </div>
        )
    }
}

export default UtilsTable