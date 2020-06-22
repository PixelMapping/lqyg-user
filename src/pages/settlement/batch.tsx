import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Input, Select, Button, Row  ,Table, Card} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment'
import {bathList } from '@/services/settlement'
const { Option } = Select
import './index.less';


export default (props) => {

  const [data,setData] = useState([])
  const [selectedRowKeys,setKeys]= useState([])
  const [form] = Form.useForm()
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const columns = [
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key:"batchNo",
    },
    {
      title: '发起时间',
      dataIndex: 'submitTime',
      key:"submitTime",
    },
    {
      title: '打款通道',
      dataIndex: 'channelName',
      key:"channelName",
    },
    {
      title: '结算方式',
      dataIndex: 'type',
      key:"type",
      render:(tags:any)=>(
      <div>{tags=='1'?'一次性结算':''}</div>
      )
    },
    {
      title: '打款状态',
      dataIndex: 'status',
      key:"status",
      render:(tags:any)=>{
        let arr=['打款完成','打款审核中','打款失败']
        return (
        <span>{arr[tags-1]}</span>
        )
      }
    },
    {
      title: '打款金额',
      dataIndex: 'settleAmount',
      key:"settleAmount",
    },    
    {
      title:'操作',
      key:'action',
      render:(tags:any)=>(
        <div>
          <Button type="link" onClick={toDetail.bind(this,tags)}>详情</Button>
        </div>
      
      )
    }
  ];

  useEffect(() => {
    getData()
  }, []);

  const getData= ()=>{
    let val = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      status:val.status||'',
      settleAmount:val.settleAmount||'',
      submitTime:val.submitTime?moment(val.submitTime).format('YYYY-MM-DD'):''
    }
    bathList(data).then(res=>{
      if(res.result){
        setData(React.setKey(res.data.rows))
        let obj = { ...pageInfo }
      obj.total = res.data.total
      setPage(obj)
      }
    })
  }

  const changePage = (current: number) => {
    pageInfo.page = current
    setPage(pageInfo)
    getData()
  }

  const toDetail = (rows:any)=>{
    props.history.push({pathname:'detail',state:{id:rows.id}})
  }


  return (
    <div className="batch">
      <Card title="批次查询" className="mb24">
      <Form layout="inline" form={form}>
        {/* <Form.Item className="w200">
          <Input placeholder="打款批次号/打款人"></Input>
        </Form.Item>
        <Form.Item className="w200">
          <Select placeholder="打款通道">
            <Option value="测试"> 测试</Option>
          </Select>
        </Form.Item> */}
        {/* <Form.Item className="w200">
          <DatePicker placeholder="日期" style={{ width: '100%' }} />
        </Form.Item>                */}
        <Form.Item className="w200" name="status">
          <Select placeholder="打款状态" allowClear>
            <Option value="1"> 打款完成</Option>
            <Option value="2"> 打款审核中</Option>
            <Option value="3"> 打款失败</Option>
          </Select>
        </Form.Item>
        <Form.Item className="w200" name="settleAmount">
          <Input placeholder="打款金额"></Input>
        </Form.Item>
        <Form.Item className="w200" name="submitTime">
          <DatePicker placeholder="发起日期" style={{ width: '100%' }} />
        </Form.Item> 
        <Form.Item className="w200">
          <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
        </Form.Item>
      
      </Form>
      </Card>
      
      <Card title="批次列表">
   
      <Table
        pagination={{
          pageSize: pageInfo.limit,
          total: pageInfo.total,
          onChange: changePage
        }}
        columns={columns}
        dataSource={data}
      />
      </Card>
      
    </div>

  );
};
