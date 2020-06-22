import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Timeline, Button, message, Steps, Popconfirm, Modal, Form, Input, Select, DatePicker, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment'
const { Option } = Select
import Zmage from 'react-zmage'
const { Step } = Steps;
import { invoiceInfo, auditPass, auditorList, reject, invoiceComplete, express, remind } from '@/services/manager'
import './index.less';


const stateList = ['审核中', '开票中', '已开票', '已驳回', '已邮寄', '已签收']
export default (props: any) => {
  const [id, setId] = useState('')
  const [info, setInfo] = useState<any>({})
  const [packag, setPackag] = useState<any>({ data: [] })
  const [isReject,setIsReject] = useState(false)
  const [fileList, setFileList] = useState([])
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState(0) //默认0
  const [urls, setUrls] = useState<any>([{ src: '' }])
  const [tit, setTile] = useState('')
  const [list, setList] = useState([])
  const [form] = Form.useForm()


  useEffect(() => {
    if (props.location.state) {
      console.log(props.location.state)
      setId(props.location.state.rechargeId)
      getData(props.location.state.rechargeId)
    }
  }, []);


  const getData = (id: string) => {
    invoiceInfo({ applyInvoiceId: id }).then(res => {
      let info = res.data.info
      setInfo(res.data.info)
      let arr = info.invoiceUrl.split(',')

      let obj = arr.map((item: string) => {
        return {
          src: item,
        }
      })
      setUrls(obj)
      let Status = res.data.info.invoiceStatus
      if (Status < 4) {
        setStatus(Number(Status))
      } else if (Status == 4) {
        setStatus(1)
      } else if (Status >= 5) {
        setStatus(4)
      }
      if (res.data.packag.data) {
        setPackag(res.data.packag)

      }
    })
    auditorList({}).then(res => {
      if (res.result) {
        setList(res.data)
      }
    })
  }

  const changeStatus = (type: number) => {
    if (type == 1) {
      setIsReject(false)
      setTile('审核通过')
    } else {
      setIsReject(true)
      setTile('审核驳回')
    }
    setVisible(true)
  }

  const confirm = () => {
    form.validateFields().then((val: any) => {
      if (info.invoiceStatus == 1&&!isReject) { //审核通过
        let name = list.filter((item: any) => item.userId == val.auditId)[0].name
        let data = {
          applyInvoiceId: id,
          auditId: val.auditId,
          auditName: name
        }
        auditPass(data).then(res => {
          if (res.result) {
            message.info(res.message)
            getData(id)
          }
        })
      } else if (isReject) { //审核驳回
        reject({ reason: val.reason, applyInvoiceId: id }).then(res => {
          if (res.result) {
            message.info(res.message)
            getData(id)
          }
        })
      } else if (info.invoiceStatus == 2) { //开票
        let arr = fileList.map((item: any) => {
          if (item.response && item.response.result) {
            return item.response.data
          }
        })
        let data = {
          applyInvoiceId: id,
          billingTime: val.billingTime ? moment(val.billingTime).format('YYYY-MM-DD') : '',
          invoiceList: arr
        }
        invoiceComplete(data).then(res => {
          if (res.result) {
            message.info(res.message)
            getData(id)
          }
        })
      } else if (info.invoiceStatus == 3) { //邮寄
        let data = {
          applyInvoiceId: id,
          postName: val.postName,
          expressNumber: val.expressNumber,
          postPhone: val.postPhone
        }
        express(data).then(res => {
          if (res.result) {
            message.info(res.message)
            getData(id)
          }
        })
      } else if (info.invoiceStatus == 5) {//短信提醒
        remind({ applyInvoiceId: id }).then(res => {
          if (res.result) {
            message.info(res.message)
            getData(id)
          }
        })
      }
      setVisible(false)

    })

  }


  const upProps = {
    name: 'file',
    action: '/manger/document/upload',
    data: {
      type: 1
    },
    listType: "picture-card",
    className: "avatar-uploader",
    headers: {
      "User-Client": 'manager',
      "Authorization": localStorage.getItem('token')
    },
    onChange(info: any) {
      console.log(info)
      if (info.file.status === 'done') {
        setFileList(info.fileList)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },
  };

  const setModal = () => {
    // setStatus(type)
    if (info.invoiceStatus == 2) {
      setTile('上传发票')
    }
    if (info.invoiceStatus == 3) {
      setTile('提交快递信息')
    }
    setVisible(true)

  }


  return (
    <div className="detail">
      <Card className="mb24" extra={
        <div>
          {info.invoiceStatus == 1 &&
            <Popconfirm
              placement="top"
              title="发起审核"
              onConfirm={changeStatus.bind(this, 1)}
              onCancel={changeStatus.bind(this, 2)}
              okText="通过"
              cancelText="驳回"
            >
              <Button type="primary">审核</Button>
            </Popconfirm>
          }
          {
            info.invoiceStatus == 2 &&
            <Button type="primary" onClick={setModal}>上传发票</Button>
          }
          {
            info.invoiceStatus == 3 &&
            <Button type="primary" onClick={setModal}>提交快递信息</Button>
          }
          {
            info.invoiceStatus == 5 &&
            <Button type="primary" onClick={confirm}>短信提醒</Button>
          }
        </div>
      }
      >
        <Steps progressDot labelPlacement="vertical" current={status}>
          <Step title="申请" subTitle={'申请企业：' + info.enterpriseName} description={info.submitTime} />
          <Step title="审核" subTitle={'审核人：' + info.firstName} description={info.firstTime} />
          <Step title="开票中" subTitle={'经办人：' + info.secondName} description={info.secondTime} />
          <Step title="已开票" subTitle={'经办人：' + info.thirdName} description={info.thirdTime} />
          <Step title="已邮寄" subTitle={'经办人：' + info.thirdName} description={info.thirdTime} />
        </Steps>
      </Card>
      <Card title="申请信息" className="mb24" extra={
        <div>
          {/* <Button type="primary" className="mr10">查看发票</Button> 
            <Button type="primary" disabled={(info.receiveStatus==1&&info.invoiceStatus==5)?false:true} onClick={confirm}>确认收票</Button> */}
        </div>
      }>
        <Row>
          <Col span="12"><span>申请人</span> <span>{info.applyName}</span></Col>
          <Col span="12"><span>申请时间 </span> <span>{info.submitTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>申请方式</span>    <span>{info.applyType == 1 ? '商户申请' : ''}</span></Col>
          <Col span="12"><span>通道</span>    <span>{info.channelName}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>编号</span>    <span>{info.applyNumber}</span></Col>
          <Col span="12"><span>期望开票日期</span>    <span>{info.hopeTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>开票状态 </span>   <span> {stateList[info.invoiceStatus - 1]}</span></Col>
          <Col span="12"><span>开票时间</span>    <span>{info.billingTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>收票状态 </span>  <span>{info.receiveStatus == '1' ? '已收票' : '未收票'}</span></Col>
          <Col span="12"><span>收票时间</span>    <span>{info.receiveTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>备注</span> <span>{info.remarks}</span></Col>
          <Col span="12"></Col>
        </Row>
      </Card>
      <Card title="发票信息" className="mb24">
        <Row>
          <Col span="12"><span>开票金额</span> <span>{info.invoiceMoney}</span></Col>
          <Col span="12"><span>实际开票日期</span> <span>{info.billingTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>发票类型</span> <span>{info.invoiceType == '1' ? '增值税普通发票' : '增值税专用发票'}</span></Col>
          <Col span="12"><span>开票内容</span> <span>{info.invoiceContent}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>发票抬头</span> <span>{info.invoiceTitle}</span></Col>
          <Col span="12"><span>单位税号</span> <span>{info.taxNumber}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>银行账号</span> <span>{info.bankAccount}</span></Col>
          <Col span="12"><span>开户行</span> <span>{info.openBank}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>单位地址</span> <span>{info.unitAddress}</span></Col>
          <Col span="12"><span>单位电话</span> <span>{info.unitTel}</span></Col>
        </Row>
        <Row>
        <Col span="12"><span>驳回原因</span> <span className="reject">{info.reason}</span></Col>
          <Col span="12">
            <span>发票图片</span>
            <span className="imgs">
              <Zmage
                src={urls[0].src}
                set={urls}
              />
            </span>
          </Col>
        </Row>
      </Card>
      <Card title="邮寄信息">
        <Row>
          <Col span="12"><span>收件地址</span> <span>{info.address}</span></Col>
          <Col span="12"><span>收件人</span> <span>{info.addressee}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>联系电话</span> <span>{info.addresseePhone}</span></Col>
          <Col span="12"><span></span> <span></span></Col>
        </Row>
        <Row>
          <Col span="12"><span>快递品牌</span> <span>{info.postName}</span></Col>
          <Col span="12"><span>运单号</span> <span>{info.expressNumber}</span></Col>
        </Row>
        {/* <Row>
          <Col span="12"><span>备注</span> <span>{info.postRemarks}</span></Col>
          <Col span="12"><span></span> <span></span></Col>
        </Row> */}
        <Row>
          <Col span="24">
            <span>快递信息</span>
            <Timeline mode="left" style={{ marginTop: 8 }}>
              {
                packag.data.map((item: any) => {
                  return (
                    <Timeline.Item label={item.time} key={item.time}>{item.context}</Timeline.Item>
                  )
                })
              }
            </Timeline>
          </Col>

        </Row>


      </Card>
      <Modal title={tit} visible={visible} onOk={confirm} onCancel={() => { setVisible(false) }}>
        <Form form={form}>
          {
            (info.invoiceStatus == 1&&!isReject) &&
            <Form.Item label="财务负责人" name="auditId" rules={[{ required: true }]}>
              <Select>
                {
                  list.map((item: any) => {
                    return (
                      <Option value={item.userId} key={item.userId}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
          }

          {
            (info.invoiceStatus == 2) && (
              <div>
                <Form.Item label="开票时间" name="billingTime" rules={[{ required: true }]}>
                  <DatePicker className="w300" placeholder="请选择开票时间"></DatePicker>
                </Form.Item>
                <Form.Item label="* 发票图片" >
                  <Upload {...upProps}>
                    <div>
                      <PlusOutlined />
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </div>
            )
          }
          {
            info.invoiceStatus == 3 && (
              <div>
                <Form.Item label="快递品牌" name="postName" rules={[{ required: true }]}>
                  <Select>
                    <Option value="顺丰">顺丰</Option>
                    <Option value="申通">申通</Option>
                    <Option value="圆通">圆通</Option>
                    <Option value="韵达">韵达</Option>
                    <Option value="中通">中通</Option>
                    <Option value="天天">天天</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="快递单号" name="expressNumber" rules={[{ required: true }]}>
                  <Input maxLength={25} placeholder="请输入快递单号"></Input>
                </Form.Item>
                <Form.Item label="寄件人/手机号码" name="postPhone" rules={[{ required: true }]}>
                  <Input maxLength={11} placeholder="请输入寄件人或手机号码"></Input>
                </Form.Item>
              </div>
            )
          }
          {
            isReject &&
            <Form.Item label="驳回原因" name="reason" rules={[{ required: true }]}>
              <Input.TextArea placeholder="请输入驳回原因"></Input.TextArea>
            </Form.Item>

          }

        </Form>
      </Modal>
    </div>

  );
};
