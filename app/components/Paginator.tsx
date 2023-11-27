import { Link } from "@remix-run/react";

const Pagination = ({ page, total }: { page: number, total: number }) => {
    const pages = Array.from({length: total}, (_, i) => i + 1);

    return (
      <div className="flex justify-center space-x-2">
        {pages.map((pageNumber) => (
          <Link
          key={pageNumber}
          to={`?page=${pageNumber}`}
          className={`px-3 py-2 border rounded-md hover:text-white hover:bg-teal-500
            ${page === pageNumber ? 'font-bold border-b-2 underline text-teal-500' : 'font-bold border-b-2 text-gray-500'}`}
        >
          {pageNumber}
        </Link>
        ))}
      </div>
    );
  };

  export default Pagination;