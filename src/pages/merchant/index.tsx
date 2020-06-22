import React, { useState, useEffect } from 'react';
import { SearchOutlined} from '@ant-design/icons';
import { Card,Form,Input,DatePicker,Button,Table,Select} from 'antd';
import moment from 'moment'
const {Option} = Select
import { enterprisePage,channelList} from '@/services/manager'
import './index.less';


export default (props:any) => {
  const [form] = Form.useForm()
  const columns=[   
    {
      title:'商户',
      dataIndex:'name',
      key:'name',
    },
    {
      title:'商户主体',
      dataIndex:'fullName',
      key:'fullName',
   
    },    
    {
      title:'签约通道',
      dataIndex:'channel',
      key:'channel',
    },  
    {
      title:'地址',
      dataIndex:'address',
      key:'address',
      width:200
    },  
    {
      title:'添加时间',
      dataIndex:'crtTime',
      key:'crtTime',
    },      
    {
      title:'操作',
      key:'action',
      render:(tags:any)=>{
        return (
          <div>
            <Button type="link" className="mr10" onClick={toDetail.bind(this,tags.enterpriseId)}>编辑</Button>
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
    getData()
    
  }, []);

  const getData =()=>{
    let val = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      search:val.search?val.search:'',
      crtTime:val.crtTime?moment(val.crtTime).format('YYYY-MM-DD'):'',
      channelId:val.channelId?val.channelId:''
    }
    enterprisePage(data).then(res=>{      
      if(res.result){
        setData(React.setKey(res.data.rows))
        let obj = { ...pageInfo }
        obj.total = res.data.total
        setPage(obj)
      }      
    })
    channelList({}).then(res=>{
      if(res.result){
        setList(res.data)
      }
    })
  }



  const changePage = (current: number) => {
    pageInfo.page = current
    setPage(pageInfo)
    getData()
  }

  const addShop =()=>{
    props.history.push('/merchant/add')
  }

  const toDetail = (id:string)=>{
    props.history.push({pathname:'/merchant/add',state:{enterpriseId:id}})
  }

  return (
    <div className="detail">
        <Card title="商户查询" className="mb24">
          <Form layout="inline" form={form}>
            <Form.Item className="w200" name="search">
              <Input placeholder="商户名/地址"></Input>
            </Form.Item>      
            <Form.Item className="w250" name="crtTime">
              <DatePicker placeholder="请选择日期"></DatePicker>
            </Form.Item>    
            <Form.Item className="w200" name="channelId">
              <Select placeholder="签约通道" allowClear>
                {
                  list.map((item:any)=>{
                    return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </Form.Item>    
            <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
          </Form>
        </Card>
        <Card title="商户列表" extra={<Button onClick={addShop}>添加商户</Button>}>
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
