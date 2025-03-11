import { useState } from 'react'
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

function Home() {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        console.log('Search query:', searchQuery)
        fetch(`http://localhost:8080/search?query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(data => {
                console.log('Search results:', data)
            })
            .catch(error => {
                console.error('Error fetching search results:', error)
            })
    }

    const handleTagClick = (tag) => {
        setSearchQuery(tag)
        handleSearchSubmit({
            preventDefault: () => {
            }
        }) // 模拟表单提交
    }

    return (
        <div>
            <Carousel autoPlay interval={5000} animation="fade" sx={{ position: 'relative', height: '50vh' }}>
                <Box sx={{
                    backgroundImage: 'url(/images/lab.jpg)',
                    backgroundSize: 'cover',
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
                    padding: '3vh', maxWidth: '80vh', margin: '0 auto', marginTop: '-15vh',
                    position: 'relative', zIndex: 1,
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
                            sx={{ width: '100%', marginBottom: '1.3vh' }}
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}>
                            搜索
                        </Button>
                    </Box>
                    {/* 筛选快捷入口 */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2vh' }}>
                        {['人工智能', '清华大学', '生物医学工程'].map((tag, index) => (
                            <Button
                                key={index}
                                onClick={() => handleTagClick(tag)}
                                variant="outlined"
                                color="primary"
                                sx={{ margin: '1vh' }}
                            >
                                {tag}
                            </Button>
                        ))}
                    </Box>
                    {/* 高级筛选按钮 */}
                    <Button disabled                      variant="text"
                        color="primary"
                        onClick={() => console.log('跳转到高级筛选页面')}
                        sx={{ marginTop: '2vh' }}
                    >
                        高级筛选
                    </Button>
                </Paper>
            </div>

            <footer style={{ backgroundColor: 'primary.main', color: 'black', padding: '20px', marginTop: '20px' }}>
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
                        <Typography>团队背景、联系方式、加入我们。</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">帮助中心</Typography>
                        <Typography>常见问题（如何验证导师信息真实性？如何提高联系成功率？）。</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">友情链接</Typography>
                        <Typography>学术资源网站、考研论坛、期刊主页。</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">法律与协议</Typography>
                        <Typography>隐私政策、用户协议、数据来源声明（如合作数据库授权）。</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">社交媒体</Typography>
                        <Typography>微信公众号、微博、知乎账号二维码，推送学术资讯与更新通知。</Typography>
                    </Box>
                </Box>
            </footer>
        </div>
    )
}

export default Home
