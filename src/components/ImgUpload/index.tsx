import React, { useState, useEffect, createContext , useContext,useImperativeHandle} from 'react';
import { Upload, Button, message ,Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import myContext from '@/components/ImgUpload/creatContext'
import './index.less';

export default ({cRef}) => {
  const [fileList, setFile] = useState([])
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  })
  
  useImperativeHandle(cRef, () => ({
		// changeVal 就是暴露给父组件的方法
	    getUpFile: () => {
        if(fileList.length==0){
          return []
        }else{
          let arr = fileList.map((item:any)=>item.url)
	        return arr
        }
	    }
  	}));

  useEffect(() => {
   
  }, []);

  const upProps = {
    action: '/manger/batch/upload',
    listType: 'picture-card',
    accept:"image/*",
    fileList: fileList,
    headers: {
      "User-Client": 'manager',
      "Authorization": localStorage.getItem('token')
    },
    beforeUpload(file: any) {


      const isLt2M = file.size / 1024 / 1024 <= 8;
      if (!isLt2M) {
        message.error('单个文件不能超过8M！');
      }
      return isLt2M;
    },
    onChange(info: any) {
      if(info.file.status=='uploading'){
        setFile(info.fileList)
      }
      if (info.file.status === 'done') {
        changeList(info.fileList)
      }
      if (info.file.status == "removed") {
        changeList(info.fileList)
      }    
    },
    onPreview(file:any){
      setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    }
  };

  const changeList = (list: any) => {
    let arr = []
    arr = list.map((item: any) => {
      if (item.response.result) {
        return {
          name: item.name,
          url: item.response.data[0],
          status: 'done',
          uid: item.uid
        }
      }
    })
    setFile(arr)

  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">点击上传</div>
    </div>
  )
  return (
    <div>
      <Upload {...upProps}>
        {fileList.length >= 10 ? null : uploadButton}
      </Upload>
      <p className="mt10">
        1、最多添加10个附件，单文件大小不超过8M <br />
        2、支持格式：jpeg、jpg、png
      </p>
      <Modal
          visible={state.previewVisible}
          title={state.previewTitle}
          footer={null}
          onCancel={()=>{setState({...state,previewVisible:false})}}
        >
          <img alt="example" style={{ width: '100%' }} src={state.previewImage} />
        </Modal>
    </div>
  );
};
