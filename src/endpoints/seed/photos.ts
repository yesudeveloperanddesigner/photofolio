type Orientation = 'landscape' | 'portrait' | 'square'

export type PhotoSeed = {
  alt: string
  camera?: string
  caption?: string
  location?: string
  orientation: Orientation
  seed: string
  shotAt?: string
  size: [number, number]
  tags?: { label: string }[]
  title: string
}

/**
 * Demo photographs. Each entry is downloaded from picsum and uploaded into the
 * Photos library so galleries and blocks can reference real documents.
 */
export const photoSeeds: PhotoSeed[] = [
  {
    alt: 'Coastal cliffs in fog',
    camera: '35mm · Portra 400',
    caption: 'Quiet Coast',
    location: 'Atlantic coast, PT',
    orientation: 'portrait',
    seed: 'elena-01',
    shotAt: '2024-04-01',
    size: [1200, 1600],
    tags: [{ label: 'coast' }, { label: 'landscape' }],
    title: 'Quiet Coast',
  },
  {
    alt: 'Portrait in window light',
    camera: '50mm · Tri-X 400',
    caption: 'Ana, at home',
    location: 'Lisbon, PT',
    orientation: 'portrait',
    seed: 'elena-02',
    shotAt: '2024-02-10',
    size: [1200, 1600],
    tags: [{ label: 'portrait' }],
    title: 'Ana, at home',
  },
  {
    alt: 'Empty street at dawn',
    camera: '28mm · Portra 160',
    caption: 'Before the City Wakes',
    location: 'Lisbon, PT',
    orientation: 'landscape',
    seed: 'elena-03',
    shotAt: '2023-11-20',
    size: [1600, 1200],
    tags: [{ label: 'street' }],
    title: 'Before the City Wakes',
  },
  {
    alt: 'Mountain ridge line',
    camera: 'Medium format · Ektar 100',
    caption: 'Above the Treeline',
    location: 'Serra da Estrela, PT',
    orientation: 'portrait',
    seed: 'elena-04',
    shotAt: '2023-08-05',
    size: [1200, 1600],
    tags: [{ label: 'landscape' }],
    title: 'Above the Treeline',
  },
  {
    alt: 'Still life on a table',
    camera: '85mm · Portra 400',
    caption: 'Sunday Objects',
    location: 'Studio, Lisbon',
    orientation: 'square',
    seed: 'elena-05',
    shotAt: '2022-12-18',
    size: [1400, 1400],
    tags: [{ label: 'still life' }],
    title: 'Sunday Objects',
  },
  {
    alt: 'Dancer mid-movement',
    camera: '35mm · Delta 3200',
    caption: 'Rehearsal',
    location: 'Teatro, Lisbon',
    orientation: 'portrait',
    seed: 'elena-06',
    shotAt: '2022-06-30',
    size: [1200, 1600],
    tags: [{ label: 'portrait' }, { label: 'movement' }],
    title: 'Rehearsal',
  },
]
