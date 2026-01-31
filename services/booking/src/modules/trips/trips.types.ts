import { TripStatus } from '@/prisma/generated/prisma/enums';

export type UpsertTripInput = {
  id?: string;
  driverId: string;
  routeId: string;
  departureTime: Date;
  capacity: number;
  status?: TripStatus;
};

export const SELLABLE_TRIP_STATUSES = new Set<TripStatus>([
  TripStatus.SCHEDULED,
  TripStatus.BOARDING,
]);
