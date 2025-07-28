export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 pointer-events-auto">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-t-blue-500 border-b-4 border-b-purple-500"></div>
    </div>
  );
}