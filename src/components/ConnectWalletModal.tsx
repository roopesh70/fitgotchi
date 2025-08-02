
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { Loader2, CheckCircle, XCircle, Wallet } from "lucide-react";

type ConnectWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export default function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setError(null);
    }
  }, [isOpen]);

  const handleConnect = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install it to connect your wallet.");
      setStatus("error");
      return;
    }
    
    setStatus("connecting");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      setStatus("connected");
      setTimeout(() => {
         onClose();
         window.location.reload(); // Refresh to update header state
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      setStatus("error");
    }
  };

  const renderContent = () => {
    switch (status) {
      case "connecting":
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold mb-2">Connecting...</h2>
            <p className="text-muted-foreground">Please approve the connection in your MetaMask wallet.</p>
          </div>
        );
      case "connected":
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Wallet Connected!</h2>
            <p className="text-muted-foreground">You can now use your wallet within FitGotchi.</p>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <XCircle className="w-16 h-16 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
            <p className="text-destructive text-sm max-w-xs">{error}</p>
             <Button variant="outline" onClick={() => setStatus('idle')} className="mt-4">Try Again</Button>
          </div>
        );
      case "idle":
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
             <Wallet className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">Connect your MetaMask wallet to manage your rewards and participate in challenges.</p>
            <Button onClick={handleConnect} size="lg">
                Connect with MetaMask
            </Button>
          </div>
        );
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="sm:max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Connect your Ethereum wallet to proceed.
              </DialogDescription>
            </DialogHeader>
            <AnimatePresence mode="wait">
                 <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                 >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
