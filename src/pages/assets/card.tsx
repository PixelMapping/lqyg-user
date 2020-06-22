import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

import { Card,Form,Input,DatePicker,Button,Table, message ,Modal ,Switch} from 'antd';
import {bankPage,switchBank,setDefault,addBank,uptBank,delBank} from '@/services/asset';

import './index.less';


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props:any) => {
  const columns=[
    {
      title:'银行账户',
      dataIndex:'bankName',
      key:'bankName',
    },
    {
      title:'银行账号',
      dataIndex:'bankAccount',
      key:'bankAccount',
    },
    {
      title:'开户行',
      dataIndex:'openBank',
      key:'openBank',
    },
    {
      title:'添加时间',
      dataIndex:'crtTime',
      key:'crtTime',
    },
    {
      title:'操作',
      key:'action',
      render:(tags:any)=>(
        <div>
          <Button type="link" onClick={edit.bind(this,tags)}>编辑</Button>
          {
            tags.useFlag==1?(
              <Button type="link" onClick={setStatus.bind(this,tags.bankId,2)}>启用</Button>
            ):(
              <Button type="link" onClick={setStatus.bind(this,tags.bankId,1)}>禁用</Button>
            )
          }
          <Button type="link" onClick={del.bind(this,tags.bankId)}>删除</Button>
          <Button type="link" onClick={changeDefault.bind(this,tags.bankId,1)}>设为默认</Button>
        </div>
      )
    },
  ]
  const [data,setData] = useState([])
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm()
  const [isAdd,setAdd] = useState(true)
  const [bankId,setId] = useState('')
  const [visible,setVisible] = useState(false)
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    getData()
  }, []);

  const getData = () =>{
    let values = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      search:values.search,
      crtTime:values.crtTime?moment(values.crtTime).format('YYYY-MM-DD'):''
    }
    bankPage(data).then(res=>{
      setData(React.setKey(res.data.rows))
      let obj = { ...pageInfo }
      obj.total = res.data.total
      setPage(obj)
    })
  }

  const changePage = (current: number) => {
    pageInfo.page = current
    setPage(pageInfo)
    getData()
  }

  const setStatus=(bankId:string,useFlag:number)=>{
    switchBank({bankId:bankId,useFlag:useFlag}).then(res=>{
      if(res.result){
        message.info(res.message)
        getData()
      }
      
    })
  }

  const changeDefault=(bankId:string,defaultFlag:number)=>{
    setDefault({bankId:bankId,defaultFlag:defaultFlag}).then(res=>{
      if(res.result){
      message.info(res.message)
      getData()
      }
    })
  }

  const edit = (row:any)=>{
    let data = {...row}
    data.defaultFlag= row.defaultFlag==1?true:false
    modalForm.setFieldsValue(data)
    setId(row.bankId)
    setVisible(true)
    setAdd(false)
  }

  const add=()=>{
    setAdd(true)
    setVisible(true)
  }

  const del=(id:string)=>{
    delBank({bankId:id,showLoading:true}).then(res=>{
      if(res.result){
      message.info('删除成功！')
      getData()
      }
    })
  }

  const handleOk=()=>{
    modalForm.validateFields().then(val=>{
      let data = {
        bankName:val.bankName,
        bankAccount:val.bankAccount,
        openBank:val.openBank,
        defaultFlag:val.defaultFlag?1:2,
        bankId:''
      }
      if(isAdd){
        addBank(data).then(res=>{
          if(res.result){
          message.info('新增成功！')
          getData()
          }
        })
      }else{
        data.bankId=bankId
        uptBank(data).then(res=>{
          if(res.result){
          message.info('修改成功！')
          getData()
          }
        })
      }
      setVisible(false)
      modalForm.resetFields()
    })
    
  }
  
  const handleCancel=()=>{
    setVisible(false)
    modalForm.resetFields()
  }

  return (
    <div className="detail">
        <Card title="银行账号查询" className="mb24" >
          <Form layout="inline" form={form} onFinish={getData}>
            <Form.Item className="w200" name="search">
              <Input placeholder="银行账号/开户行"></Input>
            </Form.Item>
            <Form.Item name="crtTime">
              <DatePicker placeholder="日期"></DatePicker>
            </Form.Item>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">搜索</Button>
          </Form>
        </Card>
        <Card title="银行账户列表"  extra={<Button onClick={add}>添加银行卡</Button>}>
          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{
              pageSize: pageInfo.limit,
              total: pageInfo.total,
              onChange: changePage
            }}
          ></Table>
        </Card>

        <Modal
          title={isAdd?'添加银行账号':'修改银行账号'}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={modalForm} {...layout}>
            <Form.Item label="银行名称" name="bankName" rules={[{ required: true, message: '请输入银行名称' }]}>
              <Input placeholder="请输入银行名称"></Input>
            </Form.Item>
            <Form.Item label="银行卡号" name="bankAccount" rules={[{ required: true, message: '请输入银行卡号' }]}>
              <Input placeholder="请输入银行卡号"></Input>
            </Form.Item>
            <Form.Item label="开户行" name="openBank" rules={[{ required: true, message: '请输入开户行' }]}>
              <Input placeholder="请输入开户行"></Input>
            </Form.Item>
            <Form.Item label="是否默认" name="defaultFlag" valuePropName="checked">
              <Switch></Switch>
            </Form.Item>
          </Form>
        </Modal>
    </div>

  );
};
