import React from 'react'
import { Provider } from 'react-redux'
import App from '../../../App'
import {store} from '../../redux/store'
import FlashMessage from 'react-native-flash-message'

function AppWrapper() {
  return (
    <Provider store={store}>
        <App />
        <FlashMessage position="top" />
    </Provider>
  )
}

export default AppWrapper