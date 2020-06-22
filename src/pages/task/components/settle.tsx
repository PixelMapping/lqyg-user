import React, { useState, useEffect ,useContext  } from 'react';
import { Card ,Form ,Input ,Select ,DatePicker ,Button ,Table ,} from 'antd';
import { getTaskDetail} from '@/services/task'
import excel from '@/utils/excel'
const {Option} = Select
import  '../index.less';
import myContext from './creatContext'

export default () => {
  const [data,setData] = useState([])
  const [form] = Form.useForm();
  const cur = useContext(myContext).cur
  const id = useContext(myContext).id
  const columns = [
    {
      title:'姓名',
      key:'userName',
      dataIndex:'userName'
    },
    {
      title:'手机号',
      key:'userPhone',
      dataIndex:'userPhone'
    },
    {
      title:'证件类型',
      key:'certifiteType',
      dataIndex:'certifiteType',
    },
    {
      title:'证件号码',
      key:'idcard',
      dataIndex:'idcard'
    },
    {
      title:'报名类型',
      key:'type',
      dataIndex:'type',    
    },
    {
      title:'收款方式',
      key:'paymentMethod',
      dataIndex:'paymentMethod'
    },
    {
      title:'收款账户',
      key:'bankAccount',
      dataIndex:'bankAccount'
    },
    {
      title:'任务验收时间',
      key:'checkTime',
      dataIndex:'checkTime'
    },
    {
      title:'结算状态',
      key:'statusName',
      dataIndex:'statusName'
    },
  ]


  useEffect(() => {
    if(id){
      getData()

    }
  }, [id]);

  const getData=()=>{
    let values = form.getFieldsValue()
    let data={
      page:1,
      limit:1000,
      status:3,
      taskId:id,
      search:values.search,
      certifiteType:values.certifiteType,
      enrollType:values.enrollType,
      enrollStatus:values.enrollStatus,
      enrollTime:values.enrollTime
    }
    getTaskDetail(data).then(res=>{
      setData(React.setKey(res.data.rows))
    })
  }


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const exTable = ()=>{
    console.log(121)
    let col = [{
      title:'结算金额',
      key:'total'
    },{
      title:'报名Id',
      key:'userId'
    }]
    let exCol=[...columns,...col]
    excel.exportExcel(exCol,data,'结算名单.xlsx')
  }

  return (
    <div>
      <Card title="任务信息" className="mb24">
      <Form layout="inline" form={form} onFinish={getData}>
          <Form.Item className="w200" name="search">
            <Input placeholder="姓名/手机号/证件号码"></Input>
          </Form.Item>
          <Form.Item className="w200" name="certifiteType">
            <Select placeholder="证件类型">
              <Option value="1">身份证</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="enrollStatus">
            <Select placeholder="报名状态">
              <Option value="1">报名状态</Option>
              <Option value="1">已录用</Option>
              <Option value="2">未录用</Option>
              <Option value="3">已签约</Option>
              <Option value="4">未签约</Option>
              <Option value="5">提交验证</Option>
              <Option value="6">验收通过</Option>
              <Option value="7">验收未通过</Option>
              <Option value="8">结算完成</Option>
              <Option value="9">未结算</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="enrollTime">
            <DatePicker placeholder="报名时间" style={{width:'100%'}}></DatePicker>
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form>
      </Card>
      <Card 
        title="结算名单" 
        extra={
          <div>           
            <Button onClick={exTable}>下载名单</Button>
          </div>
        }
      >
        <Table 
          columns={columns} 
          dataSource={data}
          rowSelection={{
            ...rowSelection,
          }}
        ></Table>
      </Card>
    </div>
  );
};
