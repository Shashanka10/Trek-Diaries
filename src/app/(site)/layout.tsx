import NavBar from "./components/NavBar/NavBar";
import Fbar from "./components/FollowedLocation/Fbar";
import React from "react";
import FollowedLocationProvider from "./components/FollowedLocation/FollowedLocationProvider";
// import PlacetoVisit from "./components/PlacetoVisit/PlaceVisit";

export interface Location {
  _id: string;
  address: string;
}

// const getFollowedLocations = async (email: string) => {
//   const res = await fetch(
//     `https://ap-south-1.aws.data.mongodb-api.com/app/trek-diaries-bmymy/endpoint/getFollowedLocations?email=${email}`,
//     { cache: "no-store" }
//   );
//   return res.json();
// };

// function useFetchLocations(
//   session: SessionContextValue
// ): [locations: Location[], updateLocations: Function] {
//   const [locations, setLocations] = useState<Array<Location>>([]);

//   const updateLocations = async () => {
//     const followedLocations = await getFollowedLocations(
//       session?.data?.user?.email as string
//     );
//     setLocations(followedLocations);
//   };

//   useEffect(() => {
//     if (session.status === "authenticated" && session.data.user) {
//       const getData = async () => {
//         await updateLocations();
//       };
//       getData();
//     }
//   }, [session]);

//   return [locations, updateLocations];
// }

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <FollowedLocationProvider>
          <div className="navbar">
            <NavBar />
          </div>
          <div className="fbar">
            <Fbar />
          </div>
          <div className="rbar">{/* <PlacetoVisit /> */}</div>
          {/* <FLocationContext.Provider value={locations}>
          <ReloadFLocationContext.Provider value={updateLocations}> */}
          {children}
          {/* </ReloadFLocationContext.Provider>
        </FLocationContext.Provider> */}
        </FollowedLocationProvider>
      </main>
    </>
  );
}
