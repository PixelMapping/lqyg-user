import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Table, Row, message, Modal } from 'antd';
import { getTaskDetail, employmentAll, checkTask } from '@/services/task'
import excel from '@/utils/excel'
import Zmage from 'react-zmage'
const { Option } = Select
import '../index.less';
import myContext from './creatContext'

export default () => {
  const [data, setData] = useState([])
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false)
  const cur = useContext(myContext).cur
  const [urls, setUrls] = useState([])
  const id = useContext(myContext).id
  const columns = [
    {
      title: '姓名',
      key: 'userName',
      dataIndex: 'userName'
    },
    {
      title: '手机号',
      key: 'userPhone',
      dataIndex: 'userPhone'
    },
    {
      title: '证件类型',
      key: 'certifiteType',
      dataIndex: 'certifiteType',
    },
    {
      title: '证件号码',
      key: 'idcard',
      dataIndex: 'idcard'
    },
    {
      title: '报名类型',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '提交验收时间',
      key: 'submitTime',
      dataIndex: 'submitTime'
    },
    {
      title: '工作状态',
      key: 'statusName',
      dataIndex: 'statusName',
      
    },
    {
      title: '验收/驳回时间',
      key: 'checkTime',
      dataIndex: 'checkTime'
    },
    {
      title: '任务反馈',
      key: 'action',
      render: (tags: any) => (<Button type="link" onClick={toView.bind(this,tags.dataUrls)}>查看</Button>)
    },
    {
      title: '操作',
      key: "action",
      render: (tags: any) => (
        <div>
          <Button type="link" disabled={tags.status == 5 ? false : true} className="mr10" onClick={check.bind(this, tags.enrollId, 1)}>通过</Button>
          <Button type="link" disabled={tags.status == 5 ? false : true} className="mr10" onClick={check.bind(this, tags.enrollId, 2)}>不通过</Button>
        </div>
      )
    }
  ]


  useEffect(() => {
    if (id) {
      getData()
    }
  }, [id]);

  const getData = () => {
    let values = form.getFieldsValue()
    let data = {
      page: 1,
      limit: 1000,
      status: 2,
      taskId: id,
      search: values.search,
      certifiteType: values.certifiteType,
      enrollType: values.enrollType,
      enrollStatus: values.enrollStatus,
      enrollTime: values.enrollTime
    }
    getTaskDetail(data).then(res => {
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

  const exTable = () => {
    // console.log(121212)
    // exportExcel()
  }

  const check = (enrollId: string, type: number) => {
    checkTask({ enrollId: enrollId, type: type }).then(res => {
      if (res.result) {
        message.info('录用成功！')
        getData()
      }
    })
  }

  const checkAll = () => {
    employmentAll({ taskId: id }).then(res => {
      if (res.result) {
        message.info('录用成功！')
        getData()
      }
    })
  }

  const toView=(urls:any)=>{
    let arr=urls.split(',')
    console.log(arr)
    if(urls==''){
      message.info('暂无验收图片！')
      return
    }
    setUrls(arr.map((item:string)=>{src:item}))
    setVisible(true)
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
            <DatePicker placeholder="报名时间" style={{ width: '100%' }}></DatePicker>
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form>
      </Card>
      <Card
        title="结算名单"
        extra={
          <div>
            <Button onClick={checkAll} className="mr10">全部录用</Button>
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
      <Modal
        title="查看反馈"
        visible={visible}
      >
        <Zmage
          set={urls}
        />
      </Modal>
    </div>
  );
};
