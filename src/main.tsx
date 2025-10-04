import { createRoot } from 'react-dom/client'
import './index.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import App from './App'
createRoot(document.getElementById('root')!).render(
    <App/>
)
