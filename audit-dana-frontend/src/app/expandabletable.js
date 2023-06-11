import React from "react";
import { Table, Tag } from "antd";
import BoxPlot from "./boxplot";

export default function ExpandableTable({ data }) {
    let options = [
        { color: "green", label: "Normal" },
        { color: "orange", label: "Warning" },
        { color: "red", label: "Danger" },
    ];
    const columns = [
        {
            title: "Nama Produk",
            dataIndex: "name",
            width: "50%",
        },
        {
            title: "Harga (Rp)",
            dataIndex: "price",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (_, { alert_level }) => {
                return (
                    <Tag color={options[alert_level].color}>
                        {options[alert_level].label}
                    </Tag>
                );
            },
        },
    ];
    return (
        <Table
            className="w-full"
            columns={columns}
            expandable={{
                expandedRowRender: (record) => (
                    <p
                        style={{
                            margin: 0,
                        }}
                    >
                        <BoxPlot
                            data={record.distribution}
                            target={record.price}
                            status={record.alert_level}
                        />
                    </p>
                ),
                rowExpandable: (record) => record.name !== "Not Expandable",
            }}
            dataSource={data}
        />
    );
}
