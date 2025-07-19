import React, {useState, useEffect} from 'react';
import {
    TreeView,
    TreeItem
} from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {backend_addr} from "./backend.js";
import {Box, Typography, Paper, TextField} from '@mui/material'; // 添加TextField导入

function Lib() {
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // 新增状态以存储搜索词

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
    };

    const renderTree = (nodes) => {
        if (!nodes) return null;

        return Object.entries(nodes).map(([key, value]) => {
            // 如果值是数组，则为学校列表
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
            // 否则它是包含国家的区域
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

    // 新增函数来过滤树数据
    const filterTreeData = (data, term) => {
        if (!term) return data;

        const filteredData = {};
        Object.keys(data).forEach(areaKey => {
            const nations = data[areaKey];
            if (typeof nations === 'object' && !Array.isArray(nations)) {
                const filteredNations = {};
                Object.keys(nations).forEach(nationKey => {
                    const schools = nations[nationKey];
                    if (Array.isArray(schools)) {
                        if (nationKey.toLowerCase().includes(term.toLowerCase())) {
                            filteredNations[nationKey] = schools;
                        } else {
                            const filteredSchools = schools.filter(school =>
                                school.toLowerCase().includes(term.toLowerCase())
                            );
                            if (filteredSchools.length > 0) {
                                filteredNations[nationKey] = filteredSchools;
                            }
                        }
                    }
                });
                if (Object.keys(filteredNations).length > 0 || areaKey.toLowerCase().includes(term.toLowerCase())) {
                    filteredData[areaKey] = filteredNations;
                }
            }
        });
        return filteredData;
    };

    useEffect(() => {
        fetch(`${backend_addr}/tree`)
            .then(response => response.json())
            .then(data => {
                setTreeData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tree data:', error);
                setLoading(false);
            });
    }, []);

    return (
        <Box sx={{padding: '20px'}}>
            <Typography variant="h5" gutterBottom>
                地区 - 国家 - 院校树
            </Typography>
            {/* 新增搜索输入区域 */}
            <TextField
                label="搜索地区、国家或学校"
                variant="outlined"
                fullWidth
                sx={{marginBottom: '20px'}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Paper sx={{padding: '20px', height: '80vh', overflowY: 'auto'}}>
                {loading ? (
                    <Typography>加载中...</Typography>
                ) : treeData ? (
                    <TreeView
                        aria-label="地区筛选"
                        defaultCollapseIcon={<ExpandMoreIcon/>}
                        defaultExpandIcon={<ChevronRightIcon/>}
                        expanded={expanded}
                        selected={selected}
                        multiSelect
                        onNodeToggle={handleToggle}
                        onNodeSelect={handleSelect}
                        sx={{height: 400, flexGrow: 1}}
                    >
                        {renderTree(filterTreeData(treeData, searchTerm))}
                    </TreeView>
                ) : (
                    <Typography color="error">无法加载树结构，请稍后再试</Typography>
                )}
            </Paper>
        </Box>
    );
}

export default Lib;