import React, { useState, useEffect ,useRef } from 'react';
import { Form, Steps, Input, Divider, Select, Button, Row, Col ,InputNumber, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons'
import {bankList} from '@/services/task'
import { recharge } from '@/services/asset';
import ImgUpload from '@/components/ImgUpload'
import {changeMoneyToChinese} from '@/utils/utils'
import myContext from '@/components/ImgUpload/creatContext'
const { TextArea } = Input;
const { Option } = Select
const { Step } = Steps;
import './index.less';
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
};
export default (props: any) => {
  const childRef = useRef();
  const [form] = Form.useForm();
  const [cur, setCur] = useState(0)
  const [info, setInfo] = useState<any>({})
  const [list,setList] = useState([])
  const [totals,setTotals] = useState({amount:'0',serviceAmount:'0',taxAmount:'0',actualAmount:'0'})
  const [formDta,setFormData] = useState<any>({})

  useEffect(() => {
    getList()
    if (props.location.state) {
      console.log(props.location.state)
      setInfo(props.location.state.info)
    }
  }, []);

  const next = () => {
   
    let fileList = childRef.current.getUpFile()
    if(fileList.length==0){
      message.info('请上传充值凭证！')
      return
    }
    form.validateFields().then(values => {     
      let asset=list.filter(item=>item.bankId==values.bankAccount)[0]
      let data={
        enterpriseChannelId:info.enterpriseChannelId,
        channelName:info.name,
        applyType:'1',
        rechargeType:values.rechargeType,
        bankId:asset.bankId,
        bankName:asset.bankName,
        bankAccount:asset.bankAccount,
        openBank:asset.openBank,
        amount:values.amount,
        serviceAmount:totals.serviceAmount,
        taxAmount:totals.taxAmount,
        actualAmount:totals.actualAmount,
        certificate:fileList.join(','),
        serialNumber:values.serialNumber,
        remark:values.remark
      }
      setFormData(data)
      setCur(1)
    })
  }

  const getList=()=>{
    bankList({}).then(res=>{
      setList(res.data)
    })
  }

  const submit = () => {
    form.validateFields().then(values => {      
      let data={
        ...formDta,showLoading:true
      }
      recharge(data).then(res=>{
        
      })
      setCur(2)


    })
  }

  const changeAmount = (e:any) =>{
    if(info.serviceCharge>0){
      let num={...totals}
      num.amount=e
      num.serviceAmount=(e*info.serviceCharge).toFixed(2)
        num.taxAmount=((e-num.serviceAmount)*info.taxation).toFixed(2)
        num.actualAmount=(e-num.taxAmount-num.serviceAmount).toFixed(2)
        setTotals(num)
    }else{
      let num={...totals}
      num.amount=e
      setTotals(num)
    }
  }

  const toList = ()=>{
    props.history.push({pathname:'record',state:{id:info.channelId}})
  }

  

  return (
    <div className="assets">
      <Steps current={cur}>
        <Step title="填写充值信息" description="进行中" />
        <Step title="确认信息" description="待进行" />
        <Step title="充值确认" description="已完成" />
      </Steps>
      <Divider></Divider>
      <div>
        {
          cur == 0 && (
            <Form
              {...layout}
              name="basic"
              form={form}
            >
              <Form.Item label="收款信息">
                <p style={{ marginTop: 5 }}>银行账户：{info.bankName}</p>
                <p>银行账号：{info.bankAccount}</p>
                <p>开户行：{info.openBank}</p>
              </Form.Item>
              <Form.Item label="充值通道" >
                <p style={{ marginTop: 5 }}>{info.name}</p>
              </Form.Item>
              <Form.Item label="充值方式" name="rechargeType" rules={[{ required: true }]}>
                <Select className="w250">
                  <Option value="1">线下支付(银行转账)</Option>
                  <Option value="2">支付宝支付</Option>
                  <Option value="3">微信支付)</Option>             
                </Select>
              </Form.Item>
              <Form.Item label="充值账户">
                <p style={{ marginTop: 5 }}>南京舜昊健康产业集团</p>
              </Form.Item>
              <Form.Item label="银行账号" name="bankAccount" rules={[{ required: true }]}>
                <Select className="w250">
                  {
                    list.map((item:any)=>{
                      return (
                      <Option value={item.bankId} key={item.bankId}>{item.bankName}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              <div className="total">
               <Form.Item  label="充值金额" name="amount" rules={[{ required: true, type: 'number'}]}>
                <InputNumber min={0} className="w250"  onChange={changeAmount} placeholder="请输入充值金额"></InputNumber>
                </Form.Item>
                <div className="num">
                  
              （{(changeMoneyToChinese(totals.amount))}）
                </div>
              </div>
              
             
              <Form.Item label=" " colon={false} >
                  <div className="translate">
                <p>平台服务费：{totals.serviceAmount} （{(changeMoneyToChinese(totals.serviceAmount))}）</p>
                    <p>实际到账(已除去税金):{totals.actualAmount} （{(changeMoneyToChinese(totals.actualAmount))}）</p>
                  </div>
              </Form.Item>
              <Form.Item label="流水号" name="serialNumber" rules={[{ required: true }]}>
                <Input className="w250" placeholder="请输入流水号"></Input>
              </Form.Item>
              <Form.Item label="* 充值凭证">
                <myContext.Provider>
                  <ImgUpload  cRef={childRef}></ImgUpload>

                </myContext.Provider >
              </Form.Item>
              <Form.Item label="备注" name="remark">
                <TextArea rows={4} className="w250" />
              </Form.Item>
              <Row>
                <Col span="2"></Col>
                <Col>
                  <Button type="primary" onClick={next}>下一步</Button>
                </Col>
              </Row>

            </Form>
          )
        }
        {
          cur == 1 && (
            <div className="confirm">
              <Row className="row">
                <Col span="2" className="lt">收款信息</Col>
                <Col className="rt">
                <p style={{ marginTop: 5 }}>银行账户：{info.bankName}</p>
                <p>银行账号：{info.bankAccount}</p>
                <p>开户行：{info.openBank}</p>
                </Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2">充值通道</Col>
          <Col className="rt">{info.name}</Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2">充值方式</Col>
                <Col className="rt">
                  {
                    formDta.rechargeType ==1 && (<span>线下支付（银行转账）</span>)
                  }      
                  {
                    formDta.rechargeType ==2 && (<span>支付宝支付</span>)
                  }
                  {
                    formDta.rechargeType ==3 && (<span>微信支付</span>)
                  }            
                </Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2">充值账户</Col>
                <Col className="rt">南京舜昊健康产业集团</Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2">银行账号</Col>
                <Col className="rt">{formDta.bankAccount}</Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2">充值金额</Col>
                <Col className="rt">￥{totals.amount}（{(changeMoneyToChinese(totals.amount))}）</Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2">流水号</Col>
                <Col className="rt">{formDta.serialNumber}</Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2">充值凭证</Col>
                <Col className="rt">
                </Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2">备注</Col>
                <Col className="rt">
                  {formDta.remark}
                </Col>
              </Row>
              <Row className="row">
                <Col className="lt" span="2"></Col>
                <Col className="rt">
                  <Button className="mr10" onClick={() => { setCur(0) }}>返回修改</Button>
                  <Button type="primary" onClick={submit}>确认提交</Button>
                </Col>
              </Row>
            </div>
          )
        }
        {
          cur == 2 && (
            <div className="sucess">
              <CheckCircleFilled style={{ fontSize: 60, color: '#1890ff' }} />
              <p className="tit">充值确认中</p>
              <p className="des">预计两小时内到账</p>
              <Button onClick={toList}>充值记录</Button>
            </div>
          )
        }
      </div>

    </div>

  );
};
