import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {usePuterStore} from "~/lib/puter";

export const meta = () => ([
    {title: 'ResuChekr | Auth'},
    {name: 'description', content : 'Log In'},

])

const Auth = () => {
    //getting loading state from the puter store
    const {isLoading, auth} = usePuterStore();
    //when a user is trying to access a secure route
    const location = useLocation();
    //the page that the user wanted to visit next
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();


    useEffect(() => {
        if(auth.isAuthenticated)navigate(next)
    }, [auth.isAuthenticated, next]);
  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover flex items-center justify-center">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1>Welcome</h1>
                    <h2>Log In to continue</h2>
                </div>
                <div>
            {isLoading ? (
                <button className="auth-button animate-pulse">
                    <p>
                        Signing You In 
                    </p>
                </button>
            ) : (
                <>
                {auth.isAuthenticated ? (
                    <button className="auth-button" onClick={auth.signOut}>
                      <p>Log Out</p>  
                    </button>
                ) : (
                    <button className="auth-button" onClick={auth.signIn}>
                     <p>Sign In</p>  
                    </button>
                )}
                </>
            )}
                </div>
            </section>
        </div>
   </main>
  )
}

export default Auth