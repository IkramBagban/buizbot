import React from "react";
import { checkAuthentication } from "../actions/authAction";
import { redirect } from "next/navigation";
import Landing from "../components/Landing";

export default async function Home() {
  const isAuthenticated = await checkAuthentication();

  if (isAuthenticated) {
    redirect("/chats");
  } 
  
  return <Landing />
}
