import React from "react";
import Plot from "react-plotly.js";

export default function BoxPlot({ data, target, status }) {
    return (
        <Plot
            data={[
                {
                    x: data.concat([target]),
                    type: "box",
                    name: "Harga Barang",
                    marker: {
                        color: Array(data.length)
                            .fill("rgb(0,81,156)")
                            .concat([
                                status === 0
                                    ? "rgb(66,217,15)"
                                    : status === 1
                                    ? "rgb(255, 165, 0)"
                                    : "rgb(255,0,0)",
                            ]),
                    },
                    boxmean: true,
                    orientation: "h",
                    boxpoints: "all",
                },
            ]}
            layout={{ title: "Distribusi Harga" }}
        />
    );
}
