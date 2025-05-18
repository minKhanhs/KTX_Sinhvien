import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import {store ,persistor} from './Redux/store.js'
import App from './App.jsx'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </PersistGate>
  </Provider>,
);
