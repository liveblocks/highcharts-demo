"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { RoomProvider } from "@liveblocks/react/suspense";
import { Loading } from "../components/Loading";
import { ClientSideSuspense } from "@liveblocks/react";
import { ErrorBoundary } from "react-error-boundary";
import { CollaborativeApp } from "../components/CollaborativeApp";
import { Header } from "../components/Header";

export default function Page() {
  const roomId = useExampleRoomId("liveblocks:demo:highcharts");

  return (
    <RoomProvider id={roomId}>
      <ErrorBoundary
        fallback={<div className="error">There was an error.</div>}
      >
        <ClientSideSuspense fallback={<Loading />}>
          {() => (
            <>
              <Header />
              <CollaborativeApp />
            </>
          )}
        </ClientSideSuspense>
      </ErrorBoundary>
    </RoomProvider>
  );
}

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useExampleRoomId(roomId: string) {
  const params = useSearchParams();
  const exampleId = params?.get("exampleId");

  const exampleRoomId = useMemo(() => {
    return exampleId ? `${roomId}-${exampleId}` : roomId;
  }, [roomId, exampleId]);

  return exampleRoomId;
}
