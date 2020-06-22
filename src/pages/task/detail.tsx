import React, { useState, useEffect } from 'react';
import { Tabs, Steps, Card, Switch, Row, Col, Button, message, Popconfirm } from 'antd';
// import { TeamOutlined } from '@ant-design/icons'
// const { Step } = Steps;
const { TabPane } = Tabs
import Zmage from 'react-zmage'
import './index.less';
// import Sign from './components/sign' //报名管理
// import Acceptance from './components/acceptance' //任务验收
// import Settle from './components/settle' //结算管理
// import myContext from './components/creatContext'
import { showTask, getTaskDetailNum, templatePreview, completeTask, taskExamine, getTaskDetailBasic } from '@/services/task'



export default (props: any) => {
  const [cur, setCur] = useState('0')
  const [info, setInfo] = useState<any>({})
  const [id, setId] = useState()
  const [taskStatus, setStatus] = useState(0)
  const [numObj, setNum] = useState<any>({})
  const [url, setUrl] = useState('')
  const [urls, setUrls] = useState([{ src: '' }])
  useEffect(() => {
    if (props.location.state) {
      let taskStatus = props.location.state.info.taskStatus
      if (props.location.state.info) {
        getTemplate(props.location.state.info)
        setId(props.location.state.info.id)
        getData(props.location.state.info)
      }
      switch (taskStatus) {
        case '3':
          setStatus(1);
          break;
        case '4':
          setStatus(2);
          break;
        case '5':
          setStatus(3);
          break;
        case '6':
          setStatus(4);
          break;
      }
    }
  }, []);

  const getData = (info: any) => {
    getTaskDetailBasic({ taskId: info.id }).then(res => {
      if (res.result) {
        let arr = res.data.annexUrls.split(',')
        let imgs = arr.map((item: any) => {
          return {
            src: item
          }
        })
        setUrls(imgs)
        setInfo(res.data)
      }
    })
  }

  const changeTab = (key: any) => {
    if (key == '0') {
      setCur(key)
      return
    }
    let data = {
      status: key,
      taskId: info.id
    }
    getTaskDetailNum(data).then(res => {
      setNum(res.data)
      setCur(key)
    })
  }

  const changeSwitch = (id: string) => {

    showTask({ taskId: id, showLoading: true }).then(res => {
      if (res.result) {
        let obj = { ...info }
        let showFlag = info.showFlag
        if (showFlag == 1) {
          obj.showFlag = 2
        } else {
          obj.showFlag = 1
        }
        setInfo(obj)
        message.info(res.message)
      }
    })
  }

  const getTemplate = (info: any) => {
    templatePreview({ taskId: info.id }).then(res => {
      if (res.result) {
        setUrl(res.data)
      }
    })
  }

  const confirm = () => {
    completeTask({ taskId: info.id }).then(res => {
      if (res.result) {
        message.info(res.message)
      }
    })
  }

  const audit = (type: number) => {
    taskExamine({ taskId: id, status: type }).then(res => {
      if (res.result) {
        message.info(res.message)
        getData({id:id})
      }
    })
  }

  return (
    <div className="task">
      <Card title="任务详情" className="mb24"
        extra={
          <div>
            <Popconfirm
              placement="top"
              title="确定审核通过吗？"
              disabled={info.taskStatus == 1 ? false : true}
              onConfirm={audit.bind(this, 1)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" disabled={info.taskStatus == 1 ? false : true} className="mr10">审核通过</Button>
            </Popconfirm>
            <Popconfirm
              placement="top"
              title="确定审核不通过吗？"
              disabled={info.taskStatus == 1 ? false : true}
              onConfirm={audit.bind(this, 2)}
              okText="确定"
              cancelText="取消"
            >
            <Button type="primary" disabled={info.taskStatus == 1 ? false : true} danger >审核不通过</Button>
            </Popconfirm>
          </div>
        }
      >
        <Tabs
          activeKey={cur}
          onChange={changeTab}
          tabBarExtraContent={
            cur == '2' && (
              <Button onClick={confirm}>任务完成</Button>
            )
          }
        >
          <TabPane tab="基本信息" key="0">
            <div>发布企业：{info.enterpriseName}</div>
            <div className="mt10">任务编号：{info.taskNum}</div>
            <div className="mt10">发布时间：{info.releaseTime}</div>
            {/* <Steps current={taskStatus} size="small" className="mt24">
              <Step title="发布任务" description="已完成" />
              <Step title="用户报名" description="未开始" />
              <Step title="任务验收" description="进行中" />
              <Step title="任务结算" description="结算中" />
              <Step title="任务完成" description="以完成" />
            </Steps> */}
          </TabPane>
        </Tabs>
      </Card>
      {
        cur == '0' && (
          <Card title="任务大厅" className="tables">
            <div className="list">
              <div className="head">
                <p className="lt">{info.name} </p>
                <p>
                  <span>任务编号：{info.taskNum}</span>
                  <span>发布时间：{info.releaseTime}</span>
                </p>
              </div>
              <div className="info">
                <div className="lt">
                  <div className="line">
                    <span>任务预算单价</span>
                    <span>总预算</span>
                    <span>需要人数</span>
                    <span>报名人数</span>
                    <span>已录用人数</span>
                  </div>
                  <div className="line">
                    <span className="num">{info.singleMinAmount}~{info.singleMaxAmount}</span>
                    <span className="num">{info.totalBudgetAmount}</span>
                    <span>{info.needNum}</span>
                    <span>{info.signNum}</span>
                    <span>{info.employNum}</span>
                  </div>
                </div>
              </div>
              <div className="footer">
                <div className="lt">
                  {info.businessLabel}>{info.industryLabel}<span className="mrlr20">{info.cityName}</span><span>报名截止时间:{info.signEndTime}</span>
                </div>
                <div className="rt">
                  {
                    info.taskStatus!=2&&(
                      <div>
                        <span>任务大厅中显示</span> <Switch checked={info.showFlag == 1 ? true : false} onChange={changeSwitch.bind(this, info.id)} />
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
            <Row gutter={[20, 40]}>
              <Col span="2">任务描述</Col>
              <Col span="22">
                {info.description}
              </Col>
              <Col span="2">任务附件</Col>
              <Col span="22" >
                <div className="imgs">
                  <Zmage src={urls[0].src}
                    set={urls}></Zmage>
                </div>
                  <p style={{color:'#ff0000'}}>点击查看多个附件</p>
              </Col>
              <Col span="2">任务协议</Col>
              <Col span="22">
                 <a href={url} target="_blank">预览</a>
              </Col>
            </Row>
          </Card>
        )
      }
      {/* {
        cur == '1' && (
          <myContext.Provider value={info.id} >
            <Sign></Sign>
          </myContext.Provider>
        )
      }
      {
        cur == '2' && (
          <myContext.Provider value={{ cur: cur, id: info.id }}>
            <Acceptance ></Acceptance>
          </myContext.Provider>
        )
      }
      {
        cur == '3' && (
          <myContext.Provider value={{ cur: cur, id: info.id }}>
            <Settle ></Settle>
          </myContext.Provider>
        )
      } */}

    </div>
  );
};
