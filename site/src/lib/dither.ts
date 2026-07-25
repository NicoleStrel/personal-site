/** Bayer 8x8 ordered dither matrix (normalized 0–1 thresholds). */
export const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64))

export type DitherTone = 'dark' | 'mid' | 'accent'

export type DitherCell = {
  x: number
  y: number
  tone: DitherTone
  /** Target position in portrait local space */
  tx: number
  ty: number
}

export const TONE_COLORS: Record<DitherTone, string> = {
  dark: '#1a1a1a',
  mid: '#6e6e6e',
  accent: '#8ec8e6',
}

export function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export type SampleOptions = {
  cols: number
  /** If true, sample dark pixels (photo). If false, sample bright lines on dark bg. */
  invert?: boolean
  threshold?: number
  accentChance?: number
  /** Less Bayer thinning — denser line strokes. */
  dense?: boolean
}

/**
 * Sample an image into a sparse dithered cell grid (horse-look squares).
 * For white-on-black line sketches, keep invert=false so bright strokes become cells.
 */
export function sampleImageToCells(
  image: HTMLImageElement | HTMLCanvasElement,
  options: SampleOptions,
): { cells: DitherCell[]; cols: number; rows: number; cellSize: number } {
  const {
    cols,
    invert = false,
    threshold = 0.22,
    accentChance = 0.08,
    dense = false,
  } = options
  const iw = 'naturalWidth' in image ? image.naturalWidth || image.width : image.width
  const ih = 'naturalHeight' in image ? image.naturalHeight || image.height : image.height
  const cellSize = iw / cols
  const rows = Math.max(1, Math.round(ih / cellSize))

  const canvas = document.createElement('canvas')
  canvas.width = cols
  canvas.height = rows
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return { cells: [], cols, rows, cellSize: 1 }
  }

  ctx.drawImage(image, 0, 0, cols, rows)
  const { data } = ctx.getImageData(0, 0, cols, rows)
  const cells: DitherCell[] = []
  const bayScale = dense ? 0.03 : 0.08

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      const a = data[i + 3] / 255
      if (a < 0.08) continue

      let lum = luminance(data[i], data[i + 1], data[i + 2])
      if (invert) lum = 1 - lum

      const strength = lum * a
      const bay = BAYER_8[y % 8][x % 8]
      if (strength < threshold + bay * bayScale) continue

      let tone: DitherTone = 'dark'
      if (strength < 0.45) {
        tone = 'mid'
      } else if (strength < 0.75) {
        tone = Math.random() < 0.35 ? 'mid' : 'dark'
      } else {
        tone = 'dark'
      }

      if (Math.random() < accentChance && strength > 0.5) {
        tone = 'accent'
      }

      cells.push({
        x,
        y,
        tone,
        tx: x,
        ty: y,
      })
    }
  }

  return { cells, cols, rows, cellSize }
}

export type EdgeOrigin = { ox: number; oy: number }

/** Assign random edge/corner origins for rush-in animation (in cell units). */
export function assignEdgeOrigins(
  cells: DitherCell[],
  cols: number,
  rows: number,
): EdgeOrigin[] {
  const pad = Math.max(cols, rows) * 0.75
  return cells.map(() => {
    const edge = Math.floor(Math.random() * 8)
    switch (edge) {
      case 0:
        return { ox: Math.random() * cols, oy: -pad - Math.random() * pad }
      case 1:
        return { ox: Math.random() * cols, oy: rows + pad + Math.random() * pad }
      case 2:
        return { ox: -pad - Math.random() * pad, oy: Math.random() * rows }
      case 3:
        return { ox: cols + pad + Math.random() * pad, oy: Math.random() * rows }
      case 4:
        return { ox: -pad, oy: -pad }
      case 5:
        return { ox: cols + pad, oy: -pad }
      case 6:
        return { ox: -pad, oy: rows + pad }
      default:
        return { ox: cols + pad, oy: rows + pad }
    }
  })
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 768px)').matches
}
