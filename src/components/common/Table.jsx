import React from 'react';
import {Table} from 'antd';
const UPPTable = (props) => {
    const {columns, tableInfo,fetchData,rowSelection,onRow,pagination=true} = props;
    const paginationInfo= props.paginationInfo || {  //分页信息
        pageSize: tableInfo.curPageSize,    //每页条数
        current: tableInfo.curPageNum,
        total:tableInfo.data.totalCount,//总条数
        showSizeChanger:true,   //是否可以改变 pageSize
        simple: tableInfo.simple || false,
        onChange:(page,pageSize)=>{  //分页操作获取对应数据
            fetchData(page-1,pageSize,tableInfo.searchFields);
            // console.log(page,pageSize);
        },
        onShowSizeChange:(current, pageSize)=>{ //改变每页显示条目数
            fetchData(current-1,pageSize,tableInfo.searchFields);
            // console.log(current, pageSize);
        },
        showTotal:(total)=>{    //显示总条数
            return `总共 ${total} 条`;
        },
        showQuickJumper:true    //是否可以快速跳转至某页
    };
    
    let runFun=(func,args)=>{
        if(func){
            return func(args);
        }
    }

    const record= tableInfo.data.items;
 
    return (
        <div>
            {rowSelection?           
                <Table
                columns={columns}
                dataSource={ tableInfo.data.items}
                rowKey={record => record.id}
                loading={tableInfo.loading}
                pagination={pagination?paginationInfo:pagination}
                bordered={true}
                onRow={(record) =>{return runFun(onRow,record)}}
                rowSelection={rowSelection}
                scroll = { props.scroll || {}  }                
                />
                :
                <Table
                columns={columns}
                dataSource={ tableInfo.data.items}
                rowKey={record => record.id}
                loading={tableInfo.loading}
                pagination={pagination?paginationInfo:pagination}
                bordered={true}
                scroll = { props.scroll || {} }
                />}

        </div>
    )
}
export {UPPTable}