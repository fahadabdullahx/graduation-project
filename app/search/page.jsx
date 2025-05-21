import SearchResult from "@/components/trip/searchResult";
import { SearchAction } from "@/app/actions/trips";
import SearchForm from "@/components/trip/searchForm";
// export const dynamic = "force-dynamic";
// export const revalidate = 0; // Revalidate every request
export const metadata = {
  title: "Search",
};
export default async function Search({ searchParams }) {
  const SP = await searchParams;

  if (
    !SP ||
    SP == null ||
    SP == undefined ||
    Object.keys(SP).length == 0 ||
    SP.from_address == undefined ||
    SP.to_address == undefined
  ) {
    return (
      <div className="container mx-auto p-4  min-h-[calc(100dvh-300px)] flex justify-center items-center">
        <div className="relative z-10 w-full max-w-4xl mx-auto p-5 rounded-lg shadow-2xl bg-white">
          <div className="relative z-10 w-full">
            <span className="text-2xl font-bold text-gray-800">Search</span>
            <span className="text-sm text-gray-500">for your trip</span>
          </div>
          <SearchForm />
        </div>
      </div>
    );
  }
  const trips = await SearchAction(SP);
  return (
    <div className="container mx-auto p-4">
      {trips && trips.length > 0 ? (
        <SearchResult result={trips} />
      ) : (
        <div className="my-5 relative z-10 w-full max-w-4xl mx-auto p-5 rounded-lg shadow-2xl bg-white">
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-gray-500 text-lg font-semibold">
            <span className="text-2xl font-bold text-gray-800">
              No results found for your search.
            </span>

            <span className="text-sm text-gray-500">
              Please try a different search or check your input.
            </span>
          </div>
          <SearchForm className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-lg w-full border bg-white" />
        </div>
      )}
    </div>
  );
}
