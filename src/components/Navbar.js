import React, {Component} from 'react'
import bank from '../bank.png'

class Navbar extends Component {
    render() {
        return (
            <nav className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor:'#404040', height:'70px'}}>
                <a href="/#" className='navbar-brand col-sm-3 col-md-2 mr-0' style={{color:'white'}}>
                    <img src={bank} width='50' className='d-inline-block align-center ' alt='bank'/>
                    &nbsp; DAPP Yield Farming (Decentralized Banking)
                </a>
                <ul className='navbar-nav px-3'>
                    <li className='text-nowrap d-none nav-item d-sm-none d-sm-block'>
                        <small style={{color:'white'}}>ACCOUNT NUMBER: {this.props.account.slice(0, 11) + '...'}
                        </small>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;