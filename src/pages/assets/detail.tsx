import React, { useState, useEffect } from 'react';
import { getInfo } from '@/services/asset';
import { changeMoneyToChinese } from '@/utils/utils'
import { Card, Row, Col } from 'antd';

import './index.less';


export default (props: any) => {
  const [info, setInfo] = useState<any>({})

  useEffect(() => {
    console.log(props)
    if (props.location.state) {
      getData(props.location.state.rechargeId)
    }

  }, []);

  const getData = (id: string) => {
    getInfo({ rechargeId: id }).then(res => {
      setInfo(res.data)
    })
  }

  return (
    <div className="detail">
      <Card title="充值信息" className="mb24">
        <Row>
          <Col span="12"><span>申请时间</span> <span>{info.applyTime}</span></Col>
          <Col span="12"><span>申请姓名 </span> <span>{info.applyName}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值商户</span>    <span>{info.enterpriseName}</span></Col>
          <Col span="12"><span>申请方式</span>    <span>{info.applyType == '1' && (<span>商户申请</span>)}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值通道</span>    <span>{info.channelName}</span></Col>
          <Col span="12"><span>充值账号</span>    <span>{info.channelBankAccount} | {info.channelBankName}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值金额 </span>   <span> ￥{info.amount}（{(changeMoneyToChinese(info.amount))}）</span></Col>
          <Col span="12"><span>充值凭证</span>    <span>{info.certificate}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>流水号 </span>  <span>{info.serialNumber}</span></Col>
          <Col span="12"><span>收票时间</span>    <span>{info.receiveTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>充值状态</span> <span>
            {info.rechargeStatus == 1 && (<span>充值成功</span>)}
            {info.rechargeStatus == 2 && (<span>审核中</span>)}
            {info.rechargeStatus == 3 && (<span>充值失败</span>)}
          </span></Col>
          <Col span="12"><span>收票状态</span> <span>
            {info.receiveStatus == 1 && (<span>已开票</span>)}
            {info.rechargeStatus == 2 && (<span>未收票</span>)}
          </span></Col>
        </Row>
        <Row>
          <Col span="12"><span>开票状态</span> <span>
            {info.invoiceStatus == 1 && (<span>已开票</span>)}
            {info.invoiceStatus == 2 && (<span>未收票</span>)}
          </span></Col>
          <Col span="12"></Col>
        </Row>
        <Row>
          <Col span="12"><span>备注</span></Col>
          <Col span="12">{info.remark}</Col>
        </Row>
      </Card>
      <Card title="收款信息">
        <Row>
          <Col span="12"><span>银行账户</span> <span>{info.channelBankName}</span></Col>
          <Col span="12"><span>银行账号</span> <span>{info.channelBankAccount}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>开户行</span> <span>{info.channelOpenBank}</span></Col>
          <Col span="12"></Col>
        </Row>
      </Card>
    </div>

  );
};
