import { Hero } from './components/Hero.jsx';
import { PrecioDestacado } from './components/PrecioDestacado.jsx';
import { Beneficios } from './components/Beneficios.jsx';
import { FormularioContacto } from './components/FormularioContacto.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <Hero />
      </header>
      <main className="flex-1">
        <PrecioDestacado />
        <Beneficios />
        <FormularioContacto />
      </main>
      <Footer />
    </div>
  );
}
