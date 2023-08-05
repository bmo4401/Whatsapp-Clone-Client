import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatTime(totalSeconds: number): string {
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = Math.floor(totalSeconds % 60);

   const formattedMinutes = minutes.toString().padStart(2, '0');
   const formattedSeconds = seconds.toString().padStart(2, '0');

   return `${formattedMinutes}:${formattedSeconds}`;
}

export function calculateTime(inputDateStr: Date) {
   // Assuming the input date string is in UTC format
   const inputDate = new Date(inputDateStr);

   // Get current date
   const currentDate = new Date();

   // Set up date formats
   const timeFormat = { hour: 'numeric', minute: 'numeric' } as const;
   const dateFormat = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
   } as const;

   // Check if it's today, tomorrow, or more than one day ago
   if (
      inputDate.getUTCDate() === currentDate.getUTCDate() &&
      inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
      inputDate.getUTCFullYear() === currentDate.getUTCFullYear()
   ) {
      // Today: Convert to AM/PM format
      const ampmTime = inputDate.toLocaleTimeString('en-US', timeFormat);
      return ampmTime;
   } else if (
      inputDate.getUTCDate() === currentDate.getUTCDate() - 1 &&
      inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
      inputDate.getUTCFullYear() === currentDate.getUTCFullYear()
   ) {
      // Tomorrow: Show "Yesterday"

      return 'Yesterday';
   } else if (
      Math.floor(
         (currentDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24),
      ) > 1 &&
      Math.floor(
         (currentDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24),
      ) <= 7
   ) {
      const timeDifference = Math.floor(
         (currentDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      const targetDate = new Date();
      targetDate.setDate(currentDate.getDate() - timeDifference);

      const daysOfWeek = [
         'Sunday',
         'Monday',
         'Tuesday',
         'Wednesday',
         'Thursday',
         'Friday',
         'Saturday',
      ];
      const targetDay = daysOfWeek[targetDate.getDay()];

      return targetDay;
   } else {
      // More than 7 days ago: Show date in DD/MM/YYYY format
      const formattedDate = inputDate.toLocaleDateString('en-GB', dateFormat);
      return formattedDate;
   }
}
