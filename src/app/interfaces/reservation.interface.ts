export interface Reservation {
    userId: number,
    restaurantId: number
    date: Date; 
    timeHour: number;
    timeMinute: number;
    numberOfGuests: number;
    note?: string; 
  }