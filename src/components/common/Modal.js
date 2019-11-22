import React from 'react';
import {Modal} from 'antd';

const UPPModal = (props) => {
    const {modalInfo, handleOk, handleCancel,maskClosable,closable,destroyOnClose=false, width='416px'} = props;
    return (
        <div>
            <Modal
                destroyOnClose={destroyOnClose}
                title={modalInfo.title}
                visible={modalInfo.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={!maskClosable}
                closable={!closable}
                footer={null}
                width={width}
                destroyOnClose
                >
                {props.children}
            </Modal>
        </div>
    );
}
export {UPPModal}