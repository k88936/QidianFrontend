import React, {useState, useEffect} from 'react';
import {
    // useNavigate,
    useSearchParams
} from 'react-router-dom';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Pagination,
    IconButton,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Slider,
    Chip,
    Divider,
    Tooltip // 引入 Tooltip 组件
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import Drawer from '@mui/material/Drawer'; // 引入 Drawer 组件
import MenuIcon from '@mui/icons-material/Menu'; // 引入 MenuIcon 组件
import Autocomplete from '@mui/material/Autocomplete';

import {backend_addr} from "./backend.js";

const countries = [
    '英国',
    '美国',
    '德国',
    '澳大利亚',
    '新西兰',
    '新加坡'
];


// 定义 FilterSidebar 组件，用于展示和操作筛选条件
function FilterSidebar({
                           filters,
                           selectedFilters,
                           handleFilterChange,
                           handleRemoveFilter,
                           handleFilterButtonClick,
                           isMobile
                       }) {
    return (
        <Box sx={{
            width: isMobile ? '75vw' : '15vw', padding: '10px', paddingRight: '20px', borderRight: '1px solid #ccc'
        }}>
            <Typography variant="caption">筛选条件</Typography>
            <FormGroup>
                <Typography variant="caption">国家和地区</Typography>
                <Autocomplete
                    multiple
                    id="tags-standard"
                    options={countries}
                    value={filters.nation}
                    onChange={(event, newValue) => {
                        handleFilterChange('nation', newValue);
                    }}
                    filterOptions={(options, params) => {
                        const inputValue = params.inputValue.toLowerCase();
                        return options.filter(option => option.toLowerCase().includes(inputValue));
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            placeholder="选择国家和地区"
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({index})}
                                onDelete={() => {
                                    const newValues = filters.nation.filter(val => val !== option);
                                    handleFilterChange('nation', newValues);
                                }}
                            />
                        ))
                    }
                />

            </FormGroup>
            <Divider/>
            {/*<FormGroup>*/}
            {/*    <Typography variant="caption">职称</Typography>*/}
            {/*    <FormControlLabel disabled control={<Checkbox/>} label="教授"*/}
            {/*                      onChange={() => handleFilterChange('title', [...filters.title, '教授'])}/>*/}
            {/*    <FormControlLabel disabled control={<Checkbox/>} label="副教授"*/}
            {/*                      onChange={() => handleFilterChange('title', [...filters.title, '副教授'])}/>*/}
            {/*    <FormControlLabel disabled control={<Checkbox/>} label="讲师"*/}
            {/*                      onChange={() => handleFilterChange('title', [...filters.title, '讲师'])}/>*/}
            {/*</FormGroup>*/}
            {/*<Divider/>*/}
            {/*<FormGroup>*/}
            {/*    <Typography variant="caption">研究方向</Typography>*/}
            {/*    <TextField disabled label="研究方向" variant="outlined" size="small"*/}
            {/*               onChange={(e) => handleFilterChange('researchField', [...filters.researchField, e.target.value])}/>*/}
            {/*</FormGroup>*/}
            {/*<Divider/>*/}
            {/*<FormGroup>*/}
            {/*    <Typography variant="caption">论文发表数量区间</Typography>*/}
            {/*    <Slider*/}
            {/*        disabled*/}
            {/*        value={filters.publicationRange}*/}
            {/*        onChange={(e, newValue) => handleFilterChange('publicationRange', newValue)}*/}
            {/*        valueLabelDisplay="auto"*/}
            {/*        min={0}*/}
            {/*        max={100}*/}
            {/*        size="small"*/}
            {/*    />*/}
            {/*</FormGroup>*/}
            {/*<Divider/>*/}
            {/*<FormGroup>*/}
            {/*    <Typography variant="caption">H-index指数区间</Typography>*/}
            {/*    <Slider*/}
            {/*        disabled*/}
            {/*        value={filters.hIndexRange}*/}
            {/*        onChange={(e, newValue) => handleFilterChange('hIndexRange', newValue)}*/}
            {/*        valueLabelDisplay="auto"*/}
            {/*        min={0}*/}
            {/*        max={50}*/}
            {/*        size="small"*/}
            {/*    />*/}
            {/*</FormGroup>*/}
            <Divider/>
            <Box>
                <Typography variant="caption">已选条件</Typography>
                {selectedFilters.map(filterType => (
                    <Chip label={filterType} onDelete={() => handleRemoveFilter(filterType)} size="small"/>
                ))}
            </Box>
            <Divider/>
            <Button  variant="contained" onClick={handleFilterButtonClick} color="primary" size="small"
                    fullWidth>
                筛选
            </Button>
        </Box>
    );
}

// 定义 TeacherCard 组件，用于展示单个导师的信息
function TeacherCard({result}) {
    return (
        <Paper elevation={3} sx={{
            padding: '10px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: '1 1' // 使用flex属性使其可伸缩
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center'
            }}>
                <Typography variant="h6" sx={{fontWeight: 'bold'}}>{result.teacher}</Typography>
            </Box>

            {/*<AutoDisappearTooltip title="如果网页空白,是因为受到了跨域访问限制,请点击下方主页按钮在浏览器访问">*/}
            {/*    <iframe*/}
            {/*        src={result['page']}*/}
            {/*        title="Website Preview"*/}
            {/*        style={{width: '100%', height: '500px', border: 'none', marginTop: '10px'}}*/}
            {/*    />*/}
            {/*</AutoDisappearTooltip>*/}
            <Box sx={{
                display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px', justifyContent: 'center'
            }}>
                {// result.researchFields.
                    result['fields'].split('#').map((field, idx) => (
                        <Chip key={idx} label={field} color="primary"/>
                    ))}
            </Box>
            <Box sx={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '10px', marginTop: '10px'
            }}>
                <Typography variant="body2">{result['school']} - {result['department']}</Typography>
                <Box sx={{display: 'flex', gap: '10px'}}>
                    <AutoDisappearTooltip title="发送邮件给该导师">
                        <IconButton href={`mailto:${result['email']}`} disabled={!result['email']||!result['email'].includes('@')}
                                    target="_blank"
                                    aria-label="email">
                            <MailIcon/>
                        </IconButton>
                    </AutoDisappearTooltip>
                    <AutoDisappearTooltip title="访问该导师的主页">
                        <IconButton href={result['page']} disabled={!result['page'] ||!result['page'].includes('http')}
                                    aria-label="homepage">
                            <HomeIcon/>
                        </IconButton>
                    </AutoDisappearTooltip>
                    <AutoDisappearTooltip title="在 Bing Scholar 上搜索该导师">
                        <IconButton
                            href={`https://www.bing.com/academic/search?q=${encodeURIComponent(result['school'] + ' ' + result['department'] + ' ' + result['teacher'])}`}
                            target="_blank" aria-label="bing scholar">
                            <SchoolIcon/>
                        </IconButton>
                    </AutoDisappearTooltip>
                    <AutoDisappearTooltip title="在 Google Scholar 上搜索该导师">
                        <IconButton
                            href={`https://scholar.google.com/scholar?hl=zh-CN&as_sdt=0%2C5&q=${encodeURIComponent(result['school'] + ' ' + result['department'] + ' ' + result['teacher'])}&btnG=`}
                            target="_blank" aria-label="google scholar">
                            <SchoolIcon/>
                        </IconButton>
                    </AutoDisappearTooltip>
                </Box>
            </Box>

        </Paper>
    );
}

// 定义 AutoDisappearTooltip 组件，用于显示自动消失的提示信息
function AutoDisappearTooltip({title, children, disappearTime = 4000}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                setOpen(false);
            }, disappearTime);
            return () => clearTimeout(timer);
        }
    }, [open, disappearTime]);

    return (
        <Tooltip
            title={title}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            {children}
        </Tooltip>
    );
}

// 定义 formatFilters 函数，用于将筛选条件格式化为可读的字符串
function formatFilters(filters) {
    const formattedFilters = [];
    if (filters.nation && filters.nation.length > 0) {
        formattedFilters.push(`国家和地区: ${filters.nation.join(', ')}`);
    }
    // 可以根据需要添加其他过滤条件的格式化逻辑
    return formattedFilters.join('; ');
}

// 定义 Search 组件，用于处理搜索逻辑和展示搜索结果
function Search({isMobile}) {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [searchResults, setSearchResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        nation: [],
        // title: [], researchField: [], publicationRange: [0, 100], hIndexRange: [0, 50]
    });
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 使用 useEffect 钩子来触发搜索请求
    useEffect(() => {
        if (!shouldFetch) return;

        setIsLoading(true);
        console.log(`Searching for: ${query}`);
        console.log(encodeURIComponent(query))
        fetch(`${backend_addr}/search?query=${encodeURIComponent(query)}&page=${currentPage}&filters=${JSON.stringify(filters)}`)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data['docs']);
                setTotalResults(data['count']);
                console.log(data['docs'])
                console.log(data['docs'].length)
            })
            .catch(error => {
                console.error('Error fetching Search results:', error);
            })
            .finally(() => {
                setShouldFetch(false);
                setIsLoading(false);
            });
    }, [query, filters, shouldFetch, currentPage]);

    // 处理分页变化
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        console.log(`Page changed to ${value}`)
    };

    // 滚动到页面顶部
    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    // 处理筛选条件变化
    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => ({
            ...prevFilters, [filterType]: value
        }));
        if (!selectedFilters.includes(filterType)) {
            setSelectedFilters([...selectedFilters, filterType]);
        }
    };

    // 移除筛选条件
    const handleRemoveFilter = (filterType) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: filterType === 'publicationRange' || filterType === 'hIndexRange' ? [0, 100] : []
        }));
        setSelectedFilters(selectedFilters.filter(type => type !== filterType));
    };

    // 处理筛选按钮点击事件
    const handleFilterButtonClick = () => {
        setShouldFetch(true);
        if (isMobile) {
            setIsDrawerOpen(false); // 关闭抽屉
        }
    };

    // 切换抽屉的打开和关闭状态
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    return (
        <div>
            <Box sx={{display: 'flex', flexDirection: 'row', padding: '20px'}}>
                {isMobile ? (
                    <>
                        <Button variant="contained" color="primary" onClick={toggleDrawer(true)}
                                sx={{
                                    position: 'fixed',
                                    height: '6vh',
                                    width: '6vh',
                                    bottom: '1vh',
                                    left: '1vh',
                                    zIndex: 1000,
                                    backgroundColor: 'primary'
                                }}>
                            筛选
                        </Button>
                        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                            <FilterSidebar
                                filters={filters}
                                selectedFilters={selectedFilters}
                                handleFilterChange={handleFilterChange}
                                handleRemoveFilter={handleRemoveFilter}
                                handleFilterButtonClick={handleFilterButtonClick}
                                isMobile={isMobile}
                            />
                        </Drawer>
                    </>
                ) : (
                    <FilterSidebar
                        filters={filters}
                        selectedFilters={selectedFilters}
                        handleFilterChange={handleFilterChange}
                        handleRemoveFilter={handleRemoveFilter}
                        handleFilterButtonClick={handleFilterButtonClick}
                        isMobile={isMobile}
                    />
                )}
                <Box sx={{
                    width: isMobile ? '100%' : '75%',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    gap: '20px'
                }}>
                    <Box sx={{padding: '20px', backgroundColor: '#f0f0f0'}}>
                        {isLoading ? (
                            <Typography variant="h6">
                                正在搜索中...
                            </Typography>
                        ) : (
                            <Typography variant="h6">
                                共找到 {totalResults} 位导师(展示前一百位)，条件：{query}，筛选条件：{formatFilters(filters)}
                            </Typography>
                        )}
                    </Box>
                    {searchResults.slice((currentPage - 1) * 10, currentPage * 10).map((result, index) => (
                        <TeacherCard key={index} result={result}/>
                    ))}
                </Box>
            </Box>
            <Box sx={{display: 'flex', padding: '20px', alignItems: 'center', justifyContent: 'center'}}>
                <Pagination count={Math.ceil(totalResults / 10)} page={currentPage} onChange={handlePageChange}/>
                <IconButton onClick={scrollToTop}>
                    <ArrowUpwardIcon/>
                </IconButton>
            </Box>
        </div>
    );
}

export default Search;