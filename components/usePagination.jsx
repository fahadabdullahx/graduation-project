"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UsePagination({
  totalPages = 0,
  initialPage = 1,
  siblingsCount = 1,
}) {
  if (totalPages <= 1) return null; // No pagination needed if total pages is less than 1
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page from URL or use initialPage as fallback
  const pageParam = searchParams.get("page");
  const currentPage = pageParam
    ? Math.min(Math.max(1, Number.parseInt(pageParam, 10)), totalPages)
    : initialPage;

  // Calculate the range of pages to display
  const getPageRange = () => {
    const range = [];

    // Always show first page
    range.push(1);

    // Calculate start and end of sibling range
    const siblingStart = Math.max(currentPage - siblingsCount, 2);
    const siblingEnd = Math.min(currentPage + siblingsCount, totalPages - 1);

    // Add ellipsis if there's a gap after page 1
    if (siblingStart > 2) {
      range.push("...");
    }

    // Add sibling pages
    for (let i = siblingStart; i <= siblingEnd; i++) {
      range.push(i);
    }

    // Add ellipsis if there's a gap before last page
    if (siblingEnd < totalPages - 1) {
      range.push("...");
    }

    // Always show last page if not the first page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      // Create new URL with updated page parameter
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const pageRange = getPageRange();

  return (
    <div className="w-full max-w-4xl mx-auto my-2.5">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : 0}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {pageRange.map((page, index) =>
            typeof page === "number" ? (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : 0}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
