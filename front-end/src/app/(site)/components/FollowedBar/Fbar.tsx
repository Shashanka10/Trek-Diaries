"use client"
import followStyle from "./fbar.module.css";
import Flocation from "../FollowedLocation/Flocation";
import {ImLocation2} from "react-icons/im";
import { Location } from "../../layout";

export default function Fbar({ locations }: { locations: Array<Location> }) {
    return(
        <div className={followStyle.followbar}>
            <h1>Followed Locations <ImLocation2 className={followStyle.locicon} /></h1>
            <div className={followStyle.followLocation}>
            {
                locations.map((location) => (
                    <Flocation
                        key={ location._id }
                        id={ location._id }
                        address={ location.address }
                    />
                ))
            }
            </div>
        </div>
    );
}