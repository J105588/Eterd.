'use client';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-grow flex flex-col transition-opacity duration-300">
      {children}
    </div>
  );
}
