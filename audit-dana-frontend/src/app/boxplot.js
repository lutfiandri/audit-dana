import React from "react";
import Plot from "react-plotly.js";

export default function BoxPlot({ data, target }) {
    return (
        <Plot
            data={[
                {
                    x: data.concat([target]),
                    type: "box",
                    name: "Rp",
                    marker: {
                        color: "rgb(0,81,156)",
                    },
                    boxmean: true,
                    orientation: "h",
                },
            ]}
            layout={{ title: "Distribusi Harga" }}
        />
    );
}
