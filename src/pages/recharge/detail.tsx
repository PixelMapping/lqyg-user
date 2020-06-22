import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, message, Popconfirm, Modal, Form, Input } from 'antd';
import { getInfo, rechargeConfirm, rechargeReject } from '@/services/manager'
import { changeMoneyToChinese } from '@/utils/utils'
import './index.less';
import Imgs from '@/components/Imgs'
import myContext from '@/components/Imgs/creatContext'

const statusList = ['未开票', '审核中', '开票中', '已开票', '已驳回', '已邮寄', '已签收']
export default (props: any) => {
  const [id, setId] = useState('')
  const [showBtn,setBtn] = useState(false)
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false)
  const [info, setInfo] = useState<any>({})

  const childRef = useRef();

  useEffect(() => {
    if (props.location.state) {
      setId(props.location.state.id)
      if(props.location.state.showBtn){
        setBtn(true)
      }
      getData(props.location.state.id)
    }
  }, []);


  const getData = (id: string) => {
    getInfo({ rechargeId: id }).then(res => {
      setInfo(res.data)
    })
  }

  const confirm = () => {
    rechargeConfirm({ rechargeId: info.rechargeId }).then(res => {
      if (res.result) {
        message.info(res.message)
        getData(info.rechargeId)
      }

    })
  }

  const reject = () => {
    form.validateFields().then(val => {
      rechargeReject({ rechargeId: info.rechargeId, reason: val.reason }).then(res => {
        setVisible(false)
        if (res.result) {
          message.info(res.message)
          getData(info.rechargeId)
        }
      })
    })

  }

  return (
    <div className="detail">
      <Card title="充值信息" className="mb24" extra={
        showBtn && (
          <div>
          <Popconfirm
            placement="top"
            title="确定收款吗？"
            onConfirm={confirm}
            okText="是"
            cancelText="否"
          >
              <Button type="primary" className="mr10" disabled={info.rechargeStatus == 2 ? false : true} >款项已到，确认收款</Button>
            </Popconfirm>

            <Button type="primary" disabled={info.rechargeStatus == 2 ? false : true} onClick={() => { setVisible(true) }}>驳回</Button>
          </div>
        )        
      }>
        <Row>
          <Col span="12"><span>申请时间</span> <span>{info.applyTime}</span></Col>
          <Col span="12"><span>申请人 </span> <span>{info.applyName}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值商户</span>    <span>{info.enterpriseName}</span></Col>
          <Col span="12"><span>申请方式</span>    <span>{info.applyType == 1 ? '商户申请' : ''}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值通道</span>    <span>{info.channelName}</span></Col>
          <Col span="12"><span>充值账户</span>    <span>{info.bankAccount} | {info.bankName}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值金额 </span>   <span> ￥{info.amount}（{(changeMoneyToChinese(info.amount))}）</span></Col>
          <Col span="12"><span>服务费 </span>   <span> ￥{info.serviceAmount}（{(changeMoneyToChinese(info.serviceAmount))}）</span></Col>

        </Row>
        <Row>
          <Col span="12"><span>实际到账金额 </span>   <span> ￥{info.actualAmount}（{(changeMoneyToChinese(info.actualAmount))}）</span></Col>
          <Col span="12"><span>流水号 </span>  <span>{info.serialNumber}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值状态</span> <span style={{ color: '#52C41A' }}>
            {info.rechargeStatus == 1 && (<span>充值成功</span>)}
            {info.rechargeStatus == 2 && (<span>审核中</span>)}
            {info.rechargeStatus == 3 && (<span>充值失败</span>)}
          </span></Col>
          <Col span="12"><span>收票状态</span> <span style={{ color: '#FAAD14' }}>
            {info.receiveStatus == 1 && (<span>已开票</span>)}
            {info.receiveStatus == 2 && (<span>未收票</span>)}
          </span></Col>
        </Row>
        <Row>
          <Col span="12"><span>开票状态</span> <span style={{ color: '#FAAD14' }}>
            {statusList[info.invoiceStatus]}
          </span></Col>
          <Col span="12"><span>收票时间</span>    <span>{info.receiveTime}</span></Col>

        </Row>
        <Row>
          <Col span="12"><span>驳回原因</span> <span className="reject flex-1">{info.reason}</span></Col>

          <Col span="12"><span>备注</span> <span className="flex-1">{info.remark}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值凭证</span>    <span>
            <myContext.Provider value={{ src: info.certificate }}>
              <Imgs cRef={childRef} ></Imgs>
            </myContext.Provider >
          </span>
          </Col>
        </Row>
      </Card>
      <Card title="收款信息">
        <Row>
          <Col span="12"><span>单位名称 </span>   <span>{info.channelName}</span></Col>
          <Col span="12"><span>银行账号 </span>   <span>{info.channelBankAccount}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>开户行</span> <span>{info.channelBankName}</span></Col>
        </Row>
      </Card>
      <Modal
        title="审核驳回"
        visible={visible}
        onOk={reject}
        onCancel={() => { setVisible(false) }}
      >
        <Form form={form}>
          <Form.Item name="reason" label="驳回原因" rules={[{ required: true }]}>
            <Input.TextArea placeholder="请输入驳回原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};