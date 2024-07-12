import Highcharts from "highcharts";
import HighchartsReact, {
  HighchartsReactProps,
} from "highcharts-react-official";
import styles from "./Chart.module.css";
import { ChartThreadsOverlay } from "./ChartThreadsOverlay";
import { useThreads } from "@liveblocks/react/suspense";
import { Thread } from "@liveblocks/react-ui";

export function Chart({
  id,
  options,
  showThreadList,
}: {
  id: string;
  options: HighchartsReactProps;
  showThreadList: boolean;
}) {
  const { threads } = useThreads({ query: { metadata: { chartId: id } } });

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chart}>
        <HighchartsReact highcharts={Highcharts} options={options} />

        {/* Overlay comments + add comment button */}
        <ChartThreadsOverlay chartId={id} threads={threads} />
      </div>

      {/* Sidebar comments */}
      {showThreadList ? (
        <div className={styles.threads}>
          {threads.length ? (
            threads.map((thread) => <Thread thread={thread} />)
          ) : (
            <div className={styles.noComments}>← Add a comment</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
