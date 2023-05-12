"use client"
import React, { useState } from "react";
import navStyles from "./navbar.module.css";
import SearchInput from "../SearchInput/SearchInput";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/login" });
    router.push(data.url);
  };

  return (
    <div className={navStyles.wrapper}>
      <div className={navStyles.Bar}>
        <div className={navStyles.BarLeft}>
          <h1 onClick={()=>{router.push("/")}}>Logo</h1>
        </div>
        <div className={navStyles.BarCenter}>
          <SearchInput />
        </div>
        {/* <div className={navStyles.dp} ref={dropRef}> */}
        <div 
        className={navStyles.dp} 
        onClick={ () => setOpen(open => !open) }
        >
          <Image
            src="/ncpr.jpg"
            alt="profilePicture"
            width={50}
            height={50}
            style={{ objectFit: "fill"}}
          />
        </div>
        {open && (
            <div className={navStyles.drop}>
              <ul>
                <li className={navStyles.dropdownItem}>
                  <CgProfile />
                  <a>My profile</a>
                </li>
                <li className={navStyles.dropdownItem} onClick={ handleSignOut }>
                  <FiLogOut/>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
