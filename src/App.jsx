import './App.css'
import Header from './Components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Footer from './Components/Footer';
import About from './Components/About';
import Services from './Components/Services';
import Contact from './Components/Contact';
import Products from './Components/Products';
import Register from './Components/Register';
import Login from './Components/Login';
import Cart from './Components/Cart';
import ProductDetails from './Components/ProductDetails';
import Checkout from './Components/Checkout';
import AllOrders from './Components/AllOrders';
import OrderPlaced from './Components/orderPlaced';
import MyAccount from './Components/Myaccount';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/about' element={<About/>}></Route>
            <Route path='/services' element={<Services/>}></Route>
            <Route path='/contact' element={<Contact/>}></Route>
            <Route path="/products/:category" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orderplaced" element={<OrderPlaced />}/>
            <Route path="/allorders" element={<AllOrders />} />
            <Route path="/myaccount" element={<MyAccount />} />

          </Routes>
        </main>
        <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
