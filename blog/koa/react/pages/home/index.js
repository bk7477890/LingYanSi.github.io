import React,{Component} from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import List from './../Article/List/index.js'

require('./index.scss')

class Home extends Component{
    constructor(){
        super()
        this.state = {
        }
    }
    render(){
        return <div id="home">
            <div className="banner"></div>
            <List len={3}></List>
        </div>
    }
}

export default Home
