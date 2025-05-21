export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-300px)]">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
