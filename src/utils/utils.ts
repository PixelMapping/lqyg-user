import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export const changeMoneyToChinese=(money:any)=>{  
  var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字  
  var cnIntRadice = new Array("","拾","佰","仟"); //基本单位  
  var cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位  
  var cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位  
  //var cnInteger = "整"; //整数金额时后面跟的字符  
  var cnIntLast = "元"; //整型完以后的单位  
  var maxNum = 999999999999999.9999; //最大处理的数字  
    
  var IntegerNum; //金额整数部分  
  var DecimalNum; //金额小数部分  
  var ChineseStr=""; //输出的中文金额字符串  
  var parts; //分离金额后用的数组，预定义  

  money = parseFloat(money);  
  if( money >= maxNum ){  
      return "";  
  }  
  if( money == 0 || money == ""){  
      //ChineseStr = cnNums[0]+cnIntLast+cnInteger;  
      ChineseStr = cnNums[0]+cnIntLast  
      //document.getElementById("show").value=ChineseStr;  
      return ChineseStr;  
  }  
  money = money.toString(); //转换为字符串  
  if( money.indexOf(".") == -1 ){  
      IntegerNum = money;  
      DecimalNum = '';  
  }else{  
      parts = money.split(".");  
      IntegerNum = parts[0];  
      DecimalNum = parts[1].substr(0,4);  
  }  
  if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换  
      let  zeroCount = 0;  
      let IntLen = IntegerNum.length;  
      for(let i=0;i<IntLen;i++ ){  
         let  n = IntegerNum.substr(i,1);  
         let p = IntLen - i - 1;  
         let q = p / 4;  
         let m = p % 4;  
          if( n == "0" ){  
              zeroCount++;  
          }else{  
              if( zeroCount > 0 ){  
                  ChineseStr += cnNums[0];  
              }  
              zeroCount = 0; //归零  
              ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];  
          }  
          if( m==0 && zeroCount<4 ){  
              ChineseStr += cnIntUnits[q];  
          }  
      }  
      ChineseStr += cnIntLast;  
      //整型部分处理完毕  
  }  
  if( DecimalNum!= '' ){//小数部分  
    let decLen = DecimalNum.length;  
      for(let i=0; i<decLen; i++ ){  
          let n = DecimalNum.substr(i,1);  
          if( n != '0' ){  
              ChineseStr += cnNums[Number(n)]+cnDecUnits[i];  
          }  
      }  
  }  
  if( ChineseStr == '' ){  
      //ChineseStr += cnNums[0]+cnIntLast+cnInteger;  
      ChineseStr += cnNums[0]+cnIntLast;  
  }/* else if( DecimalNum == '' ){ 
      ChineseStr += cnInteger; 
      ChineseStr += cnInteger; 
  } */  
  return ChineseStr;  
}  


