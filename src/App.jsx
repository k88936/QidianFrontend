import React, {useEffect} from 'react'; // 添加useEffect导入
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './Home.jsx';
import Search from './Search.jsx'; // 引入搜索页面组件
// 引入MUI组件
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LanguageIcon from '@mui/icons-material/Language';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from 'react'; // 添加useState导入

function App() {
    // const [anchorEl, setAnchorEl] = useState(null);
    // // const [language, setLanguage] = useState('中文');
    //
    // const handleMenuOpen = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    //
    // const handleMenuClose = () => {
    //     setAnchorEl(null);
    // };

    // const handleLanguageChange = (lang) => {
    //     setLanguage(lang);
    //     handleMenuClose();
    // };

    useEffect(() => {
        const setRemUnit = () => {
            const html = document.documentElement;
            const width = html.clientWidth;
            html.style.fontSize = `${width / 30}`; // 设置html的font-size为视口宽度的1/10
        };

        setRemUnit();
        window.addEventListener('resize', setRemUnit);

        return () => {
            window.removeEventListener('resize', setRemUnit);
        };
    }, []);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        {text: '首页', path: '/'},
        {text: '院校库', path: '/schools', disabled: true},
        {text: '学科分类', path: '/subjects', disabled: true},
        {text: '帮助中心', path: '/help-center', disabled: true},
    ];

    return (
        <Router>
            <AppBar position="fixed">
                <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        启点
                        <Typography variant="subtitle1" component="span" sx={{marginLeft: '1rem'}}>
                            精准匹配学术引路人
                        </Typography>
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                        {isMobile ? (
                            <>
                                <Avatar sx={{marginLeft: '1rem'}}>U</Avatar>
                                <IconButton
                                    color="inherit"
                                    onClick={toggleDrawer(true)}
                                    aria-label="menu"
                                >
                                    <MenuIcon/>
                                </IconButton>
                                <Drawer
                                    anchor="right"
                                    open={drawerOpen}
                                    onClose={toggleDrawer(false)}
                                    sx={{ // 添加样式
                                        '& .MuiDrawer-paper': {
                                            width: 240, // 设置宽度
                                        },
                                    }}
                                >
                                    <List>
                                        {menuItems.map((item, index) => (
                                            <ListItem
                                                button
                                                key={index}
                                                component={Link}
                                                to={item.path}
                                                onClick={(event) => {
                                                    if (!item.disabled) {
                                                        toggleDrawer(false)(event);
                                                    }
                                                }}
                                                sx={{ // 添加样式
                                                    color: 'inherit',
                                                    textDecoration: 'none',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                    },
                                                    // 添加禁用样式
                                                    ...(item.disabled && {
                                                        pointerEvents: 'none',
                                                        opacity: 0.5,
                                                    }),
                                                }}
                                            >
                                                <ListItemText primary={item.text}/>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Drawer>
                            </>
                        ) : (
                            <>
                                {menuItems.map((item, index) => (
                                    <Button
                                        key={index}
                                        color="inherit"
                                        component={Link}
                                        to={item.path}
                                        disabled={item.disabled}
                                    >
                                        {item.text}
                                    </Button>
                                ))}
                                <Avatar sx={{marginLeft: '1rem'}}>U</Avatar>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ marginTop: '64px' }}>
                <Routes>
                    <Route path="/" element={<Home isMobile={isMobile} />}/>
                    <Route path="/search" element={<Search isMobile={isMobile} />}/>
                    {/* 其他路由可以在这里添加 */}
                </Routes>
            </Box>
        </Router>
    );
}

export default App;