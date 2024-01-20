import { Routes, Route } from 'react-router-dom';
import './App.css'
import Form from './pages/Form';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

function App() {


  return (
    <>
         <Navbar />
          <Toaster 
           position={window.innerWidth < 768 ? 'bottom-center' : 'bottom-right'}
          toastOptions={{duration: 5000}} />
          <Routes>
          <Route path='/' element={<Home />} />
            <Route path='/forms' element={<Form />} />
          </Routes>
    </>
  )
}

export default App
