import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Authorized from './Authorized';

import type { IAuthorityType } from './CheckPermissions';

type AuthorizedRouteProps = {
  currentAuthority: string;
  component: React.ComponentClass<any, any>;
  render: (props: any) => React.ReactNode;
  redirectPath: string;
  authority: IAuthorityType;
};


const AuthorizedRoute = (
    {
        component: Component,
        element,
        authority,
        redirectPath,
        ...rest
    }) => (
    <Authorized
        authority={authority}
        noMatch={ <Route {...rest} element={<Navigate to={{ pathname: redirectPath }} />} />}
    >
        <Route {...rest} element={Component ? <Component /> : element} />
    </Authorized>
);

export default AuthorizedRoute;
