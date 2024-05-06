import { Identity } from "@/types";
import React from "react";

interface Props {
  identity: Identity;
  tap: (identity: Identity) => void;
}

const Card: React.FC<Props> = ({ identity, tap }) => {
  return (
    <div className="block text-stone-200 border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit  rounded-xl border bg-gray-200  text-sm  w-auto h-auto">
      <div
        onClick={() => tap(identity)}
        className="whitespace-nowrap cursor-pointer overflow-hidden truncate flex justify-start items-center space-x-3 border-b dark:border-neutral-800 p-4"
      >
        <span
          className={`${
            identity.gender === "Male" ? "bg-sky-500" : "bg-rose-500"
          } rounded-full w-4 h-4`}
        ></span>
        <h2 className="whitespace-nowrap overflow-hidden text-overflow-ellipsis">
          {identity.fullName}
        </h2>
      </div>
      <div
        onClick={() => tap(identity)}
        className="flex flex-col gap-3 text-xs p-4 cursor-pointer"
      >
        <div className=" whitespace-nowrap overflow-hidden truncate">
          <strong className="text-stone-500">Connection:&nbsp;&nbsp;</strong>
          {identity.connection}
        </div>
        <div className=" whitespace-nowrap overflow-hidden truncate">
          <strong className="text-stone-500">Gender:&nbsp;&nbsp;</strong>
          {identity.gender}
        </div>
        <div className=" whitespace-nowrap overflow-hidden truncate">
          <strong className="text-stone-500">Occupation:&nbsp;&nbsp;</strong>
          {identity.occupation}
        </div>
        <div className=" whitespace-nowrap overflow-hidden truncate">
          <strong className="text-stone-500">Tel/Phone #:&nbsp;&nbsp;</strong>
          {identity.phone}
        </div>
        <div className=" whitespace-nowrap overflow-hidden truncate">
          <strong className="text-stone-500">Links:&nbsp;&nbsp;</strong>
          {identity.socialLinks}
        </div>
        <div className=" whitespace-nowrap overflow-hidden truncate">
          <strong className="text-stone-500">Address:&nbsp;&nbsp;</strong>
          {identity.address}
        </div>
      </div>
      <div className="flex justify-start items-center space-x-3 border-t dark:border-neutral-800 p-4 text-xs">

      </div>
    </div>
  );
};

export default Card;
