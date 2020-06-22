import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress  } from 'antd';
import {homeInfo,homeChart} from '@/services/manager'
import { Column } from '@ant-design/charts';
import './index.less';




export default () => {

  const [comInfo, setCom] = useState<any>({})
  const [count, setCount] = useState<any>({})
  const [data,setData] = useState([])
  const config = {
    title: {
      visible: true,
    },
    forceFit: true,
    data,
    padding: 'auto',
    xField: 'type',
    yField: 'sales',
    meta: {
      type: { alias: ' ' },
      sales: { alias: '发放金额(元)' },
    },
  };
  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    homeInfo({}).then(res => {
      if (res.result) {
        window.localStorage.setItem('comInfo', res.data.enterpriseInfo)

        setCom(res.data.userInfo)
        setCount(res.data.count)
      }
    })
    
    homeChart({}).then(res=>{
      console.log(res)
      if(res.result){
        let arr = res.data.map((item:any)=>{
          return {
            type:item.date,
            sales:item.amount
          }
        })
        setData(arr)
      }
    })
  }

  return (
    <div>
      <Row className="mb24">
        <Col span="24">
          <Card>
            <div className="top">
              <div className="user">
                <p>您好，{comInfo.name}</p>
                <p><span className="phone">{comInfo.loginName}</span> <span className="role">{comInfo.roleName}</span></p>
              </div>
              <div className="amount">
                <p>通道总余额</p>
                <div>
                  <span className="total">￥{count.balances}</span>
                  {/* <Button type="primary">充值</Button> */}
                </div>
              </div>
              <div className="item">
                <div>
                  <p>进行中的项目</p>
                  <p className="num">{count.ongoingNum}</p>
                </div>
                <div>
                  <p>已签约人员</p>
                  <p className="num">{count.signNum}</p>
                </div>
                <div>
                  <p>待结算批次</p>
                  <p className="num">{count.settleNum}</p>
                </div>
              </div>
            </div>

          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span="12">
          <Card title="上月任务完成率">
            <div className="circle">
              <Progress width={250} type="circle" percent={count.finishRate}  />              
            </div>
          </Card>
        </Col>
        <Col span="12">
          <Card title="近六月发放金额">            
            <Column {...config} />
          </Card>
        </Col>
      </Row>

    </div>
  );
};
