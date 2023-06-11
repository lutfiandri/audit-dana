"use client";
import { Menu, message } from "antd";
import { useRef, useState } from "react";
import DynamicTable from "./dynamictable";
import ExpandableTable from "./expandabletable";
import { UploadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import axios from "axios";

export default function Home() {
    const [messageApi, contextHolder] = message.useMessage();
    const inputRef = useRef();
    const resultRef = useRef();
    const [current, setCurrent] = useState("manual");
    const [isShowResult, setIsShowResult] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [dataResult, setDataResult] = useState([]);

    const items = [
        {
            label: "Masukan Manual",
            key: "manual",
        },
        {
            label: "Unggah Berkas CSV",
            key: "csv",
        },
    ];

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const readFile = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setDataSource(reader.result);
            const parsedData = Papa.parse(reader.result, { header: true });

            let data = parsedData.data.map((d, idx) => {
                return {
                    name: d.name,
                    price: d.price,
                    key: idx,
                };
            });
            setDataSource(data);
            setCurrent("manual");
        };
        reader.readAsBinaryString(inputRef?.current.files[0]);
    };

    const handleSubmit = () => {
        let body = {};

        if (dataSource.length > 0) {
            messageApi.open({
                key: "submit",
                type: "loading",
                content: "Memulai analisis..",
                duration: 25 * dataSource.length,
            });

            body["products"] = dataSource.map((data) => {
                return { name: data.name, price: Number(data.price) };
            });

            axios
                .post("http://localhost:5000/scrape-products", body)
                .then((res) => {
                    messageApi.open({
                        key: "submit",
                        type: "success",
                        content: "Analisis selesai!",
                    });
                    setDataResult(
                        res.data.map((data, idx) => {
                            return {
                                key: idx,
                                alert_level: data.alert_level,
                                name: data.name,
                                price: data.price,
                                distribution: data.products.map((prod) => {
                                    return prod.price;
                                }),
                            };
                        })
                    );
                    setIsShowResult(true);

                    setTimeout(() => {
                        resultRef.current?.scrollIntoView();
                    }, 300);
                })
                .catch((err) => {
                    messageApi.open({
                        key: "submit",
                        type: "error",
                        content: "Ada permasalahan!",
                    });
                    console.log(err);
                });
        } else {
            console.log("insufficient input");
            messageApi.open({
                key: "submit",
                type: "warning",
                content: "Masukkan setidaknya satu baris data!",
            });
        }
    };

    return (
        <div className="w-11/12 max-w-5xl mx-auto flex flex-col gap-8 justify-center items-center py-32">
            {contextHolder}
            <div className="py-3 px-12 rounded-2xl bg-gradient-to-t from-neutral-300 to-neutral-50 text-c-blue-300 border border-neutral-300 flex w-fit">
                <span>Sistem Pendukung Keputusan</span>
            </div>
            <p className="py-1 font-bold text-5xl text-center text-transparent bg-clip-text bg-gradient-to-b from-c-blue-500 to-c-blue-500/70">
                Temukan anomali harga barangmu!
            </p>

            <div className="w-full max-w-3xl bg-white rounded-lg flex-col drop-shadow-xl p-8 flex items-center justify-center">
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                />

                <div className="mt-12 w-full">
                    {current === "manual" && (
                        <div>
                            <DynamicTable
                                dataSource={dataSource}
                                setDataSource={setDataSource}
                            />
                        </div>
                    )}
                    {current === "csv" && (
                        <div className="w-full flex flex-col justify-center items-center">
                            <div className="w-full">
                                <label
                                    htmlFor="csv"
                                    className="cursor-pointer w-full border border-c-blue-100 rounded-lg text-center py-1 flex gap-2 justify-center items-center hover:text-c-blue-primary hover:border-c-blue-primary transition"
                                >
                                    <UploadOutlined />
                                    Klik untuk mengunggah
                                </label>
                                <input
                                    ref={inputRef}
                                    id="csv"
                                    type="file"
                                    accept=".csv"
                                    onChange={readFile}
                                    placeholder="Klik untuk mengunggah"
                                    className="hidden"
                                />
                            </div>

                            <div className="bg-neutral-100 px-8 py-4 mt-8">
                                <div className="grid grid-cols-12">
                                    <div>💡</div>
                                    <div className="col-span-11 text-neutral-700">
                                        <p>
                                            Unggah berkas CSV dengan header{" "}
                                            <span className="font-bold font-mono">
                                                “name,price”
                                            </span>{" "}
                                            diikuti dengan baris barang yang
                                            ingin diperiksa.
                                        </p>
                                        <br />
                                        <p>
                                            Contoh isi file CSV yang{" "}
                                            <span className="font-bold">
                                                benar
                                            </span>
                                            :
                                        </p>
                                        <div className="w-full bg-white rounded-md mt-2 py-4 px-8 drop-shadow-sm">
                                            <p className="font-mono">
                                                {[
                                                    {
                                                        name: "name",
                                                        price: "price",
                                                    },
                                                    {
                                                        name: "tepung beras rose brand 500gr",
                                                        price: "25000",
                                                    },
                                                    {
                                                        name: "samsung tab s8 8/128 wifi",
                                                        price: "2000000",
                                                    },
                                                    {
                                                        name: "nintendo switch console zelda",
                                                        price: "5000000",
                                                    },
                                                ].map((data) => {
                                                    return (
                                                        <div key={data.name}>
                                                            <span className="font-mono text-green-900">
                                                                {data.name}
                                                            </span>
                                                            ,
                                                            <span className="font-mono text-blue-900">
                                                                {data.price}
                                                            </span>
                                                            <br />
                                                        </div>
                                                    );
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-c-blue-500 text-white rounded-3xl hover:bg-c-blue-500/0 hover:text-c-blue-500 border hover:border-c-blue-500 transition"
            >
                Periksa
            </button>

            <div
                className={`mt-24 w-full flex flex-col justify-center items-center gap-8  ${
                    isShowResult ? "" : "hidden"
                }`}
                ref={resultRef}
            >
                <h2 className="mt-24 font-bold text-xl text-center">
                    🔎
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-c-blue-500 to-c-blue-500/70">
                        Berikut adalah hasil pemeriksaan kami
                    </span>
                    🔍
                </h2>
                <div className="w-full max-w-3xl bg-white rounded-lg flex-col drop-shadow-xl p-8 flex items-center justify-center">
                    <ExpandableTable data={dataResult} />
                </div>
            </div>
        </div>
    );
}
