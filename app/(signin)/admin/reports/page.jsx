import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
export const metadata = {
  title: "Reports",
};
export default async function page({ searchParams }) {
  const { s } = await searchParams;
  //   const sectionList = ["View User", "Update User", "Delete User"];
  const sectionList = [];
  return (
    <div className="grid gap-3 lg:grid-cols-[200px_1fr] grid-rows-1 min-h-[calc(100vh-200px)]">
      <Card className="py-2 rounded-t-none -mt-1 row-span-full">
        <CardContent className="flex flex-col gap-2 px-2">
          {sectionList.map((section, i) => (
            <Link
              href="/admin/drivers"
              hash={section}
              as={`/admin/drivers?s=${section.replace(" ", "-")}`.toLowerCase()}
              className={`*:hover:bg-primary/10 rounded-sm p-2 hover:bg-primary/10 ${
                s === section.replace(" ", "-").toLowerCase() ||
                (s === undefined && section === "new driver")
                  ? "bg-primary/10"
                  : ""
              }`}
              key={i + 1}
            >
              {section}
            </Link>
          ))}
        </CardContent>
      </Card>
      <div className="mt-3 flex flex-col gap-3">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-fit">
          <table className="w-full text-sm text-center text-gray-500">
            <thead className="text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Full Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {true ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr
                    className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center"
                    key={i}
                  >
                    <th
                      scope="row"
                      className="px-2 py-2 font-medium text-gray-900"
                    >
                      <span>{"Fahad abdullah"}</span>
                    </th>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      Fahad@email.com
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      0555555555
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      driver
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      <Button variant="link" className="cursor-pointer">
                        View User
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center">
                  <th
                    colSpan="100"
                    className="px-2 py-2 font-bold text-2xl text-gray-900"
                  >
                    <span>NO USER FOUND !!!</span>
                  </th>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
