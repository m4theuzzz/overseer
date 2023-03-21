import React from 'react'
import * as V from "victory";

const Graph = ({ xLabel, yLabel, data, xField, yField, y2Field }) => {
  return (
    <div style={{ marginLeft: 12, width: "100%" }} >
      <V.VictoryChart domainPadding={50}>
        <V.VictoryAxis
          style={{ axisLabel: { fontSize: 15, padding: 60 } }}
          label={xLabel}
        />
        <V.VictoryAxis
          label={yLabel}
          dependentAxis
          tickFormat={(x) => x}
          style={{ axisLabel: { fontSize: 15, padding: 60 } }}
        />
        <V.VictoryBar
          labelComponent={<V.VictoryTooltip />}
          labels={({ datum }) => datum[yField]}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 },
          }}
          data={data}
          x={xField}
          y={yField}
          style={{ data: { fill: "green" } }}
        />
        {!!y2Field &&
          <V.VictoryBar
            labelComponent={<V.VictoryTooltip />}
            labels={({ datum }) => datum[y2Field]}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            data={data}
            x={xField}
            y={y2Field}
            style={{ data: { fill: "red" } }}
          />
        }
      </V.VictoryChart>
    </div>
  )
}

export default Graph