"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <nav className='flex-between w-full mb-16 pt-3' style={{ zIndex: "999" }}>
      <Link href='/' className='flex gap-2 flex-center'>
        <Image
          src='/assets/images/logo.png'
          alt='logo'
          width={30}
          height={30}
          className='object-contain'
        />
        <p className='logo_text'>BLOGIT</p>
      </Link>

      {/* Desktop Navigation */}
      <div className='sm:flex hidden' style={{ zIndex: "999" }}>
        {session?.user ? (
          <div className='flex gap-3 md:gap-5'>
            <Link href='/discover' className='black_btn'>
              Discover
            </Link>
            <Link href='/create-prompt' className='black_btn'>
              Create Post
            </Link>
            <div className='relative'>
              <img
                src={session?.user?.image || "/assets/images/default-profile.png"}
                className='rounded-full cursor-pointer'
                alt='profile'
                width="30px"
                height="30px"
                onClick={() => setToggleDropdown(!toggleDropdown)}
              />
              {toggleDropdown && (
                <div className='dropdown'>
                  <Link href='/profile' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                    My Profile
                  </Link>
                  <Link href='/settings' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                    Settings
                  </Link>
                  <button
                    type='button'
                    onClick={() => {
                      setToggleDropdown(false);
                      signOut();
                    }}
                    className='mt-3 w-full black_btn'
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>{providers && (
            <>
              <Link href='/discover' className='black_btn mx-3'>
                Discover
              </Link>
              <Link href='/signin' className='black_btn mx-3'>
                Signin
              </Link>
            </>
          )}</>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative' style={{ zIndex: "999" }}>
        {session?.user ? (
          <div className='flex'>
            <img
              src={session?.user?.image || "/assets/images/default-profile.png"}
              className='rounded-full cursor-pointer'
              alt='profile'
              onClick={() => setToggleDropdown(!toggleDropdown)}
              width="30px"
              height="30px"
            />

            {toggleDropdown && (
              <div className='dropdown'>
                <Link href='/profile' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                  My Profile
                </Link>
                <Link href='/settings' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                  Settings
                </Link>
                <Link href='/discover' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                  Discover
                </Link>
                <Link href='/create-prompt' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                  Create Prompt
                </Link>
                <button
                  type='button'
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className='mt-5 w-full black_btn'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>{providers && (
            <div
              style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end" }}
            >
              <Link href='/discover' className='black_btn my-1'>
                Discover
              </Link>
              <Link href='/signin' className='black_btn mx-3'>
                Signin
              </Link>
            </div>
          )}</>
        )}
      </div>
    </nav>
  );
};

export default Nav;
