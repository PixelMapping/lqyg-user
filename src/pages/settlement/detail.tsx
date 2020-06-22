import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Table, Steps, Modal, Form, Input, Select, Button, Popconfirm, message } from 'antd';
const { Step } = Steps;
const { Option } = Select
import { enBatchPaymentInfo, settleBatchList, getFinancrPerson, operationAudit, financialLeaderAudit, financialAudit, settlementCompleted } from '@/services/settlement'
import ImgUpload from '@/components/ImgUpload'
import myContext from '@/components/ImgUpload/creatContext'
import Zmage from 'react-zmage'
import './index.less';

const statusList = ['打款完成', '打款审核中', '打款失败']
const messageArr = ['审核中', '运营审核通过', '运营审核不通过', '财务审核不通过', '财务审核通过', '财务负责人审核通过', '财务负责人审核不通过']
const columns = [
  {
    title: '打款金额',
    key: 'payAmount',
    dataIndex: 'payAmount',
  },
  {
    title: '收款人',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '打款状态',
    key: 'status',
    dataIndex: 'status',
    render: (tags: any) => {
      return (statusList[tags - 1] || '')
    }
  },
  {
    title: '原因',
    key: 'reason',
    dataIndex: 'reason',
  },
  {
    title: '收款账户',
    key: 'bankAccount',
    dataIndex: 'bankAccount',
  },
  {
    title: '证件号码',
    key: 'idcard',
    dataIndex: 'idcard',
  },
  {
    title: '手机号',
    key: 'phone',
    dataIndex: 'phone',
  }
]

export default (props: any) => {
  const childRef = useRef();
  const [id, setId] = useState()
  const [info, setInfo] = useState<any>({})
  const [title, setTitle] = useState('审核通过')
  const [data, setData] = useState([])
  const [err, setErr] = useState("wait")
  const [cur, setCur] = useState(1)
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState(0)
  const [form] = Form.useForm()
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [urls, setUrls] = useState<any>([{ src: '' }])


  useEffect(() => {
    if (props.location.state) {
      setId(props.location.state.id)
      getInfo(props.location.state.id)
      getData(props.location.state.id)
    }
  }, []);


  const getData = (id: string) => {
    settleBatchList(
      {
        page: pageInfo.page,
        limit: pageInfo.limit,
        batchId: id
      }
    ).then(res => {
      if (res.result) {
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

  const getInfo = (id: string) => {
    enBatchPaymentInfo({ id }).then(res => {
      if (res) {
        let auditStatus = res.data.auditStatus
        if (auditStatus == '' || auditStatus == 1) {
          setCur(1)
        } else if (auditStatus == 2) {
          setCur(2)
        } else if (auditStatus == 3) {
          setCur(1)
          setErr("error")
        } else if (auditStatus == 4) {
          setCur(2)
          setErr("error")
        } else if (auditStatus == 5) {
          setCur(3)
        } else if (auditStatus == 6) {
          setCur(4)
        } else if (auditStatus == 7) {
          setErr("error")
        } else {
          setCur(5)
        }
        setInfo(res.data)
        let arr = res.data.settlementVoucher.split(',')
        let obj = arr.map((item: string) => {
          return {
            src: item,
          }
        })
        setUrls(obj)
      }
    })

    getFinancrPerson({}).then(res => {
      if (res.result) {
        setList(res.data)
      }

    })
  }

  const showModal = (type: number) => {
    //type1通过 2未通过
    if (cur == 1) {
      if (type == 1) {
        setStatus(2)
        setTitle('审核通过')
      } else {
        setStatus(3)
        setTitle('审核不通过')
      }
      setVisible(true)
    } else if (cur == 2) {
      if (type == 1) {
        setStatus(5)
        setTitle('审核通过')
        confirm(5, event)
      } else {
        setStatus(4)
        setTitle('审核不通过')
        setVisible(true)
      }
    } else if (cur == 3) {
      if (type == 1) {
        setStatus(6)
        confirm(6, event)
        setTitle('审核通过')
      } else {
        setStatus(7)
        setTitle('审核不通过')
        setVisible(true)
      }
    } else if (cur == 4) {
      if (type == 1) {
        setStatus(1)
        setTitle('结算成功')
      } else {
        setStatus(0)
        setTitle('结算失败')
      }
      setVisible(true)
    }
  }

  const confirm = (type: number, e: any) => {
    form.validateFields().then(val => {
      let data = {
        id: info.id,
        status: Number(type) ? type : status,
        reason: val.reason
      }
      setVisible(false)

      if (cur == 1) {
        if (title == '审核通过') {
          let name = list.filter((item: any) => item.userId == val.financrPersonId)[0].name
          data.financrPersonId = val.financrPersonId
          data.financrPersonName = name
        }
        operationAudit(data).then(res => {
          if (res.result) {
            message.info(messageArr[status - 1])
            getInfo(info.id)
          }
        })
      } else if (cur == 2) {
        financialAudit(data).then(res => {
          if (res.result) {
            message.info(messageArr[status - 1])
            getInfo(info.id)
          }
        })
      } else if (cur == 3) {
        financialLeaderAudit(data).then(res => {
          if (res.result) {
            message.info(messageArr[status - 1])
            getInfo(info.id)
          }
        })
      } else if (cur == 4) {
        let fileList = childRef.current.getUpFile()
        if (fileList == '') {
          message.info('请提交结算凭证！')
          return
        }
        data.voucherImage = fileList.join(',')

        settlementCompleted(data).then(res => {
          if (res.result) {
            message.info(data.status == 1 ? '结算成功' : '结算失败')
            getInfo(info.id)
          }
        })
      }
    })

  }

  const btns = () => {
    if (cur == 1 || cur == 2 || cur == 3) {
      return (
        <Popconfirm placement="top" title='确定审核通过吗？' onConfirm={showModal.bind(this, 1)} onCancel={showModal.bind(this, 2)} okText="是" cancelText="否">
          <Button type="primary">审核</Button>
        </Popconfirm>
      )
    } else if (cur == 4) {
      return (
        <Popconfirm placement="top" title='确定结算成功吗？' onConfirm={showModal.bind(this, 1)} onCancel={showModal.bind(this, 2)} okText="是" cancelText="否">
          <Button type="primary">结算</Button>
        </Popconfirm>
      )
    } else {
      return ('')
    }
  }

  return (
    <div className="detail">
      <Card className="mb24" extra={
        (cur == 1 || cur == 2 || cur == 3) ? (
          <Popconfirm placement="top" title='确定审核通过吗？' onConfirm={showModal.bind(this, 1)} onCancel={showModal.bind(this, 2)} okText="是" cancelText="否">
            <Button type="primary">审核</Button>
          </Popconfirm>
        ) : cur == 4 ? (
          <Popconfirm placement="top" title='确定结算成功吗？' onConfirm={showModal.bind(this, 1)} onCancel={showModal.bind(this, 2)} okText="是" cancelText="否">
            <Button type="primary">结算</Button>
          </Popconfirm>
        ) : ('')
      }>
        <Steps progressDot labelPlacement="vertical" status={err} current={cur}>
          <Step title="结算申请" subTitle={'申请企业：' + info.enterpriseName} description={info.submitTime} />
          <Step title="运营审核" subTitle={'审核人员：' + info.firstName} description={info.firstTime} />
          <Step title="财务审核" subTitle={'审核人员：' + info.secondName} description={info.secondTime} />
          <Step title="财务负责人审核" subTitle={'审核人员：' + info.thirdName} description={info.thirdTime} />
          <Step title="已结算" subTitle={info.channelName} description={info.submitTime} />
        </Steps>
      </Card>
      <Card className="mb24">
        <Row>
          <Col span="12">合计总额（笔|元）</Col>
          <Col span="12">打款成功（笔|元）</Col>
        </Row>
        <Row>
          <Col span="12" className="total">{info.settleNum} | ￥{info.settleAmount}</Col>
          <Col span="12" className="total primary">{info.successSettleNum} | ￥{info.successSettlePay}</Col>
        </Row>
      </Card>
      <Card title="结算申请信息" className="mb24">
        <Row>
          <Col span="12"><span>批次号</span> <span>{info.batchNo}</span></Col>
          <Col span="12"><span>打款时间 </span> <span>{info.submitTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>申请公司</span> <span>{info.enterpriseName}</span></Col>
          <Col span="12"><span>结算状态 </span> <span>{statusList[info.status - 1]}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>结算通道</span>    <span>{info.channelName}</span></Col>
          <Col span="12"><span>结算方式</span>    <span>普通结算</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>结算总金额</span>    <span>{info.settleAmount}</span></Col>
          <Col span="12"><span>结算人数</span>    <span>{info.settleNum}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>打款凭证 </span>
            <span className="imgs">
              <Zmage
                src={urls[0].src}
                set={urls}
              />
              {
                urls[0].src && (
                  <p style={{ color: '#ff0000' }}>点击查看多张图片</p>
                )
              }
            </span>
          </Col>
        </Row>

      </Card>
      <Card title="打款信息">
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
        title={title}
        visible={visible}
        onOk={confirm}
        width={600}
        onCancel={() => { setVisible(false) }}
      >
        <Form labelCol={{ span: 4 }} form={form}>
          {
            (cur == 1 && title == "审核通过") && (
              <Form.Item label="财务审核人" name="financrPersonId" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  {
                    list.map((item: any) => {
                      return (<Option value={item.userId} key={item.userId}>{item.name}</Option>)
                    })
                  }
                </Select>
              </Form.Item>
            )
          }
          {
            (status == 3 || status == 4 || status == 7) && (
              <Form.Item label="原因" name="reason" rules={[{ required: true }]}>
                <Input.TextArea rows={4}></Input.TextArea>
              </Form.Item>
            )
          }
          {
            (status == 1 || status == 0) && (
              <Form.Item label="* 打款凭证">
                <myContext.Provider>
                  <ImgUpload cRef={childRef}></ImgUpload>

                </myContext.Provider >
              </Form.Item>
            )
          }

        </Form>
      </Modal>


    </div>

  );
};
