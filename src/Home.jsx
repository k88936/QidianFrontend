import {useState} from 'react'
import './App.css'
// 引入MUI组件
import TextField from '@mui/material/TextField'
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
import Paper from '@mui/material/Paper'
// 新增轮播图组件
import Carousel from 'react-material-ui-carousel'
// 新增 useNavigate 钩子
import {useNavigate} from 'react-router-dom';
import Link from '@mui/material/Link'; // 新增 Link 组件的引入

function Home(isMobile) {
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate(); // 新增导航钩子

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        // 导航到 Search 页面并传递查询参数
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }

    const handleTagClick = (tag) => {
        setSearchQuery(tag)
    }

    return (
        <div>
            <Carousel autoPlay interval={5000} animation="fade" sx={{position: 'relative', height: '50vh'}}>
                <Box sx={{
                    backgroundImage: 'url(/images/logo.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center', // 添加背景图片居中
                    height: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px black',
                }}>
                    {/*<Typography variant="h4">探索前沿学术领域</Typography>*/}
                </Box>
                <Box sx={{
                    backgroundImage: 'url(/images/lab.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center', // 添加背景图片居中
                    height: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px black',
                }}>
                    <Typography variant="h4">找到引领你学术未来的导师</Typography>
                </Box>
                <Box sx={{
                    backgroundImage: 'url(/images/conference.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center', // 添加背景图片居中
                    height: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px black',
                }}>
                    <Typography variant="h4">探索前沿学术领域</Typography>
                </Box>
            </Carousel>

            {/* 搜索功能模块 */}
            <div className="search-container">
                <Paper elevation={3} sx={{
                    padding: '3vw', maxWidth: '80vw', margin: '0 auto', marginTop: '-15vh',
                    position: 'relative', zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 设置背景颜色为半透明
                    backdropFilter: 'blur(50px)', // 添加磨砂玻璃效果
                }}>
                    <Box
                        component="form"
                        onSubmit={handleSearchSubmit}
                        noValidate
                        autoComplete="on"
                        className="search-form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            label="输入导师姓名、研究方向或院校名称..."
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            sx={{width: '100%', marginBottom: '1.3vh'}}
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{width: '100%'}}>
                            搜索
                        </Button>
                    </Box>
                    {/* 筛选快捷入口 */}
                    <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2vh'}}>
                        {['张三', '清华大学', '生物医学工程'].map((tag, index) => (
                            <Button
                                key={index}
                                onClick={() => handleTagClick(tag)}
                                variant="outlined"
                                color="primary"
                                sx={{margin: '5px'}}
                            >
                                {tag}
                            </Button>
                        ))}
                    </Box>
                    {/* 高级筛选按钮 */}
                    <Button disabled variant="text"
                            color="primary"
                            onClick={() => console.log('跳转到高级筛选页面')}
                            sx={{marginTop: '5px'}}
                    >
                        高级筛选
                    </Button>
                </Paper>
            </div>

            <footer style={{backgroundColor: 'primary.main', color: 'black', padding: '20px', marginTop: '20px'}}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        marginTop: '10vh'
                    }}>
                    <Box>
                        <Typography variant="h6">关于我们</Typography>
                        <Typography><Link href="">团队背景</Link></Typography>
                        <Typography><Link href="">联系方式</Link></Typography>
                        <Typography><Link href="">加入我们</Link></Typography>
                    </Box>
                    {/*<Box>*/}
                    {/*    <Typography variant="h6">帮助中心</Typography>*/}
                    {/*    <Typography><Link href="">常见问题</Link></Typography>*/}
                    {/*    <Typography><Link href="">如何验证导师信息真实性</Link></Typography>*/}
                    {/*    <Typography><Link href="">如何提高联系成功率</Link></Typography>*/}
                    {/*</Box>*/}
                    {/*<Box>*/}
                    {/*    <Typography variant="h6">友情链接</Typography>*/}
                    {/*    <Typography><Link href="">学术资源网站</Link></Typography>*/}
                    {/*    <Typography><Link href="">考研论坛</Link></Typography>*/}
                    {/*    <Typography><Link href="">期刊主页</Link></Typography>*/}
                    {/*</Box>*/}
                    {/*<Box>*/}
                    {/*    <Typography variant="h6">法律与协议</Typography>*/}
                    {/*    <Typography><Link href="">隐私政策</Link></Typography>*/}
                    {/*    <Typography><Link href="">用户协议</Link></Typography>*/}
                    {/*    <Typography><Link href="">数据来源声明</Link></Typography>*/}
                    {/*</Box>*/}
                    {/*<Box>*/}
                    {/*    <Typography variant="h6">社交媒体</Typography>*/}
                    {/*    <Typography><Link href="">微信公众号</Link></Typography>*/}
                    {/*    <Typography><Link href="">微博</Link></Typography>*/}
                    {/*    <Typography><Link href="">知乎账号二维码</Link></Typography>*/}
                    {/*    <Typography><Link href="">推送学术资讯与更新通知</Link></Typography>*/}
                    {/*</Box>*/}
                </Box>
            </footer>
        </div>
    )
}

export default Home