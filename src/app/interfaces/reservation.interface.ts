export interface Reservation {
    userId: number,
    restaurantId: number
    date: Date; 
    timeHour: number;
    timeMinute: number;
    numberOfGuests: number;
    note?: string; 
  }

export interface Reservation2 {
    id: number;
    userId: number;
    restaurant: {
      id: number;
      name: string;
      userId: number;
      description: string;
      image: string;
    };
    numberOfGuests: number;
    time: string;
    note: string;
    date: string;
    isAccepted: boolean;
    isRealised: boolean;
}