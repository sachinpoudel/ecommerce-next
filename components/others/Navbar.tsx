"use client"
import { prisma } from "@/lib/prisma-client";

import { getSession } from "@/lib/session";
import { includes } from "zod";
import { id } from "zod/v4/locales";
import { cn } from "@/lib/utils";
import { CircleUser, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
// import Cart from "../cart/cart";
// import CartSheet from "../cart/cart-sheet";
import SearchForm from "./SearchForm";

export async function Navbar ({className}: {className?: string}) {


    const session = await getSession();
    let user;
    let cartItems =null;

    if(session){
        const dataUserAndCart = await prisma.user.findUnique({
            where:{
                id: session.id as string
            }

            ,select:{
                id:true,
                name:true,
                email:true,
                cartItems: {
                    include:{
                        product: {
                            select:{
                                id:true,
                                name:true,
                                description: true,
                                price: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            }
        })
        user = dataUserAndCart;
        cartItems = dataUserAndCart?.cartItems; 
    }

    return (
         <header className={cn("bg-white shadow-sm sticky top-0 z-50", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 md:hidden" />
            <Link href="/" className="text-xl font-bold text-primary">
              Eco Shop
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 mx-6 ">
            <div className="w-full relative">
              <SearchForm mobile={false}></SearchForm>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* <CartSheet cartItems={cartItems} user={user} /> */}
            {/* <Sheet>
              <SheetTrigger asChild>
              <button className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-700 cursor-pointer" />
              {cartItems?.length != 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">
                {cartItems?.length}
                </span>
                )}
                </button>
                </SheetTrigger>
                <SheetContent className="w-140">
                <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
                <SheetDescription>Your Cart</SheetDescription>
                {user == null ? (
                  <div className="w-full flex flex-col justify-center gap-2">
                  <Image
                  width={100}
                  height={100}
                  src={"/cart.png"}
                  alt={"Cart Image"}
                  unoptimized={true}
                  className="object-cover w-full"
                  ></Image>
                  <span className="text-center font-light gap-2">
                  <span className="text-2xl font-bold">
                  Oops, your cart is empty!
                  </span>
                  <br></br>
                  Find your favorite items and start Browse.
                  </span>
                  </div>
                  ) : (
                    <>
                    <Cart userId={user.id}></Cart>
                    <Button className="mt-4">Bayar</Button>
                    </>
                    )}
                    </SheetHeader>
                    </SheetContent>
                    </Sheet> */}
            {user == null && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-primary border border-primary rounded-full px-3 py-1 hover:bg-primary hover:text-white transition"
                >
                  Daftar
                </Link>
              </>
            )}
            {user && (
              <Link
                href="/dashboard"
                className="flex gap-2 px-2 py-1 rounded-xl"
              >
                <span className="text-sm font-medium text-gray-700 hover:text-primary">
                  <CircleUser className="h-5 w-5 text-gray-700"></CircleUser>
                </span>
                <span className="text-sm font-medium text-gray-700 hover:text-primary">
                  {user.name}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-2 md:hidden pb-4">
          {/* <input
            type="text"
            placeholder="Cari produk..."
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            onChange={handleOnChange}
          /> */}
          <SearchForm mobile={true}></SearchForm>
        </div>
      </div>
    </header>
    )
}