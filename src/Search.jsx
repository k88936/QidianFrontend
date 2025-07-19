import React, {useEffect, useState,} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom'; // 新增: 引入 useNavigate
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    FormGroup,
    IconButton,
    Pagination,
    Paper,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {TreeItem, TreeView} from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import Drawer from '@mui/material/Drawer';

import {backend_addr} from "./backend.js";

// Tree filter component for area/nation/school selection
function TreeFilter({data, onFilterChange}) {
    const [selected, setSelected] = useState([]);
    const [expanded, setExpanded] = useState([]);

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    // Handle both selection and checkbox changes
    const handleSelect = (event, nodeIds) => {
        // Check if the event came from a checkbox click
        setSelected(nodeIds);

        // Parse selected items to determine filter categories
        const areas = [];
        const nations = [];
        const schools = [];

        nodeIds.forEach(nodeId => {
            // Format: 'area:亚洲' or 'nation:中国' or 'school:清华大学'
            const [type, value] = nodeId.split(':');
            if (type === 'area') areas.push(value);
            else if (type === 'nation') nations.push(value);
            else if (type === 'school') schools.push(value);
        });

        // Call parent with filtered data
        onFilterChange({
            area: areas,
            nation: nations,
            school: schools
        });
    };

    const renderTree = (nodes) => {
        if (!nodes) return null;

        return Object.entries(nodes).map(([key, value]) => {
            // If value is an array, it's a list of schools
            if (Array.isArray(value)) {
                return (
                    <TreeItem
                        key={`nation:${key}`}
                        nodeId={`nation:${key}`}
                        label={key}
                        sx={{marginLeft: 1}}
                    >
                        {value.map(school => (
                            <TreeItem
                                key={`school:${school}`}
                                nodeId={`school:${school}`}
                                label={school}
                                sx={{marginLeft: 1}}
                            />
                        ))}
                    </TreeItem>
                );
            }
            // Otherwise it's an area with nations
            else {
                return (
                    <TreeItem
                        key={`area:${key}`}
                        nodeId={`area:${key}`}
                        label={key}
                        sx={{'& > .MuiTreeItem-content': {fontWeight: 'bold'}}}
                    >
                        {renderTree(value)}
                    </TreeItem>
                );
            }
        });
    };

    return (
        <TreeView
            aria-label="地区筛选"
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
            expanded={expanded}
            selected={selected}
            multiSelect
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
            sx={{height: 400, flexGrow: 1, overflowY: 'auto'}}
        >
            {renderTree(data)}
        </TreeView>
    );
}


// 定义 FilterSidebar 组件，用于展示和操作筛选条件
function FilterSidebar({
                           filters,
                           selectedFilters,
                           handleFilterChange,
                           handleRemoveFilter,
                           handleFilterButtonClick,
                           isMobile,
                           treeData,
                           isTreeLoading
                       }) {

    // Handle tree filter changes
    const handleTreeFilterChange = (treeFilters) => {
        // Update all filter categories at once
        if (treeFilters.area && treeFilters.area.length > 0) {
            handleFilterChange('area', treeFilters.area);
        } else if (filters.area && filters.area.length > 0) {
            handleRemoveFilter('area');
        }

        if (treeFilters.nation && treeFilters.nation.length > 0) {
            handleFilterChange('nation', treeFilters.nation);
        } else if (filters.nation && filters.nation.length > 0) {
            handleRemoveFilter('nation');
        }

        if (treeFilters.school && treeFilters.school.length > 0) {
            handleFilterChange('school', treeFilters.school);
        } else if (filters.school && filters.school.length > 0) {
            handleRemoveFilter('school');
        }
    };

    return (
        <Box sx={{
            width: isMobile ? '75vw' : '15vw', padding: '10px', paddingRight: '20px', borderRight: '1px solid #ccc'
        }}>
            <Typography variant="caption">筛选条件</Typography>
            <FormGroup>
                <Typography variant="caption">地区-国家-院校</Typography>
                {isTreeLoading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                        <CircularProgress size={24}/>
                    </Box>
                ) : treeData ? (
                    <TreeFilter
                        data={treeData}
                        onFilterChange={handleTreeFilterChange}
                    />
                ) : (
                    <Typography variant="caption" color="error">
                        无法加载筛选树，请稍后再试
                    </Typography>
                )}
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
            <Button variant="contained" onClick={handleFilterButtonClick} color="primary" size="small"
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


            <Box sx={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <Box sx={{flex: 3, position: 'relative'}}>
                    <AutoDisappearTooltip title="如果网页空白,是因为受到了跨域访问限制,请点击下方主页按钮在浏览器访问">
                        <Box>
                            <iframe
                                src={result['page']}
                                aria-label="Website Preview"
                                style={{width: '100%', height: '500px', border: 'none', marginTop: '10px'}}
                            />
                        </Box>
                    </AutoDisappearTooltip>
                </Box>
                <Box sx={{flex: 7}}>
                    <Typography variant="h6" sx={{marginBottom: '10px', fontWeight: 'bold'}}>
                        AI总结--导师简介
                    </Typography>
                    <Paper
                        elevation={1}
                        sx={{
                            padding: '15px',
                            height: '470px',
                            overflow: 'auto',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <div style={{
                            height: '100%',
                            overflow: 'auto',
                            color: '#333',
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                        }}>
                            <MarkdownTypewriter
                                content={result['introduction'] || '暂无导师简介信息'}
                                speed={30}
                            />
                        </div>
                    </Paper>
                </Box>
            </Box>

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
                        <IconButton href={`mailto:${result['email']}`}
                                    disabled={!result['email'] || !result['email'].includes('@')}
                                    target="_blank"
                                    aria-label="email">
                            <MailIcon/>
                        </IconButton>
                    </AutoDisappearTooltip>
                    <AutoDisappearTooltip title="访问该导师的主页">
                        <IconButton href={result['page']} disabled={!result['page'] || !result['page'].includes('http')}
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

// 定义 MarkdownTypewriter 组件，用于打字机效果显示 Markdown 内容
function MarkdownTypewriter({content, speed = 50}) {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        let currentIndex = 0;
        setDisplayedContent('');
        setIsTypingComplete(false);

        const interval = setInterval(() => {
            if (currentIndex < content.length) {
                setDisplayedContent(prev => prev + content[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsTypingComplete(true);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [content, speed]);

    // Define custom components with styling
    const components = {
        p: ({...props}) => <p style={{fontSize: '1.25rem', lineHeight: 1.8}} {...props} />,
        h1: ({...props}) => <h1
            style={{fontSize: '2em', marginTop: '1.5rem', marginBottom: '1rem'}} {...props} />,
        h2: ({...props}) => <h2
            style={{fontSize: '1.5em', marginTop: '1.5rem', marginBottom: '1rem'}} {...props} />,
        h3: ({...props}) => <h3
            style={{fontSize: '1.25em', marginTop: '1.5rem', marginBottom: '1rem'}} {...props} />,
        a: ({...props}) => <a style={{color: '#0366d6', textDecoration: 'none'}} {...props} />,
        ul: ({...props}) => <ul style={{paddingLeft: '2em'}} {...props} />,
        ol: ({...props}) => <ol style={{paddingLeft: '2em'}} {...props} />,
        blockquote: ({...props}) => <blockquote
            style={{padding: '0 1em', color: '#6a737d', borderLeft: '0.25em solid #dfe2e5'}} {...props} />,
        code: ({...props}) => <code style={{
            padding: '0.2em 0.4em',
            margin: 0,
            fontSize: '85%',
            backgroundColor: 'rgba(27, 31, 35, 0.05)',
            borderRadius: '3px'
        }} {...props} />
    };

    return (
        <div style={{fontSize: '1.25rem'}}>
            {!isTypingComplete ? (
                <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.8}}>{displayedContent}</div>
            ) : (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={components}
                >
                    {content}
                </ReactMarkdown>
            )}
        </div>
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
    if (filters.area && filters.area.length > 0) {
        formattedFilters.push(`地区: ${filters.area.join(', ')}`);
    }
    if (filters.nation && filters.nation.length > 0) {
        formattedFilters.push(`国家和地区: ${filters.nation.join(', ')}`);
    }
    if (filters.school && filters.school.length > 0) {
        formattedFilters.push(`院校: ${filters.school.join(', ')}`);
    }
    // 可以根据需要添加其他过滤条件的格式化逻辑
    return formattedFilters.join('; ');
}

// 定义 Search 组件，用于处理搜索逻辑和展示搜索结果
function Search({isMobile}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate(); // 新增: 导入导航钩子

    const [searchResults, setSearchResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        area: [],
        nation: [],
        school: []
    });
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [treeData, setTreeData] = useState(null);
    const [isTreeLoading, setIsTreeLoading] = useState(false);

    // Fetch tree data for filtering
    useEffect(() => {
        setIsTreeLoading(true);
        fetch(`${backend_addr}/tree`)
            .then(response => response.json())
            .then(data => {
                setTreeData(data);
            })
            .catch(error => {
                console.error('Error fetching tree data:', error);
                setTreeData(null);
            })
            .finally(() => {
                setIsTreeLoading(false);
            });
    }, []);

    // 使用 useEffect 钩子来触发搜索请求
    useEffect(() => {
        if (!shouldFetch) return;
        setShouldFetch(false);
        if (searchParams.get('query') === '') {
            return;
        }
        setIsLoading(true);
        console.log(`Searching for: ${searchParams.get('query')}`);
        console.log(encodeURIComponent(searchParams.get('query') || ''))
        fetch(`${backend_addr}/search?query=${encodeURIComponent(searchParams.get('query'))}&page=${currentPage}&filters=${JSON.stringify(filters)}`)
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
                setIsLoading(false);
            });
    }, [filters, shouldFetch, currentPage, searchParams]);

    // 从 URL 读取筛选条件
    useEffect(() => {
        const filtersFromUrl = searchParams.get('filters');
        if (filtersFromUrl) {
            try {
                const parsedFilters = JSON.parse(filtersFromUrl);
                setFilters(prev => ({
                    ...prev,
                    ...parsedFilters
                }));
                setSelectedFilters([])
                Object.entries(parsedFilters).forEach(([key, value]) => {
                    if (value && value.length > 0) {
                        setSelectedFilters(prev => [...prev, key]);
                    }
                });
                // setShouldFetch(true);
            } catch (err) {
                console.error('Invalid filters parameter in URL');
            }
        }
    }, [searchParams]);

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

    const cap = 50;
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
                                treeData={treeData}
                                isTreeLoading={isTreeLoading}
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
                        treeData={treeData}
                        isTreeLoading={isTreeLoading}
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
                    {/* 新增的搜索输入区域 */}
                    <Box sx={{width: '100%', padding: '10px', marginBottom: '20px'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <TextField
                                fullWidth
                                label="输入搜索关键词"
                                variant="outlined"
                                defaultValue={searchParams.get('query') || ''}
                                onChange={(e) => {
                                    setShouldFetch(false);
                                    const newQuery = e.target.value;
                                    const trimmedQuery = newQuery.trim();
                                    const newSearchParams = new URLSearchParams(searchParams);
                                    newSearchParams.set('query', trimmedQuery);
                                    setSearchParams(newSearchParams)
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    const currentQuery = searchParams.get('query') || '';
                                    if (currentQuery.trim() === '') {
                                        alert('查询参数不能为空或空白字符');
                                        return;
                                    }
                                    setShouldFetch(true);
                                }}
                                sx={{ml: 2, height: '55px'}}
                            >
                                搜索
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{padding: '20px', backgroundColor: '#f0f0f0'}}>
                        {
                            searchParams.get('query') === '' || searchParams.get('query') === null ? (
                                <Typography variant="h6">
                                    请输入搜索关键词
                                </Typography>
                            ) : isLoading ? (
                                <Typography variant="h6">
                                    正在搜索中...
                                </Typography>
                            ) : (
                                <Typography variant="h6">
                                    共找到 {totalResults} 位导师(展示前一百位)，条件：{searchParams.get('query') || ''}，筛选条件：{formatFilters(filters)}
                                </Typography>
                            )}
                    </Box>
                    {searchResults.slice((currentPage - 1) * cap, currentPage * cap).map((result, index) => (
                        <TeacherCard key={index} result={result}/>
                    ))}
                </Box>
            </Box>
            <Box sx={{display: 'flex', padding: '20px', alignItems: 'center', justifyContent: 'center'}}>
                <Pagination count={Math.ceil(totalResults / cap)} page={currentPage} onChange={handlePageChange}/>
                <IconButton onClick={scrollToTop}>
                    <ArrowUpwardIcon/>
                </IconButton>
            </Box>
        </div>
    );
}

export default Search;