import { useAppDispatch, useAppSelector } from '@/context/store/hooks';
import {
  login,
  logout,
  toggleCollapse,
  saveFilter,
  handleSearch,
} from '@/context/slice/auth-slice';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((element) => element.auth);
  const isAuthenticated = !!user.token;

  const authLogin = (authData: any) => {
    dispatch(login(authData));
  };

  const authLogout = () => {
    dispatch(logout());
  };

  const toggleMenu = () => {
    dispatch(toggleCollapse());
  };

  const handleFilter = (filter: Record<string, any>) => {
    dispatch(saveFilter({ filter }));
  };

  const handleSearchText = (search: string) => {
    dispatch(handleSearch({ search }));
  };

  //   const authUpdate = (authData: any) => {
  //     dispatch(update(authData));
  //   };

  //   const authAdminLogin = (authData: any) => {
  //     dispatch(adminLogin(authData));
  //   };

  //   const authAdminUpdate = (authData: any) => {
  //     dispatch(adminUpdate(authData));
  //   };

  return {
    user,
    isAuthenticated,
    login: authLogin,
    logout: authLogout,
    toggle: toggleMenu,
    isCollapsed: user.isCollapsed,
    handleFilter,
    handleSearch: handleSearchText,
    // update: authUpdate,
    // adminLogin: authAdminLogin,
    // adminUpdate: authAdminUpdate,
  };
};

export default useAuth;
