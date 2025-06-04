
export default function BookingSuccess({ showBookingSuccess }) {
  if (!showBookingSuccess) return null;
  
  return (
    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-sm font-medium text-green-800 dark:text-green-200">
          Appointment Confirmed
        </span>
      </div>
      <p className="text-sm text-green-700 dark:text-green-300">
        Your appointment has been successfully scheduled.
      </p>
    </div>
  );
}