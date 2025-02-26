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
