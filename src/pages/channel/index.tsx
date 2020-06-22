import React, { useState, useEffect } from 'react';
import { SearchOutlined} from '@ant-design/icons';
import { Card,Form,Input,Button,Table,Select} from 'antd';
import moment from 'moment'
const {Option} = Select
import { channelRecordPage,channelList,forbidLogin} from '@/services/manager'
import './index.less';


export default (props:any) => {
  const [form] = Form.useForm()
  const columns=[   
    {
      title:'申请时间',
      dataIndex:'applyTime',
      key:'applyTime',
    },
    {
      title:'申请方式',
      dataIndex:'applyType',
      key:'applyType',
      render:(tags:any)=>(tags==1?'商户申请':'')
    },    
    {
      title:'商户名称',
      dataIndex:'enterpriseName',
      key:'enterpriseName',
    },  
    {
      title:'充值通道',
      dataIndex:'channelName',
      key:'channelName',
    },  
    {
      title:'充值金额',
      dataIndex:'amount',
      key:'amount',
      width:200
    },  
    {
      title:'充值状态',
      dataIndex:'rechargeStatus',
      key:'rechargeStatus',
      render:(tags:any)=>{
        let arr=['充值成功','审核中','充值失败']
        return (arr[tags-1])
      }
    },    
    {
      title:'开票状态',
      dataIndex:'invoiceStatus',
      key:'invoiceStatus',
      render:(tags:any)=>{
        let arr=['审核中','开票中','已开票','已驳回','已邮寄','已签收']
        return (arr[tags-1])
      }
    }, 
    {
      title:'收票状态',
      dataIndex:'receiveStatus',
      key:'receiveStatus',
      render:(tags:any)=>{
        let arr=['已收票','未收票']
        return (arr[tags-1])
      }
    },       
    {
      title:'操作',
      key:'action',
      render:(tags:any)=>{
        return (
          <div>
            <Button type="link" className="mr10" onClick={toDetail.bind(this,tags.rechargeId)}>详情</Button>
            {/* <Button type="link">添加商户</Button> */}
          </div>
        )
        
      }      
    },
  ]
  const [data,setData] = useState([])
  const [list,setList] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {    
    let state=props.location.state
    if(state){
      getList(state.id)
    }else{
      getList('')
    }
  }, []);

  const getList=(id:string)=>{
    channelList({}).then(res=>{
      if(res.result){     
        setList(res.data)
        if(id){
         form.setFieldsValue({channelId:id})
        }

        //获取列表
        getData()
      }
    })
  }

  const getData =()=>{
    let val = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      channelId:val.channelId?val.channelId:'',
      serialNumber:val.serialNumber||'',
      rechargeStatus:val.rechargeStatus||'',
      invoiceStatus:val.invoiceStatus||'',
      receiveStatus:val.receiveStatus||''
    }
    channelRecordPage(data).then(res=>{      
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
    getData()
  }



  const toDetail = (id:string)=>{
    props.history.push({pathname:'/recharge/detail',state:{id:id}})
  }

  return (
    <div className="detail">
        <Card title="充值记录查询" className="mb24">
          <Form layout="inline" form={form}>             
            <Form.Item name="channelId">
              <Select className="w200" placeholder="通道列表" >
                {
                  list.map((item:any)=>{
                    return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </Form.Item>  
            <Form.Item className="w200" name="serialNumber">
                <Input placeholder="流水号"></Input>
            </Form.Item>  
            <Form.Item className="w200" name="rechargeStatus">
                <Select placeholder="充值状态">
                  <Option value="1">充值成功</Option>
                  <Option value="2">审核中</Option>
                  <Option value="3">充值失败</Option>
                </Select>
            </Form.Item>  
            <Form.Item className="w200" name="invoiceStatus">
                <Select placeholder="开票状态">
                  <Option value="1">审核中</Option>
                  <Option value="2">开票中</Option>
                  <Option value="3">已开票</Option>
                  <Option value="4">已驳回</Option>
                  <Option value="5">已邮寄</Option>
                  <Option value="6">已签收</Option>
                </Select>
            </Form.Item>  
            <Form.Item className="w200" name="receiveStatus">
                <Select placeholder="收票状态">
                  <Option value="1">已收票</Option>
                  <Option value="2">未收票</Option>
                </Select>
            </Form.Item>  
            <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
          </Form>
        </Card>
        <Card title="充值记录列表">
          {/* <div className="mb10"><Button className="mr10">导出选中</Button> <Button>导出检索结果</Button></div> */}
          <Table 
          
            pagination={{
              pageSize: pageInfo.limit,
              total: pageInfo.total,
              onChange: changePage
            }}
            columns={columns} dataSource={data} ></Table>
        </Card>

        
    </div>

  );
};
