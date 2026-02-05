import { useEffect,useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Collapse,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  ShoppingCart,
  Logout,
  Close,
  Settings,
  People,
  ExpandLess,
  ExpandMore,
  Search,
  Edit,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useTabs } from '@/contexts/TabContext';
import DashboardPage from '@/pages/Dashboard';
import ProductListPage from '@/pages/ProductList';
import { authApi,menuList } from '@/api/auth';


const drawerWidth = 240;

interface LeafMenuItem {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface SubMenuItem {
  id: string;
  label: string;
  children: LeafMenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component?: React.ReactNode;
  children?: SubMenuItem[];
}



export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { user, logout } = useAuth();
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabs();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadMenuList();    
  }, []);

  const loadMenuList = async () => {
    setLoading(true);
    const result = await authApi.getMenuList();
    setMenuList(buildMenuTree(result));
  };

  function buildMenuTree(flatMenu: any[]): MenuItem[] {
    const menuMap = new Map();
    const tree: MenuItem[] = [];
    // 1단계: 모든 메뉴를 Map에 저장
    flatMenu.forEach(menu => {
      const menuMapSub: any= {
        id: menu.menuCd,
        label: menu.menuNm,
        icon: menu.iconNm ? getIcon(menu.iconNm) : undefined,
        component: menu.progCd ? getComponent(menu.progCd) : undefined,
      };

      if(menu.progCd == "" || menu.progCd == null){
          menuMapSub.children = [];
      }

      menuMap.set(menu.menuCd, menuMapSub);

    });

    flatMenu.forEach(menu => {
      const menuItem = menuMap.get(menu.menuCd);
      
      if (menu.parentCd === null) {
        // 최상위 메뉴
        tree.push(menuItem);
      } else {
        // 하위 메뉴
        const parent = menuMap.get(menu.parentCd);
        if (parent) {
          parent.children.push(menuItem);
        }
      }
    });

    

   
    return tree;
}

// 아이콘 매핑
function getIcon(iconNm: string) {
  const icons: Record<string, JSX.Element> = {
    'Dashboard': <Dashboard />,
    'ShoppingCart': <ShoppingCart />,
    'People': <People />,
    'Settings': <Settings />
  };
  return icons[iconNm];
}

// 컴포넌트 매핑
function getComponent(progCd: string) {
  const components: Record<string, JSX.Element> = {
    'DashboardPage': <DashboardPage />,
    'ProductListPage': <ProductListPage />
  };
  return components[progCd] || <div style={{ padding: 24 }}>{progCd}</div>;
}


  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuToggle = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleLeafClick = (item: LeafMenuItem) => {
    addTab({
      id: item.id,
      label: item.label,
      component: item.component,
      closable: item.id !== 'dashboard',
    });
    setMobileOpen(false);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleTabClose = (event: React.MouseEvent, tabId: string) => {
    event.stopPropagation();
    removeTab(tabId);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileClose();
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuList.map((item) => (
          <div key={item.id}>
            {/* 1 Depth - 메인 메뉴 */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.children) {
                    handleMenuToggle(item.id);
                  } else if (item.component) {
                    handleLeafClick({ id: item.id, label: item.label, component: item.component });
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {item.children && (
                  openMenus[item.id] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            
            {/* 2 Depth - 서브 메뉴 */}
            {item.children && (
              <Collapse in={openMenus[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((subItem) => (
                    <div key={subItem.id}>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() => handleMenuToggle(subItem.id)}
                      >
                        <ListItemText primary={subItem.label} />
                        {openMenus[subItem.id] ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      
                      {/* 3 Depth - 최하위 메뉴 */}
                      <Collapse in={openMenus[subItem.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {subItem.children.map((leafItem) => (
                            <ListItemButton
                              key={leafItem.id}
                              sx={{ pl: 6 }}
                              onClick={() => handleLeafClick(leafItem)}
                            >
                              <ListItemText primary={leafItem.label} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </div>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.userId?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.userId}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>로그아웃</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        
        {/* 탭 헤더 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{tab.label}</span>
                    {tab.closable && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleTabClose(e, tab.id)}
                        sx={{ ml: 0.5, p: 0.5 }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                }
                sx={{ textTransform: 'none' }}
              />
            ))}
          </Tabs>
        </Box>

        {/* 탭 컨텐츠 */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {tabs.map((tab) => (
            <Box
              key={tab.id}
              role="tabpanel"
              hidden={activeTab !== tab.id}
              sx={{ height: '100%' }}
            >
              {activeTab === tab.id && tab.component}
            </Box>
          ))}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
