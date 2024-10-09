import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";

export default function NavBar() {
    return(
        <>
            <Image src="/PrepSmartLogo.png" alt="PrepSmart Logo" width={210} height={140}/>
            <Button variant="outlined">Log in</Button>
        </>
    )
};