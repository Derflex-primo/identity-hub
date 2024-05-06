"use client";

import { Identity } from "@/types";
import Card from "./Card";

interface Props {
  identities: Identity[];
  loading: boolean;
  onSelectIdentity: (identity: Identity) => void 
}

const Identities: React.FC<Props> = ({ identities, onSelectIdentity, loading }) => {
  if (loading) {
    return <p>Loading identities...</p>;
  }
  return (
    <div>
      {loading ? (
        <p>Loading identities...</p>
      ) : identities.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-4 w-full  gap-2">
          {identities.map((identity, index) => (
            <Card identity={identity} key={index} tap={onSelectIdentity} />
          ))}
        </ul>
      ) : (
        <p>No identities found.</p>
      )}
    </div>
  );
};

export default Identities;
