import React, { useState, useEffect } from 'react';
import { Card, Table,Button, Form, Input, Select, DatePicker } from 'antd';
import {applyInvoicePage} from '@/services/manager'
import moment from "moment";
const { Option } = Select
import './index.less';


const statusList = ['审核中','开票中','已开票','已驳回','已邮寄','已签收']
export default (props: any) => {
  const [data, setData] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [form] = Form.useForm()
  const columns = [
    {
      title: '申请时间',
      dataIndex: 'submitTime',
      key: 'submitTime'
    },
    {
      title: '通道',
      dataIndex: 'channelName',
      key: 'channelName'
    },    
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName'
    },    
    {
      title: '发票金额',
      dataIndex: 'invoiceMoney',
      key: 'invoiceMoney'
    },
    {
      title: '开票内容',
      dataIndex: 'invoiceContent',
      key: 'amouinvoiceContentnt'
    },
    {
      title: '开票状态',
      dataIndex: 'invoiceStatus',
      key: 'invoiceStatus',
      render:(tags:any)=>(statusList[tags-1])
    },
    {
      title: '收票状态',
      dataIndex: 'receiveStatus',
      key: 'receiveStatus',
      render:(tags:any)=>(tags==1?'已收票':'未收票')
    },
    {
      title: '操作',
      key: 'action',
      render: (tags: any) => (
        <Button type="link" onClick={toDetail.bind(this, tags.applyInvoiceId)}>查看详情</Button>
      )
    },
  ];
  useEffect(() => {
    // getList()
    getData()
  }, []);

  const getData = () => {
    let val = form.getFieldsValue()
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      invoiceStatus:val.invoiceStatus||'',
      startDate:val.startDate?moment(val.startDate).format('YYYY-MM-DD'):'',
      endDate:val.endDate?moment(val.endDate).format('YYYY-MM-DD'):'',
      sInvoiceMoney:val.sInvoiceMoney||'',
      eInvoiceMoney:val.eInvoiceMoney||''
    }
    applyInvoicePage(data).then(res => {      
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

  const toDetail = (id: string) => {
    props.history.push({ pathname: 'detail', state: { rechargeId: id } })
  }
 

 
 
  return (
    <div>
      <Card title="发票查询" className="mb24">
        <Form form={form} layout="inline">
          <Form.Item name="invoiceStatus" className="w200">
            <Select placeholder="发票状态" allowClear>
              <Option value="1">审核中</Option>
              <Option value="2">开票中</Option>
              <Option value="3">已开票</Option>
              <Option value="4">已驳回</Option>
              <Option value="5">已邮寄</Option>
              <Option value="6">已签收</Option>
            </Select> 
          </Form.Item>
          <Form.Item name="startDate">
            <DatePicker placeholder="开始时间" className="w200"></DatePicker>
          </Form.Item>
          <Form.Item name="endDate">
            <DatePicker placeholder="结束时间" className="w200"></DatePicker>
          </Form.Item>
          <Form.Item name="sInvoiceMoney" className="w200">
            <Input placeholder="开票最小金额"></Input>
          </Form.Item>
          <Form.Item name="eInvoiceMoney" className="w200">
            <Input placeholder="开票最大金额"></Input>
          </Form.Item>
          <Button type="primary" onClick={getData}>搜索</Button>
        </Form>
      </Card>
      <Card title="发票申请列表" className="mb24">
        
        <Table
         
          pagination={{
            pageSize: pageInfo.limit,
            total: pageInfo.total,
            onChange: changePage
          }}
          className="mt10"
          columns={columns}
          dataSource={data}
        />
      </Card>
         
      
      <div></div>
    </div>
  );
};
