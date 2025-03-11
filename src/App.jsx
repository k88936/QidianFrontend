import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './home.jsx';
import Schools from './Schools.jsx'; // 引入院校库页面组件
import Subjects from './Subjects.jsx'; // 引入学科分类页面组件
import HelpCenter from './HelpCenter.jsx'; // 引入帮助中心页面组件
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

function App() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [language, setLanguage] = useState('中文');

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        handleMenuClose();
    };

    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        博导通
                        <Typography variant="subtitle1" component="span" sx={{marginLeft: '10px'}}>
                            精准匹配学术引路人
                        </Typography>
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Button color="inherit" component={Link} to="/">首页</Button>
                        {/*<Button color="inherit">导师搜索</Button>*/}
                        <Button color="inherit" component={Link} to="/schools" disabled>院校库</Button> {/* 禁用院校库按钮 */}
                        <Button color="inherit" component={Link} to="/subjects" disabled>学科分类</Button> {/* 禁用学科分类按钮 */}
                        <Button color="inherit" component={Link} to="/help-center" disabled>帮助中心</Button> {/* 禁用帮助中心按钮 */}
                        <IconButton
                            color="inherit"
                            onClick={handleMenuOpen}
                            aria-controls="language-menu"
                            aria-haspopup="true"
                        >
                            <LanguageIcon/>
                        </IconButton>
                        <Menu
                            id="language-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => handleLanguageChange('中文')}>中文</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('English')}>English</MenuItem>
                        </Menu>
                        <Button color="inherit">登录/注册</Button>
                        <Avatar sx={{marginLeft: '10px'}}>U</Avatar>
                    </Box>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/schools" element={<Schools/>}/> {/* 添加院校库路由 */}
                <Route path="/subjects" element={<Subjects/>}/> {/* 添加学科分类路由 */}
                <Route path="/help-center" element={<HelpCenter/>}/> {/* 添加帮助中心路由 */}
                {/* 其他路由可以在这里添加 */}
            </Routes>
        </Router>
    );
}

export default App;