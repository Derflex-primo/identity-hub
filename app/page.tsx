"use client";

import Image from "next/image";
import Form from "./components/Form";
import { useAuth } from "./context/Auth";
import date from "./utils/date";
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Identities from "./components/Identities";
import { Identity } from "@/types";

export default function Home() {
  const { user, handleSignOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);

  const handleSelectIdentity = (identity: Identity) => {
    setSelectedIdentity(identity);
  };

  useEffect(() => {
    if (user) {
      const fetchIdentities = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const identitiesRef = collection(userDocRef, "identities");
        setLoading(true);
        try {
          const querySnapshot = await getDocs(identitiesRef);
          const identitiesList: Identity[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            fullName: doc.data().fullName || "No Name",
            gender: doc.data().gender || "Unknown",
            age: doc.data().age || "Unknown",
            connection: doc.data().connection || "Unknown",
            address: doc.data().address || "No Address",
            socialLinks: doc.data().socialLinks || "None",
            occupation: doc.data().occupation || "Unemployed",
            phone: doc.data().phone || "No Phone",
          }));
          setIdentities(identitiesList);
        } catch (error) {
          console.error("Error fetching identities:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchIdentities();
    }else {
      setLoading(false);
      setIdentities([]);
    }
  }, [user]);

  useEffect(() => {
    if (selectedIdentity) {
      setOpenModal(true);
    }
  }, [selectedIdentity]);

  useEffect(() => {
    if (user) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [user]);

  const refreshIdentities = async () => {
    if (user) {
      setLoading(true);
      const userDocRef = doc(db, "users", user.uid);
      const identitiesRef = collection(userDocRef, "identities");
      try {
        const querySnapshot = await getDocs(identitiesRef);
        const newIdentitiesList: any[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          fullName: doc.data().fullName || "No Name",
          gender: doc.data().gender || "Unknown",
          age: doc.data().age ? Number(doc.data().age) : "Unknown",
          connection: doc.data().connection || "Unknown",
          address: doc.data().address || "No Address",
          socialLinks: doc.data().socialLinks || "None",
          occupation: doc.data().occupation || "Unemployed",
          phone: doc.data().phone || "No Phone",
        }));
        setIdentities(newIdentitiesList);
      } catch (error) {
        console.error("Error fetching identities:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshIdentities();
  }, [user]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        Loading...
      </div>
    );
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between m-2 lg:p-24`}
    >
      <div className="flex flex-col h-auto justify-center w-full items-center">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-medium text-sm lg:flex">
          <div className="fixed justify-between items-center left-0 top-0 flex w-full border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            {user ? (
              <div className="flex justify-between items-center w-full px-4">
                <div className="flex space-x-3">
                  <Image
                    src={user.photoURL || "google.png"}
                    alt={`${user.displayName} image from google`}
                    className="rounded-full"
                    width={24}
                    height={24}
                  />
                  <span>{user.displayName}</span>
                </div>
                <div className="flex lg:hidden">
                  <span onClick={handleSignOut} className="font-mono text-sm">Log out</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full">
                Identity&nbsp;
                <code className="font-mono font-bold">wall</code>
              </div>
            )}
          </div>
          <div className="fixed bottom-0 left-0 flex w-full items-center justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
            <div className="w-full">
              {user ? (
                <>
                  <div className="flex lg:hidden w-full px-2 pb-2">
                    <Form
                      identity={selectedIdentity}
                      open={openModal}
                      setOpen={setOpenModal}
                      refreshIdentities={refreshIdentities}
                    />
                  </div>
                  <div onClick={handleSignOut} className="hidden lg:flex cursor-pointer text-sm font-semibold mr-3">Log out</div>
                </>
              ) : (
                <div className="pointer-events-none flex place-items-center justify-center  font-mono text-xs md:text-sm gap-2 p-8 lg:pointer-events-auto lg:p-0 ">
                  Created by{" "}
                  <a
                    className="text-lime-400"
                    href={`${user ? " " : "https://github.com/Derflex-primo"}`}
                    target="_blank"
                    rel="noopener noreferrer "
                  >
                    Derflex-primo
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        {identities.length > 0 ? (
          <section className=" md:flex md:justify-start md:items-start w-full max-w-5xl my-[74px] lg:mt-8 lg:my-0">
            <Identities
              identities={identities}
              loading={loading}
              onSelectIdentity={handleSelectIdentity}
            />
          </section>
        ) : null}
      </div>
      {user ? (
        <>
          {identities.length === 0 && (
            <div>
              <span className="font-mono text-2xl text-center flex justify-center h-[50vh] lg:h-full">
                Hello {user.displayName} ^^
              </span>
            </div>
          )}
        </>
      ) : (
        <div>
          <h1 className="font-mono text-2xl text-center">
            Save & Secure identity
          </h1>
          <p className=" leading-relaxed text-xs text-center mt-4 text-stone-200">
            Disclamer 2024: All idendity saved from this web app is secured and
            protected <br className="hidden md:flex" />
            in a private storage 🔒
          </p>
        </div>
      )}
      <div
        className={` ${
          user ? "hidden lg:flex" : "flex"
        } w-full max-w-5xl mb-20 lg:mb-0 lg:mt-6`}
      >
        <Form
          identity={selectedIdentity}
          open={openModal}
          setOpen={setOpenModal}
          refreshIdentities={refreshIdentities}
        />
      </div>
    </main>
  );
}
