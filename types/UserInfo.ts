export interface Group {
  id: number;
  groupName: string;
  description: string;
  status: string | null;
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
}

export interface PageRole {
  id: number;
  pageName: string;
  pageUrl: string;
  pageIcon: string | null;
  parentId: number;
  menuIndex: number;
  level: number;
  pageType: string | null;
  roles: string;
  roleId: string | null;
}

export interface User {
  id: number;
  avatar: string | null;
  fullName: string;
  username: string;
  password: string | null;
  status: string;
  phone: string;
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  fullNameNotMark: string;
  groups: Group[];
}

export interface ResponseData {
  groups: Group[];
  pageRoles: PageRole[];
  user: User;
}

export interface ApiResponse {
  timestamp: string;
  traceId: string;
  code: string;
  message: string;
  data: ResponseData;
}
