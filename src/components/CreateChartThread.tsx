import { useCallback, useEffect, useState } from "react";
import { Composer } from "@liveblocks/react-ui";
import { useCreateThread, useSelf } from "@liveblocks/react/suspense";
import styles from "./CreateChartThread.module.css";
import avatarStyles from "./CommentsCanvas.module.css";

export function CreateChartThread({
  rect,
  chartId,
}: {
  rect: DOMRect;
  chartId: string;
}) {
  // Get create thread function and the current user
  const createThread = useCreateThread();
  const creator = useSelf((me) => me.info);

  const [state, setState] = useState<"initial" | "placing" | "placed">(
    "initial"
  );
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const reset = useCallback(() => {
    setState("initial");
    setCoords({ x: 0, y: 0 });
  }, []);

  return (
    <>
      {/* Allows you to place composers */}
      <div className={styles.toolbar}>
        <button
          className={styles.button}
          onClick={() => setState("placing")}
          style={{ cursor: state === "placing" ? "none" : undefined }}
        >
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2zM12 7v6M9 10h6" />
          </svg>
        </button>
      </div>

      {/* Overlay that lets you click and cancel placing */}
      <div
        className={styles.cancelPlacing}
        onClick={reset}
        onContextMenu={(e) => {
          e.preventDefault();
          reset();
        }}
        data-enabled={state !== "initial" ? true : undefined}
      />

      {/* The visible cursor when you're placing */}
      {state === "placing" ? (
        <div
          className={styles.newThreadClick}
          onClick={(e) => {
            // On click, get coords and place down composer
            const avatarOffset = 42;
            setCoords({
              x: e.pageX + avatarOffset - rect.left,
              y: e.pageY - rect.top,
            });
            setState("placed");
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            reset();
          }}
        >
          <NewThreadCursor rect={rect} />
        </div>
      ) : null}

      {/* When cursor placed, show a composer on the canvas */}
      {state === "placed" ? (
        <>
          <div
            className={styles.composerWrapper}
            style={{ transform: `translate(${coords.x}px, ${coords.y}px)` }}
          >
            <div className={avatarStyles.avatar} style={{ cursor: "default" }}>
              {creator ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  width="28px"
                  height="28px"
                  draggable={false}
                />
              ) : (
                <div />
              )}
            </div>
            <Composer
              className="composer"
              onComposerSubmit={({ body }, e) => {
                e.preventDefault();
                e.stopPropagation();
                setState("initial");

                // Percentage across current rect
                const { x, y } = {
                  x: coords.x / rect.width,
                  y: coords.y / rect.height,
                };

                // Create a new thread with the coords as metadata
                createThread({
                  body,
                  metadata: { chartId, x, y },
                });
              }}
            />
          </div>
        </>
      ) : null}
    </>
  );
}

// Render the new thread component over the current user's cursor
function NewThreadCursor({ rect }: { rect: DOMRect }) {
  const [coords, setCoords] = useState({
    x: -10000,
    y: -10000,
  });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setCoords({
        x: e.pageX - rect.left,
        y: e.pageY - rect.top,
      });
    };

    document.addEventListener("mousemove", updatePosition, false);
    document.addEventListener("mouseenter", updatePosition, false);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", updatePosition);
    };
  }, []);

  return (
    <div
      className={styles.newThreadCursor}
      style={{
        transform: `translate(${coords.x}px, ${coords.y}px)`,
        zIndex: 99999999999,
      }}
    />
  );
}
