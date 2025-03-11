import {useState} from 'react'
import './App.css'
// 引入MUI组件
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper' // 添加Paper组件

function App() {
    const [searchQuery, setSearchQuery] = useState('') // 添加搜索框状态

    // 添加处理搜索框输入的函数
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    // 添加处理搜索提交的函数
    const handleSearchSubmit = (event) => {
        event.preventDefault()
        // 这里可以添加搜索逻辑，比如跳转到搜索结果页
        console.log('Search query:', searchQuery)

        // 添加对后端search的调用，指定端口号8080
        fetch(`http://localhost:8080/search?query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(data => {
                console.log('Search results:', data)
                // 处理搜索结果，比如更新状态或跳转页面
            })
            .catch(error => {
                console.error('Error fetching search results:', error)
            })
    }

    return (
        <div className="search-container">
            <Paper elevation={3} sx={{
                padding: '20px', maxWidth: '400px',
                marginTop: 0,
                alignSelf: 'flex-start',
            }}> 
                <Box
                    component="form"
                    onSubmit={handleSearchSubmit}
                    noValidate
                    autoComplete="on"
                    className="search-form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Search..."
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{width: '300px', height: '56px', marginRight: '10px'}} // 添加右侧间距
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{height: '56px'}}>
                        Search
                    </Button>
                </Box>
            </Paper>
        </div>
    )
}

export default App