import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Input, Select, Button, Row, Table, Card, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { auditPage, channelList } from '@/services/manager'
const { Option } = Select
import './index.less';



export default (props) => {

  const [data, setData] = useState([])
  const [selectedRowKeys, setKeys] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [list, setList] = useState([])
  const [form] = Form.useForm()
  const columns = [
    {
      title: '充值时间',
      dataIndex: 'applyTime',
      key: "applyTime",
    },
    {
      title: '充值商户',
      dataIndex: 'enterpriseName',
      key: "enterpriseName",
    },
    {
      title: '充值通道',
      dataIndex: 'channelName',
      key: "channelName",
    },
    {
      title: '充值金额',
      dataIndex: 'amount',
      key: "amount",
    },  
    {
      title: '实际到账金额',
      dataIndex: 'actualAmount',
      key:"actualAmount",
    },
    {
      title: '服务费',
      dataIndex: 'serviceAmount',
      key:"serviceAmount",
    },
    {
      title: '充值状态',
      dataIndex: 'rechargeStatus',
      key: "rechargeStatus",
      render: (tags: any) => {
        let arr = ['充值成功', '审核中', '充值失败']
        return (
          <span>{arr[tags - 1]}</span>
        )
      }
    },
    {
      title: '开票状态',
      dataIndex: 'invoiceStatus',
      key: "invoiceStatus",
      render: (tags: any) => {
        let arr = ['未开票','审核中', '开票中', '已开票', '已驳回', '已邮寄', '已签收']
        return (
          <span>{arr[tags]}</span>
        )
      }
    },
    {
      title: '申请方式',
      dataIndex: 'applyType',
      key: "applyType",
      render: (tags: any) => {
        return (
          <span>{tags==1?'商户申请':''}</span>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (tags: any) => (
        <div>
          <Button type="link" onClick={toDetail.bind(this, tags.rechargeId)}>详情</Button>
        </div>

      )
    }
  ];

  useEffect(() => {
    getData()
    getList()
  }, []);

  const getList = () => {
    channelList({}).then(res => {
      if (res.result) {
        setList(res.data)
      }
    })
  }

  const getData = () => {
    let val = form.getFieldsValue()
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      serialNumber: val.serialNumber || '',
      rechargeStatus: val.rechargeStatus || '',
      invoiceStatus: val.invoiceStatus || '',
      receiveStatus: val.receiveStatus || '',
      channelId: val.channelId || '',
    }
    auditPage(data).then(res => {
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

  const confirm = (id: string) => {
    confirmReceive({ applyInvoiceId: id }).then(res => {
      if (res.result) {
        message.info('收票成功！')
        getData()
      }

    })
  }


  const toDetail = (id: string) => {
    props.history.push({ pathname: 'recharge/detail', state: { id: id,showBtn:true } })
  }
  return (
    <div className="recharge">
      <Card title="充值查询" className="mb24">
        <Form form={form}>
          <Row>
            <Form.Item className="w200 mr10" name="serialNumber">
              <Input placeholder="流水号"></Input>
            </Form.Item>
            <Form.Item className="w200 mr10" name="rechargeStatus">
              <Select placeholder="充值状态">
                <Option value="1">充值成功</Option>
                <Option value="2">审核中</Option>
                <Option value="3">充值失败</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10" name="invoiceStatus">
              <Select placeholder="开票状态">
                <Option value="1">审核中</Option>
                <Option value="2">开票中</Option>
                <Option value="3">已开票</Option>
                <Option value="4">已驳回</Option>
                <Option value="5">已邮寄</Option>
                <Option value="6">已签收</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10" name="receiveStatus">
              <Select placeholder="收票状态">
                <Option value="1">已收票</Option>
                <Option value="2">未收票</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10" name="channelId">
              <Select placeholder="通道列表">
                {
                  list.map((item: any) => {
                    return (
                      <Option value={item.id} key={item.id}> {item.name}</Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
            {/* <Form.Item className="w200 mr10">
              <Select placeholder="申请方式">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10">
              <Input placeholder="通道"></Input>
            </Form.Item>
            <Form.Item className="mr10">
              <Input.Group compact>
                <Button>发票金额</Button>
                <Input style={{ width: 130, textAlign: 'center' }} placeholder="最小值" />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  className="site-input-right"
                  style={{
                    width: 126,
                    textAlign: 'center',
                    borderLeft: 0,
                  }}
                  placeholder="最大值"
                />
                <Button>元</Button>
              </Input.Group>
            </Form.Item> */}
            <Form.Item className="w200">
              <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
            </Form.Item>
          </Row>
          {/* <Row>
            <Form.Item className="w200 mr10">
              <Select placeholder="开票状态">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10">
              <DatePicker placeholder="开票时间" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item className="w200 mr10">
              <Select placeholder="收票状态">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10">
              <DatePicker placeholder="收票时间" style={{ width: '100%' }} />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item className="w200 mr10">
              <Input placeholder="开票内容"></Input>
            </Form.Item>
            <Form.Item className="w200">
              <Select placeholder="开票状态">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
          </Row> */}
        </Form>
      </Card>

      <Card title="充值列表">
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
