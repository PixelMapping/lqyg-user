import React, { useState, useEffect } from 'react';
import './index.less';
import { Card, Steps, Form, Table, Select, Upload, message, Button, Radio ,Row ,Col} from 'antd'
import { UploadOutlined ,CheckCircleFilled} from '@ant-design/icons';
import { importBatchSign ,batchSign} from '@/services/sign'
const { Option } = Select
const { Step } = Steps;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};



export default (props:any) => {

  const [cur, setCur] = useState(0);
  const [data, setData] = useState([])
  const [isAgain, setIsAgain] = useState(false)
  const [status,setStatus] = useState('a')
  const [form] = Form.useForm()
  const [fail, setFail] = useState([])
  const [pass, setPass] = useState([])
  const [file, setFile] = useState('')
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "证件类型",
      dataIndex: "certifiteType",
      key: "certifiteType"
    },
    {
      title: "证件号码",
      dataIndex: "certifiteNum",
      key: "certifiteNum"
    },  
    {
      title: "手机号码",
      dataIndex: "phone",
      key: "phone"
    },
    {
      title: status=='a'?"失败原因":'操作',
      key: "reason",
      render:(tags:any)=>(
       <div>
          {
          status=='a' ?  (
            <span>{tags.reason}</span>
          ): (
            <Button type="link">发起签约</Button>
          )
        }
       </div>
          
        
          
        )
      
    },
  ]

  const upProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: false,
    headers: {
      "User-Client": 'client',
    },
    beforeUpload: (files: any) => {
      setFile(files)
      if(isAgain){
        next(files)
        setIsAgain(false)
      }
      return false;
    }
  };
  useEffect(() => {

  }, []);


  const next = (files:any) => {
    let upFile = files?files:file
    if (upFile == '') {
      message.info('请选择文件！')
      return
    }


    let data = new FormData()
    data.append('file', upFile)
    importBatchSign(data).then(res => {
      if (res.result) {
        setFail(React.setKey(res.data.fail))
        setPass(React.setKey(res.data.pass))
        setCur(1)
      }
    })
  }

  const initiate=()=>{
    
    batchSign(pass).then(res=>{
      setCur(2)
    })
  }

  const change = (e:any)=>{
    setStatus(e.target.value)
  }

  const again = ()=>{
    setIsAgain(true)
  }

  const toDetail=()=>{
    props.history.push('detailInfo')
  }

  return (
    <div className="import">
      <Card >
        <Steps current={cur}>
          <Step title="上传注册" description={cur == 0 ? '进行中' : '待进行'} />
          <Step title="初步检验" description={cur == 1 ? '进行中' : '待进行'} />
          <Step title="签约确认" description={cur == 2 ? '进行中' : '待进行'} />
        </Steps>
      </Card>
      {
        cur == 0 && (
          <Card>

            <Form {...layout} form={form}>
              <Form.Item label="当前账户">
                南京舜昊健康产业集团
              </Form.Item>

              <Form.Item label="上传文件">
                <Upload {...upProps}>
                  <Button>
                    <UploadOutlined /> 上传文件
                </Button>
                </Upload>
                <Button type="link" href="http://lqyg.shunshuitong.net/resource/template/signTemplate.xlsx">下载导入模板</Button>
                <p className="mt10">                  
                  (任务详情->报名管理->导出名单) <br/> 
                  支持格式：xls,xlsx
                </p>
              </Form.Item>
              <Button type="primary" className="ml130" onClick={next.bind(this,file)}>下一步</Button>
            </Form>
          </Card>

        )
      }
      {
        cur == 1 && (
          <div>
            <p className="describe">总计导入{fail.length + pass.length}条数据  可发起签约{pass.length}条</p>
            <Card className="mb24">
              <div className="info">
                <div className="lt">
                  <p>通过验证（条）</p>
                  <p className="num">{pass.length}</p>
                </div>
                <div className="rt">
                  <p>未通过（条）</p>
                  <p className="num">{fail.length}</p>
                </div>
              </div>
            </Card>
            <Card>
              <Row justify="space-between">
                <Col>
                <Radio.Group defaultValue={status} onChange={change} buttonStyle="solid">
                  <Radio.Button value="a">未通过</Radio.Button>
                  <Radio.Button value="b">通过验证</Radio.Button>
                </Radio.Group>
                </Col>
                <Col>
                {
                  status=='b' &&(
                    <Button type="primary" className="mr10" onClick={initiate}>发起签约</Button>
                  )
                }
                <Upload {...upProps}><Button onClick={again}>重新上传</Button></Upload>
                </Col>
              </Row>
              
              <Table columns={columns} dataSource={status=='a'?fail:pass}></Table>
            </Card>
          </div>
        )
      }

  {
            cur == 2 && (
              <div className="sucess">
                <CheckCircleFilled style={{ fontSize: 60, color: '#1890ff' }} />
                <p className="tit mb24">签约成功</p>
                <Button onClick={toDetail}>查看明细</Button>
              </div>
            )
          }
    </div>
  );
};
