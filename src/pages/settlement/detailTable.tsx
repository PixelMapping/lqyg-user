import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Input, Select, Button, Row, Table, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {settleBatchList} from '@/services/settlement'
import { channelList} from '@/services/manager'
const { Option } = Select
import './index.less';


export default (props:any) => {
  const [list,setList] = useState([]) 
  const [data, setData] = useState([])
  const [selectedRowKeys, setKeys] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [form] = Form.useForm()
  const columns = [
    {
      title: '发起时间',
      dataIndex: 'submitTime',
      key: "submitTime",
    },
    {
      title: '打款金额',
      dataIndex: 'payAmount',
      key: "payAmount",
    },
    {
      title: '收款人',
      dataIndex: 'name',
      key: "name",
    },
    {
      title: '收款账户',
      dataIndex: 'bankAccount',
      key: "bankAccount",
    },
    {
      title: '批次号',
      dataIndex: 'bathNo',
      key: "bathNo",
    },
    {
      title: '打款状态',
      dataIndex: 'status',
      key: "status",
      render:(tags:any)=>{
        let arr = ['打款完成','打款审核中','打款失败']
        return (arr[tags-1])
      }
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: "reason",
    },
    // {
    //   title: '证件类型',
    //   dataIndex: '',
    //   key: "",
    // },   
    {
      title: '证件号码',
      dataIndex: 'idcard',
      key: "idcard",
    },
    {
      title: '打款通道',
      dataIndex: 'channelName',
      key: "channelName",
    },
    // {
    //   title: '结算方式',
    //   dataIndex: 'name',
    //   key: "",
    // },

  ];

  useEffect(() => {
    
    if(props.location.state){
      form.setFieldsValue({batchNo:props.location.state.bcatchNo})
      getList()
      getData()
    }else{
      getList()
      getData()
    }
  }, []);

  const getList=()=>{
    channelList({}).then(res=>{
      if(res.result){
        setList(res.data)
      }
    })
  }

  const getData=()=>{
    let val = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      status:val.status,
      taskInfo:val.taskInfo,
      channelId:val.channelId,
      userName:val.userName,
      batchNo:val.batchNo
    }
    settleBatchList(data).then(res=>{
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

  const toDetail = () => {
    props.history.push('detail')
  }


  return (
    <div className="batch">
      <Card title="批次查询" className="mb24">
        <Form layout="inline" form={form}>
          <Form.Item className="w200" name="status">
          <Select placeholder="打款状态" allowClear>
              <Option value="1"> 打款完成</Option>
              <Option value="2"> 打款审核中</Option>
              <Option value="3"> 打款失败</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="taskInfo">
            <Input placeholder="任务名称/任务编号"></Input>
          </Form.Item>
          <Form.Item className="w200" name="channelId">
            <Select placeholder="打款通道" allowClear>
              {
                list.map((item:any)=>{
                  return (
                  <Option value={item.id} key={item.id}> {item.name}</Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="userName">
            <Input placeholder="收款人/手机号/证件号码"></Input>
          </Form.Item>
          <Form.Item className="w200" name="batchNo">
          <Input placeholder="打款批次号"></Input>
          </Form.Item>
          <Form.Item className="w200">
            <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
          </Form.Item>          
        </Form>
      </Card>
      <Card title="明细列表">
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
