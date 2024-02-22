import React from 'react';
import { Result } from 'antd';
import check from './CheckPermissions';
import type { IAuthorityType } from './CheckPermissions';
import type AuthorizedRoute from './AuthorizedRoute';
import type Secured from './Secured';

type AuthorizedProps = {
  authority: IAuthorityType;
  noMatch?: React.ReactNode;
  children?: React.ReactNode;
};

type IAuthorizedType = React.FC<AuthorizedProps> & {
  Secured: typeof Secured;
  check: typeof check;
  AuthorizedRoute: typeof AuthorizedRoute;
};

const Authorized = (
    {
      children,
      authority,
      noMatch =  (
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
          />
      )}) => {
    const childrenRender = typeof children === 'undefined' ? null : children;
    return check(authority, childrenRender, noMatch);
};

//export default Authorized;
export default Authorized as IAuthorizedType;
