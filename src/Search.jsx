import React, { useState, useEffect } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Pagination, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [searchResults, setSearchResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(`Searching for: ${query}`);
        console.log(`Current page: ${currentPage}`);
        console.log(encodeURIComponent(query))
        fetch(`http://localhost:8080/search?query=${encodeURIComponent(query)}&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data.docs);
                setTotalResults(data.length);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    }, [query, currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        navigate(`/search?query=${query}&page=${value}`);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <Box sx={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                <Typography variant="h6">
                    共找到 {totalResults} 位导师，条件：{query}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
                <Box sx={{ width: '25%', padding: '10px', borderRight: '1px solid #ccc' }}>
                    <Typography variant="subtitle1">筛选条件</Typography>
                    {/* 这里可以添加筛选条件组件 */}
                </Box>
                <Box sx={{ width: '75%', padding: '10px' }}>
                    {searchResults.map((result, index) => (
                        <Paper key={index} elevation={3} sx={{ marginBottom: '10px', padding: '10px' }}>
                            <Typography variant="h6">{result.teacher}</Typography>
                            <Typography variant="body1">{result.major} - {result.school_name}</Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                <Pagination count={Math.ceil(totalResults / 10)} page={currentPage} onChange={handlePageChange} />
                <IconButton onClick={scrollToTop}>
                    <ArrowUpwardIcon />
                </IconButton>
            </Box>
        </div>
    );
}

export default Search;