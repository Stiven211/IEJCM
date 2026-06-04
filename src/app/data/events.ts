export interface Event {
  id: string
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  endTime: string
  location: string
  category: 'academic' | 'cultural' | 'sports' | 'institutional'
  image: string
}

export const CATEGORY_LABELS: Record<Event['category'], string> = {
  academic: 'Académico',
  cultural: 'Cultural',
  sports: 'Deportivo',
  institutional: 'Institucional',
}

export const CATEGORY_COLORS: Record<Event['category'], { bg: string; text: string }> = {
  academic: { bg: '#006400', text: '#FFFFFF' },
  cultural: { bg: '#92400E', text: '#FFFFFF' },
  sports: { bg: '#1E40AF', text: '#FFFFFF' },
  institutional: { bg: '#5B21B6', text: '#FFFFFF' },
}

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Feria de la Ciencia y Tecnología 2026',
    description: 'Exposición de proyectos científicos y tecnológicos desarrollados por estudiantes de todos los grados.',
    fullDescription: `La Institución Educativa Colegio José Celestino Mutis tiene el honor de invitar a toda la comunidad educativa a la Feria de la Ciencia y Tecnología 2026.\n\nEste evento anual es el escenario donde nuestros estudiantes demuestran su creatividad, pensamiento crítico e innovación a través de proyectos en las áreas de Ciencias Naturales, Tecnología, Matemáticas y Ciencias Sociales. Contaremos con la participación de más de 200 estudiantes de todos los grados.\n\nEl evento está abierto a toda la comunidad estudiantil, padres de familia, docentes y ciudadanía en general. Se otorgarán premios a los mejores proyectos en cada categoría y los ganadores representarán a la institución en la Feria Regional del Guaviare.`,
    date: '2026-06-15',
    time: '8:00 AM',
    endTime: '3:00 PM',
    location: 'Patio Central de la Institución',
    category: 'academic',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: '2',
    title: 'Festival Cultural "Amazonía Viva" 2026',
    description: 'Gran festival cultural donde estudiantes representan las tradiciones y costumbres del Amazonas colombiano.',
    fullDescription: `El Festival Cultural "Amazonía Viva" es el evento cultural más importante de nuestra institución, un espacio de celebración y reconocimiento de las riquezas de nuestra región amazónica.\n\nDurante el festival, los estudiantes presentarán danzas típicas, música tradicional, artesanías y gastronomía local. Participarán grupos de teatro, coros y comparsas representando la diversidad cultural de San José del Guaviare y sus comunidades indígenas vecinas.\n\nEste año contaremos con la participación especial de grupos culturales invitados de los municipios de Miraflores y Calamar, enriqueciendo aún más la muestra de la biodiversidad cultural amazónica.`,
    date: '2026-06-28',
    time: '2:00 PM',
    endTime: '7:00 PM',
    location: 'Auditorio Municipal y Patio Principal',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1719241368157-7c78535f3a92?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: '3',
    title: 'Día del Deporte y la Salud',
    description: 'Jornada deportiva con competencias de atletismo, fútbol, baloncesto y voleibol entre los distintos grados.',
    fullDescription: `El Día del Deporte y la Salud es una jornada dedicada a la actividad física, el trabajo en equipo y el espíritu deportivo de nuestra comunidad estudiantil.\n\nSe realizarán competencias en múltiples disciplinas: atletismo, fútbol sala, baloncesto, voleibol y microfútbol. Los estudiantes participarán organizados por grados y jornadas en una sana competencia que premia el esfuerzo, la solidaridad y el juego limpio.\n\nAl finalizar las competencias se entregará el Trofeo José Celestino Mutis al grado con mejor desempeño deportivo integral. La salud y el bienestar son pilares fundamentales de nuestra formación.`,
    date: '2026-07-10',
    time: '7:30 AM',
    endTime: '12:30 PM',
    location: 'Estadio Municipal Luis Arenas Duarte',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1700914299961-d8f91559d85d?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: '4',
    title: 'Izada de Bandera — Día de la Independencia',
    description: 'Acto cívico en conmemoración del 20 de julio, Día de la Independencia de Colombia.',
    fullDescription: `Con motivo de la celebración del 20 de julio, Día de la Independencia de Colombia, la Institución Educativa Colegio José Celestino Mutis realizará su tradicional Izada de Bandera.\n\nEste solemne acto cívico contará con la participación de la Banda Marcial Institucional, el Coro Estudiantil, y la presentación del cuadro de honor de los mejores estudiantes del segundo período académico.\n\nTodos los estudiantes deberán asistir con uniforme de diario completo. La puntualidad es fundamental para dar inicio al acto con la debida solemnidad. Los padres de familia y la comunidad están cordialmente invitados.`,
    date: '2026-07-20',
    time: '7:00 AM',
    endTime: '9:00 AM',
    location: 'Patio Principal — Institución Educativa',
    category: 'institutional',
    image: 'https://images.unsplash.com/photo-1652897995172-24a626202177?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: '5',
    title: 'Semana de la Institucionalidad 2026',
    description: 'Semana de actividades especiales para celebrar el 48° aniversario de fundación del colegio.',
    fullDescription: `La Semana de la Institucionalidad 2026 celebra el 48° aniversario de fundación del Colegio José Celestino Mutis. Durante esta semana se realizarán actividades especiales cada día:\n\n• Lunes 14: Foro académico sobre historia de la institución y perspectivas de futuro\n• Martes 15: Exposición fotográfica "48 Años de Historia" en el corredor principal\n• Miércoles 16: Día de integración para docentes y personal administrativo\n• Jueves 17: Festival de talentos estudiantiles — música, danza, poesía y teatro\n• Viernes 18: Gran acto de clausura con reconocimientos institucionales y cena de exalumnos\n\nToda la comunidad educativa está invitada a ser parte de esta histórica celebración.`,
    date: '2026-09-14',
    time: '8:00 AM',
    endTime: '5:00 PM',
    location: 'Institución Educativa — Todas las sedes',
    category: 'institutional',
    image: 'https://images.unsplash.com/photo-1727518493216-d75fcdb3f2b2?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: '6',
    title: 'Ceremonias de Graduación — Promoción 2025',
    description: 'Graduación oficial de 187 egresados de la Promoción 2025 con entrega de diplomas de bachiller académico.',
    fullDescription: `Nos complace invitar a toda la comunidad educativa a la Ceremonia de Graduación de la Promoción 2025, grado undécimo.\n\nEste emotivo acto simboliza la culminación de 11 años de formación académica y humana. Los 187 egresados recibirán sus diplomas de bachiller académico en un solemne acto con presencia de autoridades educativas departamentales y municipales del Guaviare.\n\nEl programa incluye: desfile de egresados, himno nacional e institucional, discurso del mejor bachiller, palabras de la señora Rectora, entrega de diplomas y medallas de honor, y un acto artístico especial preparado por los estudiantes de grado décimo en honor a sus compañeros.`,
    date: '2025-12-05',
    time: '9:00 AM',
    endTime: '1:00 PM',
    location: 'Coliseo Municipal de San José del Guaviare',
    category: 'academic',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=500&fit=crop&auto=format',
  },
]
