import React, { useEffect, useState } from "react";
import data from "/src/data/colleges.json";
import InfiniteScroll from "react-infinite-scroll-component";

const Table = () => {
  // the below are the different state management tools we can use to make the web more interactive
  const [searchedCollege, setSearchCollege] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const itemsPerPage = 10;

  // this is the useEffect which will call every time the searchText will get update
  useEffect(() => {
    const fetchData = async () => {
      const filteredData = data.filter((res) =>
        res.collegeName.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchCollege(filteredData.slice(0, itemsPerPage)); // Initial data
    };

    fetchData();
  }, [searchText]);

  // this sortdata function is used to sort the data we have in the table
  const sortData = (dataToSort, selectedSortBy) => {
    return [].slice.call(dataToSort).sort((a, b) => {
      let comparison = 0;
      if (selectedSortBy === "review") {
        comparison = b.userReviewScore - a.userReviewScore; // Sort in descending order of review scores
      } else if (selectedSortBy === "ranking") {
        comparison = a.ranking - b.ranking; // Sort in ascending order of ranking
      } else if (selectedSortBy === "fees") {
        const feesA = parseInt(a.courseFees.replace(/,/g, ""), 10);
        const feesB = parseInt(b.courseFees.replace(/,/g, ""), 10);
        comparison = feesA - feesB; // Sort in ascending order of fees
      }
      return comparison;
    });
  };

  const handleSort = (selectedSortBy) => {
    setSortBy(selectedSortBy);
    console.log(selectedSortBy);
    // sort the entire dataset after changing sort criteria
    setSearchCollege(sortData(searchedCollege.slice(), selectedSortBy));
  };

  const fetchMoreData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (startIndex >= data.length) {
      setHasMore(false);
      return;
    }

    const filteredData = data.filter((res) =>
      res.collegeName.toLowerCase().includes(searchText.toLowerCase())
    );
    const newData = filteredData.slice(startIndex, endIndex);

    setSearchCollege((prevCollege) => [...prevCollege, ...newData]);
    setCurrentPage(currentPage + 1);
  };

  // from this onwards we are going to showcase the whole data so that we see the table
  return (
    <>
      <div className="flex justify-around bg-[#88bec4] py-2 items-center">
        <div className="sort-selection m-4 space-x-4">
          <label htmlFor="sort" className="font-medium text-lg">
            Sort By:
          </label>
          <select
            name="sort"
            id="sort"
            className="p-2 rounded-lg"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="fees">Fees</option>
            <option value="ranking">CD Rank</option>
            <option value="review">User Review</option>
          </select>
        </div>
        <div className="space-x-2 w-1/2 flex justify-end items-center">
          <input
            type="text"
            placeholder="Enter college name"
            className="px-8 py-2 m-2 rounded-3xl bg-white w-1/2"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>
      </div>
      <InfiniteScroll
        dataLength={searchedCollege.length}
        next={fetchMoreData}
        hasMore={hasMore}
      >
        <div className="p-5 h-screen">
          <div className="overflow-auto rounded-lg shadow hidden md:block">
            <table className="w-full">
              <thead className="bg-[#88bec4] border-b-2 border-gray-200">
                <tr>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">
                    CD Rank
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    Colleges
                  </th>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                    Course Fees
                  </th>
                  <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                    Placement
                  </th>
                  <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                    User Review
                  </th>
                  <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                    Ranking
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black bg-black">
                {searchedCollege.map((item, index) => {
                  return (
                    <tr
                      className={item.isFeatured ? "bg-[#fff2eb]" : "bg-white"}
                      key={index}
                    >
                      <>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap w-1/12">
                          <a
                            href="#"
                            className="font-bold text-blue-500 hover:underline"
                          >
                            #{item.ranking}
                          </a>
                        </td>
                        <td className="px-4 text-sm text-gray-700 whitespace-nowrap w-5/12">
                          {item.isFeatured ? (
                            <span className="bg-orange-500 flex w-fit mb-4 rounded-b-lg text-black p-2">
                              Featured
                            </span>
                          ) : null}
                          <span className="inline-flex gap-4">
                            <img src={item.image} className="h-16" />
                            <div>
                              <p className="text-lg text-blue-400">
                                {item.collegeName}
                              </p>
                              <sub>{item.location}</sub>
                            </div>
                          </span>
                          <div className="flex justify-between">
                            <button className="m-4 text-green-600">
                              <i class="fa-solid fa-arrow-right"></i> Apply Now
                            </button>
                            <button className="">
                              {" "}
                              <i className="fa-solid fa-download"></i> Download
                              Brochure
                            </button>
                            <div>
                              <input
                                type="checkbox"
                                value="Add To Compare"
                                className="m-2 p-2 mt-5"
                              />
                              <label>Add to Compare</label>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                          <a href="">
                            <div className="hover:underline pb-2">
                              <div className="text-green-700 font-semibold">
                                {" "}
                                <i class="fa-solid fa-indian-rupee-sign"></i>{" "}
                                {item.courseFees}
                              </div>
                              <div>BE/Btech</div>
                              <div>-1st Year Fees</div>
                            </div>
                            <a href="" className="text-green-600">
                              <i class="fa-solid fa-arrow-right-arrow-left"></i>{" "}
                              Compare Fees
                            </a>
                          </a>
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap w-2/12">
                          <a href="">
                            <div className="hover:underline  pb-2">
                              <div className="text-green-700 font-semibold">
                                {" "}
                                <i class="fa-solid fa-indian-rupee-sign"></i>{" "}
                                {item.averagePackage}
                              </div>
                              <div>Average Package</div>
                            </div>
                            <div className="hover:underline pb-2">
                              <div className="text-green-700 font-semibold">
                                {" "}
                                <i class="fa-solid fa-indian-rupee-sign"></i>{" "}
                                {item.highestPackage}
                              </div>
                              <div>Highest Package</div>
                            </div>
                            <a href="" className="text-green-600">
                              <i class="fa-solid fa-arrow-right-arrow-left"></i>{" "}
                              Compare Placements
                            </a>
                          </a>
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                          <div>
                            <a href="">{item.userReviewScore}</a>
                            <div className="hover:underline">
                              <div>Based on 346 User</div>
                              <div>Reviews</div>
                            </div>
                            <a
                              href=""
                              className="text-green-600 bg-yellow-200 rounded-2xl pl-2 pr-2"
                            >
                              <i class="fa-solid fa-check"></i> Best in Social
                              Life <i class="fa-solid fa-angle-down"></i>
                            </a>
                          </div>
                        </td>
                        <td className="w-1/12">
                          <div>#{item.ranking}/131 in India</div>
                        </td>
                      </>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

export default Table;
