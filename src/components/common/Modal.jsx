import React from 'react';
import {Modal} from 'antd';

const UPPModal = (props) => {
    const {modalInfo, handleOk, handleCancel,maskClosable,closable,destroyOnClose=false} = props;
    const width = props.width || '416px';
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
                >
                {props.children}
            </Modal>
        </div>
    );
}
export {UPPModal}