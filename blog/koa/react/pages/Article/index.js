import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import List from './List/index.js'

require('./index.scss')

class Article extends React.Component{
    render(){
        return <div>
            <div className="tool">
                <Link to="article/new">
                    <button>新建</button>
                </Link>
                <button>管理</button>
            </div>
            <List></List>
        </div>
    }
}

export default Article
