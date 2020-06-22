import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Card,Form,Input,DatePicker,Button,Table,Modal ,Row ,Select} from 'antd';
import {signUserPage} from '@/services/sign'
const {Option} = Select
import './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props:any) => {
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const columns=[
    {
      title:'姓名',
      dataIndex:'name',
      key:'name',
    },
    {
      title:'证件类型',
      dataIndex:'certifiteType',
      key:'certifiteType',
      render:(tags:any)=>(
      <div>{tags=='1'?'已认证':'个体认证'}</div>
      )
    },
    {
      title:'证件号码',
      dataIndex:'idcard',
      key:'idcard',
    },    
    {
      title:'手机号',
      dataIndex:'phone',
      key:'phone',
    },  
    {
      title:'添加时间',
      dataIndex:'crtTime',
      key:'crtTime',
    },  
    {
      title:'操作',
      dataIndex:'',
      key:'',
      render:(tags:any)=>(
        <div>
          <Button type="link" onClick={toDetail.bind(this,tags.userId)}>查看</Button>
          {/* <Button type="link">编辑手机号</Button> */}
          <Button type="link">禁止签约</Button>
          <Button type="link">发起签约</Button>
        </div>
      )
    },
  ]
  const [data,setData] = useState([])
  const [isAdd,setStatus] = useState(true)
  const [visible,setVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    getData()
  }, []);

  

  const getData = () =>{
    let val=form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      name:val.name?val.name:'',
      phone:val.phone?val.phone:'',
      idcard:val.idcard?val.idcard:'',
      authentFlag:val.authentFlag?val.authentFlag:''
    }
    signUserPage(data).then(res=>{
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
  
  const toDetail = (id:string)=>{
    props.history.push({pathname:'detail',state:{id:id}})
  }

  return (
    <div >
        <Card title="个人信息查询" className="mb24">
          <Form layout="inline" className="w1200" form={form}>
            <Form.Item className="w200" name="name">
              <Input placeholder="姓名/手机号/地址"></Input>
            </Form.Item>      
            <Form.Item className="w200" name="phone">
              <Input placeholder="手机号"></Input>
            </Form.Item> 
            <Form.Item className="w200" name="idcard">
              <Input placeholder="证件号码"></Input>
            </Form.Item>             
            <Form.Item className="w200" name="authentFlag">
              <Select>
                <Option value="1">已认证</Option>
                <Option value="2">个体认证</Option>
              </Select>
            </Form.Item> 
            {/* <Form.Item className="w200">
              <Input placeholder="是否个体商户"></Input>
            </Form.Item> 
            <Form.Item className="w200">
              <DatePicker className="w200" placeholder="添加时间"></DatePicker>
            </Form.Item>  */}
            <Form.Item className="w200">
              <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
            </Form.Item> 
            <Row className="mt16">
           
            </Row>
          </Form>
        </Card>
        <Card title="个体列表">
          <Table 
        
            pagination={{
              pageSize: pageInfo.limit,
              total: pageInfo.total,
              onChange: changePage
            }}
            columns={columns} dataSource={data} ></Table>
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
