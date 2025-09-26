"use client"
import React from 'react'
import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Product } from "@prisma/client";
import Link from "next/link";
import { useRouter } from 'next/router';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [value, delay]);
  return debouncedValue;
}

function SearchForm({mobile}: {mobile?: boolean}) {

    const [searchTerm , setSearchTerm] = useState("");
    const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
const router = useRouter();

useEffect(() => {
    if(debouncedSearchTerm) {
       const fetchProduct = async () => {
           
       }
       fetchProduct();
    }
}, [debouncedSearchTerm]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
}

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedProducts([]);
    router.push(`/search?query=${searchTerm}`); }
    
    const handleLinkClick = () => {}

  return (
    <div>
      return (
    <div className="relative" ref={searchContainerRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Cari produk..."
          className={`w-full rounded-md border border-gray-300 px-4 py-2 ${
            !mobile && "pl-10"
          } text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        />
        {!mobile && (
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        )}
      </form>
      {searchedProducts.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border-2 border-t-0 pt-2 rounded-md">
          {searchedProducts.slice(0, 5).map((product: Product, index) => (
            <li key={index} className="px-2 py-1 w-full border-b">
              <Link
                href={`/product/${product.id}`}
                className="flex flex-col"
                onClick={handleLinkClick}
              >
                <span className="truncate w-40 md:w-8/10 font-bold">
                  {product.name}
                </span>
                <span className="truncate w-40 md:w-8/10 text-sm text-gray-500">
                  {product.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
    </div>
  )
}

export default SearchForm
