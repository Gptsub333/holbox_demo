
export const Avatar = ({ children, className = "" }) => (
  <div
    className={`flex items-center justify-center rounded-full transition-all duration-200 ${className}`}
  >
    {children}
  </div>
);

export const AvatarFallback = ({ children }) => children;
