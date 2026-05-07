import { ADMIN_ROUTE, EXPECTED_ADMIN_TITLE, EXPECTED_MARKET_TITLE, MARKET_INSTRUCTION_TEXT, MARKET_ROUTE } from './constants';

export type CocktailItem = {
  id: string;
  nombre: string;
  descripcion: string;
  precioMinimo: number;
  precioPromedio: number;
  fechaCreacion: string;
  fechaActualizacion: string;
};

export type SessionState = {
  username: string;
};

export type TradingHistoryPoint = {
  precioBs: number;
  timestamp: string;
};

export type TradingActivityPoint = {
  volumen: number;
  operaciones: number;
  timestamp: string;
};

export type LastPurchase = {
  cantidad: number;
  precioUnitario: number;
  total: number;
  fecha: string;
} | null;

export type TradingStateEntry = {
  precioActualBs: number;
  precioHace15Min: number;
  precioReferenciaInicialBs: number;
  ultimaActualizacion: string;
  ultimaActualizacion15Min: string;
  volumenComprado: number;
  volumen15Min: number;
  operaciones15Min: number;
  historialPrecios: TradingHistoryPoint[];
  actividad15Min: TradingActivityPoint[];
  ultimaCompra: LastPurchase;
};

export type TradingStateRecord = Record<string, TradingStateEntry>;

const DEFAULT_ITEM_TIMESTAMP = '2026-05-06T00:00:00.000Z';
const DEFAULT_TRADING_TIMESTAMP = '2026-05-07T08:30:26.356Z';

export const adminCredentials = {
  username: 'roger',
  password: '12345'
} as const;

export const adminData = {
  route: ADMIN_ROUTE,
  title: EXPECTED_ADMIN_TITLE
} as const;

export const marketData = {
  route: MARKET_ROUTE,
  title: EXPECTED_MARKET_TITLE,
  instruction: MARKET_INSTRUCTION_TEXT
} as const;

export const defaultCocktails: CocktailItem[] = [
  {
    id: 'default-tequila-shot',
    nombre: 'Tequila Shot',
    descripcion: 'El clasico con sal y limon. Simple pero infalible.',
    precioMinimo: 10,
    precioPromedio: 30,
    fechaCreacion: DEFAULT_ITEM_TIMESTAMP,
    fechaActualizacion: DEFAULT_ITEM_TIMESTAMP
  },
  {
    id: 'default-jagerbomb',
    nombre: 'Jagerbomb',
    descripcion: 'Jagermeister con bebida energetica. Fuerte y muy popular en fiestas.',
    precioMinimo: 20,
    precioPromedio: 30,
    fechaCreacion: DEFAULT_ITEM_TIMESTAMP,
    fechaActualizacion: DEFAULT_ITEM_TIMESTAMP
  },
  {
    id: 'default-b-52',
    nombre: 'B-52',
    descripcion: 'Capas de Kahlua, Baileys y Grand Marnier. Visualmente atractivo y dulce.',
    precioMinimo: 25,
    precioPromedio: 40,
    fechaCreacion: DEFAULT_ITEM_TIMESTAMP,
    fechaActualizacion: DEFAULT_ITEM_TIMESTAMP
  }
];

export function createCocktailId(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildCocktail(overrides: Partial<CocktailItem> & Pick<CocktailItem, 'nombre' | 'precioMinimo' | 'precioPromedio'>): CocktailItem {
  const id = overrides.id ?? createCocktailId(overrides.nombre);

  return {
    id,
    nombre: overrides.nombre,
    descripcion: overrides.descripcion ?? `Descripcion de ${overrides.nombre}`,
    precioMinimo: overrides.precioMinimo,
    precioPromedio: overrides.precioPromedio,
    fechaCreacion: overrides.fechaCreacion ?? DEFAULT_ITEM_TIMESTAMP,
    fechaActualizacion: overrides.fechaActualizacion ?? DEFAULT_ITEM_TIMESTAMP
  };
}

function minutesBefore(baseIso: string, minutes: number): string {
  return new Date(new Date(baseIso).getTime() - minutes * 60_000).toISOString();
}

export function buildTradingEntry(
  item: CocktailItem,
  overrides: Partial<TradingStateEntry> = {}
): TradingStateEntry {
  const precioHace15Min = overrides.precioHace15Min ?? item.precioPromedio;
  const precioActualBs = overrides.precioActualBs ?? item.precioPromedio;
  const ultimaActualizacion = overrides.ultimaActualizacion ?? DEFAULT_TRADING_TIMESTAMP;
  const ultimaActualizacion15Min = overrides.ultimaActualizacion15Min ?? ultimaActualizacion;
  const volumen15Min = overrides.volumen15Min ?? 0;
  const operaciones15Min = overrides.operaciones15Min ?? 0;

  return {
    precioActualBs,
    precioHace15Min,
    precioReferenciaInicialBs: overrides.precioReferenciaInicialBs ?? precioHace15Min,
    ultimaActualizacion,
    ultimaActualizacion15Min,
    volumenComprado: overrides.volumenComprado ?? 0,
    volumen15Min,
    operaciones15Min,
    historialPrecios: overrides.historialPrecios ?? [
      {
        precioBs: precioHace15Min,
        timestamp: minutesBefore(ultimaActualizacion, 15)
      },
      {
        precioBs: precioActualBs,
        timestamp: ultimaActualizacion
      }
    ],
    actividad15Min: overrides.actividad15Min ?? [
      {
        volumen: volumen15Min,
        operaciones: operaciones15Min,
        timestamp: ultimaActualizacion
      }
    ],
    ultimaCompra: overrides.ultimaCompra ?? null
  };
}

export function buildTradingState(
  items: CocktailItem[],
  overrides: Record<string, Partial<TradingStateEntry>> = {}
): TradingStateRecord {
  return Object.fromEntries(
    items.map((item) => [item.id, buildTradingEntry(item, overrides[item.id])])
  );
}
