import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Input, Select, Upload, Transfer, Checkbox, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getDictListByValue, channelList, addEnterPrise, enterpriseDetail, uptEnterprise,tempList } from '@/services/manager'
// import {tempPage} from '@/services/template'
const { Option } = Select
import './index.less';

export default (props: any) => {
  const [form] = Form.useForm()
  const [natureList, setNature] = useState([])
  const [industry, setIndust] = useState([])
  const [invoiceList, setInvoice] = useState([])
  const [temList,setTem] = useState([])
  const [targetKeys, setKey] = useState([])
  const [id, setId] = useState()
  const [userId, setuserId] = useState()

  const [options, setOptions] = useState([])

  const [imgs, setImgs] = useState({
    businessLicense: '',
    legalCardZ: '',
    legalCardF: ''
  })
  const uploadButton = (text: any) => {
    return (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">{text}</div>
      </div>
    )
  }


  useEffect(() => {
    if (props.location.state) {
      setId(props.location.state.enterpriseId)
      getDetail(props.location.state.enterpriseId)
    }else{
      getList()
    }
  }, []);

  const getDetail = (id: string) => {
    enterpriseDetail({ enterpriseId: id }).then(res => {
      let data = { ...res.data }
      setImgs({
        businessLicense: data.businessLicense,
        legalCardZ: data.legalCardZ,
        legalCardF: data.legalCardF
      })
      data.invoiceAccountValue = res.data.invoiceAccountValue.split(',')
      data.taxation = parseFloat(res.data.taxation).toFixed(2)
      data.serviceCharge = parseFloat(res.data.serviceCharge).toFixed(2)
      setKey(res.data.invoiceAccountValue.split(','))
      setuserId(res.data.userId)
      data.channelId = res.data.channelId.split(',')
      data.templateId = res.data.templateId.split(',')
      form.setFieldsValue(data)
      getList()
    })
  }

  const getList = () => {

    //企业性质
    getDictListByValue({ type: 'enterprise_nature' }).then(res => {
      if (res.result) {
        setNature(res.data)
      }
    })

    //所属行业
    getDictListByValue({ type: 'enterprise_industry' }).then(res => {
      if (res.result) {
        setIndust(res.data)
      }
    })

    //发票科目
    getDictListByValue({ type: 'invoice_account' }).then(res => {
      if (res.result) {
        let data = res.data.map((item: any) => {
          return {
            key: item.value,
            title: item.label,
            description: item.label
          }
        })
        setInvoice(data)
      }
    })

    tempList({}).then(res=>{
      if(res.result){
        let arr=res.data.map(item=>{
          return {
            label: item.title,
            value: item.id
          }
        })
        setTem(arr)
      }
    })

    channelList({}).then(res => {
      let arr= form.getFieldsValue().channelId||[]
      if (res.result) {
        let data = res.data.map((item: any) => {
          if(arr.indexOf(item.id)>-1){
            return {
              label: item.name,
              value: item.id,
              disabled:true
            }
          }else{
            return {
              label: item.name,
              value: item.id
            }
          }
          
        })
        setOptions(data)
      }
    })
  }

  const upProps = {
    name: 'file',
    action: '/manger/batch/upload',
    headers: {
      "User-Client": 'manager',
      "Authorization": window.localStorage.getItem('token'),
    },
    listType: "picture-card",
    className: "avatar-uploader",
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status == 'done') {
        let res = info.fileList[0].response
        if (res.result) {
          setImgs({ ...imgs, legalCardZ: res.data[0] })

        }
      }
    },
  };

  const props1 = {
    ...upProps,
    onChange(info: any) {
      if (info.file.status == 'done') {
        let res = info.fileList[info.fileList.length - 1].response
        if (res.result) {
          setImgs({ ...imgs, businessLicense: res.data[0] })

        }
      }
    },
  };

  const props2 = {
    ...upProps,
    onChange(info: any) {
      if (info.file.status == 'done') {
        let res = info.fileList[info.fileList.length - 1].response
        if (res.result) {
          setImgs({ ...imgs, legalCardZ: res.data[0] })

        }
      }
    },
  };

  const props3 = {
    ...upProps,
    onChange(info: any) {
      if (info.file.status == 'done') {
        let res = info.fileList[info.fileList.length - 1].response
        if (res.result) {
          setImgs({ ...imgs, legalCardF: res.data[0] })

        }
      }
    },
  };


  const handleSelectChange = () => {

  }

  const changeKey = (nextTargetKeys: any) => {
    setKey(nextTargetKeys)
  }

  const reset = () => {
    form.resetFields()
    setImgs({ businessLicense: '', legalCardZ: '', legalCardF: '' })
  }

  const submit = (val: any) => {
    if (imgs.businessLicense == '') {
      message.info('请上传营业执照！')
      return
    }
    if (imgs.legalCardZ == '' || imgs.legalCardF == '') {
      message.info('请上传身份证！')
      return
    }

    let data = {
      name: val.name || '',
      fullName: val.fullName || '',
      regCode: val.regCode || '',
      taxNum: val.taxNum || '',
      contactName: val.contactName || '',
      contactPhone: val.contactPhone || '',
      contactEmail: val.contactEmail || '',
      legal: val.legal || '',
      legalIdCard: val.legalIdCard || '',
      legalCardZ: imgs.legalCardZ,
      legalCardF: imgs.legalCardF,
      natureValue: val.natureValue || '',
      industryValue: val.industryValue || '',
      address: val.address || '',
      phone: val.phone || '',
      businessLicense: imgs.businessLicense,
      serviceCharge: val.serviceCharge || '',
      taxation: val.taxation || '',
      invoiceAccountValue: val.invoiceAccountValue ? val.invoiceAccountValue.join(',') : '',
      channelId: val.channelId ? val.channelId.join(',') : '',
      loginName: val.loginName || '',
      userName:val.userName ||'',
      password: val.password || '',
      templateId:val.templateId?val.templateId.join(','):''
    }
    if (id) {
      data.enterpriseId = id
      data.userId = userId
      uptEnterprise(data).then(res => {
        if (res.result) {
          message.info('修改成功！')
          props.history.push('/merchant')
        }
      })
    } else {
      addEnterPrise(data).then(res => {
        if (res.result) {
          message.info('添加成功！')
          props.history.push('/merchant')
        }
      })
    }

  }

  return (

    <div className="add">
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} onFinish={submit} >

        <Card title="基本资料" className="mb24">
          <Row gutter={100}>
            <Col span="12">
              <Form.Item label="企业名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请填写企业名称"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="商户主体" name="fullName" rules={[{ required: true }]}>
                <Input placeholder="请填写商户主体"></Input>
              </Form.Item>
            </Col>
            {/* <Col span="12">
              <Form.Item label="社会信用代码" name="regCode" rules={[{ required: true }]}>
                <Input placeholder="请填写统一社会信用代码"></Input>
              </Form.Item>
            </Col> */}
            <Col span="12">
              <Form.Item label="税号" name="taxNum" rules={[{ required: true }]}>
                <Input placeholder="请输入企业税号"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="联系人姓名" name="contactName" rules={[{ required: false }]}>
                <Input placeholder="请填写联系人姓名"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="联系人电话" name="contactPhone" rules={[{ required: false }]}>
                <Input placeholder="请填写客户联系人电话"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="联系人邮箱" name="contactEmail" rules={[{ required: false }]}>
                <Input placeholder="请填写联系人邮箱"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="企业法人" name="legal" rules={[{ required: true }]}>
                <Input placeholder="请填写企业法人"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="法人身份证号" name="legalIdCard" rules={[{ required: true }]}>
                <Input placeholder="请填写法人身份证号"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="企业性质" name="natureValue" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  {
                    natureList.map((item: any) => {
                      return (
                        <Option value={item.value} key={item}>{item.label}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="所属行业" name="industryValue" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  {
                    industry.map((item: any) => {
                      return (
                        <Option value={item.value} key={item}>{item.label}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="企业地址" name="address" rules={[{ required: false }]}>
                <Input placeholder="请填写企业地址"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="企业固话" name="phone" rules={[{ required: false }]}>
                <Input placeholder="请填写企业固话"></Input>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="资质信息" className="mb24">
          <Row>
            <Col span="12">
              <Form.Item label="* 营业执照">
                <Upload {...props1}>
                  {imgs.businessLicense != '' ? <img src={imgs.businessLicense} alt="avatar" style={{ width: '100%' }} /> : uploadButton('营业执照')}
                </Upload>
                <p className="des">点击图片上传/修改图片</p>
              </Form.Item>
            </Col>
            <Col span="12"></Col>
            <Col span="12" className="card">
              <Form.Item label="* 法人身份证">
                <Upload {...props2}>
                  {imgs.legalCardZ != '' ? <img src={imgs.legalCardZ} alt="avatar" style={{ width: '100%' }} /> : uploadButton('身份证正面')}
                </Upload>
                <p className="des">点击图片上传/修改图片</p>
              </Form.Item>
            </Col>
            <Col span="12" className="card">
              <Form.Item>
                <Upload {...props3}>
                  {imgs.legalCardF != '' ? <img src={imgs.legalCardF} alt="avatar" style={{ width: '100%' }} /> : uploadButton('身份证反面')}
                </Upload>
                <p className="des">点击图片上传/修改图片</p>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="财务信息" className="mb24">
          <Row>
            <Col span="12">
              <Form.Item label="平台服务费率" name="serviceCharge" rules={[{ required: true }]}>
                <Input suffix="%"></Input>
              </Form.Item>
            </Col>
            <Col span="12"></Col>
            <Col span="12">
              <Form.Item label="增值税税率" name="taxation" rules={[{ required: true }]}>
                <Input suffix="%"></Input>
              </Form.Item>
            </Col>
            <Col span="12"></Col>
            <Col span="12">
              <Form.Item label="发票科目" name="invoiceAccountValue" rules={[{ required: true }]}>
                <Transfer
                  dataSource={invoiceList}
                  titles={['全部', '已选择']}
                  targetKeys={targetKeys}
                  render={item => item.title}
                  onChange={changeKey}
                />
              </Form.Item>
            </Col>
            <Col span="12"></Col>
            
                <Col span="12">
                  <Form.Item label="签约通道" name="channelId" rules={[{ required: true }]}>
                    <Checkbox.Group
                      options={options}
                    />
                  </Form.Item>
                </Col>
                <Col span="12"></Col>
                <Col span="12">
                  <Form.Item label="协议模板" name="templateId" rules={[{ required: true }]}>
                    <Checkbox.Group
                      options={temList}
                    />
                  </Form.Item>
                </Col>

          </Row>
        </Card>
        
            <Card title="账户信息" className="mb24">
              <Row>
                <Col span="12">
                  <Form.Item label="企业登录账户" name="loginName" rules={[{ required: true }]}>
                    <Input placeholder="请填写登录手机号"></Input>
                  </Form.Item>
                </Col>
                <Col span="12">
                  <Form.Item label="用户名" name="userName" rules={[{ required: true }]}>
                    <Input placeholder="请填写用户名"></Input>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
         

        <Card>
          <Row>
            <Col span="12">
              <Form.Item noStyle>
                <Button className="mr10" onClick={reset}>重置表单</Button>
                <Button type="primary" htmlType="submit">{id ? '提交修改' : '确定提交'}</Button>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>

    </div>
  );
};
