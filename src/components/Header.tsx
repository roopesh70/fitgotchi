
"use client";

import { Button } from "@/components/ui/button";
import { Flame, CircleDollarSign, LogIn, Wallet, PawPrint, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ethers } from "ethers";
import { cn } from "@/lib/utils";

type HeaderProps = {
  streak: number;
  coins: number;
  onConnectWallet: () => void;
};

type WalletState = {
  address: string;
  balance: string;
} | null;


const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
};


export default function Header({ streak, coins, onConnectWallet }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletState>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const connectWallet = async () => {
     if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setWallet({
          address: address,
          balance: ethers.formatEther(balance),
        });
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    }
  }

  useEffect(() => {
    if(wallet) {
      onConnectWallet();
    }
  }, [wallet, onConnectWallet])

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold font-headline text-primary">
          Fitgotchi
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Flame className="text-orange-500" />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <CircleDollarSign className="text-green-500" />
            <span>{coins}</span>
          </div>
           {wallet && (
             <div className="hidden md:flex items-center gap-2 text-xs bg-secondary px-2 py-1 rounded-md">
                <span className="font-mono truncate w-24" title={wallet.address}>{wallet.address}</span>
                <span className="font-semibold">{parseFloat(wallet.balance).toFixed(4)} ETH</span>
             </div>
           )}

          <AnimatePresence mode="wait">
           {wallet ? (
             <motion.div
                key="wallet-connected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex"
             >
                <Button variant="outline" size="sm" className="bg-green-500/20 border-green-500 text-green-700 hover:bg-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet Connected
                </Button>
            </motion.div>
           ) : (
             <motion.div
                key="connect-wallet"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex"
             >
                <Button variant="outline" size="sm" onClick={onConnectWallet}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                </Button>
            </motion.div>
           )}
          </AnimatePresence>
          
          <ClientOnly>
            <div className="w-[180px] h-9 flex items-center justify-end">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center w-full"
                  >
                    <PawPrint className="animate-bounce h-6 w-6 text-primary" />
                  </motion.div>
                ) : user ? (
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Avatar className="cursor-pointer h-9 w-9">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                      </PopoverTrigger>
                      <PopoverContent className="w-40">
                         <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start">
                           <LogOut className="mr-2 h-4 w-4" />
                           Sign Out
                         </Button>
                      </PopoverContent>
                    </Popover>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button onClick={handleSignIn} variant="default" size="sm" className="hidden md:flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.02,35.622,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                      Sign in with Google
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ClientOnly>

        </div>
      </div>
    </header>
  );
}
