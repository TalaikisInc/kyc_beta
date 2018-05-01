import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import '../../node_modules/grommet-css'
import App from 'grommet/components/App'
import Box from 'grommet/components/Box'
import ReactGA from 'react-ga'

import * as actions from '../actions'
import Async from './Async'
import env from '../env'
ReactGA.initialize(env.GA)
const supportsHistory = 'pushState' in window.history
const Home = Async(() => import('./Home'))
const Header = Async(() => import('./Header'))
const Footer = Async(() => import('./Footer'))
const Status = Async(() => import('./Status'))
const RemoveFromWhitelist = Async(() => import('./admin/RemoveFromWhitelist'))
const Withdraw = Async(() => import('./admin/Withdraw'))
const AddToWhitelist = Async(() => import('./admin/AddToWhitelist'))
const Admin = Async(() => import('./admin/Admin'))
const GetUser = Async(() => import('./admin/GetUser'))
const Fee = Async(() => import('./admin/Fee'))
const UserList = Async(() => import('./admin/UserList'))
const DeleteUser = Async(() => import('./users/DeleteUser'))
const UpdateUser = Async(() => import('./users/UpdateUser'))
const AddUser = Async(() => import('./users/AddUser'))
const NoMatch = Async(() => import('./NoMatch'))
const MyAccount = Async(() => import('./MyAccount'))

class _App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      initiated: false,
      deployed: true
    }
  }

  async componentDidMount() {
    this.props.initWeb3()

    this.setState({
      initiated: true
    })

    setInterval(() => {
      this.props.fetchAccount(this.props.web3)
      this.props.fetchGasPrice(this.props.web3)
    }, 2000)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.web3 !== nextProps.web3) {
      this.props.fetchAccount(this.props.web3)
      this.props.fetchGasPrice(this.props.web3)
      this.props.initIPFS(this.props.web3)

      if (nextProps.web3.web3Initiated) {
        this.props.initToken(nextProps.web3)
      }
    }

    if (this.props.account !== nextProps.account && typeof nextProps.account === 'string') {
      this.setState({
        initiated: true
      })
    }
  }

  pageviewTracking() {
    ReactGA.pageview(window.location.pathName)
  }

  render() {
    return (
      <App>
        <div>
          <BrowserRouter onUpdate={this.pageviewTracking} forceRefresh={!supportsHistory}>
            <div>
              <Box align='center' responsive={true} pad='large'>
                <Status
                  account={this.props.account}
                  metamask={this.props.web3}
                  initiated={this.state.initiated}
                  deployed={this.state.deployed} {...this.props} />

                { this.state.deployed && typeof this.props.account === 'string' && this.props.account !== 'empty'
                  ? <div>
                      <Header />
                      <Switch>
                      <Route exact strict sensitive path='/' component={Home} />
                      <Route exact strict sensitive path='/account' component={MyAccount} />
                      <Route exact strict sensitive path='/register' component={AddUser} />
                      <Route exact strict sensitive path='/edit' component={UpdateUser} />
                      <Route exact strict sensitive path='/delete' component={DeleteUser} />

                      <Route exact strict sensitive path='/admin' component={Admin} />
                      <Route exact strict sensitive path='/fee' component={Fee} />
                      <Route exact strict sensitive path='/withdraw' component={Withdraw} />
                      <Route exact strict sensitive path='/whitelist-remove' component={RemoveFromWhitelist} />
                      <Route exact strict sensitive path='/whitelist-add' component={AddToWhitelist} />
                      <Route exact strict sensitive path='/get-user' component={GetUser} />
                      <Route exact strict sensitive path='/users-admin' component={UserList} />

                      <Route component={NoMatch} />
                      </Switch>
                    </div>
                  : null
                }
              </Box>
              <Footer />
            </div>
          </BrowserRouter>
        </div>
      </App>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(_App)
