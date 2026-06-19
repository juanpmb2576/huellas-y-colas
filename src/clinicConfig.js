// ─── Configuración del cliente ───────────────────────────────
// Para clonar este paquete a otra veterinaria, edita solo este archivo.

export const clinicConfig = {
  // Identidad
  name:      'Centro Médico Veterinario',
  shortName: 'CMV',
  tagline:   'Cuidado veterinario de excelencia para los miembros más especiales de tu familia.',
  instagram: 'centromedicoveterinarioctg',
  instagramUrl: 'https://instagram.com/centromedicoveterinarioctg',

  // Logo — coloca el archivo en /public/logo.png
  // Si no existe, se muestra el ícono de pata automáticamente
  logo: '/logo.png',

  // Contacto
  phones:   ['+57 300 566 0812', '+57 301 449 8792'],
  whatsapp: '573005660812', // sin + ni espacios, para wa.me

  // Ubicación
  address: {
    street:   'Dirección pendiente de confirmar',
    city:     'Cartagena de Indias, Bolívar',
    mapsUrl:  'https://www.google.com/maps/place/Centro+M%C3%A9dico+Veterinario+Cartagena/@10.3942101,-75.4824812,16z',
    embedUrl: 'https://maps.google.com/maps?q=10.3942101,-75.4824812&z=16&output=embed',
  },

  // Servicios — cada item se renderiza como una tarjeta en la landing
  services: [
    {
      id:    'urgencias',
      title: 'Urgencias 24 horas',
      desc:  'Disponibles toda la noche y los fines de semana. Tu mascota no puede esperar, y nosotros tampoco.',
      icon:  'clock',
    },
    {
      id:    'emergencias',
      title: 'Emergencias',
      desc:  'Equipo entrenado para actuar rápido ante intoxicaciones, traumas, convulsiones y más.',
      icon:  'bolt',
    },
    {
      id:    'hospitalizacion',
      title: 'Hospitalización',
      desc:  'Cuidado continuo y monitoreo profesional para tu mascota durante toda su recuperación.',
      icon:  'bed',
    },
    {
      id:    'bano',
      title: 'Baño y peluquería',
      desc:  'Aseo completo con productos de calidad y trato delicado para perros y gatos.',
      icon:  'scissors',
    },
    {
      id:    'consulta',
      title: 'Consulta general',
      desc:  'Chequeos preventivos, vacunas y diagnósticos con veterinarios certificados.',
      icon:  'stethoscope',
    },
  ],

  // Ruta de la tienda online dentro de la misma app
  storeUrl: '/petshop',
}
