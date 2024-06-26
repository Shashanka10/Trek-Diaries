"use client";
import Image from "next/image";
import Star from "./star";
import FinalRating from "./finalRating";
import { UserCircle } from "lucide-react";
import handleRegisteredTime from "@/lib/utilities/handleRegisteredTime";
import { useRouter } from "next/navigation";
import Comment from "./Comments";

import dynamic from "next/dynamic";
const ButtonLike = dynamic(
  () => import("@/app/(site)/components/viewPost/ButtonLike"),
  { ssr: false }
);
const AddComment = dynamic(
  () => import("./AddComment"),
  { ssr: false }
);

export default function Post({
  userId,
  address,
  locationId,
  name,
  likes,
  registeredTime,
  description,
  pictureURL,
  postID,
  rating,
}: {
  userId: string | undefined;
  address: string;
  name: string;
  likes: number;
  locationId: string;
  registeredTime: string;
  description: string;
  pictureURL: string;
  postID: string;
  rating: {
    TrailCondition: number;
    Weather: number;
    Accessibility: number;
    overallScore: number;
  };
}) {
  const router = useRouter();

  const handleRouting = () => router.push(`/location/${locationId}`);

  return (
    <div className="flex-row items-center justify-between rounded-2xl m-2 p-4 gap-10 shadow-md dark:bg-black bg-slate-200">
      <div className="flex-row space-y-5 mt-3">
        <div className="flex ml-5 gap-3">
          <div className="flex justify-center items-center">
            <UserCircle className="w-12 h-12" />
          </div>
          <div className="flex-row">
            <h3 className="text-lg">{name}</h3>
            <h4 className="opacity-50 cursor-pointer hover:text-blue-500 text-sm" onClick={handleRouting}>
              {address}
            </h4>
            <h5 className="text-xs opacity-50 ">
              {handleRegisteredTime(registeredTime)}
            </h5>
          </div>
        </div>
        <div className="relative w-full h-60 ">
          <Image
            className="object-contain rounded-2xl"
            alt="Error: Image could not be loaded."
            fill={true}
            src={pictureURL}
          />
        </div>
      </div>
      <div className="flex-row space-y-3">
        <div className="flex justify-between p-6 mt-4 m-5 gap-4 rounded-xl shadow-md border-2 bg-gray-200 dark:bg-transparent">
          <div className="box-border space-y-6">
            <p className="text-sm text-left overflow-y-scroll">{description}</p>
            {userId && (
              <div className="flex gap-3 cursor-pointer">
                <ButtonLike likes={likes} postId={postID} userId={userId} />
              </div>
            )}
          </div>
          <div className="flex gap-16">
            <div className="flex-row space-y-1">
              <div className="TrialCondition">
                <h4>
                  TrialCondition: <Star stars={rating.TrailCondition} />
                </h4>
              </div>
              <div className="Weather">
                <h4>
                  Weather: <Star stars={rating.Weather} />
                </h4>
              </div>
              <div className="Accessibility">
                <h4>
                  Accessibility: <Star stars={rating.Accessibility} />
                </h4>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <FinalRating stars={rating.overallScore} />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <AddComment postId={postID} userId={userId}/>
        </div>
        <div className="flex justify-center w-full">
          <Comment postId={postID}/>
        </div>
      </div>
    </div>
    
  );
}
