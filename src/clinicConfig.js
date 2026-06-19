// ─── Configuración del cliente ───────────────────────────────
// Para clonar a otra veterinaria, edita solo este archivo.

export const clinicConfig = {
  // Identidad
  name: 'Huellas y Colas',
  shortName: 'H&C',
  tagline: 'El cuidado que tu mascota merece, con todo el amor que se merece.',
  instagram: 'huellasycolas',
  instagramUrl: 'https://instagram.com/huellasycolas',

  // Logo — coloca el archivo en /public/logo.png
  // Si no existe, se muestra el ícono de pata automáticamente
  logo: '/logo.png',

  // Contacto
  phones: ['311 397 4333'],
  whatsapp: '573113974333',       // sin + ni espacios, para wa.me
  whatsappMsg: 'Hola, quiero agendar una cita para mi mascota',

  // Ubicación
  address: {
    street: 'Cl. 31 #78A-92, 1er piso, La Plazuela',
    city: 'Cartagena de Indias, Bolívar',
    lat: 10.3886782,
    lng: -75.4758354,
    mapsUrl: 'https://maps.google.com/?cid=12983216935852295235',
    embedUrl: 'https://www.google.com/maps?q=10.3886782,-75.4758354&output=embed',
  },

  // Servicios — cada item se renderiza como una tarjeta en la landing
  services: [
    {
      id: 'consulta',
      title: 'Consulta veterinaria',
      desc: 'Revisión general, diagnóstico y tratamiento con veterinarios certificados para el bienestar de tu mascota.',
      icon: 'stethoscope',
    },
    {
      id: 'tienda',
      title: 'Tienda de alimentos',
      desc: 'Alimentos premium y balanceados para perros y gatos, con las mejores marcas del mercado.',
      icon: 'bag',
    },
    {
      id: 'accesorios',
      title: 'Venta de accesorios',
      desc: 'Correas, collares, camas, juguetes y todo lo que tu compañero peludo necesita.',
      icon: 'tag',
    },
    {
      id: 'domicilio',
      title: 'Atención a domicilio',
      desc: 'Llevamos el cuidado veterinario hasta la puerta de tu casa, con la misma calidad y dedicación.',
      icon: 'home',
    },
    {
      id: 'urgencias',
      title: 'Urgencias 24/7',
      desc: 'Disponibles las 24 horas del día, los 7 días de la semana. Tu mascota no puede esperar.',
      icon: 'clock',
    },
  ],

  // Ruta de la tienda online dentro de la misma app
  storeUrl: '/petshop',

  // ── Identidad visual ──────────────────────────────────────
  // Los valores aquí se inyectan como variables CSS en main.jsx.
  // Cambiar este objeto es suficiente para re-tematizar la landing.
  theme: {
    primary: '#6B8E6B',   // Salvia Profundo
    accent: '#E29578',   // Durazno
    background: '#FAF3E8',   // Arena Suave
    secondary: '#A8C0A0',   // Salvia Claro
    text: '#332D27',   // Café Grisáceo
    neutral: '#EDE3D3',   // Beige
    fontDisplay: 'Fredoka',
    fontBody: 'Nunito Sans',
  },
}
