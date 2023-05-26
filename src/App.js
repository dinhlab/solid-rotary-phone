import './styles.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MThemeProvider } from './themeContext/MThemeProvider'
import MainLayout from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { DetailPage } from './pages/DetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App () {
  return (
    <div className='App'>
      <MThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path='/pokemons/:id' element={<DetailPage />} />
              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MThemeProvider>
    </div>
  )
}
