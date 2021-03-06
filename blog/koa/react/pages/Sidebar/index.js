import React,{Component} from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'

require('./index.scss')

class Sidebar extends Component{
    constructor(){
        super()
        const LIST = [
            { url: '/', title: '首页' },
            { url: '/article', title: '文章' },
            { url: '/about', title: '关于' },
        ]
        this.state = {
            list: LIST ,
            current: 0 ,
            show: false
        }
    }
    hashChange(){
        var hash = location.hash.slice(1)
        var current = 0
        this.state.list.forEach((item, index)=>{
            hash.startsWith(item.url) && (current=index)
        })

        this.setState({
            current: current
        })

    }
    addHashChange(){
        window.addEventListener('hashchange', this.hashChange.bind(this))
    }
    toggle(){
        const show = this.state.show
        $('.content,#header').toggleClass('sidebar-hide', !show)
        this.setState({
            show: !show
        })
    }
    componentDidMount(){
        this.hashChange()
        this.addHashChange()
    }
    render(){
        const state = this.state

        return <div id="sidebar" className={state.show ? 'show' : ''}>
                    <button onClick={this.toggle.bind(this)}>三</button>
                    <ul>
                        { state.list.map((item, index)=>{
                            return <li className={index==state.current?'current':''}>
                                <Link to={item.url}>{item.title}</Link>
                            </li>
                        })}
                    </ul>
                </div>
    }
}

export default Sidebar
