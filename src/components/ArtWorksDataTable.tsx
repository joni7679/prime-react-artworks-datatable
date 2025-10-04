import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";

interface ArtWork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    date_start: number;
    date_end: number;
}

const ArtWorksDataTable: React.FC = () => {
    const [data, setData] = useState<ArtWork[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedData, setSelectedData] = useState<ArtWork[] | null>(null);
    const [currentPage, setCurrentPage] = useState(0)
    const [rowClick, setRowClick] = useState<boolean>(true);

    // fetch  artworks  data here....
    const fetchData = async (page: number) => {
        setLoading(true);
        try {
            let res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            let finalRes: ArtWork[] = res.data.data;
            console.log("finalres", finalRes);
            setData(finalRes)
            setTotal(res.data.pagination.total);
            setLoading(false)
        } catch (error) {
            console.log("net work peroblem ! plz try again leater", error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(currentPage)
    }, [currentPage])

    // paginator logic here..
    const paginerPageChange = (e) => {
        setCurrentPage(e.page)
    }

    return (
        <>
            <div className="card round-xl flex items-center justify-center">
                <DataTable paginator rows={10} value={data} lazy loading={loading} totalRecords={total} selection={selectedData}
                    onSelectionChange={(e) => setSelectedData(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}
                    selectionMode={rowClick ? undefined : 'multiple'}
                    onPage={paginerPageChange}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="title" header="Title"></Column>
                    <Column field="place_of_origin" header="Place Of  Origin"></Column>
                    <Column field="artist_display" header="Arist Display"></Column>
                    <Column field="date_start" header="Date Start"></Column>
                    <Column field="date_end" header="Date End"></Column>
                </DataTable>
            </div>
        </>
    )
}

export default ArtWorksDataTable;


