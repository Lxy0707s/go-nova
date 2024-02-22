
import React from 'react';
import {getFunctions} from "@/utils/tool/authority";
type AuthorizedProps = {
  appId?: string,
  authority?: string[],
  judgeKey: string,
  noMatch?: React.ReactNode;
  children?: React.ReactNode;
};

export const checkUserPermission = (functions:string[],judgeKey:string, appid:string|undefined)=>{
  let appId = '';
  if (appid) {
    appId = appid ;
  }
  console.log("009",functions,appId, appid,judgeKey)
  let matchKey = ('GLOBAL_'+ judgeKey);
  let key = functions.find(x=>x === matchKey);
  if (key) return true;

  matchKey = judgeKey // ('APP_'+ appId + '_' + judgeKey);
  console.log("010",functions, matchKey)
  key = functions.find(x=>x === matchKey);
  if (key) return true;

  return false;
}

const AuthorizedEle: React.FunctionComponent<AuthorizedProps>  = (props)=>{
  let functions:string[] = [];

  if (props.authority) {
    functions = props.authority;
  } else {
    functions = getFunctions();
  }
  console.log("008",props.authority,functions)
  console.log(props.judgeKey,props?.appId)
  return checkUserPermission(functions,props.judgeKey,props?.appId)? <>{props.children}</> : <>{props.noMatch}</>
};

export default AuthorizedEle;

