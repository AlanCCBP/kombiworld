export interface CreateStopInput {
  routeId: string;

  nameRaw: string;
  nameNormalized?: string;
  city?: string;
  province?: string;

  latitude?: number;
  longitude?: number;

  plusMinutes?: number;
  sequence?: number;
}
