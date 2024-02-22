export type StateType = {
    status?: 'ok' | 'error';
    type?: string;
    currentAuthority?: 'user' | 'auditor' | 'super-admin' | 'admin';
};