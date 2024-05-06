"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Auth";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import modal_style from "../utils/modal";
import MenuItem from "@mui/material/MenuItem";
import gender from "../utils/gender";
import connections from "../utils/conection";
import { Button } from "@mui/material";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Identity } from "@/types";

interface Props {
  identity: Identity | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  refreshIdentities: () => void;
}

const Form: React.FC<Props> = ({
  identity,
  open,
  setOpen,
  refreshIdentities,
}) => {
  const { user, handleSignInWithGoogle } = useAuth();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedConnection, setSelectedConnection] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phone, setPhone] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = async () => {
    if (user) {
      const identitiesRef = collection(db, "users", user.uid, "identities");
      let identityDocRef;

      if (identity && identity.id) {
        identityDocRef = doc(db, "users", user.uid, "identities", identity.id);
      } else {
        identityDocRef = doc(identitiesRef);
      }

      const payload = {
        fullName,
        gender: selectedGender,
        age: Number(age),
        connection: selectedConnection,
        address,
        socialLinks,
        occupation,
        phone: Number(phone),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        await setDoc(identityDocRef, payload, { merge: true });
        alert("Identity saved successfully!");
        cleanUp();
        handleClose();
        refreshIdentities(); 
      } catch (error) {
        console.error("Error writing document: ", error);
        alert("Failed to save identity. Please try again.");
      }
    } else {
      console.error("No user logged in!");
      alert("You must be logged in to save data.");
    }
  };

  const handleDelete = async () => {
    if (user && identity) {
      const identityDocRef = doc(
        db,
        "users",
        user.uid,
        "identities",
        identity.id
      );
      try {
        await deleteDoc(identityDocRef);
        alert("Identity deleted successfully!");
        cleanUp();
        handleClose();
        refreshIdentities(); 
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete identity. Please try again.");
      }
    } else {
      console.error("No user logged in!");
      alert("You must be logged in to delete data.");
    }
  };

  useEffect(() => {
    if (identity) {
      setSelectedGender(identity.gender || "");
      setSelectedConnection(identity.connection || "");
      setFullName(identity.fullName || "");
      setAge(identity.age.toString() || "");
      setAddress(identity.address || "");
      setSocialLinks(identity.socialLinks || "");
      setOccupation(identity.occupation || "");
      setPhone(identity.phone.toString() || "");
    }
  }, [identity]);

  const cleanUp = () => {
    setSelectedGender("");
    setSelectedConnection("");
    setFullName("");
    setAge("");
    setAddress("");
    setSocialLinks("");
    setOccupation("");
    setPhone("");
  };

  return (
    <React.Fragment>
      <div
        onClick={user ? handleOpen : handleSignInWithGoogle}
        className={`flex justify-center bg-black w-full mt-2  text-stone-100 border border-gray-300 dark:border-neutral-800 p-3 rounded-xl text-base text-center font-semibold cursor-pointer transition-colors ease-in-out`}
      >
        {user ? (
          <span onClick={handleOpen}>Click to add</span>
        ) : (
          <>
            Log in with&nbsp;&nbsp;&nbsp;
            <Image
              src={"/google.png"}
              alt="Google image"
              width={24}
              height={24}
            />
          </>
        )}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          overflowY: "scroll",
          margin: "0px 4px 0px 4px",
        }}
      >
        <Box sx={modal_style}>
          <div>
            <h2 className="text-stone-600 font-semibold mb-4 text-xs">
              Confidential
            </h2>
          </div>
          <div className="grid grid-rows-1 md:grid-cols-2 space-y-4 md:space-y-0 gap-4">
            <div className="flex flex-col gap-4">
              <TextField
                id="outlined-basic"
                label="Who"
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                helperText={!identity ? "*Enter full name" : ""}
              />
              <TextField
                id="outlined-basic"
                label="Gender"
                variant="outlined"
                onChange={(e) => setSelectedGender(e.target.value)}
                value={selectedGender}
                select
                sx={{
                  ".MuiInputBase-input": {
                    color:
                      selectedGender === "Male"
                        ? "#5b8fe3"
                        : selectedGender === "Female"
                        ? "#e35b74"
                        : "inherit",
                  },
                }}
              >
                {gender.map((option) => (
                  <MenuItem
                    key={option.gender}
                    value={option.gender}
                    sx={{
                      color: option.gender === "Male" ? "#5b8fe3" : "#e35b74",
                    }}
                  >
                    {option.gender}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-basic"
                label="Age"
                variant="outlined"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Connection"
                variant="outlined"
                select
                value={selectedConnection}
                onChange={(e) => setSelectedConnection(e.target.value)}
              >
                {connections.map((option) => (
                  <MenuItem key={option.type} value={option.type}>
                    {option.type}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="flex flex-col gap-4">
              <TextField
                id="outlined-basic"
                label="Address"
                type="src"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                helperText={
                  !identity
                    ? "*Paste google map link here for accurate address"
                    : ""
                }
              />
              <TextField
                id="outlined-basic"
                label="Social media links"
                variant="outlined"
                type="src"
                value={socialLinks}
                onChange={(e) => setSocialLinks(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Occupation"
                variant="outlined"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                type="text"
              />
              <TextField
                id="outlined-basic"
                label="Tel/phone #"
                variant="outlined"
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              sx={{
                textTransform: "capitalize",
              }}
            >
              Delete
            </Button>
            <div className="flex space-x-2 md:space-x-4">
              <Button
                onClick={handleClose}
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: "capitalize",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: "capitalize",
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default Form;
