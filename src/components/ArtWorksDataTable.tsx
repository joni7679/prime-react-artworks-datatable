import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";

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
    const [selecteRow, setSelecteRow] = useState<ArtWork[]>([]);
    const [currentPage, setCurrentPage] = useState(0)
    const [rowClick, setRowClick] = useState<boolean>(true);
    const [value, setValue] = useState<string>('');
    const op = useRef(null);
    // fetch  artworks  data here....
    let fetchData = async (page: number) => {
        setLoading(true);
        try {
            let res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            let finalRes: ArtWork[] = res.data.data;
            console.log("finalres", finalRes);
            setData(finalRes)
            setTotal(res.data.pagination.total);
            setLoading(false)
        } catch (error) {
            console.log("netWork Issu Plz Try Againg Leater", error)
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
    // how many row selected logic here...
    const handelSubmit = () => {
        


    }


    return (
        <>
            <div className="card">
                <OverlayPanel ref={op} style={{width:"20rem"}} >
                    <InputText style={{width:"100%"}} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    placeholder="Plz Enter How Many Row YOu Selected"
                    />
                    <br /> <br />
                    <Button label="Submit" />
                </OverlayPanel>
                <DataTable onClick={(e) => op.current.toggle(e)} paginator rows={10} value={data} lazy loading={loading} totalRecords={total} selection={selectedData}
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


