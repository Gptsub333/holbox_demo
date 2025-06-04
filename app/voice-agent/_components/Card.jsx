
import React from "react";

export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`${className}`}>{children}</div>
);

export const ScrollArea = React.forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative overflow-y-auto overflow-x-hidden ${className}`}
        style={{ scrollBehavior: "smooth" }}
        {...props}
      >
        <div className="min-h-full">{children}</div>
      </div>
    );
  }
);
