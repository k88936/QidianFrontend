import React, {useState} from 'react';
import {Button, Container} from '@mui/material';
import {JsonEditor} from 'json-edit-react';
import Box from "@mui/material/Box";
import {backend_addr} from "./backend.js";

const JsonEditorPage = () => {
    const [json, setJson] = useState({});
    const pullData = async () => {
        try {
            const response = await fetch(`${backend_addr}/edit?operation=pull`);
            console.log('Response:', response)
            if (!response.ok) {
                // 检查响应状态码是否为成功
                const errorData = await response.json();
                console.error('Error pulling data:', errorData.error || 'Unknown error');
                alert('Failed to pull data: ' + (errorData.error || 'Unknown error'));
                return;
            }
            const result = await response.json();
            console.log('Pulled data:',);
            if (result.message) {
                // 如果后端返回消息（如 "No more unfixed items"），提示用户
                alert(result.message);
            } else if (result.data) {
                // 如果后端返回有效数据，更新状态
                setJson(result.data);
            } else {
                // 如果后端返回的数据结构不符合预期，提示用户
                alert('Invalid data format received from the server.');
            }
        } catch (error) {
            console.error('Error pulling data:', error);
            alert('An unexpected error occurred while pulling data.');
        }
    };

    const stashData = async () => {
        try {
            // 验证 JSON 数据格式是否正确
            console.log('json: ', json)
            const response = await fetch(`${backend_addr}/edit?operation=stash`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data: json}),
            });

            // 检查响应状态码
            if (!response.ok) {
                const errorData = await response.text(); // 尝试获取文本形式的错误信息
                console.error('Error stashing data:', errorData);
                alert(`Failed to stash data: ${errorData || 'Unknown error'}`);
                return;
            }
            alert('Data stashed successfully.')

            const result = await response.json();
            console.log('Stashed data:', result);
        } catch (error) {
            console.error('Error stashing data:', error);
            alert('An unexpected error occurred while stashing data.');
        }
    };
    const pushData = async () => {
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(`${backend_addr}/edit?operation=push`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({data: json}),
                });
                
                console.log('json: ', json);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Pushed data:', result);
                alert('Data pushed successfully.');
                return; // Success, exit the function
            } catch (error) {
                console.error(`Attempt ${attempt} - Error pushing data:`, error);
                
                if (attempt < maxRetries) {
                    console.log(`Retrying in ${attempt * 1000}ms...`);
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // Exponential backoff
                } else {
                    alert(`Failed to push data after ${maxRetries} attempts: ${error.message} copy these below and save to file to save your work:     ${JSON.stringify(json)}`);
                }
            }
        }
    };

    return (
        <Container>
            <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
                <Button variant="contained" color="primary" onClick={pullData}>
                    Pull Data
                </Button>
                <Button variant="contained" color="secondary" onClick={stashData}>
                    Stash Data
                </Button>
                <Button variant="contained" color="success" onClick={()=>{pushData().then(() => pullData());}}>
                    Push Data
                </Button>
            </Box>
            <JsonEditor
                data={json}
                setData={setJson}
                // onEditEvent={(path, isKey) => {
                //     console.log(path);
                //     console.log(isKey);
                // }}
                mode="tree"
                search={true}
                name="JSONEditor"
                navigationBarButtons={['mode-switcher', 'find-replace']}
                defaultValue={{
                    "name": "department_name",
                    "url": "people_page_url"
                }}
            />
        </Container>
    );
};

export default JsonEditorPage;