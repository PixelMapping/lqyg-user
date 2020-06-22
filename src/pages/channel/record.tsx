import React, { useState, useEffect, useRef } from 'react';
import { channelBalance } from '@/services/manager';
import { Card, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

import './index.less';


export default (props: any) => {
  const [list, setList] = useState<any>([])
  useEffect(() => {
    getData()

  }, []);

  const getData = () => {
    channelBalance({}).then(res => {
      if (res.result) {
        setList(res.data)

      }
    })
  }

  const toList = (id:string)=>{
    props.history.push({pathname:'index',state:{id:id}})
  }

  return (
    <div>
      <Card title="余额查询" className="mb24">
        <div className="record">

          {
            list.map((item: any) => {
              return (
                <div className="channel" key={item.id}>
                  <div className="tit">{item.name}</div>
                  <div className="cont">
                    <div className="des">账户余额</div>
                    <div className="total">￥ {item.balances}</div>
                    <Button type="link" onClick={toList.bind(this,item.id)} icon={<FileTextOutlined />}>充值记录</Button>
                  </div>
                  <div className="bot">
                    创建时间：{item.crtTime}
                  </div>
                </div>
              )
            })
          }
        </div>

      </Card>

    </div>

  );
};
