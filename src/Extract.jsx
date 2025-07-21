import React from 'react';
import './App.css';

class LinkExtractor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            htmlInput: '',
            jsonOutput: ''
        };
    }

    handleInputChange = (e) => {
        this.setState({htmlInput: e.target.value});
    };

    parseLinks = () => {
        const {htmlInput} = this.state;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlInput, 'text/html');
        const links = [];

        const anchorTags = doc.querySelectorAll('a');
        anchorTags.forEach(a => {
            const name = a.textContent.trim();
            const url = a.getAttribute('href');
            if (name && url) {
                links.push({name, url});
            }
        });

        // 新增: 使用简单循环拼接 JSON 字符串
        let formattedOutput = '';
        for (let i = 0; i < links.length; i++) {
            formattedOutput += JSON.stringify(links[i]);
            formattedOutput += ', ';
        }
        this.setState({jsonOutput: formattedOutput});
    };

    // 新增：复制到剪贴板的方法
    handleCopyClick = () => {
        const {jsonOutput} = this.state;
        navigator.clipboard.writeText(jsonOutput)
            // .then(() => alert('复制成功！'))
            .catch(err => console.error('复制失败: ', err));
    };

    render() {
        return (
            <div style={{padding: '20px'}}>
                <h2>HTML Link Parser</h2>
                <textarea
                    rows="10"
                    cols="80"
                    value={this.state.htmlInput}
                    onChange={this.handleInputChange}
                    placeholder="Paste your HTML here..."
                />
                <br/>
                <button onClick={this.parseLinks}>Parse Links</button>
                {/* 新增：复制按钮 */}

                <br/><br/>
                <h3>JSON Output:</h3>
                <pre>{this.state.jsonOutput}</pre>
                <br/><br/>
                <button onClick={this.handleCopyClick} style={{marginLeft: '10px'}}>
                    Copy to Clipboard
                </button>
            </div>
        );
    }
}

export default LinkExtractor;