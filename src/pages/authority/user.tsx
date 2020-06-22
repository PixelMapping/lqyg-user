import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Card,Form,Input,DatePicker,Button,Table,Modal,Select} from 'antd';

import './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props:any) => {
  const columns=[
    {
      title:'姓名',
      dataIndex:'name',
      key:'name',
    },
    {
      title:'登录手机号',
      dataIndex:'',
      key:'',
    },
    {
      title:'角色',
      dataIndex:'',
      key:'',
    },    
    {
      title:'添加时间',
      dataIndex:'',
      key:'',
    },  
    {
      title:'操作',
      dataIndex:'',
      key:'',
      render:(tags:any)=>(
        <div>
          <Button type="link">编辑</Button>
          <Button type="link">绑定角色</Button>
          <Button type="link">禁止登陆</Button>
          <Button type="link">禁用</Button>
        </div>
      )
    },
  ]
  const [data,setData] = useState([{name:222}])
  const [isAdd,setStatus] = useState(true)
  const [visible,setVisible] = useState(false)

  useEffect(() => {

  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div className="detail">
        <Card title="用户管理查询" className="mb24">
          <Form layout="inline">
            <Form.Item className="w200">
              <Input placeholder="编号/姓名"></Input>
            </Form.Item>      
            <Form.Item className="w200">
              <Input placeholder="登陆手机号"></Input>
            </Form.Item>   
            <Form.Item className="w200">
              <Input placeholder="角色"></Input>
            </Form.Item> 
            <Form.Item className="w200">
              <Input placeholder="是否禁止登录"></Input>
            </Form.Item>     
            <Form.Item className="w200">
              <DatePicker placeholder="添加时间" style={{width:'100%'}}></DatePicker>
            </Form.Item>   
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Form>
        </Card>
        <Card title="用户列表"  extra={<Button>添加用户</Button>}>
          <Table columns={columns} dataSource={data} ></Table>
        </Card>

        <Modal title={isAdd?'新增收件人':'修改收件人'} visible={visible}>
          <Form {...layout}>
            <Form.Item label="姓名">
              <Input placeholder="请输入姓名"></Input>
            </Form.Item>
            <Form.Item label="手机号码">
              <Input placeholder="请输入手机号码"></Input>
            </Form.Item>
            <Form.Item label="地址">
              <Input.TextArea placeholder="请输入地址"></Input.TextArea>
            </Form.Item>
          </Form>
        </Modal>
    </div>

  );
};
