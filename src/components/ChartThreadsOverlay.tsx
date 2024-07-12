import { Thread } from "@liveblocks/react-ui";
import { ThreadData } from "@liveblocks/client";
import { useUser } from "@liveblocks/react/suspense";
import {
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./CommentsCanvas.module.css";
import { CreateChartThread } from "./CreateChartThread";

export function ChartThreadsOverlay({
  chartId,
  threads,
}: {
  chartId: string;
  threads: ThreadData[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rect = useBoundingRect(ref);

  return (
    <div className={`${styles.wrapper} lb-root`} ref={ref}>
      {threads.map((thread) => (
        <ChartThread key={thread.id} thread={thread} />
      ))}
      {rect ? <CreateChartThread rect={rect} chartId={chartId} /> : null}
    </div>
  );
}

function ChartThread({ thread }: { thread: ThreadData }) {
  // Open threads that have just been created
  const startOpen = useMemo(() => {
    return Number(new Date()) - Number(new Date(thread.createdAt)) <= 100;
  }, [thread]);

  const [open, setOpen] = useState(startOpen);

  // Get the creator of the thread
  const { user: creator } = useUser(thread.comments[0].userId);

  return (
    <div
      className={styles.chartThread}
      style={{
        position: "absolute",
        left: `${thread.metadata.x * 100}%`,
        top: `${thread.metadata.y * 100}%`,
      }}
    >
      <div className={styles.avatar} onClick={() => setOpen(!open)}>
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
      {open ? <Thread thread={thread} className="thread" /> : null}
    </div>
  );
}

// Get coords of an element
export function useBoundingRect(ref: MutableRefObject<HTMLElement | null>) {
  let [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    let target = ref.current;
    if (target == null) return;
    setRect(target.getBoundingClientRect());
    let observer = new ResizeObserver(() => {
      // ResizeObserver provides clientRect as a part of observed entries
      // but it's not in sync with result of getBoundingClientRect()
      // which causes unnecessary state update (and so re-renders)
      let newRect = target.getBoundingClientRect();
      // getBoundingClientRect() always returns a new instance
      // DOMRect doesn't have own properties so it needs special shallowEqual implementation
      setRect((rect) => (equals(rect, newRect) ? rect : newRect));
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return rect;
}

function equals(a: any, b: any) {
  if (a == null || b == null) return false;
  for (let key in a) if (a[key] !== b[key]) return false;
  return true;
}
