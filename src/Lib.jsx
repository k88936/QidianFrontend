import React, {useState, useEffect} from 'react';
import {
    TreeView,
    TreeItem
} from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {backend_addr} from "./backend.js";
import {Box, Typography, Paper, TextField} from '@mui/material';
import {useNavigate} from 'react-router-dom';

function Lib() {
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);

        if (nodeIds.length > 0) {
            const nodeId = nodeIds[0];
            if (nodeId.startsWith('school:')) {
                const schoolName = nodeId.split(':')[1];
                //navigate(`/search?filters=${encodeURIComponent(JSON.stringify({school: [schoolName]}))}`);
            }
        }
    };

    const renderTree = (nodes, level = 0) => {
        if (!nodes) return null;

        return Object.entries(nodes).map(([key, value]) => {
            // 如果是学校节点（值是数组且数组元素包含 name 和 count）
            if (Array.isArray(value) && value.every(item => item.name && item.count !== undefined)) {
                return (
                    <TreeItem
                        key={`school:${key}`}
                        nodeId={`school:${key}`}
                        label={key}
                        sx={{marginLeft: 1}}
                    >
                        {value.map(college => (
                            <TreeItem
                                key={`college:${college.name}`}
                                nodeId={`college:${college.name}`}
                                label={`${college.name} (${college.count})`}
                                sx={{marginLeft: 2}}
                            />
                        ))}
                    </TreeItem>
                );
            }

            // 如果是国家或地区节点（值是数组，即学校列表）
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

            // 如果是嵌套结构（比如区域 -> 国家 -> 学校）
            return (
                <TreeItem
                    key={`area:${key}`}
                    nodeId={`area:${key}`}
                    label={key}
                    sx={{
                        '& > .MuiTreeItem-content': {fontWeight: 'bold'},
                        marginLeft: level * 2
                    }}
                >
                    {renderTree(value, level + 1)}
                </TreeItem>
            );
        });
    };

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
                    } else if (Array.isArray(schools) || typeof schools === 'object') {
                        const filteredSchools = Object.keys(schools).filter(school =>
                            school.toLowerCase().includes(term.toLowerCase())
                        );
                        if (filteredSchools.length > 0) {
                            const filtered = {};
                            filteredSchools.forEach(s => filtered[s] = schools[s]);
                            filteredNations[nationKey] = filtered;
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
            <TextField
                label="搜索地区、国家、学校或学院"
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
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
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
