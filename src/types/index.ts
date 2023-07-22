import { UsersIcon } from "@heroicons/react/24/outline";

export type TObject = {
  [key: string]: any;
};

export type TSubmenu = {
  path: string;
  component: string;
  exact: boolean;
  name: string;
  Icon: typeof UsersIcon;
  childPath?: string;
};

export type TRoute = {
  path: string;
  component: string;
  exact: boolean;
  name: string;
  submenus?: TSubmenu[];
  Icon: typeof UsersIcon;
  home?: boolean;
};

export type TRoutes = TRoute[];
