import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { CTA } from './components/CTA';
import Footer from './components/Footer';
import './styles/globals.css';

function App() {
  return (
    <div className="app">
      <Navigation />
      <Hero />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
