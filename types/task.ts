export type Task = {
  id: string;
  title: string;
  type: string;
  dateTime: {
    start: string;
    end: string;
  };
  location: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    lat: number;
    long: number;
  };
  equipment: {
    model: string;
    serialNumber: string;
  };
  technician: {
    name: string;
    id: string;
  };
  taskId: string;

  isAppointed: boolean;

  // Variant determines which display mode to use
  variant: 'sla' | 'expected_dates' | 'job_comment';

  // SLA variant fields
  sla?: string; // e.g. "8H"
  slaDate?: string; // e.g. "2025-03-05T18:30:00" (will be displayed as "Wed 5/3/25 • 18:30")

  // Expected dates variant fields (used as alternative to SLA)
  expectedDates?: {
    start: string; // e.g. "2025-03-08T08:00:00"
    end: string; // e.g. "2025-03-10T17:00:00"
  };

  // Job comment variant field (for "NO SLA, NOR EXPECTED DATES" variation)
  jobComment?: string; // e.g. "seleccionar café a maquina dá indicação para tirar..."

  // Indicates if task is new (unread/unopened) - shown with blue dot
  isNew?: boolean;
};

export interface TaskLocation {
  id: string;
  title: string;
  location: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    lat: number | string;
    long: number | string;
  };
}
