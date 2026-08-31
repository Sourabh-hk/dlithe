import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavouritesProvider } from './context/FavouritesContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Favourites from './pages/Favourites';
import EnquiryForm from './pages/EnquiryForm';
import MyEnquiries from './pages/MyEnquiries';
import NotFound from './pages/NotFound';

function App() {
  return (
    <FavouritesProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/enquiry/:id" element={<EnquiryForm />} />
              <Route path="/my-enquiries" element={<MyEnquiries />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FavouritesProvider>
  );
}

export default App;
