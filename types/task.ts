export type Task = {
  id: string;
  title: string;
  type: string;
  dateTime: {
    start: Date;
    end: Date;
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
  status: string;
  sla: string;
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
