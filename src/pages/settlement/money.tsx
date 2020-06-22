import React, { useState, useEffect } from 'react';
import './index.less';
import { Card, Steps, Form, Table, Select, Upload, message, Button, Radio, Row, Col } from 'antd'
import { UploadOutlined ,CheckCircleFilled} from '@ant-design/icons';
import { enterpriseChannels, batchPaymentSumit,checkSetleTaskInfo,taskList,confirmPpayment } from '@/services/settlement'
const { Option } = Select
const { Step } = Steps;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};


const columns = [
  {
    title: '姓名',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '手机号',
    key: '',
    dataIndex: ''
  },
  {
    title: '证件类型',
    key: '',
    dataIndex: ''
  },
  {
    title: '证件号码',
    key: 'idcard',
    dataIndex: 'idcard'
  },
  {
    title: '报名类型',
    key: '',
    dataIndex: ''
  },
  {
    title: '收款方式',
    key: 'type',
    dataIndex: 'type'
  },
  {
    title: '收款账户',
    key: 'bankAccount',
    dataIndex: 'bankAccount'
  },
  {
    title: '任务验收时间',
    key: 'submitTime',
    dataIndex: 'submitTime'
  },
  {
    title: '结算状态',
    key: 'status',
    dataIndex: 'status'
  },
  {
    title: '结算金额',
    key: 'payAmount',
    dataIndex: 'payAmount'
  }
]


export default (props:any) => {
  const [cur, setCur] = useState(0);
  const [list, setList] = useState([])
  const [subInfo, setInfo] = useState<any>()
  const [form] = Form.useForm()
  const [formData,setFormData] = useState<any>({

  })
  const [file, setFile] = useState('')
  const [isSub,setIsSub] = useState('a')
  const [uploading] = useState(false)
  const [totals,setTotals] = useState<any>({})
  const [data, setData] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const upProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: true,
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: (file: any) => {
      setFile(file)
      return false;
    }
  };
  const againProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: (file: any) => {
      console.log(file)
      let obj={
        channelId:formData.channelId,
        settlementMethod:formData.settlementMethod
      }
      setCur(4)
      next(obj,file)
    }
  };
  useEffect(() => {
    getList()    
    if(cur==1){
      getCheck()
    }
    
  }, [cur]);

  const getList = () => {
    enterpriseChannels({}).then(res => {
      setList(res.data)
    })
  }

  const next = (values: any,files:any) => {
    let upFile=files?files:file
    if (upFile == '') {
      message.info('请选择文件！')
      return
    }
    let channelName = list.filter((item: any) => item.id == values.channelId)[0].name


    let data = new FormData()
    data.append('channelId', values.channelId)
    data.append('channelName', channelName)
    data.append('settlementMethod', values.settlementMethod)
    data.append('file', upFile)
    batchPaymentSumit(data).then(res => {
      if (res) {
        setFormData(values)
        setInfo(res.data)        
        setCur(1)
      }
    })
  }

  const getCheck=()=>{
    checkSetleTaskInfo({batchId:subInfo.batchId}).then(res=>{
      if(res){
        setTotals(res.data)
        getDetail(1)
      }
    })
  }
  const getDetail=(type:number)=>{
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      batchId:subInfo.batchId,
      checkFlag:type
    }
    taskList(data).then(res=>{
      if(res.result){
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
    getDetail(cur)
  }
  
  const submit = ()=>{
    if(data.length==0){
      message.info('暂无结算数据！')
      return
    }
    let prames={
      enterpriseId:subInfo.enterpriseId,
      channelId:subInfo.channelId,
      batchId:subInfo.batchId
    }
    confirmPpayment(prames).then(res=>{
      if(res){
        setCur(3)
      }
    })
  }

  const selectBtn = (e:any)=>{
    if(e.target.value=='a'){
      setIsSub('a')
      getDetail(1)
    }else{
      setIsSub('b')
      getDetail(-1)
    }
  }

  const toList = ()=>{
    props.history.push('batch')
  }

  return (
    <div className="money">
      <Card className="mb24">
        <Steps current={cur}>
          <Step title="进行中" description="上传数据" />
          <Step title="初步检验" description={cur == 1 ? '进行中' : '待进行'} />
          <Step title="确认打款" description={cur == 2 ? '进行中' : '待进行'} />
        </Steps>
        
        {
          cur == 2 && (
            <div className="sucess">
              <CheckCircleFilled style={{ fontSize: 60, color: '#1890ff' }} />
              <p className="tit">结算名单提交成功</p>
              <p className="des">预计1个工作日完成审核</p>
              <Button onClick={toList}>批次列表</Button>
            </div>
          )
        }
      </Card>
      {

        cur == 0 && (
          <Card>

            <Form {...layout} form={form} onFinish={next}>
              <Form.Item label="当前账户">
                南京舜昊健康产业集团
              </Form.Item>
              <Form.Item label="打款通道" name="channelId" rules={[{ required: true }]}>
                <Select className="w200">
                  {
                    list.map((item: any) => {
                      return (
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="结算方式" name="settlementMethod" rules={[{ required: true }]}>
                <Select className="w200">
                  <Option value="1">一次性结算</Option>
                </Select>
              </Form.Item>
              <Form.Item label="上传文件">
                <Upload {...upProps}>
                  <Button>
                    <UploadOutlined /> 上传文件
                </Button>
                </Upload>
                <Button type="link" href="http://lqyg.shunshuitong.net/resource/template/结算名单.xlsx">下载导入模板</Button>
                <p className="mt10">支持格式：xls,xlsx</p>
              </Form.Item>
              <Button type="primary" className="ml130" htmlType="submit">下一步</Button>
            </Form>
          </Card>

        )
      }


      {
        (cur == 1|| cur== 4) && (
          <div>
            <p className="describe">当前表格合计{totals.waitCheck}条  可发起签约{totals.passCheck}条</p>
            <Card className="mb24">
              <div className="info">
                <div className="lt">
                  <p>通过验证（条）</p>
        <p className="num">{totals.passCheck}</p>
                </div>
                <div className="rt">
                  <p>未通过（条）</p>
                  <p className="num">{totals.failedPassCheck}</p>
                </div>
              </div>
            </Card>
            <Card className="mb24">
              <Row justify="space-between">
                <Col>
                  <Radio.Group defaultValue={isSub} buttonStyle="solid" onChange={selectBtn}>
                    <Radio.Button value="a">未通过</Radio.Button>
                    <Radio.Button value="b">通过验证</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col>
                {
                  isSub == 'b' && (
                    <Button className="mr10" onClick={submit}>提交结算</Button>
                  )
                }
                  <Upload {...againProps}><Button>重新上传</Button></Upload>
                </Col>
              </Row>

              <Table 
                pagination={{
                  pageSize: pageInfo.limit,
                  total: pageInfo.total,
                  onChange: changePage
                }} 
                columns={columns} 
                dataSource={data}
              ></Table>
            </Card>
          </div>

        )
      }

    </div>
  );
};
